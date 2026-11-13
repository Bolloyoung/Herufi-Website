import type { PoolClient } from 'pg'
import { cleanText } from '@/lib/domain/text'
import { PROFILE_FIELDS, type ContactStatus, type SuppressionReason } from '@/lib/domain/types'
import type { GoogleSheetsClient } from '@/lib/integrations/google-sheets/client'
import { parseRows, suggestMapping, validateMapping, type ParsedRow } from '@/lib/integrations/google-sheets/mapper'
import { indexExisting, planImport, type ExistingContact, type PlannedRow, type PlanTotals } from '@/lib/integrations/google-sheets/plan'
import { columnMappingSchema, spreadsheetRefSchema, type ColumnMapping } from '@/lib/integrations/google-sheets/schemas'
import { db, getPool, withTx } from '@/lib/server/db'
import { AppError, ValidationError } from '@/lib/server/errors'
import type { Logger } from '@/lib/server/logger'
import { audit } from './audit'
import { logConsentEvent, unsubscribeInTx } from './consent'
import { applyAutoRules } from './audiences'
import { finishJob, heartbeat, recordRowErrors, resolveRowErrors, startJob, type RowError } from './sync-jobs'

export type ImportRequest = {
  spreadsheetId: string
  worksheet: string
  mapping?: ColumnMapping
  tagDelimiter?: string
}

export type PlannedRowView = {
  rowNumber: number
  email: string
  action: PlannedRow['action']
  changes: string[]
  message?: string
  initialStatus?: ContactStatus
  adoptWithdrawal: boolean
  claim: { status: string; complete: boolean; problems: string[] } | null
}

export type PreviewResult = {
  spreadsheetId: string
  worksheet: string
  headers: string[]
  mapping: ColumnMapping
  mappingSource: 'provided' | 'saved' | 'suggested'
  mappingErrors: string[]
  tagDelimiter: string
  totals: PlanTotals | null
  rows: PlannedRowView[]
  truncated: boolean
}

const PREVIEW_ROW_LIMIT = 1000
const CHUNK = 100
const PROBLEM_ACTIONS: ReadonlyArray<PlannedRow['action']> = ['invalid', 'duplicate_in_sheet', 'email_changed', 'conflict']

export function validateRequest(req: ImportRequest): ImportRequest {
  const ref = spreadsheetRefSchema.safeParse({ spreadsheetId: req.spreadsheetId, worksheet: req.worksheet })
  if (!ref.success) throw new ValidationError(ref.error.issues[0].message)
  if (req.mapping) {
    const m = columnMappingSchema.safeParse(req.mapping)
    if (!m.success) throw new ValidationError('The column mapping is not valid')
  }
  if (req.tagDelimiter !== undefined && !/^[,;|]$/.test(req.tagDelimiter)) throw new ValidationError('The tag delimiter must be a comma, semicolon or pipe')
  return req
}

async function loadMapping(req: ImportRequest, headers: string[]): Promise<{ mapping: ColumnMapping; source: PreviewResult['mappingSource']; tagDelimiter: string }> {
  if (req.mapping) return { mapping: req.mapping, source: 'provided', tagDelimiter: req.tagDelimiter ?? ',' }
  const { rows } = await db().query('select mapping, tag_delimiter from email_column_mappings where spreadsheet_id = $1 and worksheet = $2', [req.spreadsheetId, req.worksheet])
  if (rows[0]) return { mapping: rows[0].mapping, source: 'saved', tagDelimiter: req.tagDelimiter ?? rows[0].tag_delimiter }
  return { mapping: suggestMapping(headers), source: 'suggested', tagDelimiter: req.tagDelimiter ?? ',' }
}

type Loaded = {
  headers: string[]
  mapping: ColumnMapping
  mappingSource: PreviewResult['mappingSource']
  tagDelimiter: string
  mappingErrors: string[]
  parsed: ParsedRow[]
  plan: PlannedRow[] | null
  totals: PlanTotals | null
}

