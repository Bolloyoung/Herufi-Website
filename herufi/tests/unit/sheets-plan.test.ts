import { describe, expect, it } from 'vitest'
import { parseRows } from '@/lib/integrations/google-sheets/mapper'
import { indexExisting, planImport, type ExistingContact } from '@/lib/integrations/google-sheets/plan'
import type { SuppressionReason } from '@/lib/domain/types'

const NOW = new Date('2026-11-11T12:00:00Z')
const SHEET = 'sheet-1'
const headers = ['Email', 'First', 'Org', 'Tags', 'Consent', 'Date', 'Source', 'Purpose', 'Evidence', 'ID']
const mapping = {
  email: 'Email', first_name: 'First', organisation: 'Org', tags: 'Tags', consent_status: 'Consent',
  consent_date: 'Date', consent_source: 'Source', consent_purpose: 'Purpose', consent_evidence: 'Evidence', external_id: 'ID',
}
const parse = (rows: string[][]) => parseRows(headers, rows, mapping, { now: NOW })

const existing = (over: Partial<ExistingContact> = {}): ExistingContact => ({
  id: 'id-1', email: 'a@example.org', external_id: null, source_spreadsheet_id: null, status: 'imported_pending_consent',
  first_name: 'Ann', last_name: null, organisation: 'Acme', job_title: null, country: null, organisation_type: null,
  category: null, notes: null, tags: [], claimed_consent: null, ...over,
})
const none = new Map<string, SuppressionReason>()
const run = (rows: string[][], contacts: ExistingContact[] = [], sup = none) =>
  planImport(parse(rows), indexExisting(contacts, SHEET), sup)

