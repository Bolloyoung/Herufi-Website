'use client'

import Link from 'next/link'
import { useState } from 'react'
import { api, errMsg, fmtDate, useLoad } from '@/lib/admin/api'
import { CONTACT_STATUSES, STATUS_LABELS } from '@/lib/domain/types'
import { Empty, Field, Notice, PageTitle, Panel, Spinner, StatusBadge, Td, TableWrap, Th } from '@/components/admin/ui'

type Row = {
  id: string; email: string; first_name: string | null; last_name: string | null; organisation: string | null; status: string
  consent_given_at: string | null; claimed_consent: { status: string; complete: boolean } | null; updated_at: string
  audiences: Array<{ id: string; name: string; consented: boolean }>
}
type List = { rows: Row[]; total: number; page: number; perPage: number; counts: Record<string, number> }
type Audience = { id: string; name: string }

export default function ContactsPage() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [audienceId, setAudienceId] = useState('')
  const [claim, setClaim] = useState('')
  const [archived, setArchived] = useState(false)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [bulkAudience, setBulkAudience] = useState('')
  const [message, setMessage] = useState<{ kind: 'success' | 'error' | 'warn'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const audiences = useLoad(() => api<{ audiences: Audience[] }>('/api/audiences'))
  const list = useLoad(() => {
    const p = new URLSearchParams({ page: String(page), perPage: '50', archived: String(archived) })
    if (q.trim()) p.set('q', q.trim())
    if (status) p.set('status', status)
    if (audienceId) p.set('audienceId', audienceId)
    if (claim) p.set('claim', claim)
    return api<List>(`/api/contacts?${p}`)
  }, [q, status, audienceId, claim, archived, page])

  const rows = list.data?.rows ?? []
  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id))
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  async function addToAudience() {
    if (!bulkAudience || !selected.length) return
    setBusy(true); setMessage(null)
    try {
      const r = await api<{ changed: number }>(`/api/audiences/${bulkAudience}/members`, { body: { action: 'add', contactIds: selected } })
      setMessage({ kind: 'success', text: `Added ${r.changed} contact(s) to the audience. This does not give them consent. They still cannot receive email until consent is recorded.` })
      setSelected([]); await list.reload()
    } catch (e) { setMessage({ kind: 'error', text: errMsg(e) }) } finally { setBusy(false) }
  }

  async function acceptClaims() {
    if (!bulkAudience || !selected.length) return
    if (!window.confirm(`Accept the consent claimed in the spreadsheet for ${selected.length} contact(s), for the chosen audience?\n\nOnly contacts whose sheet row holds a date, source, purpose and evidence will be subscribed. You are recording that you have checked this evidence.`)) return
    setBusy(true); setMessage(null)
    try {
      const r = await api<{ accepted: number; skipped: Array<{ reason: string }> }>('/api/contacts/accept-claimed', { body: { contactIds: selected, audienceIds: [bulkAudience] } })
      setMessage({ kind: r.skipped.length ? 'warn' : 'success', text: `Accepted ${r.accepted}. Skipped ${r.skipped.length}${r.skipped.length ? ` because the sheet did not hold complete evidence of consent` : ''}.` })
      setSelected([]); await list.reload()
    } catch (e) { setMessage({ kind: 'error', text: errMsg(e) }) } finally { setBusy(false) }
  }

  const pages = Math.max(1, Math.ceil((list.data?.total ?? 0) / 50))

  return (
    <>
      <PageTitle title="Contacts" intro="Everyone Herufi holds. A contact can only receive email while subscribed, and only for the audiences they consented to." />
      <div className="space-y-5">
        {list.data && (
          <div className="flex flex-wrap gap-2">
            {CONTACT_STATUSES.map((s) => (
              <button key={s} type="button" onClick={() => { setStatus(status === s ? '' : s); setPage(1) }}
                className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${status === s ? 'border-forest bg-forest text-cream' : 'border-border-soft bg-white text-charcoal/70 hover:border-forest/40'}`}>
                {STATUS_LABELS[s]} <span className="font-mono">{list.data!.counts[s] ?? 0}</span>
              </button>
            ))}
          </div>
        )}

        <Panel>
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Search" htmlFor="c-q"><input id="c-q" className="field" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Email, name or organisation" /></Field>
            <Field label="Audience" htmlFor="c-a">
              <select id="c-a" className="field" value={audienceId} onChange={(e) => { setAudienceId(e.target.value); setPage(1) }}>
                <option value="">All audiences</option>
                {audiences.data?.audiences.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
            <Field label="Spreadsheet consent claim" htmlFor="c-c">
              <select id="c-c" className="field" value={claim} onChange={(e) => { setClaim(e.target.value); setPage(1) }}>
                <option value="">Any</option><option value="complete">Complete evidence, not yet accepted</option><option value="incomplete">Evidence missing</option>
              </select>
            </Field>
            <Field label="Show" htmlFor="c-arch">
              <select id="c-arch" className="field" value={String(archived)} onChange={(e) => { setArchived(e.target.value === 'true'); setPage(1) }}>
                <option value="false">Active contacts</option><option value="true">Archived contacts</option>
              </select>
            </Field>
          </div>
        </Panel>

        {message && <Notice kind={message.kind}>{message.text}</Notice>}

        {selected.length > 0 && (
          <Panel>
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-sm text-charcoal"><strong>{selected.length}</strong> selected</p>
              <Field label="Audience" htmlFor="b-a">
                <select id="b-a" className="field min-w-[14rem]" value={bulkAudience} onChange={(e) => setBulkAudience(e.target.value)}>
                  <option value="">Choose an audience</option>
                  {audiences.data?.audiences.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </Field>
              <button type="button" className="btn-secondary" disabled={!bulkAudience || busy} onClick={addToAudience}>Add to audience</button>
              <button type="button" className="btn-primary" disabled={!bulkAudience || busy} onClick={acceptClaims}>Accept sheet consent</button>
            </div>
            <p className="mt-3 text-xs text-charcoal/60">Adding to an audience never grants consent. Accepting sheet consent subscribes only contacts whose sheet row holds a date, source, purpose and evidence.</p>
          </Panel>
        )}

        <Panel>
          {list.loading && !list.data ? <Spinner /> : list.error ? <Notice kind="error">{list.error}</Notice> : rows.length === 0 ? (
            <Empty>No contacts match. Import a spreadsheet to add contacts.</Empty>
          ) : (
            <TableWrap>
              <thead><tr>
                <Th className="w-8"><input type="checkbox" aria-label="Select all on this page" checked={allSelected} onChange={() => setSelected(allSelected ? [] : rows.map((r) => r.id))} /></Th>
                <Th>Contact</Th><Th>Status</Th><Th>Audiences</Th><Th>Consent</Th><Th>Updated</Th>
              </tr></thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border-soft hover:bg-gray-soft/60">
                    <Td><input type="checkbox" aria-label={`Select ${r.email}`} checked={selected.includes(r.id)} onChange={() => toggle(r.id)} /></Td>
                    <Td>
                      <Link href={`/admin/email/contacts/${r.id}`} className="font-medium text-forest hover:underline">{r.email}</Link>
                      <div className="text-xs text-charcoal/55">{[r.first_name, r.last_name].filter(Boolean).join(' ')}{r.organisation ? ` at ${r.organisation}` : ''}</div>
                    </Td>
                    <Td><StatusBadge status={r.status} /></Td>
                    <Td className="text-xs">{r.audiences.length ? r.audiences.map((a) => <span key={a.id} className={`mr-1 inline-block rounded px-1.5 py-0.5 ${a.consented ? 'bg-forest/10 text-forest' : 'bg-charcoal/10 text-charcoal/70'}`}>{a.name}</span>) : <span className="text-charcoal/40">None</span>}</Td>
                    <Td className="text-xs text-charcoal/65">
                      {r.consent_given_at ? `Confirmed ${fmtDate(r.consent_given_at)}` : r.claimed_consent?.status === 'given' ? (r.claimed_consent.complete ? 'Sheet claims consent, evidence complete' : 'Sheet claims consent, evidence missing') : 'None recorded'}
                    </Td>
                    <Td className="text-xs text-charcoal/65">{fmtDate(r.updated_at)}</Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
          {list.data && list.data.total > 50 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
              <span className="text-charcoal/60">Page {page} of {pages} ({list.data.total} contacts)</span>
              <button className="btn-secondary" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          )}
        </Panel>
      </div>
    </>
  )
}
