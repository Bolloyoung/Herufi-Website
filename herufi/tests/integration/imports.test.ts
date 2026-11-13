import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { GoogleSheetsClient } from '@/lib/integrations/google-sheets/client'
import type { ColumnMapping } from '@/lib/integrations/google-sheets/schemas'
import { createAudience } from '@/lib/services/audiences'
import { confirmSubscription, requestSubscription, unsubscribe } from '@/lib/services/consent'
import { previewImport, runImport } from '@/lib/services/imports'
import { unresolvedRowNumbers } from '@/lib/services/sync-jobs'
import { createTestDatabase, sql } from './helpers'

const SHEET = 'sheet-id-1234567'
const TAB = 'Contacts'
const HEADERS = ['Email', 'First name', 'Surname', 'Organisation', 'Type', 'Tags', 'Consent', 'Consent date', 'Consent source', 'Consent purpose', 'Consent evidence', 'ID']
const MAPPING: ColumnMapping = {
  email: 'Email', first_name: 'First name', last_name: 'Surname', organisation: 'Organisation', organisation_type: 'Type', tags: 'Tags',
  consent_status: 'Consent', consent_date: 'Consent date', consent_source: 'Consent source', consent_purpose: 'Consent purpose',
  consent_evidence: 'Consent evidence', external_id: 'ID',
}

let url = ''
let drop: () => Promise<void>
let rows: string[][] = []
let delayMs = 0
const sheets = {
  readSheet: async () => {
    if (delayMs) await new Promise((r) => setTimeout(r, delayMs))
    return { headers: HEADERS, rows: rows.map((r) => [...r]) }
  },
} as unknown as GoogleSheetsClient

const row = (email: string, o: Partial<Record<keyof typeof MAPPING, string>> = {}) => [
  email, o.first_name ?? '', o.last_name ?? '', o.organisation ?? '', o.organisation_type ?? '', o.tags ?? '', o.consent_status ?? '',
  o.consent_date ?? '', o.consent_source ?? '', o.consent_purpose ?? '', o.consent_evidence ?? '', o.external_id ?? '',
]
const req = { spreadsheetId: SHEET, worksheet: TAB, mapping: MAPPING, actor: 'admin@herufi.org' }
const contact = async (e: string) => (await sql(url, 'select * from email_contacts where email = $1', [e]))[0]
const count = async (table: string, where = 'true') => (await sql(url, `select count(*)::int n from ${table} where ${where}`))[0].n as number

beforeAll(async () => { const d = await createTestDatabase(); url = d.url; drop = d.drop })
afterAll(async () => { await drop?.() })
beforeEach(async () => {
  delayMs = 0
  for (const t of ['email_sync_row_errors', 'email_sync_jobs', 'email_consent_events', 'email_confirmation_tokens', 'email_contact_audiences', 'email_suppressions', 'email_contacts', 'email_audit_log', 'email_column_mappings', 'email_audiences']) {
    await sql(url, `delete from ${t}`)
  }
})

const FULL_CLAIM = { consent_status: 'Yes', consent_date: '2025-03-04', consent_source: 'Nairobi summit form', consent_purpose: 'Research updates', consent_evidence: 'Form 881' }

describe('preview', () => {
  it('reports what would happen and writes nothing', async () => {
    rows = [row('a@example.org', { first_name: 'Ann' }), row('b@example.org'), row('not an email'), row('a@example.org')]
    const p = await previewImport({ spreadsheetId: SHEET, worksheet: TAB, mapping: MAPPING }, sheets)
    expect(p.totals).toMatchObject({ total: 4, valid: 2, invalid: 1, duplicates: 1, new: 2 })
    expect(p.rows.slice(0, 2).map((r) => r.action).sort()).toEqual(['duplicate_in_sheet', 'invalid'])
    expect(await count('email_contacts')).toBe(0)
    expect(await count('email_sync_jobs')).toBe(0)
  })

  it('suggests a mapping from the headings when none is given, and reports a missing email column without throwing', async () => {
    rows = [row('a@example.org')]
    const ok = await previewImport({ spreadsheetId: SHEET, worksheet: TAB }, sheets)
    expect(ok.mappingSource).toBe('suggested')
    expect(ok.mapping).toMatchObject({ email: 'Email', first_name: 'First name', organisation: 'Organisation' })
    const bad = await previewImport({ spreadsheetId: SHEET, worksheet: TAB, mapping: { first_name: 'First name' } }, sheets)
    expect(bad.mappingErrors).toContain('An email column is required')
    expect(bad.totals).toBeNull()
  })
})