/** Read the sheet and work out what an import would do. Writes nothing. */
async function loadAndPlan(req: ImportRequest, sheets: GoogleSheetsClient): Promise<Loaded> {
  const { headers, rows } = await sheets.readSheet(req.spreadsheetId, req.worksheet)
  const { mapping, source, tagDelimiter } = await loadMapping(req, headers)
  const check = validateMapping(mapping, headers)
  if (!check.ok) return { headers, mapping, mappingSource: source, tagDelimiter, mappingErrors: check.errors, parsed: [], plan: null, totals: null }

  const parsed = parseRows(headers, rows, mapping, { tagDelimiter })
  const emails = parsed.filter((p) => p.email).map((p) => p.email)
  const extIds = parsed.map((p) => p.fields.external_id).filter((v): v is string => !!v)

  const [existingRes, suppressionRes] = await Promise.all([
    db().query(
      `select id, email, external_id, source_spreadsheet_id, status, first_name, last_name, organisation, job_title, country,
              organisation_type, category, notes, tags, claimed_consent
         from email_contacts
        where email = any($1::text[]) or (source_spreadsheet_id = $2 and external_id = any($3::text[]))`,
      [emails, req.spreadsheetId, extIds],
    ),
    db().query('select email, reason from email_suppressions where email = any($1::text[]) and cleared_at is null', [emails]),
  ])
  const suppressions = new Map<string, SuppressionReason>()
  for (const r of suppressionRes.rows) suppressions.set(r.email, r.reason)
  const { rows: planned, totals } = planImport(parsed, indexExisting(existingRes.rows as ExistingContact[], req.spreadsheetId), suppressions)
  return { headers, mapping, mappingSource: source, tagDelimiter, mappingErrors: [], parsed, plan: planned, totals }
}

const view = (r: PlannedRow): PlannedRowView => ({
  rowNumber: r.rowNumber,
  email: r.email,
  action: r.action,
  changes: r.changes,
  message: r.message,
  initialStatus: r.initialStatus,
  adoptWithdrawal: r.adoptWithdrawal,
  claim: r.parsed.claimedConsent
    ? { status: r.parsed.claimedConsent.status, complete: r.parsed.claimedConsent.complete, problems: r.parsed.claimedConsent.problems }
    : null,
})

export async function previewImport(req: ImportRequest, sheets: GoogleSheetsClient): Promise<PreviewResult> {
  validateRequest(req)
  const l = await loadAndPlan(req, sheets)
  const all = l.plan ?? []
  // Show problems first, then the rows that would change something, then the rest.
  const rank = (a: PlannedRow['action']) => (PROBLEM_ACTIONS.includes(a) ? 0 : a === 'new' || a === 'update' ? 1 : 2)
  const ordered = [...all].sort((a, b) => rank(a.action) - rank(b.action) || a.rowNumber - b.rowNumber)
  return {
    spreadsheetId: req.spreadsheetId,
    worksheet: req.worksheet,
    headers: l.headers,
    mapping: l.mapping,
    mappingSource: l.mappingSource,
    mappingErrors: l.mappingErrors,
    tagDelimiter: l.tagDelimiter,
    totals: l.totals,
    rows: ordered.slice(0, PREVIEW_ROW_LIMIT).map(view),
    truncated: ordered.length > PREVIEW_ROW_LIMIT,
  }
}

// ---------------------------------------------------------------------------
// Applying a planned row
// ---------------------------------------------------------------------------
type ApplyCtx = { spreadsheetId: string; worksheet: string; actor: string; correlationId?: string }

/** The profile or tag fields that, when changed on a subscribed contact, must be pushed to Listmonk. */
const PUSHABLE_CHANGES = new Set<string>([...PROFILE_FIELDS.filter((f) => f !== 'notes'), 'tags'])

