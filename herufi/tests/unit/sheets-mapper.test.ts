import { describe, expect, it } from 'vitest'
import { buildClaim, parseConsentDate, parseConsentStatus, parseRows, suggestMapping, validateMapping } from '@/lib/integrations/google-sheets/mapper'

const NOW = new Date('2026-11-11T12:00:00Z')

describe('column mapping', () => {
  it('suggests a mapping from common headings, ignoring case and punctuation', () => {
    const m = suggestMapping(['E-mail Address', 'Given Name', 'Surname', 'Company', 'Position', 'Country', 'Org Type', 'Labels', 'Consent', 'Date of consent', 'Notes', 'Contact ID'])
    expect(m).toMatchObject({
      email: 'E-mail Address', first_name: 'Given Name', last_name: 'Surname', organisation: 'Company',
      job_title: 'Position', country: 'Country', organisation_type: 'Org Type', tags: 'Labels',
      consent_status: 'Consent', consent_date: 'Date of consent', notes: 'Notes', external_id: 'Contact ID',
    })
  })
  it('never assigns one column to two fields', () => {
    const m = suggestMapping(['Type', 'Email'])
    const cols = Object.values(m)
    expect(new Set(cols).size).toBe(cols.length)
  })
  it('requires an email column, existing headers, and no duplicates', () => {
    expect(validateMapping({}, ['A']).errors).toContain('An email column is required')
    expect(validateMapping({ email: 'Nope' }, ['A']).ok).toBe(false)
    expect(validateMapping({ email: 'A', first_name: 'A' }, ['A']).ok).toBe(false)
    expect(validateMapping({ email: 'A', first_name: 'B' }, ['A', 'B']).ok).toBe(true)
  })
})

describe('consent dates', () => {
  it.each([
    ['2025-03-04', '2025-03-04'], ['2025/03/04', '2025-03-04'], ['04/03/2025', '2025-03-04'],
    ['4-3-2025', '2025-03-04'], ['4 March 2025', '2025-03-04'], ['Mar 4, 2025', '2025-03-04'],
    ['2025-03-04T10:30:00Z', '2025-03-04'],
  ])('parses %s', (input, iso) => expect(parseConsentDate(input, NOW)).toBe(iso))
  it.each(['', 'soon', '31/02/2025', '2025-13-01', '2031-01-01', '1980-01-01', '32/01/2025'])('rejects %j', (input) =>
    expect(parseConsentDate(input, NOW)).toBeNull())
})

describe('consent claims', () => {
  it('reads common words for given and withdrawn', () => {
    for (const w of ['Yes', 'opted in', 'Consented', 'Subscribed', 'TRUE']) expect(parseConsentStatus(w)).toBe('given')
    for (const w of ['No', 'Unsubscribed', 'opted out', 'Do not contact', 'withdrawn']) expect(parseConsentStatus(w)).toBe('withdrawn')
    expect(parseConsentStatus('maybe')).toBe('unknown')
  })
  it('is complete only with a date, source, purpose and evidence', () => {
    const full = buildClaim({ status: 'yes', date: '2025-03-04', source: 'Summit form', purpose: 'Research updates', evidence: 'Form #881' }, NOW)!
    expect(full.complete).toBe(true)
    expect(full.problems).toEqual([])
    const partial = buildClaim({ status: 'yes', date: '2025-03-04', source: '', purpose: '', evidence: '' }, NOW)!
    expect(partial.complete).toBe(false)
    expect(partial.problems).toEqual(['Consent source is missing', 'Consent purpose is missing', 'Consent evidence is missing'])
  })
  it('flags an unreadable date and an unknown status', () => {
    expect(buildClaim({ status: 'yes', date: 'last spring', source: 's', purpose: 'p', evidence: 'e' }, NOW)!.problems)
      .toContain('Consent date is not a valid past date')
    expect(buildClaim({ status: 'maybe', date: '', source: '', purpose: '', evidence: '' }, NOW)!.status).toBe('unknown')
  })
  it('produces no claim when every consent cell is empty', () => {
    expect(buildClaim({ status: '', date: '', source: '', purpose: '', evidence: '' }, NOW)).toBeNull()
  })
})

describe('row parsing', () => {
  const headers = ['Email', 'First', 'Org', 'Tags', 'Consent', 'ID']
  const mapping = { email: 'Email', first_name: 'First', organisation: 'Org', tags: 'Tags', consent_status: 'Consent', external_id: 'ID' }

  it('numbers rows as the sheet shows them (header is row 1)', () => {
    const rows = parseRows(headers, [['a@example.org', 'Ann', 'X'], ['b@example.org', 'Bo', 'Y']], mapping, { now: NOW })
    expect(rows.map((r) => r.rowNumber)).toEqual([2, 3])
  })
  it('skips blank lines but keeps row numbering aligned', () => {
    const rows = parseRows(headers, [['a@example.org'], ['', '', ''], ['b@example.org']], mapping, { now: NOW })
    expect(rows.map((r) => [r.rowNumber, r.email])).toEqual([[2, 'a@example.org'], [4, 'b@example.org']])
  })
  it('lowercases and validates emails, recording a clear reason for each failure', () => {
    const rows = parseRows(headers, [[' ANN@Example.ORG '], ['not-an-email'], ['', 'Bo'], ['x@@y.org', 'Name']], mapping, { now: NOW })
    expect(rows[0]).toMatchObject({ email: 'ann@example.org', invalid: false })
    expect(rows[1].issues[0].code).toBe('invalid_email')
    expect(rows[2].issues[0].code).toBe('missing_email')
    expect(rows[3].invalid).toBe(true)
  })
  it('flags a repeated address and points at the first row', () => {
    const rows = parseRows(headers, [['a@example.org'], ['A@EXAMPLE.org']], mapping, { now: NOW })
    expect(rows[0].invalid).toBe(false)
    expect(rows[1]).toMatchObject({ invalid: true })
    expect(rows[1].issues[0]).toEqual({ code: 'duplicate_in_sheet', message: 'Duplicate of row 2' })
  })
  it('cleans cell values and parses tags', () => {
    const [r] = parseRows(headers, [['a@example.org', '<b>Ann</b>', ' Acme  Corp ', 'DFI, dfi, NGO']], mapping, { now: NOW })
    expect(r.fields.first_name).toBe('bAnn/b')
    expect(r.fields.organisation).toBe('Acme Corp')
    expect(r.fields.tags).toEqual(['DFI', 'NGO'])
  })
  it('works with arbitrary headings and a custom tag delimiter, without requiring exact names', () => {
    const rows = parseRows(['Work mail', 'Interests'], [['a@example.org', 'x|y']], { email: 'Work mail', tags: 'Interests' }, { tagDelimiter: '|', now: NOW })
    expect(rows[0].fields.tags).toEqual(['x', 'y'])
  })
  it('captures the consent claim without treating it as permission', () => {
    const [r] = parseRows(headers, [['a@example.org', '', '', '', 'Yes']], mapping, { now: NOW })
    expect(r.claimedConsent).toMatchObject({ status: 'given', complete: false })
  })
})