describe('import', () => {
  it('imports valid rows as "no consent", reports bad rows, and subscribes nobody', async () => {
    rows = [
      row('a@example.org', { first_name: 'Ann', organisation: 'Acme', organisation_type: 'DFI', tags: 'dfi, africa', external_id: 'X1', ...FULL_CLAIM }),
      row('b@example.org', { first_name: 'Bo' }),
      row('bad'),
      row('a@example.org'),
      ['', '', '', '', '', '', '', '', '', '', '', ''],
      row('stop@example.org', { consent_status: 'Unsubscribed' }),
    ]
    const r = await runImport(req, sheets)
    expect(r.status).toBe('partial')
    expect(r.stats).toMatchObject({ created: 3, problems: 2, failed: 0 })
    expect(await count('email_contacts', "status = 'subscribed'")).toBe(0)
    expect(await count('email_contacts')).toBe(3)

    const a = await contact('a@example.org')
    expect(a).toMatchObject({ status: 'imported_pending_consent', first_name: 'Ann', organisation_type: 'DFI', external_id: 'X1', source_spreadsheet_id: SHEET, source_row: 2 })
    expect(a.tags).toEqual(['dfi', 'africa'])
    expect(a.claimed_consent).toMatchObject({ status: 'given', complete: true, source: 'Nairobi summit form' })
    expect(a.consent_given_at).toBeNull() // a claim is not consent

    const stop = await contact('stop@example.org')
    expect(stop.status).toBe('unsubscribed')
    expect((await sql(url, 'select reason, source from email_suppressions where email = $1', ['stop@example.org']))[0].reason).toBe('unsubscribed')

    const errs = await sql(url, 'select row_number, code from email_sync_row_errors order by row_number')
    expect(errs).toEqual([{ row_number: 4, code: 'invalid_email' }, { row_number: 5, code: 'duplicate_in_sheet' }])
    expect((await sql(url, 'select status from email_sync_jobs'))[0].status).toBe('partial')
    expect(await count('email_column_mappings')).toBe(1)
    expect(await count('email_audit_log', "action = 'import.completed'")).toBe(1)
  })

  it('is idempotent: running the same sheet again creates and changes nothing', async () => {
    rows = [row('a@example.org', { first_name: 'Ann', tags: 'x', ...FULL_CLAIM, external_id: 'X1' }), row('b@example.org'), row('c@example.org', { consent_status: 'No' })]
    await runImport(req, sheets)
    const before = await sql(url, 'select id, email, status, updated_at, tags from email_contacts order by email')
    const evBefore = await count('email_consent_events')

    const second = await runImport(req, sheets)
    expect(second.status).toBe('succeeded')
    expect(second.stats).toMatchObject({ created: 0, updated: 0, unchanged: 3, failed: 0 })
    expect(await sql(url, 'select id, email, status, updated_at, tags from email_contacts order by email')).toEqual(before)
    expect(await count('email_consent_events')).toBe(evBefore)

    const third = await runImport(req, sheets)
    expect(third.stats).toMatchObject({ created: 0, updated: 0, unchanged: 3 })
    expect(await count('email_contacts')).toBe(3)
  })

  it('updates changed fields, keeps the source mapping, and never erases data from a blank cell', async () => {
    rows = [row('a@example.org', { first_name: 'Ann', last_name: 'Lee', organisation: 'Acme', external_id: 'X1' })]
    await runImport(req, sheets)
    rows = [row('a@example.org', { first_name: 'Ann', last_name: '', organisation: 'Acme Ltd', external_id: 'X1' })]
    const r = await runImport(req, sheets)
    expect(r.stats).toMatchObject({ created: 0, updated: 1 })
    expect(await contact('a@example.org')).toMatchObject({ organisation: 'Acme Ltd', last_name: 'Lee', external_id: 'X1', source_spreadsheet_id: SHEET })
    expect(await count('email_contacts')).toBe(1)
  })

  it('only queues a Listmonk sync when a subscribed contact has a change that Listmonk shows', async () => {
    rows = [row('a@example.org', { organisation: 'Acme' })]
    await runImport(req, sheets)
    await sql(url, "update email_contacts set status = 'subscribed', needs_listmonk_sync = false where email = 'a@example.org'")
    rows = [row('a@example.org', { organisation: 'Acme', consent_status: 'Yes' })] // only the claim changes
    await runImport(req, sheets)
    expect((await contact('a@example.org')).needs_listmonk_sync).toBe(false)
    rows = [row('a@example.org', { organisation: 'Acme Ltd', consent_status: 'Yes' })]
    await runImport(req, sheets)
    expect((await contact('a@example.org')).needs_listmonk_sync).toBe(true)
  })

  it('NEVER reactivates a contact who unsubscribed, even when the sheet claims full consent', async () => {
    const aud = await createAudience('admin@herufi.org', { name: 'Updates', publicSignup: true })
    const t = await requestSubscription({ email: 'a@example.org', audienceSlugs: [aud.slug], source: 'form' })
    if (t.outcome !== 'sent') throw new Error('x')
    await confirmSubscription(t.token)
    await unsubscribe({ contactId: t.contactId, source: 'email link' })
    expect((await contact('a@example.org')).status).toBe('unsubscribed')

    rows = [row('a@example.org', { first_name: 'Ann', ...FULL_CLAIM })]
    for (let i = 0; i < 3; i++) await runImport(req, sheets)

    const c = await contact('a@example.org')
    expect(c.status).toBe('unsubscribed')
    expect(await count('email_suppressions', "email = 'a@example.org' and cleared_at is null")).toBe(1)
    expect(await count('email_contact_audiences', 'consented')).toBe(0)
  })

  it('honours a withdrawal written in the sheet for a currently subscribed contact', async () => {
    const aud = await createAudience('admin@herufi.org', { name: 'Updates', publicSignup: true })
    const t = await requestSubscription({ email: 'a@example.org', audienceSlugs: [aud.slug], source: 'form' })
    if (t.outcome !== 'sent') throw new Error('x')
    await confirmSubscription(t.token)
    rows = [row('a@example.org', { consent_status: 'Do not contact' })]
    const r = await runImport(req, sheets)
    expect(r.stats.withdrawals).toBe(1)
    const c = await contact('a@example.org')
    expect(c).toMatchObject({ status: 'unsubscribed', needs_listmonk_sync: true })
    expect(await count('email_contact_audiences', 'consented')).toBe(0)
    expect((await sql(url, "select source from email_consent_events where event_type = 'unsubscribed'"))[0].source).toContain(`sheet:${SHEET}/${TAB}!2`)
  })

  it('starts a new contact in the stricter state when the address is already suppressed', async () => {
    await sql(url, "insert into email_suppressions (email, reason, source) values ('s@example.org', 'bounced', 'provider')")
    rows = [row('s@example.org', FULL_CLAIM)]
    await runImport(req, sheets)
    expect((await contact('s@example.org')).status).toBe('bounced')
  })

  it('imports only the rows an administrator selected', async () => {
    rows = [row('a@example.org'), row('b@example.org'), row('c@example.org')]
    const r = await runImport({ ...req, rowNumbers: [3] }, sheets)
    expect(r.stats).toMatchObject({ created: 1, skipped: 2 })
    expect(await count('email_contacts')).toBe(1)
    expect(await contact('b@example.org')).toBeTruthy()
    expect(await count('email_column_mappings')).toBe(0) // a partial import does not overwrite the saved mapping
  })

  it('adds contacts to audiences by rule without granting any consent', async () => {
    const aud = await createAudience('admin@herufi.org', { name: 'DFIs', autoRules: { organisation_type: ['dfi'] } })
    rows = [row('a@example.org', { organisation_type: 'DFI' }), row('b@example.org', { organisation_type: 'NGO' })]
    await runImport(req, sheets)
    const m = await sql(url, 'select c.email, m.consented, m.added_via from email_contact_audiences m join email_contacts c on c.id = m.contact_id where m.audience_id = $1', [aud.id])
    expect(m).toEqual([{ email: 'a@example.org', consented: false, added_via: 'import_rule' }])
  })

  it('flags a changed email address for review instead of rewriting it', async () => {
    rows = [row('old@example.org', { external_id: 'X1' })]
    await runImport(req, sheets)
    rows = [row('new@example.org', { external_id: 'X1' })]
    const r = await runImport(req, sheets)
    expect(r.status).toBe('partial')
    expect(await contact('new@example.org')).toBeUndefined()
    expect(await contact('old@example.org')).toBeTruthy()
    expect((await sql(url, "select code from email_sync_row_errors where code = 'email_changed'")).length).toBe(1)
  })

  it('refuses an invalid spreadsheet id or mapping before doing anything', async () => {
    await expect(runImport({ ...req, spreadsheetId: 'bad id!' }, sheets)).rejects.toMatchObject({ code: 'validation_error' })
    await expect(runImport({ ...req, mapping: { first_name: 'First name' } }, sheets)).rejects.toMatchObject({ code: 'validation_error' })
    expect(await count('email_contacts')).toBe(0)
    expect((await sql(url, "select status from email_sync_jobs where status = 'failed'")).length).toBe(1) // the mapping failure is recorded
  })
})