async function applyRow(c: PoolClient, r: PlannedRow, ctx: ApplyCtx): Promise<{ id: string; outcome: 'created' | 'updated' }> {
  const f = r.parsed.fields
  const sourceRef = `sheet:${ctx.spreadsheetId}/${ctx.worksheet}!${r.rowNumber}`

  if (r.action === 'new') {
    const { rows } = await c.query(
      `insert into email_contacts
         (email, first_name, last_name, organisation, job_title, country, organisation_type, category, notes, tags,
          external_id, source_spreadsheet_id, source_worksheet, source_row, status, claimed_consent, last_imported_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::text[],$11,$12,$13,$14,$15,$16::jsonb, now())
       on conflict (email) do nothing returning id`,
      [
        r.email, f.first_name, f.last_name, f.organisation, f.job_title, f.country, f.organisation_type, f.category, f.notes, f.tags,
        f.external_id, ctx.spreadsheetId, ctx.worksheet, r.rowNumber, r.initialStatus ?? 'imported_pending_consent',
        r.parsed.claimedConsent ? JSON.stringify(r.parsed.claimedConsent) : null,
      ],
    )
    if (!rows[0]) throw new AppError(409, 'concurrent_insert', 'This address was added by another process during the import. Run the import again.')
    const id = rows[0].id as string
    await logConsentEvent(c, {
      contactId: id, email: r.email, type: 'imported', from: null, to: r.initialStatus ?? 'imported_pending_consent',
      source: sourceRef, actor: ctx.actor, correlationId: ctx.correlationId,
      metadata: { claimed: r.parsed.claimedConsent ? { status: r.parsed.claimedConsent.status, complete: r.parsed.claimedConsent.complete } : null },
    })
    // The sheet says the person withdrew consent and nothing already suppresses the address.
    if (r.adoptWithdrawal) {
      await unsubscribeInTx(c, { contactId: id, source: sourceRef, actor: ctx.actor, correlationId: ctx.correlationId })
    }
    return { id, outcome: 'created' }
  }

  // update
  const pushable = r.changes.some((ch) => PUSHABLE_CHANGES.has(ch))
  const { rows } = await c.query(
    `update email_contacts set
        first_name = coalesce($2, first_name), last_name = coalesce($3, last_name), organisation = coalesce($4, organisation),
        job_title = coalesce($5, job_title), country = coalesce($6, country), organisation_type = coalesce($7, organisation_type),
        category = coalesce($8, category), notes = coalesce($9, notes),
        tags = case when cardinality($10::text[]) > 0 then $10::text[] else tags end,
        external_id = coalesce(external_id, $11), source_spreadsheet_id = coalesce(source_spreadsheet_id, $12),
        source_worksheet = coalesce(source_worksheet, $13), source_row = $14,
        claimed_consent = coalesce($15::jsonb, claimed_consent), last_imported_at = now(), updated_at = now(),
        needs_listmonk_sync = needs_listmonk_sync or (status = 'subscribed' and archived_at is null and $16::boolean)
      where id = $1 returning id`,
    [
      r.existingId, f.first_name, f.last_name, f.organisation, f.job_title, f.country, f.organisation_type, f.category, f.notes, f.tags,
      f.external_id, ctx.spreadsheetId, ctx.worksheet, r.rowNumber,
      r.parsed.claimedConsent ? JSON.stringify(r.parsed.claimedConsent) : null, pushable,
    ],
  )
  if (!rows[0]) throw new AppError(404, 'not_found', 'The contact disappeared during the import')
  if (r.adoptWithdrawal) {
    await unsubscribeInTx(c, { contactId: r.existingId!, source: sourceRef, actor: ctx.actor, correlationId: ctx.correlationId })
  }
  return { id: rows[0].id, outcome: 'updated' }
}

// ---------------------------------------------------------------------------
// Running an import
// ---------------------------------------------------------------------------
export type RunImportResult = {
  jobId: string
  status: 'succeeded' | 'partial'
  stats: Record<string, number>
}

