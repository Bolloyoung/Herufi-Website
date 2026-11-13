'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api, errMsg, fmtDate, useLoad } from '@/lib/admin/api'
import { CAMPAIGN_STATUSES } from '@/lib/domain/types'
import { Empty, Field, Notice, PageTitle, Panel, Spinner, StatusBadge, Td, TableWrap, Th } from '@/components/admin/ui'

type Row = {
  id: string; name: string; subject: string; status: string; audience_name: string | null; eligible_count: number | null
  scheduled_at: string | null; timezone: string; stats: { sent?: number; to_send?: number; bounces?: number; views?: number; clicks?: number; unsubscribes?: number }
  updated_at: string; last_error: string | null
}

export default function CampaignsPage() {
  const router = useRouter()
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [audienceId, setAudienceId] = useState('')
  const [err, setErr] = useState('')
  const audiences = useLoad(() => api<{ audiences: Array<{ id: string; name: string }> }>('/api/audiences'))
  const list = useLoad(() => api<{ rows: Row[]; total: number }>(`/api/campaigns?${new URLSearchParams({ page: String(page), perPage: '25', ...(status ? { status } : {}), ...(q.trim() ? { q: q.trim() } : {}) })}`), [status, q, page])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    try {
      const c = await api<{ id: string }>('/api/campaigns', { body: { name, audienceId: audienceId || null } })
      router.push(`/admin/email/campaigns/${c.id}`)
    } catch (e2) { setErr(errMsg(e2)) }
  }

  const pages = Math.max(1, Math.ceil((list.data?.total ?? 0) / 25))

  return (
    <>
      <PageTitle title="Campaigns" intro="One off emails to an audience. Each one is tested, reviewed and confirmed before it can go out.">
        <button className="btn-primary" onClick={() => setCreating(true)}>New campaign</button>
      </PageTitle>
      <div className="space-y-5">
        {creating && (
          <Panel title="New campaign">
            <form onSubmit={create} className="grid gap-4 md:grid-cols-[2fr_2fr_auto] md:items-end">
              <Field label="Name (internal)" htmlFor="n-n"><input id="n-n" className="field" required maxLength={200} value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
              <Field label="Audience" htmlFor="n-a"><select id="n-a" className="field" value={audienceId} onChange={(e) => setAudienceId(e.target.value)}><option value="">Choose later</option>{audiences.data?.audiences.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
              <div className="flex gap-2"><button className="btn-primary">Create</button><button type="button" className="btn-secondary" onClick={() => setCreating(false)}>Cancel</button></div>
            </form>
            {err && <div className="mt-3"><Notice kind="error">{err}</Notice></div>}
          </Panel>
        )}

        <Panel>
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <Field label="Search" htmlFor="cs-q"><input id="cs-q" className="field" value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Name or subject" /></Field>
            <Field label="Status" htmlFor="cs-s"><select id="cs-s" className="field" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }}><option value="">All</option>{CAMPAIGN_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
          </div>
          {list.loading && !list.data ? <Spinner /> : list.error ? <Notice kind="error">{list.error}</Notice> : !list.data?.rows.length ? <Empty>No campaigns yet.</Empty> : (
            <TableWrap><thead><tr><Th>Campaign</Th><Th>Status</Th><Th>Audience</Th><Th className="text-right">Recipients</Th><Th className="text-right">Accepted</Th><Th>When</Th><Th>Updated</Th></tr></thead>
              <tbody>{list.data.rows.map((r) => (
                <tr key={r.id} className="border-t border-border-soft hover:bg-gray-soft/60">
                  <Td><Link href={`/admin/email/campaigns/${r.id}`} className="font-medium text-forest hover:underline">{r.name}</Link><div className="text-xs text-charcoal/55">{r.subject || 'No subject yet'}</div>{r.last_error && <div className="text-xs text-red-700">{r.last_error}</div>}</Td>
                  <Td><StatusBadge status={r.status} /></Td>
                  <Td>{r.audience_name ?? <span className="text-charcoal/40">None</span>}</Td>
                  <Td className="text-right font-mono">{r.eligible_count ?? ''}</Td>
                  <Td className="text-right font-mono">{r.stats?.sent ?? ''}</Td>
                  <Td className="text-xs">{r.scheduled_at ? `${fmtDate(r.scheduled_at)}` : ''}</Td>
                  <Td className="text-xs text-charcoal/65">{fmtDate(r.updated_at)}</Td>
                </tr>
              ))}</tbody></TableWrap>
          )}
          {list.data && list.data.total > 25 && (
            <div className="mt-4 flex items-center justify-between text-sm"><button className="btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span className="text-charcoal/60">Page {page} of {pages}</span><button className="btn-secondary" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button></div>
          )}
        </Panel>
      </div>
    </>
  )
}
