'use client'

import Link from 'next/link'
import { useState } from 'react'
import { api, errMsg, fmtDate, useLoad } from '@/lib/admin/api'
import { Empty, Notice, PageTitle, Panel, Spinner, Stat, StatusBadge, Td, TableWrap, Th } from '@/components/admin/ui'

type Overview = {
  environment: string
  sendMode: 'disabled' | 'allowlist' | 'live'
  allowlistEntries: number
  configured: Record<string, boolean>
  listmonk: { healthy: boolean; lists?: Array<{ id: number; name: string; subscriber_count?: number }>; error?: string }
  counts: Record<string, number>
  audiences: number
  jobs: Array<{ id: string; kind: string; status: string; started_at: string; error: string | null; spreadsheet_id: string | null }>
}

const SETTINGS: Array<[string, string]> = [
  ['database', 'Database connection'], ['listmonk', 'Listmonk connection'], ['googleSheets', 'Google Sheets access'],
  ['tokenSecret', 'Link signing secret'], ['jobSecret', 'Scheduled job secret'], ['resend', 'Confirmation email service'], ['webhookSecret', 'Delivery event secret'],
]

const MODE = {
  disabled: { kind: 'warn' as const, text: 'Sending is turned off in this environment. Nothing will be emailed, and no contacts are sent to Listmonk.' },
  allowlist: { kind: 'info' as const, text: 'Test mode. Only addresses on the test allowlist can receive email.' },
  live: { kind: 'success' as const, text: 'Live sending is on. Campaigns reach real recipients.' },
}

export default function EmailOverview() {
  const { data, error, loading, reload } = useLoad(() => api<Overview>('/api/email-status'))
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<string>('')
  const [syncError, setSyncError] = useState('')

  async function syncNow() {
    setBusy(true); setResult(''); setSyncError('')
    try {
      const r = await api<any>('/api/sync', { method: 'POST', body: {} })
      setResult(r.contacts?.skipped ? 'Sync skipped because sending is turned off here.' : `Pulled ${r.reconcile.unsubscribesAdopted + r.reconcile.suppressed + r.reconcile.bouncesApplied} change(s) from Listmonk. Sent ${r.contacts.created + r.contacts.updated} contact update(s). ${r.contacts.remaining} still waiting.`)
      await reload()
    } catch (e) { setSyncError(errMsg(e)) } finally { setBusy(false) }
  }

  if (loading && !data) return <Spinner />
  if (error && !data) return <Notice kind="error">{error}</Notice>
  if (!data) return null
  const total = Object.values(data.counts).reduce((a, b) => a + b, 0)

  return (
    <>
      <PageTitle title="Email overview" intro="Contacts, consent, audiences and campaigns. Herufi keeps the record of who agreed to what. Listmonk does the sending.">
        <button type="button" onClick={syncNow} disabled={busy} className="btn-secondary">{busy ? 'Syncing' : 'Sync now'}</button>
        <Link href="/admin/email/campaigns" className="btn-primary">Campaigns</Link>
      </PageTitle>

      <div className="space-y-6">
        <Notice kind={MODE[data.sendMode].kind}>
          <strong className="font-semibold">{data.environment}</strong>. {MODE[data.sendMode].text}
          {data.sendMode === 'allowlist' && <> {data.allowlistEntries} allowlist {data.allowlistEntries === 1 ? 'entry' : 'entries'}.</>}
        </Notice>
        {result && <Notice kind="success">{result}</Notice>}
        {syncError && <Notice kind="error">{syncError}</Notice>}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Contacts" value={total} />
          <Stat label="Subscribed" value={data.counts.subscribed ?? 0} hint="May receive email" />
          <Stat label="No consent yet" value={data.counts.imported_pending_consent ?? 0} hint="Imported, never emailed" />
          <Stat label="Audiences" value={data.audiences} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Settings in place">
            <ul className="space-y-2">
              {SETTINGS.map(([k, label]) => (
                <li key={k} className="flex items-center justify-between text-sm">
                  <span>{label}</span>
                  <span className={data.configured[k] ? 'text-forest font-medium' : 'text-red-700 font-medium'}>{data.configured[k] ? 'Set' : 'Missing'}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-charcoal/55">Only whether a setting exists is shown. Values are never displayed.</p>
          </Panel>

          <Panel title="Listmonk">
            {data.listmonk.healthy ? (
              <>
                <p className="mb-3 text-sm text-forest font-medium">Connected</p>
                {data.listmonk.lists?.length ? (
                  <TableWrap><thead><tr><Th>List</Th><Th className="text-right">Subscribers</Th></tr></thead>
                    <tbody>{data.listmonk.lists.map((l) => <tr key={l.id} className="border-t border-border-soft"><Td>{l.name}</Td><Td className="text-right font-mono">{l.subscriber_count ?? 0}</Td></tr>)}</tbody></TableWrap>
                ) : <Empty>No lists yet. One is created for each audience the first time it is used.</Empty>}
              </>
            ) : (
              <Notice kind="error">Listmonk is not reachable. {data.listmonk.error}</Notice>
            )}
          </Panel>
        </div>

        <Panel title="Recent sync jobs">
          {data.jobs.length === 0 ? <Empty>No sync has run yet.</Empty> : (
            <TableWrap><thead><tr><Th>Job</Th><Th>Status</Th><Th>Started</Th><Th>Problem</Th></tr></thead>
              <tbody>{data.jobs.map((j) => (
                <tr key={j.id} className="border-t border-border-soft"><Td>{j.kind.replace(/_/g, ' ')}</Td><Td><StatusBadge status={j.status} /></Td><Td>{fmtDate(j.started_at)}</Td><Td className="text-charcoal/65">{j.error ?? ''}</Td></tr>
              ))}</tbody></TableWrap>
          )}
        </Panel>
      </div>
    </>
  )
}
