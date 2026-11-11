'use client'

import { useEffect, useState } from 'react'
import { api, errMsg, fmtDate, useLoad } from '@/lib/admin/api'
import { CANONICAL_FIELDS, FIELD_LABELS, type CanonicalField } from '@/lib/integrations/google-sheets/schemas'
import { Empty, Field, Notice, PageTitle, Panel, Spinner, Stat, StatusBadge, Td, TableWrap, Th } from '@/components/admin/ui'

type Info = { serviceAccountEmail: string; defaultSpreadsheetId: string | null; defaultWorksheet: string | null; worksheets?: Array<{ title: string }> }
type PlannedRow = { rowNumber: number; email: string; action: string; changes: string[]; message?: string; adoptWithdrawal: boolean; claim: { status: string; complete: boolean; problems: string[] } | null }
type Preview = {
  headers: string[]; mapping: Partial<Record<CanonicalField, string>>; mappingSource: string; mappingErrors: string[]; tagDelimiter: string
  totals: Record<string, number> | null; rows: PlannedRow[]; truncated: boolean
}
type Job = { id: string; kind: string; spreadsheet_id: string | null; worksheet: string | null; status: string; stats: Record<string, number>; error: string | null; started_at: string }
type Status = { jobs: Job[]; job: { job: Job; errors: Array<{ id: string; row_number: number | null; email: string | null; code: string; message: string; resolved: boolean }>; errorTotal: number } | null; unresolvedRows: number[] }

const ACTION: Record<string, string> = {
  new: 'New', update: 'Update', unchanged: 'Unchanged', invalid: 'Invalid', duplicate_in_sheet: 'Duplicate', email_changed: 'Email changed, review', conflict: 'Conflict, review',
}

