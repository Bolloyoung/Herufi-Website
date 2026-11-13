import { statusFromSuppression } from '@/lib/domain/consent'
import { PROFILE_FIELDS, type ClaimedConsent, type ContactStatus, type SuppressionReason } from '@/lib/domain/types'
import type { ContactFields, ParsedRow } from './mapper'

/**
 * Import planning. Given parsed sheet rows and what already exists, decide what
 * an import would do for each row, without touching any data. The same plan
 * drives the preview screen and the real import, so what you preview is what
 * runs, and running it twice changes nothing the second time.
 */

export type ExistingContact = {
  id: string
  email: string
  external_id: string | null
  source_spreadsheet_id: string | null
  status: ContactStatus
  first_name: string | null
  last_name: string | null
  organisation: string | null
  job_title: string | null
  country: string | null
  organisation_type: string | null
  category: string | null
  notes: string | null
  tags: string[]
  claimed_consent: ClaimedConsent | null
}

export type RowAction =
  | 'new'
  | 'update'
  | 'unchanged'
  | 'invalid'
  | 'duplicate_in_sheet'
  | 'email_changed'
  | 'conflict'

export type PlannedRow = {
  rowNumber: number
  email: string
  action: RowAction
  /** Names of the fields that would change, for updates. */
  changes: string[]
  parsed: ParsedRow
  existingId?: string
  /** Status a new contact starts with. Imports start at imported_pending_consent unless restricted. */
  initialStatus?: ContactStatus
  /** The sheet says this person withdrew consent, so move them to unsubscribed. */
  adoptWithdrawal: boolean
  message?: string
}

export type PlanTotals = {
  total: number
  valid: number
  invalid: number
  duplicates: number
  new: number
  updated: number
  unchanged: number
  needsReview: number
  claimsComplete: number
  claimsIncomplete: number
  withdrawn: number
}

export type ExistingIndex = {
  byEmail: Map<string, ExistingContact>
  byExternalId: Map<string, ExistingContact>
}

export function indexExisting(contacts: ExistingContact[], spreadsheetId: string): ExistingIndex {
  const byEmail = new Map<string, ExistingContact>()
  const byExternalId = new Map<string, ExistingContact>()
  for (const c of contacts) {
    byEmail.set(c.email, c)
    if (c.external_id && c.source_spreadsheet_id === spreadsheetId) byExternalId.set(c.external_id, c)
  }
  return { byEmail, byExternalId }
}

/** Key order independent JSON, because Postgres jsonb does not preserve the order keys were written in. */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`
  if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>
    return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(o[k])}`).join(',')}}`
  }
  return JSON.stringify(value) ?? 'null'
}

const sameSet = (a: string[], b: string[]) => {
  const x = [...a].map((t) => t.toLowerCase()).sort()
  const y = [...b].map((t) => t.toLowerCase()).sort()
  return x.length === y.length && x.every((v, i) => v === y[i])
}

/**
 * A blank cell never erases existing data, so a half filled sheet cannot wipe a
 * record. Returns the names of fields whose non blank sheet value differs.
 */
export function diffProfile(existing: ExistingContact, incoming: ContactFields): string[] {
  const changes: string[] = []
  for (const f of PROFILE_FIELDS) {
    const v = incoming[f]
    if (v !== null && v !== existing[f]) changes.push(f)
  }
  if (incoming.tags.length && !sameSet(incoming.tags, existing.tags)) changes.push('tags')
  return changes
}

const WITHDRAWN_STATES: ReadonlySet<ContactStatus> = new Set<ContactStatus>(['unsubscribed', 'bounced', 'complained', 'suppressed', 'invalid'])

export function planImport(
  parsed: ParsedRow[],
  index: ExistingIndex,
  suppressions: Map<string, SuppressionReason>,
): { rows: PlannedRow[]; totals: PlanTotals } {
  const rows: PlannedRow[] = []

  for (const p of parsed) {
    const base = { rowNumber: p.rowNumber, email: p.email, parsed: p, changes: [] as string[], adoptWithdrawal: false }
    const withdrawn = p.claimedConsent?.status === 'withdrawn'

    if (p.invalid) {
      const dup = p.issues.some((i) => i.code === 'duplicate_in_sheet')
      rows.push({
        ...base,
        action: dup ? 'duplicate_in_sheet' : 'invalid',
        message: p.issues.map((i) => i.message).join('; '),
      })
      continue
    }

    const byExt = p.fields.external_id ? index.byExternalId.get(p.fields.external_id) : undefined
    const byMail = index.byEmail.get(p.email)

    // The email and the external ID point at two different contacts. That is the
    // more specific problem, so it is reported before a plain email change.
    if (byExt && byMail && byExt.id !== byMail.id) {
      rows.push({ ...base, action: 'conflict', existingId: byMail.id, message: 'Email and external ID point at different contacts' })
      continue
    }

    // Same source ID but a different address: a person changed their email.
    // We never rewrite an address silently, because consent belongs to the old one.
    if (byExt && byExt.email !== p.email) {
      rows.push({
        ...base,
        action: 'email_changed',
        existingId: byExt.id,
        message: `External ID ${p.fields.external_id} already belongs to a different email address. Review manually.`,
      })
      continue
    }

    const match = byExt ?? byMail
    if (match) {
      if (
        match.external_id &&
        p.fields.external_id &&
        match.external_id !== p.fields.external_id &&
        match.source_spreadsheet_id
      ) {
        rows.push({ ...base, action: 'conflict', existingId: match.id, message: 'This email already has a different external ID' })
        continue
      }

      const changes = diffProfile(match, p.fields)
      const claimChanged =
        p.claimedConsent !== null && canonicalJson(p.claimedConsent) !== canonicalJson(match.claimed_consent)
      if (claimChanged) changes.push('claimed_consent')
      const adopt = withdrawn && !WITHDRAWN_STATES.has(match.status)
      rows.push({
        ...base,
        action: changes.length || adopt ? 'update' : 'unchanged',
        changes,
        existingId: match.id,
        adoptWithdrawal: adopt,
      })
      continue
    }

    // New contact. Start at the most restrictive state we already know about.
    const suppression = suppressions.get(p.email)
    const initialStatus: ContactStatus = suppression
      ? statusFromSuppression(suppression)
      : withdrawn
        ? 'unsubscribed'
        : 'imported_pending_consent'
    rows.push({ ...base, action: 'new', initialStatus, adoptWithdrawal: withdrawn && !suppression })
  }

  return { rows, totals: totalsFor(rows) }
}

export function totalsFor(rows: PlannedRow[]): PlanTotals {
  const t: PlanTotals = {
    total: rows.length,
    valid: 0,
    invalid: 0,
    duplicates: 0,
    new: 0,
    updated: 0,
    unchanged: 0,
    needsReview: 0,
    claimsComplete: 0,
    claimsIncomplete: 0,
    withdrawn: 0,
  }
  for (const r of rows) {
    switch (r.action) {
      case 'invalid':
        t.invalid++
        break
      case 'duplicate_in_sheet':
        t.duplicates++
        break
      case 'email_changed':
      case 'conflict':
        t.needsReview++
        break
      case 'new':
        t.new++
        t.valid++
        break
      case 'update':
        t.updated++
        t.valid++
        break
      case 'unchanged':
        t.unchanged++
        t.valid++
        break
    }
    const c = r.parsed.claimedConsent
    if (c && !['invalid', 'duplicate_in_sheet'].includes(r.action)) {
      if (c.status === 'withdrawn') t.withdrawn++
      else if (c.status === 'given') c.complete ? t.claimsComplete++ : t.claimsIncomplete++
    }
  }
  return t
}