describe('import planning', () => {
  it('creates new contacts as imported_pending_consent, never subscribed', () => {
    const { rows, totals } = run([['a@example.org', 'Ann', 'Acme']])
    expect(rows[0]).toMatchObject({ action: 'new', initialStatus: 'imported_pending_consent' })
    expect(totals).toMatchObject({ total: 1, valid: 1, new: 1 })
  })

  it('keeps a "consented" claim as a claim: status stays imported_pending_consent', () => {
    const { rows } = run([['a@example.org', '', '', '', 'Yes', '2025-03-04', 'Form', 'Updates', 'Ref 9']])
    expect(rows[0].initialStatus).toBe('imported_pending_consent')
    expect(rows[0].parsed.claimedConsent?.complete).toBe(true)
  })

  it('is idempotent: a row identical to the stored contact is unchanged', () => {
    const { rows, totals } = run([['a@example.org', 'Ann', 'Acme']], [existing()])
    expect(rows[0].action).toBe('unchanged')
    expect(totals).toMatchObject({ new: 0, updated: 0, unchanged: 1 })
  })

  it('reports exactly which fields an update would change', () => {
    const { rows } = run([['a@example.org', 'Ann', 'New Org', 'DFI']], [existing()])
    expect(rows[0]).toMatchObject({ action: 'update', changes: ['organisation', 'tags'] })
  })

  it('does not erase data when a sheet cell is blank', () => {
    const { rows } = run([['a@example.org', '', '']], [existing()])
    expect(rows[0].action).toBe('unchanged')
  })

  it('never proposes a status change for an existing contact, even if the sheet claims consent', () => {
    const unsub = existing({ status: 'unsubscribed' })
    const { rows } = run([['a@example.org', 'Ann', 'Acme', '', 'Yes', '2025-03-04', 'Form', 'Updates', 'Ref']], [unsub])
    expect(rows[0].adoptWithdrawal).toBe(false)
    // the only possible change is storing the claim; status is untouched by the plan
    expect(rows[0].initialStatus).toBeUndefined()
  })

  it('honours a withdrawal in the sheet, because that only makes a contact more restricted', () => {
    const { rows } = run([['a@example.org', 'Ann', 'Acme', '', 'Unsubscribed']], [existing({ status: 'subscribed' })])
    expect(rows[0]).toMatchObject({ action: 'update', adoptWithdrawal: true })
    const fresh = run([['b@example.org', '', '', '', 'Do not contact']])
    expect(fresh.rows[0]).toMatchObject({ action: 'new', initialStatus: 'unsubscribed' })
  })

  it('does not re-adopt a withdrawal for a contact who is already blocked', () => {
    const { rows } = run([['a@example.org', 'Ann', 'Acme', '', 'No']], [existing({ status: 'bounced' })])
    expect(rows[0].adoptWithdrawal).toBe(false)
  })

  it('starts a new contact at the stricter status when the address is already suppressed', () => {
    const sup = new Map<string, SuppressionReason>([['a@example.org', 'unsubscribed'], ['c@example.org', 'bounced']])
    const { rows } = run([['a@example.org'], ['b@example.org'], ['c@example.org']], [], sup)
    expect(rows.map((r) => r.initialStatus)).toEqual(['unsubscribed', 'imported_pending_consent', 'bounced'])
  })

  it('does not rewrite an address when the same external ID arrives with a different email', () => {
    const e = existing({ external_id: 'X1', source_spreadsheet_id: SHEET })
    const { rows, totals } = run([['new@example.org', 'Ann', 'Acme', '', '', '', '', '', '', 'X1']], [e])
    expect(rows[0]).toMatchObject({ action: 'email_changed', existingId: 'id-1' })
    expect(totals.needsReview).toBe(1)
  })

  it('matches on external ID within the same spreadsheet only', () => {
    const e = existing({ external_id: 'X1', source_spreadsheet_id: 'other-sheet' })
    const { rows } = run([['a@example.org', 'Ann', 'Acme', '', '', '', '', '', '', 'X1']], [e])
    expect(rows[0].action).toBe('unchanged') // matched by email, not by the other sheet's id
  })

  it('flags a conflict when email and external ID point at different contacts', () => {
    const a = existing({ id: 'A', email: 'a@example.org' })
    const b = existing({ id: 'B', email: 'b@example.org', external_id: 'X1', source_spreadsheet_id: SHEET })
    const { rows } = run([['a@example.org', '', '', '', '', '', '', '', '', 'X1']], [a, b])
    expect(rows[0].action).toBe('conflict')
  })

  it('separates invalid and duplicate rows from valid ones in the totals', () => {
    const { totals } = run([['a@example.org'], ['bad'], ['a@example.org'], ['b@example.org']])
    expect(totals).toMatchObject({ total: 4, valid: 2, invalid: 1, duplicates: 1, new: 2 })
  })

  it('counts complete, incomplete and withdrawn claims', () => {
    const { totals } = run([
      ['a@example.org', '', '', '', 'Yes', '2025-03-04', 'Form', 'Updates', 'Ref'],
      ['b@example.org', '', '', '', 'Yes'],
      ['c@example.org', '', '', '', 'No'],
    ])
    expect(totals).toMatchObject({ claimsComplete: 1, claimsIncomplete: 1, withdrawn: 1 })
  })
})

describe('claim comparison', () => {
  it('treats the same claim as unchanged even when jsonb returns its keys in a different order', async () => {
    const { canonicalJson } = await import('@/lib/integrations/google-sheets/plan')
    expect(canonicalJson({ b: 1, a: { d: [2, 1], c: null } })).toBe(canonicalJson({ a: { c: null, d: [2, 1] }, b: 1 }))
    expect(canonicalJson({ a: 1 })).not.toBe(canonicalJson({ a: 2 }))
    const claimRow = [['a@example.org', '', '', '', 'Yes', '2025-03-04', 'Form', 'Updates', 'Ref']]
    const parsed = parse(claimRow)[0].claimedConsent!
    // same data, deliberately reordered keys, as Postgres would hand it back
    const stored = JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(parsed).reverse())))
    const { rows } = run(claimRow, [existing({ claimed_consent: stored })])
    expect(rows[0].action).toBe('unchanged')
  })
})