describe('failures and recovery', () => {
  it('isolates a failing row, keeps the rest, and lets the failed row be retried after the sheet is fixed', async () => {
    rows = [row('a@example.org', { external_id: 'X1' }), row('b@example.org', { external_id: 'X1' }), row('c@example.org', { external_id: 'X3' })]
    const first = await runImport(req, sheets)
    expect(first.status).toBe('partial')
    expect(first.stats).toMatchObject({ created: 2, failed: 1 })
    expect(await contact('a@example.org')).toBeTruthy()
    expect(await contact('b@example.org')).toBeUndefined()
    expect(await contact('c@example.org')).toBeTruthy()
    expect(await unresolvedRowNumbers(await (await import('@/lib/server/db')).db(), SHEET, TAB)).toEqual([3])

    rows = [row('a@example.org', { external_id: 'X1' }), row('b@example.org', { external_id: 'X2' }), row('c@example.org', { external_id: 'X3' })]
    const retry = await runImport({ ...req, onlyRows: [3] }, sheets)
    expect(retry.status).toBe('succeeded')
    expect(retry.stats).toMatchObject({ created: 1 })
    expect(await contact('b@example.org')).toBeTruthy()
    expect(await unresolvedRowNumbers(await (await import('@/lib/server/db')).db(), SHEET, TAB)).toEqual([])
    expect(await count('email_contacts')).toBe(3)
  })

  it('protects against two syncs of the same sheet at once', async () => {
    rows = [row('a@example.org')]
    delayMs = 400
    const results = await Promise.allSettled([runImport(req, sheets), runImport(req, sheets)])
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1)
    const rejected = results.find((r) => r.status === 'rejected') as PromiseRejectedResult
    expect(rejected.reason).toMatchObject({ code: 'sync_in_progress' })
    expect(await count('email_contacts')).toBe(1)
  })

  it('does not let a sync for another sheet block this one', async () => {
    rows = [row('a@example.org')]
    delayMs = 300
    const other = { ...req, spreadsheetId: 'other-sheet-1234567' }
    const results = await Promise.allSettled([runImport(req, sheets), runImport(other, sheets)])
    expect(results.every((r) => r.status === 'fulfilled')).toBe(true)
  })

  it('recovers from a crashed sync: a stale lock is cleared and the new sync proceeds', async () => {
    await sql(url, `insert into email_sync_jobs (kind, spreadsheet_id, worksheet, status, heartbeat_at) values ('sheet_import', $1, $2, 'running', now() - interval '1 hour')`, [SHEET, TAB])
    rows = [row('a@example.org')]
    const r = await runImport(req, sheets)
    expect(r.status).toBe('succeeded')
    const stale = await sql(url, "select status, error from email_sync_jobs where status = 'failed'")
    expect(stale).toHaveLength(1)
    expect(stale[0].error).toContain('Timed out')
  })

  it('does not block a fresh sync on a recent running job from a crashed process only after the timeout', async () => {
    await sql(url, `insert into email_sync_jobs (kind, spreadsheet_id, worksheet, status, heartbeat_at) values ('sheet_import', $1, $2, 'running', now())`, [SHEET, TAB])
    rows = [row('a@example.org')]
    await expect(runImport(req, sheets)).rejects.toMatchObject({ code: 'sync_in_progress' })
  })
})