export async function runImport(
  req: ImportRequest & { rowNumbers?: number[]; onlyRows?: number[]; actor: string; correlationId?: string },
  sheets: GoogleSheetsClient,
  log?: Logger,
): Promise<RunImportResult> {
  validateRequest(req)
  const pool = getPool()
  const job = await startJob(pool, { kind: 'sheet_import', spreadsheetId: req.spreadsheetId, worksheet: req.worksheet, startedBy: req.actor, correlationId: req.correlationId })
  const stats: Record<string, number> = { total: 0, created: 0, updated: 0, unchanged: 0, skipped: 0, problems: 0, failed: 0, withdrawals: 0 }
  const errors: RowError[] = []
  const touched: string[] = []
  const succeededRows: number[] = []

  try {
    const l = await loadAndPlan(req, sheets)
    if (!l.plan) throw new ValidationError(l.mappingErrors[0] ?? 'The column mapping is not valid')
    const selected = req.rowNumbers ? new Set(req.rowNumbers) : null
    const only = req.onlyRows ? new Set(req.onlyRows) : null
    const inScope = l.plan.filter((r) => !only || only.has(r.rowNumber))
    stats.total = inScope.length

    for (const r of inScope) {
      if (PROBLEM_ACTIONS.includes(r.action)) {
        stats.problems++
        // Prefer the specific reason (invalid_email, missing_email) over the generic action.
        const code = r.action === 'invalid' ? (r.parsed.issues[0]?.code ?? 'invalid') : r.action
        errors.push({ rowNumber: r.rowNumber, email: r.email || null, code, message: r.message ?? 'Row could not be imported', raw: r.parsed.raw })
      } else if (r.action === 'unchanged') {
        stats.unchanged++
        succeededRows.push(r.rowNumber)
      }
    }

    const actionable = inScope.filter((r) => (r.action === 'new' || r.action === 'update') && (!selected || selected.has(r.rowNumber)))
    stats.skipped = inScope.filter((r) => (r.action === 'new' || r.action === 'update') && selected && !selected.has(r.rowNumber)).length
    const ctx: ApplyCtx = { spreadsheetId: req.spreadsheetId, worksheet: req.worksheet, actor: req.actor, correlationId: req.correlationId }

    const apply = (r: PlannedRow, outcome: { id: string; outcome: 'created' | 'updated' }) => {
      stats[outcome.outcome]++
      if (r.adoptWithdrawal) stats.withdrawals++
      touched.push(outcome.id)
      succeededRows.push(r.rowNumber)
    }
    const fail = (r: PlannedRow, err: unknown) => {
      stats.failed++
      const msg = err instanceof AppError ? err.message : 'The row could not be saved'
      log?.warn('import row failed', { row: r.rowNumber, code: (err as { code?: string })?.code })
      errors.push({ rowNumber: r.rowNumber, email: r.email, code: 'apply_failed', message: msg, raw: r.parsed.raw })
    }

    for (let i = 0; i < actionable.length; i += CHUNK) {
      const chunk = actionable.slice(i, i + CHUNK)
      try {
        const results = await withTx(async (c) => {
          const out: Array<{ id: string; outcome: 'created' | 'updated' }> = []
          for (const r of chunk) out.push(await applyRow(c, r, ctx))
          return out
        })
        chunk.forEach((r, n) => apply(r, results[n]))
      } catch {
        // One bad row must not sink its neighbours: redo the chunk row by row.
        for (const r of chunk) {
          try {
            apply(r, await withTx((c) => applyRow(c, r, ctx)))
          } catch (err) {
            fail(r, err)
          }
        }
      }
      await heartbeat(pool, job.id, stats)
    }

    if (touched.length) await applyAutoRules(pool, touched)

    if (!req.rowNumbers && !req.onlyRows) {
      // Remember the mapping that worked, so the next import needs no setup.
      await pool.query(
        `insert into email_column_mappings (spreadsheet_id, worksheet, mapping, tag_delimiter, updated_by)
         values ($1, $2, $3::jsonb, $4, $5)
         on conflict (spreadsheet_id, worksheet) do update set mapping = excluded.mapping, tag_delimiter = excluded.tag_delimiter, updated_by = excluded.updated_by, updated_at = now()`,
        [req.spreadsheetId, req.worksheet, JSON.stringify(l.mapping), l.tagDelimiter, req.actor],
      )
    }

    await recordRowErrors(pool, job.id, errors)
    await resolveRowErrors(pool, req.spreadsheetId, req.worksheet, succeededRows)
    const status = errors.length ? 'partial' : 'succeeded'
    await finishJob(pool, job.id, status, stats)
    await audit(pool, {
      actor: req.actor, action: 'import.completed', entityType: 'sync_job', entityId: job.id, correlationId: req.correlationId,
      detail: { spreadsheetId: req.spreadsheetId, worksheet: cleanText(req.worksheet, 100), ...stats },
    })
    return { jobId: job.id, status, stats }
  } catch (err) {
    const message = err instanceof AppError ? err.message : 'The import stopped unexpectedly'
    await finishJob(pool, job.id, 'failed', stats, message).catch(() => undefined)
    throw err
  }
}
