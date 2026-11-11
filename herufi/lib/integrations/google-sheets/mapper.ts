import type { ClaimedConsent } from '@/lib/domain/types'
import { cleanNotes, cleanText, isValidEmail, normaliseEmail, parseTags } from '@/lib/domain/text'
import { CANONICAL_FIELDS, type CanonicalField, type ColumnMapping } from './schemas'

const norm = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '')

/** Common spreadsheet headings for each field, compared after normalisation. */
const SYNONYMS: Record<CanonicalField, string[]> = {
  email: ['email', 'emailaddress', 'workemail', 'mail', 'eaddress', 'contactemail'],
  first_name: ['firstname', 'givenname', 'forename', 'first'],
  last_name: ['lastname', 'surname', 'familyname', 'last'],
  organisation: ['organisation', 'organization', 'company', 'institution', 'employer', 'org', 'organisationname'],
  job_title: ['jobtitle', 'title', 'position', 'role', 'designation'],
  country: ['country', 'location', 'countryofresidence'],
  organisation_type: ['organisationtype', 'organizationtype', 'orgtype', 'institutiontype', 'sector', 'type'],
  category: ['category', 'segment', 'group', 'audience', 'list'],
  tags: ['tags', 'labels', 'keywords', 'interests'],
  consent_status: ['consentstatus', 'consent', 'optin', 'optedin', 'subscriptionstatus', 'marketingconsent'],
  consent_date: ['consentdate', 'dateofconsent', 'optindate', 'consentgiven', 'consentedon'],
  consent_source: ['consentsource', 'optinsource', 'consentchannel', 'howconsented'],
  consent_purpose: ['consentpurpose', 'purpose', 'consentedfor', 'optinpurpose'],
  consent_evidence: ['consentevidence', 'evidence', 'consentreference', 'consentproof', 'consentref'],
  notes: ['notes', 'comments', 'remarks', 'internalnotes'],
  external_id: ['externalid', 'id', 'contactid', 'recordid', 'crmid', 'uid'],
}

/** Suggest a mapping from the sheet's header row. The administrator confirms or edits it. */
export function suggestMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {}
  const used = new Set<string>()
  for (const field of CANONICAL_FIELDS) {
    const candidates = SYNONYMS[field]
    const hit = headers.find((h) => !used.has(h) && candidates.includes(norm(h)))
    if (hit) {
      mapping[field] = hit
      used.add(hit)
    }
  }
  return mapping
}

export type MappingCheck = { ok: boolean; errors: string[] }

export function validateMapping(mapping: ColumnMapping, headers: string[]): MappingCheck {
  const errors: string[] = []
  if (!mapping.email) errors.push('An email column is required')
  const used = new Map<string, CanonicalField>()
  for (const field of CANONICAL_FIELDS) {
    const header = mapping[field]
    if (!header) continue
    if (!headers.includes(header)) errors.push(`The column "${header}" for ${field} is not in the sheet`)
    const prior = used.get(header)
    if (prior) errors.push(`The column "${header}" is mapped to both ${prior} and ${field}`)
    else used.set(header, field)
  }
  return { ok: errors.length === 0, errors }
}

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

function isoIfReal(y: number, m: number, d: number): string | null {
  const dt = new Date(Date.UTC(y, m - 1, d))
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

/**
 * Parses the date formats people actually type. A numeric day/month/year date is
 * read day first, which is the convention for this audience. Returns an ISO
 * date (YYYY-MM-DD) or null. Dates in the future, or before 1990, are rejected.
 */
export function parseConsentDate(input: string | null | undefined, now = new Date()): string | null {
  const s = (input ?? '').trim()
  if (!s) return null
  let iso: string | null = null
  let m: RegExpExecArray | null
  if ((m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T\s].*)?$/.exec(s))) iso = isoIfReal(+m[1], +m[2], +m[3])
  else if ((m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(s))) iso = isoIfReal(+m[3], +m[2], +m[1])
  else if ((m = /^(\d{1,2})\s+([A-Za-z]{3,9})\.?,?\s+(\d{4})$/.exec(s))) {
    const mi = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase())
    if (mi >= 0) iso = isoIfReal(+m[3], mi + 1, +m[1])
  } else if ((m = /^([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})$/.exec(s))) {
    const mi = MONTHS.indexOf(m[1].slice(0, 3).toLowerCase())
    if (mi >= 0) iso = isoIfReal(+m[3], mi + 1, +m[2])
  }
  if (!iso) return null
  const t = Date.parse(`${iso}T00:00:00Z`)
  if (t > now.getTime() + 24 * 3600 * 1000) return null
  if (t < Date.parse('1990-01-01T00:00:00Z')) return null
  return iso
}

// ---------------------------------------------------------------------------
// Consent claims
// ---------------------------------------------------------------------------
const GIVEN = new Set(['yes', 'y', 'true', '1', 'consented', 'optedin', 'optin', 'subscribed', 'confirmed', 'given', 'agreed', 'granted'])
const WITHDRAWN = new Set([
  'no', 'n', 'false', '0', 'declined', 'unsubscribed', 'optedout', 'optout', 'withdrawn', 'revoked',
  'donotcontact', 'dnc', 'stop', 'bounced', 'complained',
])

