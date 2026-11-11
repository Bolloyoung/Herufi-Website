'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { api, errMsg, fmtDate, useLoad } from '@/lib/admin/api'
import { Empty, Field, Notice, PageTitle, Panel, Spinner, StatusBadge, Td, TableWrap, Th } from '@/components/admin/ui'

type Detail = {
  contact: Record<string, any>
  audiences: Array<{ id: string; name: string; consented: boolean; consent_confirmed_at: string | null; added_via: string }>
  consentHistory: Array<{ id: string; event_type: string; from_status: string | null; to_status: string | null; source: string | null; purpose: string | null; evidence: string | null; actor: string; created_at: string }>
  suppression: { reason: string; source: string | null; detail: string | null; created_at: string } | null
}

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>()
  const { data, error, loading, reload } = useLoad(() => api<Detail>(`/api/contacts/${id}`), [id])
  const allAudiences = useLoad(() => api<{ audiences: Array<{ id: string; name: string }> }>('/api/audiences'))
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [reason, setReason] = useState('')
  const [form, setForm] = useState({ audienceIds: [] as string[], date: '', source: '', purpose: '', evidence: '' })

  if (loading && !data) return <Spinner />
  if (error && !data) return <Notice kind="error">{error}</Notice>
  if (!data) return null
  const c = data.contact
  const blocked = ['bounced', 'complained', 'suppressed', 'invalid'].includes(c.status)
  const canRecord = !blocked && c.status !== 'unsubscribed'
  const claim = c.claimed_consent as { status: string; complete: boolean; date: string | null; source: string | null; purpose: string | null; evidence: string | null; problems: string[] } | null

  async function act(action: string, needsReason: boolean) {
    if (needsReason && reason.trim().length < 5) { setMsg({ kind: 'error', text: 'Give a reason first.' }); return }
    setBusy(true); setMsg(null)
    try { await api(`/api/contacts/${id}/actions`, { body: { action, reason } }); setReason(''); setMsg({ kind: 'success', text: 'Done. The change is recorded in the audit log.' }); await reload() }
    catch (e) { setMsg({ kind: 'error', text: errMsg(e) }) } finally { setBusy(false) }
  }

  async function record(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg(null)
    try { await api(`/api/contacts/${id}/consent`, { body: form }); setMsg({ kind: 'success', text: 'Consent recorded with your name and the evidence you gave.' }); await reload() }
    catch (err) { setMsg({ kind: 'error', text: errMsg(err) }) } finally { setBusy(false) }
  }

  return (
    <>
      <p className="mb-4 text-sm"><Link href="/admin/email/contacts" className="text-forest hover:underline">Back to contacts</Link></p>
      <PageTitle title={c.email}>
        <StatusBadge status={c.status} />
        {c.archived_at && <span className="rounded-md bg-charcoal/10 px-2 py-0.5 text-xs">Archived</span>}
      </PageTitle>

      <div className="space-y-6">
        {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
        {data.suppression && <Notice kind="error"><strong className="font-semibold">Suppressed ({data.suppression.reason}).</strong> {data.suppression.detail ?? ''} This address cannot receive email until an administrator clears it with a reason.</Notice>}

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Profile">
            <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
              {[['Name', [c.first_name, c.last_name].filter(Boolean).join(' ')], ['Organisation', c.organisation], ['Job title', c.job_title], ['Country', c.country], ['Organisation type', c.organisation_type], ['Category', c.category], ['Tags', (c.tags ?? []).join(', ')], ['Source', c.source_spreadsheet_id ? `Sheet row ${c.source_row ?? ''}` : 'Public form'], ['Internal notes', c.notes]].map(([k, v]) => (
                <div key={k as string} className="contents"><dt className="text-charcoal/55">{k}</dt><dd className="text-charcoal">{(v as string) || <span className="text-charcoal/35">Not set</span>}</dd></div>
              ))}
            </dl>
          </Panel>

          <Panel title="Consent on record">
            {c.consent_given_at ? (
              <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
                <dt className="text-charcoal/55">Given</dt><dd>{fmtDate(c.consent_given_at)}</dd>
                <dt className="text-charcoal/55">Source</dt><dd>{c.consent_source}</dd>
                <dt className="text-charcoal/55">Purpose</dt><dd>{c.consent_purpose}</dd>
                <dt className="text-charcoal/55">Wording version</dt><dd className="font-mono text-xs">{c.consent_wording_version}</dd>
                <dt className="text-charcoal/55">Evidence</dt><dd>{c.consent_evidence}</dd>
              </dl>
            ) : <p className="text-sm text-charcoal/65">No verified consent. This contact cannot receive email.</p>}
            {claim && (
              <div className="mt-4 rounded-md border border-border-soft bg-gray-soft p-3 text-sm">
                <p className="font-medium text-charcoal">Claimed in the spreadsheet (not yet accepted)</p>
                <p className="mt-1 text-charcoal/70">Status: {claim.status}. {claim.complete ? 'Evidence is complete.' : 'Evidence is incomplete.'}</p>
                {claim.problems.length > 0 && <ul className="mt-1 list-disc pl-5 text-xs text-charcoal/60">{claim.problems.map((p) => <li key={p}>{p}</li>)}</ul>}
              </div>
            )}
          </Panel>
        </div>

        <Panel title="Audiences">
          {data.audiences.length === 0 ? <Empty>Not in any audience.</Empty> : (
            <TableWrap><thead><tr><Th>Audience</Th><Th>Consent for this audience</Th><Th>Added by</Th></tr></thead>
              <tbody>{data.audiences.map((a) => (
                <tr key={a.id} className="border-t border-border-soft"><Td>{a.name}</Td>
                  <Td>{a.consented ? <span className="font-medium text-forest">Yes, {fmtDate(a.consent_confirmed_at)}</span> : <span className="text-charcoal/60">No</span>}</Td>
                  <Td className="text-charcoal/65">{a.added_via.replace(/_/g, ' ')}</Td></tr>
              ))}</tbody></TableWrap>
          )}
        </Panel>

        <Panel title="Record consent obtained outside Herufi">
          {!canRecord ? (
            <Notice kind="warn">{c.status === 'unsubscribed' ? 'This person unsubscribed. They must opt in again themselves.' : 'Clear the suppression first, with a reason.'}</Notice>
          ) : (
            <form onSubmit={record} className="space-y-4">
              <Notice kind="info">This does not create permission. It records evidence you have checked, under your name. Every field is required.</Notice>
              <fieldset>
                <legend className="field-label">Audiences this consent covers</legend>
                <div className="flex flex-wrap gap-3">
                  {allAudiences.data?.audiences.map((a) => (
                    <label key={a.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.audienceIds.includes(a.id)} onChange={() => setForm((f) => ({ ...f, audienceIds: f.audienceIds.includes(a.id) ? f.audienceIds.filter((x) => x !== a.id) : [...f.audienceIds, a.id] }))} />{a.name}</label>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Date consent was given" htmlFor="r-d"><input id="r-d" type="date" className="field" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
                <Field label="Source" htmlFor="r-s" hint="For example: event registration form"><input id="r-s" className="field" required value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} /></Field>
                <Field label="What they agreed to receive" htmlFor="r-p"><input id="r-p" className="field" required value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} /></Field>
                <Field label="Reference to the evidence" htmlFor="r-e" hint="A form entry, a file name or a message reference"><input id="r-e" className="field" required value={form.evidence} onChange={(e) => setForm({ ...form, evidence: e.target.value })} /></Field>
              </div>
              <button type="submit" className="btn-primary" disabled={busy || form.audienceIds.length === 0}>Record consent</button>
            </form>
          )}
        </Panel>

        <Panel title="Actions">
          <div className="space-y-3">
            <Field label="Reason (required for suppress, clear and archive)" htmlFor="a-r"><input id="a-r" className="field" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain what you are doing and why" /></Field>
            <div className="flex flex-wrap gap-2">
              {!blocked && <button className="btn-secondary" disabled={busy} onClick={() => act('suppress', true)}>Suppress address</button>}
              {(blocked || c.status === 'unsubscribed') && <button className="btn-secondary" disabled={busy} onClick={() => act('clear_suppression', true)}>Clear suppression</button>}
              {c.archived_at ? <button className="btn-secondary" disabled={busy} onClick={() => act('restore', false)}>Restore contact</button> : <button className="btn-secondary" disabled={busy} onClick={() => act('archive', true)}>Archive contact</button>}
            </div>
            <p className="text-xs text-charcoal/55">Contacts are archived, never deleted, so the consent record and suppression stay intact. Clearing a suppression returns the contact to no consent.</p>
          </div>
        </Panel>

        <Panel title="Consent history">
          {data.consentHistory.length === 0 ? <Empty>Nothing recorded yet.</Empty> : (
            <TableWrap><thead><tr><Th>When</Th><Th>Event</Th><Th>Change</Th><Th>By</Th><Th>Detail</Th></tr></thead>
              <tbody>{data.consentHistory.map((h) => (
                <tr key={h.id} className="border-t border-border-soft"><Td className="whitespace-nowrap text-xs">{fmtDate(h.created_at)}</Td><Td>{h.event_type.replace(/_/g, ' ')}</Td>
                  <Td className="text-xs">{h.from_status ?? 'none'} to {h.to_status ?? 'none'}</Td><Td className="text-xs">{h.actor}</Td><Td className="text-xs text-charcoal/65">{[h.source, h.purpose, h.evidence].filter(Boolean).join(' / ')}</Td></tr>
              ))}</tbody></TableWrap>
          )}
        </Panel>
      </div>
    </>
  )
}
