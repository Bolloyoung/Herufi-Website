import { db, isUniqueViolation, type Queryable } from '@/lib/server/db'
import { ConflictError, NotFoundError } from '@/lib/server/errors'

export type JobKind = 'sheet_import' | 'listmonk_sync' | 'reconcile'
export type JobStatus = 'running' | 'succeeded' | 'partial' | 'failed'

export type SyncJob = {
  id: string
  kind: JobKind
  spreadsheet_id: string | null
  worksheet: string | null
  status: JobStatus
  stats: Record<string, unknown>
  error: string | null
  correlation_id: string | null
  started_by: string | null
  started_at: string
  heartbeat_at: string
  finished_at: string | null
}

/** A job that has not sent a heartbeat for this long is presumed dead, so it cannot block syncs forever. */
export const STALE_JOB_MINUTES = 15

export async function startJob(
  q: Queryable,
  input: { kind: JobKind; spreadsheetId?: string | null; worksheet?: string | null; startedBy: string; correlationId?: string },
): Promise<SyncJob> {
  await q.query(
    `update email_sync_jobs
        set status = 'failed', finished_at = now(), error = 'Timed out: no activity for ${STALE_JOB_MINUTES} minutes'
      where status = 'running' and kind = $1
        and coalesce(spreadsheet_id, '') = coalesce($2::text, '') and coalesce(worksheet, '') = coalesce($3::text, '')
        and heartbeat_at < now() - make_interval(mins => ${STALE_JOB_MINUTES})`,
    [input.kind, input.spreadsheetId ?? null, input.worksheet ?? null],
  )
  try {
    const { rows } = await q.query(
      `insert into email_sync_jobs (kind, spreadsheet_id, worksheet, started_by, correlation_id)
       values ($1, $2, $3, $4, $5) returning *`,
      [input.kind, input.spreadsheetId ?? null, input.worksheet ?? null, input.startedBy, input.correlationId ?? null],
    )
    return rows[0]
  } catch (err) {
    if (isUniqueViolation(err)) throw new ConflictError('A sync is already running for this sheet. Wait for it to finish.', 'sync_in_progress')
    throw err
  }
}

export async function heartbeat(q: Queryable, id: string, stats?: Record<string, unknown>): Promise<void> {
  await q.query(
    `update email_sync_jobs set heartbeat_at = now(), stats = coalesce($2::jsonb, stats) where id = $1 and status = 'running'`,
    [id, stats ? JSON.stringify(stats) : null],
  )
}

export async function finishJob(q: Queryable, id: string, status: Exclude<JobStatus, 'running'>, stats: Record<string, unknown>, error?: string): Promise<void> {
  await q.query(
    `update email_sync_jobs set status = $2, stats = $3::jsonb, error = $4, finished_at = now(), heartbeat_at = now() where id = $1`,
    [id, status, JSON.stringify(stats), error ? error.slice(0, 500) : null],
  )
}

export type RowError = { rowNumber: number | null; email: string | null; code: string; message: string; raw?: Record<string, string> }

export async function recordRowErrors(q: Queryable, jobId: string, errors: RowError[]): Promise<void> {
  if (!errors.length) return
  // Chunked multi row insert; raw cells are already truncated by the parser.
  for (let i = 0; i < errors.length; i += 200) {
    const chunk = errors.slice(i, i + 200)
    const values: unknown[] = []
    const tuples = chunk.map((e, n) => {
      values.push(jobId, e.rowNumber, e.email, e.code, e.message.slice(0, 500), e.raw ? JSON.stringify(e.raw) : null)
      const b = n * 6
      return `($${b + 1}, $${b + 2}, $${b + 3}, $${b + 4}, $${b + 5}, $${b + 6}::jsonb)`
    })
    await q.query(`insert into email_sync_row_errors (job_id, row_number, email, code, message, raw) values ${tuples.join(', ')}`, values)
  }
}

export async function getJob(q: Queryable, id: string): Promise<{ job: SyncJob; errors: Array<Record<string, unknown>>; errorTotal: number }> {
  const { rows } = await q.query('select * from email_sync_jobs where id = $1', [id])
  if (!rows[0]) throw new NotFoundError('Sync job not found')
  const errors = await q.query(
    'select id, row_number, email, code, message, resolved, created_at from email_sync_row_errors where job_id = $1 order by row_number nulls last, created_at limit 500',
    [id],
  )
  const total = await q.query('select count(*)::int as n from email_sync_row_errors where job_id = $1', [id])
  return { job: rows[0], errors: errors.rows, errorTotal: total.rows[0].n }
}

export async function latestJobs(q: Queryable = db(), opts: { kind?: JobKind; limit?: number } = {}): Promise<SyncJob[]> {
  const { rows } = await q.query(
    `select * from email_sync_jobs where ($1::text is null or kind = $1) order by started_at desc limit $2`,
    [opts.kind ?? null, Math.min(opts.limit ?? 20, 100)],
  )
  return rows
}

/** Row numbers from earlier imports of this sheet that failed and were not later fixed. */
export async function unresolvedRowNumbers(q: Queryable, spreadsheetId: string, worksheet: string): Promise<number[]> {
  const { rows } = await q.query(
    `select distinct e.row_number
       from email_sync_row_errors e join email_sync_jobs j on j.id = e.job_id
      where j.spreadsheet_id = $1 and j.worksheet = $2 and not e.resolved and e.row_number is not null
      order by e.row_number`,
    [spreadsheetId, worksheet],
  )
  return rows.map((r: { row_number: number }) => r.row_number)
}

export async function resolveRowErrors(q: Queryable, spreadsheetId: string, worksheet: string, rowNumbers: number[]): Promise<void> {
  if (!rowNumbers.length) return
  await q.query(
    `update email_sync_row_errors e set resolved = true, retried_at = now()
       from email_sync_jobs j
      where j.id = e.job_id and j.spreadsheet_id = $1 and j.worksheet = $2 and e.row_number = any($3::int[]) and not e.resolved`,
    [spreadsheetId, worksheet, rowNumbers],
  )
}