export function parseConsentStatus(raw: string): ClaimedConsent['status'] {
  const k = raw.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (!k) return 'unknown'
  if (GIVEN.has(k)) return 'given'
  if (WITHDRAWN.has(k)) return 'withdrawn'
  return 'unknown'
}

export function buildClaim(
  fields: { status: string; date: string; source: string; purpose: string; evidence: string },
  now = new Date(),
): ClaimedConsent | null {
  const any = Object.values(fields).some((v) => v.trim())
  if (!any) return null
  const status = parseConsentStatus(fields.status)
  const date = parseConsentDate(fields.date, now)
  const source = cleanText(fields.source, 200)
  const purpose = cleanText(fields.purpose, 300)
  const evidence = cleanText(fields.evidence, 500)
  const problems: string[] = []
  if (fields.status.trim() && status === 'unknown') problems.push(`Consent status "${cleanText(fields.status, 40)}" is not recognised`)
  if (status === 'given') {
    if (!fields.date.trim()) problems.push('Consent date is missing')
    else if (!date) problems.push('Consent date is not a valid past date')
    if (!source) problems.push('Consent source is missing')
    if (!purpose) problems.push('Consent purpose is missing')
    if (!evidence) problems.push('Consent evidence is missing')
  }
  if (status === 'unknown' && !fields.status.trim()) problems.push('Consent status is missing')
  return {
    status,
    rawStatus: cleanText(fields.status, 40) ?? '',
    date,
    source,
    purpose,
    evidence,
    complete: status === 'given' && !!date && !!source && !!purpose && !!evidence,
    problems,
  }
}

// ---------------------------------------------------------------------------
// Row parsing
// ---------------------------------------------------------------------------
export type RowIssue = { code: string; message: string }

export type ContactFields = {
  first_name: string | null
  last_name: string | null
  organisation: string | null
  job_title: string | null
  country: string | null
  organisation_type: string | null
  category: string | null
  notes: string | null
  tags: string[]
  external_id: string | null
}

export type ParsedRow = {
  /** 1 based row number in the sheet, matching what the user sees. */
  rowNumber: number
  email: string
  fields: ContactFields
  claimedConsent: ClaimedConsent | null
  issues: RowIssue[]
  /** True when the row cannot be imported. */
  invalid: boolean
  raw: Record<string, string>
}

const MAX_RAW_CELL = 300

export function parseRows(
  headers: string[],
  rows: Array<Array<string | number | boolean | undefined>>,
  mapping: ColumnMapping,
  opts: { tagDelimiter?: string; headerRow?: number; now?: Date } = {},
): ParsedRow[] {
  const delimiter = opts.tagDelimiter || ','
  const first = (opts.headerRow ?? 1) + 1
  const index = new Map<string, number>()
  headers.forEach((h, i) => {
    if (!index.has(h)) index.set(h, i)
  })
  const cell = (row: Array<string | number | boolean | undefined>, field: CanonicalField): string => {
    const header = mapping[field]
    if (!header) return ''
    const i = index.get(header)
    if (i === undefined) return ''
    const v = row[i]
    return v === undefined || v === null ? '' : String(v)
  }

  const seen = new Map<string, number>()
  const out: ParsedRow[] = []

  rows.forEach((row, i) => {
    const rowNumber = first + i
    if (row.every((v) => v === undefined || String(v).trim() === '')) return // blank line

    const raw: Record<string, string> = {}
    headers.forEach((h, c) => {
      const v = row[c]
      if (v !== undefined && String(v).trim()) raw[h] = String(v).slice(0, MAX_RAW_CELL)
    })

    const issues: RowIssue[] = []
    const email = normaliseEmail(cell(row, 'email'))
    let invalid = false
    if (!email) {
      issues.push({ code: 'missing_email', message: 'Email is blank' })
      invalid = true
    } else if (!isValidEmail(email)) {
      issues.push({ code: 'invalid_email', message: 'Email address is not valid' })
      invalid = true
    } else if (seen.has(email)) {
      issues.push({ code: 'duplicate_in_sheet', message: `Duplicate of row ${seen.get(email)}` })
      invalid = true
    } else {
      seen.set(email, rowNumber)
    }

    const claimedConsent = buildClaim(
      {
        status: cell(row, 'consent_status'),
        date: cell(row, 'consent_date'),
        source: cell(row, 'consent_source'),
        purpose: cell(row, 'consent_purpose'),
        evidence: cell(row, 'consent_evidence'),
      },
      opts.now,
    )

    out.push({
      rowNumber,
      email,
      fields: {
        first_name: cleanText(cell(row, 'first_name'), 100),
        last_name: cleanText(cell(row, 'last_name'), 100),
        organisation: cleanText(cell(row, 'organisation'), 200),
        job_title: cleanText(cell(row, 'job_title'), 200),
        country: cleanText(cell(row, 'country'), 100),
        organisation_type: cleanText(cell(row, 'organisation_type'), 100),
        category: cleanText(cell(row, 'category'), 100),
        notes: cleanNotes(cell(row, 'notes')),
        tags: parseTags(cell(row, 'tags'), delimiter),
        external_id: cleanText(cell(row, 'external_id'), 100),
      },
      claimedConsent,
      issues,
      invalid,
      raw,
    })
  })
  return out
}