export default function ImportsPage() {
  const info = useLoad(() => api<Info>('/api/integrations/google-sheets/info'))
  const [spreadsheetId, setSpreadsheetId] = useState('')
  const [worksheet, setWorksheet] = useState('')
  const [tabs, setTabs] = useState<string[]>([])
  const [mapping, setMapping] = useState<Partial<Record<CanonicalField, string>>>({})
  const [tagDelimiter, setTagDelimiter] = useState(',')
  const [preview, setPreview] = useState<Preview | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [busy, setBusy] = useState<string>('')
  const [msg, setMsg] = useState<{ kind: 'success' | 'error' | 'warn'; text: string } | null>(null)
  const [jobId, setJobId] = useState('')
  const status = useLoad(() => api<Status>(`/api/integrations/google-sheets/status?${new URLSearchParams({ ...(jobId ? { jobId } : {}), ...(spreadsheetId && worksheet ? { spreadsheetId, worksheet } : {}) })}`), [jobId, spreadsheetId, worksheet])

  useEffect(() => {
    if (info.data) { setSpreadsheetId((v) => v || info.data!.defaultSpreadsheetId || ''); setWorksheet((v) => v || info.data!.defaultWorksheet || '') }
  }, [info.data])

  async function loadTabs() {
    setBusy('tabs'); setMsg(null)
    try {
      const r = await api<Info>(`/api/integrations/google-sheets/info?spreadsheetId=${encodeURIComponent(spreadsheetId.trim())}`)
      const names = (r.worksheets ?? []).map((w) => w.title)
      setTabs(names)
      if (names.length && !names.includes(worksheet)) setWorksheet(names[0])
      if (!names.length) setMsg({ kind: 'warn', text: 'The spreadsheet has no worksheets.' })
    } catch (e) { setMsg({ kind: 'error', text: errMsg(e) }) } finally { setBusy('') }
  }

  async function runPreview(useMapping: boolean) {
    setBusy('preview'); setMsg(null)
    try {
      const p = await api<Preview>('/api/integrations/google-sheets/preview', { body: { spreadsheetId: spreadsheetId.trim(), worksheet, ...(useMapping ? { mapping, tagDelimiter } : {}) } })
      setPreview(p); setMapping(p.mapping); setTagDelimiter(p.tagDelimiter)
      setSelected(p.rows.filter((r) => r.action === 'new' || r.action === 'update').map((r) => r.rowNumber))
      if (p.mappingErrors.length) setMsg({ kind: 'warn', text: p.mappingErrors.join('. ') })
    } catch (e) { setMsg({ kind: 'error', text: errMsg(e) }) } finally { setBusy('') }
  }

  async function runImport(opts: { onlyRows?: number[] } = {}) {
    if (!preview && !opts.onlyRows) return
    const actionable = preview?.rows.filter((r) => r.action === 'new' || r.action === 'update').map((r) => r.rowNumber) ?? []
    const all = !opts.onlyRows && selected.length === actionable.length && !preview?.truncated
    const count = opts.onlyRows ? opts.onlyRows.length : selected.length
    if (!window.confirm(`Import ${count} row(s) from "${worksheet}"?\n\nContacts are added as "no consent yet". Nobody is subscribed by an import.`)) return
    setBusy('import'); setMsg(null)
    try {
      const r = await api<{ jobId: string; status: string; stats: Record<string, number> }>('/api/integrations/google-sheets/sync', {
        body: { spreadsheetId: spreadsheetId.trim(), worksheet, mapping, tagDelimiter, ...(opts.onlyRows ? { onlyRows: opts.onlyRows } : all ? {} : { rowNumbers: selected }) },
      })
      setJobId(r.jobId)
      setMsg({ kind: r.status === 'succeeded' ? 'success' : 'warn', text: `Import ${r.status}. Created ${r.stats.created}, updated ${r.stats.updated}, unchanged ${r.stats.unchanged}, problems ${r.stats.problems + r.stats.failed}.` })
      await status.reload()
      if (!opts.onlyRows) await runPreview(true)
    } catch (e) { setMsg({ kind: 'error', text: errMsg(e) }) } finally { setBusy('') }
  }

  const t = preview?.totals
  const toggle = (n: number) => setSelected((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]))
  const actionable = preview?.rows.filter((r) => r.action === 'new' || r.action === 'update') ?? []

  return (
    <>
      <PageTitle title="Import contacts" intro="Read contacts from a Google Sheet. Always preview first. An import adds contacts with no consent, and never subscribes anyone." />
      <div className="space-y-6">
        {info.data && (
          <Notice kind="info">Share the spreadsheet with <strong className="font-mono text-xs">{info.data.serviceAccountEmail}</strong> as a Viewer. Herufi only ever reads it.</Notice>
        )}
        {info.error && <Notice kind="error">{info.error}</Notice>}
        {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}

        <Panel title="1. Choose the sheet">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr_auto] md:items-end">
            <Field label="Spreadsheet ID" htmlFor="i-id" hint="The long code in the spreadsheet address, between /d/ and /edit"><input id="i-id" className="field font-mono text-xs" value={spreadsheetId} onChange={(e) => setSpreadsheetId(e.target.value)} /></Field>
            <Field label="Worksheet" htmlFor="i-ws">
              {tabs.length ? (
                <select id="i-ws" className="field" value={worksheet} onChange={(e) => setWorksheet(e.target.value)}>{tabs.map((n) => <option key={n}>{n}</option>)}</select>
              ) : <input id="i-ws" className="field" value={worksheet} onChange={(e) => setWorksheet(e.target.value)} placeholder="Tab name" />}
            </Field>
            <button className="btn-secondary" onClick={loadTabs} disabled={!spreadsheetId.trim() || busy === 'tabs'}>{busy === 'tabs' ? 'Loading' : 'Load worksheets'}</button>
          </div>
          <div className="mt-4"><button className="btn-primary" onClick={() => runPreview(false)} disabled={!spreadsheetId.trim() || !worksheet || busy === 'preview'}>{busy === 'preview' ? 'Reading the sheet' : 'Preview import'}</button></div>
        </Panel>

        {preview && (
          <>
            <Panel title="2. Match the columns" action={<span className="text-xs text-charcoal/55">Mapping {preview.mappingSource === 'saved' ? 'saved from your last import' : preview.mappingSource === 'suggested' ? 'suggested from the headings' : 'as you set it'}</span>}>
              <div className="grid gap-4 md:grid-cols-3">
                {CANONICAL_FIELDS.map((f) => (
                  <Field key={f} label={`${FIELD_LABELS[f]}${f === 'email' ? ' (required)' : ''}`} htmlFor={`m-${f}`}>
                    <select id={`m-${f}`} className="field" value={mapping[f] ?? ''} onChange={(e) => setMapping((m) => { const n = { ...m }; if (e.target.value) n[f] = e.target.value; else delete n[f]; return n })}>
                      <option value="">Not in the sheet</option>{preview.headers.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </Field>
                ))}
                <Field label="Tag separator" htmlFor="m-delim"><select id="m-delim" className="field" value={tagDelimiter} onChange={(e) => setTagDelimiter(e.target.value)}><option value=",">Comma</option><option value=";">Semicolon</option><option value="|">Pipe</option></select></Field>
              </div>
              <div className="mt-4"><button className="btn-secondary" onClick={() => runPreview(true)} disabled={busy === 'preview'}>Preview with this mapping</button></div>
              <p className="mt-3 text-xs text-charcoal/55">Dates are read day first, so 04/03/2026 is 4 March. A blank cell never erases information already held.</p>
            </Panel>

            {t && (
              <Panel title="3. Review what would happen">
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                  <Stat label="Rows" value={t.total} /><Stat label="Valid" value={t.valid} /><Stat label="New" value={t.new} /><Stat label="Updates" value={t.updated} />
                  <Stat label="Unchanged" value={t.unchanged} /><Stat label="Invalid" value={t.invalid} /><Stat label="Duplicates" value={t.duplicates} /><Stat label="Need review" value={t.needsReview} />
                  <Stat label="Consent claimed, complete" value={t.claimsComplete} hint="Needs your acceptance" /><Stat label="Consent claimed, incomplete" value={t.claimsIncomplete} /><Stat label="Withdrawn in sheet" value={t.withdrawn} hint="Will be unsubscribed" />
                </div>
                {t.claimsComplete + t.claimsIncomplete > 0 && <div className="mt-4"><Notice kind="warn">The sheet claims consent for some people. Those claims are stored for you to check on the Contacts screen. They do not make anyone eligible until you accept them.</Notice></div>}

                <div className="mt-5">
                  {preview.rows.length === 0 ? <Empty>The sheet has no data rows.</Empty> : (
                    <div className="max-h-[28rem] overflow-y-auto rounded-md border border-border-soft">
                      <TableWrap>
                        <thead className="sticky top-0 bg-white"><tr><Th className="w-8"><input type="checkbox" aria-label="Select all importable rows" checked={actionable.length > 0 && selected.length === actionable.length} onChange={() => setSelected(selected.length === actionable.length ? [] : actionable.map((r) => r.rowNumber))} /></Th><Th>Row</Th><Th>Email</Th><Th>Outcome</Th><Th>Detail</Th></tr></thead>
                        <tbody>{preview.rows.map((r) => {
                          const importable = r.action === 'new' || r.action === 'update'
                          return (
                            <tr key={r.rowNumber} className="border-t border-border-soft">
                              <Td>{importable && <input type="checkbox" aria-label={`Import row ${r.rowNumber}`} checked={selected.includes(r.rowNumber)} onChange={() => toggle(r.rowNumber)} />}</Td>
                              <Td className="font-mono text-xs">{r.rowNumber}</Td><Td>{r.email || <span className="text-charcoal/40">Blank</span>}</Td>
                              <Td><span className={`rounded-md px-2 py-0.5 text-xs ${importable ? 'bg-forest/10 text-forest' : r.action === 'unchanged' ? 'bg-charcoal/10' : 'bg-red-50 text-red-800'}`}>{ACTION[r.action] ?? r.action}</span></Td>
                              <Td className="text-xs text-charcoal/65">{r.message ?? (r.changes.length ? `Changes: ${r.changes.join(', ')}` : '')}{r.adoptWithdrawal ? ' Sheet says do not contact, will unsubscribe.' : ''}</Td>
                            </tr>
                          )
                        })}</tbody>
                      </TableWrap>
                    </div>
                  )}
                  {preview.truncated && <p className="mt-2 text-xs text-charcoal/55">Showing the first 1000 rows. Import everything at once to include the rest.</p>}
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <button className="btn-primary" disabled={busy === 'import' || selected.length === 0 || !!preview.mappingErrors.length} onClick={() => runImport()}>{busy === 'import' ? 'Importing' : `Import ${selected.length} row(s)`}</button>
                  <span className="text-xs text-charcoal/55">Running it again is safe. Rows already imported are left unchanged.</span>
                </div>
              </Panel>
            )}
          </>
        )}

        <Panel title="Import history" action={status.data?.unresolvedRows.length ? <button className="btn-secondary" disabled={busy === 'import'} onClick={() => runImport({ onlyRows: status.data!.unresolvedRows })}>Retry {status.data.unresolvedRows.length} failed row(s)</button> : undefined}>
          {status.loading && !status.data ? <Spinner /> : !status.data?.jobs.length ? <Empty>No imports yet.</Empty> : (
            <TableWrap><thead><tr><Th>Job</Th><Th>Status</Th><Th>Started</Th><Th>Result</Th><Th /></tr></thead>
              <tbody>{status.data.jobs.map((j) => (
                <tr key={j.id} className="border-t border-border-soft"><Td>{j.kind.replace(/_/g, ' ')}</Td><Td><StatusBadge status={j.status} /></Td><Td>{fmtDate(j.started_at)}</Td>
                  <Td className="text-xs text-charcoal/65">{j.error ?? (j.kind === 'sheet_import' ? `Created ${j.stats.created ?? 0}, updated ${j.stats.updated ?? 0}, unchanged ${j.stats.unchanged ?? 0}, problems ${(j.stats.problems ?? 0) + (j.stats.failed ?? 0)}` : '')}</Td>
                  <Td className="text-right"><button className="text-sm text-forest hover:underline" onClick={() => setJobId(j.id)}>Details</button></Td></tr>
              ))}</tbody></TableWrap>
          )}
          {status.data?.job && (
            <div className="mt-5 border-t border-border-soft pt-4">
              <p className="mb-2 text-sm font-medium">Row problems for the selected job ({status.data.job.errorTotal})</p>
              {status.data.job.errors.length === 0 ? <p className="text-sm text-charcoal/60">None.</p> : (
                <TableWrap><thead><tr><Th>Row</Th><Th>Email</Th><Th>Problem</Th><Th>Fixed</Th></tr></thead>
                  <tbody>{status.data.job.errors.map((e) => <tr key={e.id} className="border-t border-border-soft"><Td className="font-mono text-xs">{e.row_number ?? ''}</Td><Td>{e.email ?? ''}</Td><Td className="text-xs">{e.message}</Td><Td>{e.resolved ? 'Yes' : 'No'}</Td></tr>)}</tbody></TableWrap>
              )}
            </div>
          )}
        </Panel>
      </div>
    </>
  )
}
