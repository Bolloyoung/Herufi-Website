'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { api, errMsg, fmtDate, useLoad } from '@/lib/admin/api'
import { Notice, PageTitle, Panel, Spinner, Stat, Td, TableWrap, Th } from '@/components/admin/ui'

type Review = {
  campaign: { id: string; name: string; subject: string; from_name: string | null; from_email: string | null; reply_to: string | null; status: string; test_sent_at: string | null; test_recipients: string[]; timezone: string; scheduled_at: string | null }
  audience: { id: string; name: string } | null
  recipients: { total: number; eligible: number; excluded: Array<{ reason: string; label: string; count: number }>; excludedTotal: number }
  sendMode: 'disabled' | 'allowlist' | 'live'
  checks: Array<{ key: string; ok: boolean; blocking: boolean; message: string }>
  canSubmit: boolean
  preview: { html: string; subject: string }
}

const ZONES = ['Africa/Nairobi', 'Africa/Lagos', 'Africa/Johannesburg', 'Africa/Cairo', 'Europe/London', 'UTC']

function offsetMs(utcMs: number, tz: string): number {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).formatToParts(new Date(utcMs)).map((p) => [p.type, p.value]))
  return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second) - utcMs
}

/** Turn a wall clock time in a chosen time zone into a UTC instant. */
function zonedToUtc(local: string, tz: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local)
  if (!m) return null
  const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5])
  let utc = guess - offsetMs(guess, tz)
  const again = offsetMs(utc, tz)
  utc = guess - again
  return new Date(utc)
}

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const review = useLoad(() => api<Review>(`/api/campaigns/${id}/review`), [id])
  // One key for this visit. A double click or a retry cannot send twice.
  const idempotencyKey = useMemo(() => `${crypto.randomUUID().replace(/-/g, '')}${Date.now().toString(36)}`, [])
  const [mode, setMode] = useState<'send_now' | 'schedule'>('send_now')
  const [when, setWhen] = useState('')
  const [tz, setTz] = useState('Africa/Nairobi')
  const [ok, setOk] = useState(false)
  const [busy, setBusy] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [done, setDone] = useState<{ status: string; eligible: number; removed: number } | null>(null)
  const [err, setErr] = useState<{ code?: string; text: string } | null>(null)

  if (review.loading && !review.data) return <Spinner />
  if (review.error && !review.data) return <Notice kind="error">{review.error}</Notice>
  const r = review.data
  if (!r) return null

  const sendAt = mode === 'schedule' ? zonedToUtc(when, tz) : null
  const scheduleBad = mode === 'schedule' && (!sendAt || sendAt.getTime() < Date.now() + 5 * 60_000)
  const blockers = r.checks.filter((c) => !c.ok && c.blocking)
  const live = r.sendMode === 'live'
  const canSend = r.canSubmit && ok && !busy && !scheduleBad && !done

  async function submit() {
    setBusy(true); setErr(null)
    try {
      const res = await api<{ campaign: { status: string }; eligible: number; removedFromList: number; alreadySubmitted: boolean }>(`/api/campaigns/${id}/submit`, {
        body: { mode, scheduledAt: sendAt?.toISOString(), expectedEligibleCount: r!.recipients.eligible, confirm: true, idempotencyKey },
      })
      setDone({ status: res.campaign.status, eligible: res.eligible, removed: res.removedFromList })
    } catch (e) {
      setErr({ code: (e as { code?: string }).code, text: errMsg(e) })
      if (['audience_changed', 'list_out_of_sync'].includes((e as { code?: string }).code ?? '')) await review.reload()
    } finally { setBusy(false) }
  }

  if (done) {
    return (
      <>
        <PageTitle title={done.status === 'scheduled' ? 'Campaign scheduled' : 'Campaign is sending'} />
        <Notice kind="success">{done.status === 'scheduled' ? `Scheduled for ${fmtDate(sendAt?.toISOString())} to ${done.eligible} people.` : `Sending to ${done.eligible} people now.`}{done.removed > 0 ? ` ${done.removed} person(s) were taken off the Listmonk list first because they should not receive it.` : ''}</Notice>
        <div className="mt-6 flex gap-3"><Link className="btn-primary" href={`/admin/email/campaigns/${id}`}>View results</Link><Link className="btn-secondary" href="/admin/email/campaigns">All campaigns</Link></div>
      </>
    )
  }

  return (
    <>
      <p className="mb-4 text-sm"><Link href={`/admin/email/campaigns/${id}`} className="text-forest hover:underline">Back to editing</Link></p>
      <PageTitle title="Review and send" intro="Check who will receive this and how it looks. Nothing is sent until you confirm at the bottom." />
      <div className="space-y-6">
        <Notice kind={live ? 'success' : r.sendMode === 'allowlist' ? 'info' : 'warn'}>
          {r.sendMode === 'disabled' ? 'Sending is turned off in this environment, so this campaign cannot be sent from here.' : r.sendMode === 'allowlist' ? 'Test environment. Only allowlisted addresses will receive this.' : 'Live sending is on. This email will reach real people.'}
        </Notice>
        {err && <Notice kind="error">{err.text}{err.code === 'audience_changed' ? ' The numbers below have been refreshed.' : ''}</Notice>}

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="The email">
            <dl className="grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
              <dt className="text-charcoal/55">Subject</dt><dd className="font-medium">{r.preview.subject || <span className="text-red-700">Missing</span>}</dd>
              <dt className="text-charcoal/55">From</dt><dd>{r.campaign.from_name} ({r.campaign.from_email})</dd>
              <dt className="text-charcoal/55">Reply to</dt><dd>{r.campaign.reply_to ?? 'Not set'}</dd>
              <dt className="text-charcoal/55">Audience</dt><dd>{r.audience?.name ?? <span className="text-red-700">None chosen</span>}</dd>
              <dt className="text-charcoal/55">Test email</dt><dd>{r.campaign.test_sent_at ? `Queued ${fmtDate(r.campaign.test_sent_at)} to ${r.campaign.test_recipients.join(', ')}` : <span className="text-red-700">Not sent yet</span>}</dd>
            </dl>
          </Panel>
          <Panel title="Who will receive it">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Will receive" value={r.recipients.eligible} /><Stat label="Left out" value={r.recipients.excludedTotal} /><Stat label="In the audience" value={r.recipients.total} />
            </div>
            {r.recipients.excluded.length > 0 ? (
              <div className="mt-4"><TableWrap><thead><tr><Th>Why they are left out</Th><Th className="text-right">People</Th></tr></thead><tbody>{r.recipients.excluded.map((e) => <tr key={e.reason} className="border-t border-border-soft"><Td>{e.label}</Td><Td className="text-right font-mono">{e.count}</Td></tr>)}</tbody></TableWrap></div>
            ) : <p className="mt-4 text-sm text-charcoal/60">No one is left out.</p>}
            <p className="mt-3 text-xs text-charcoal/55">Only people who are subscribed, with consent for this audience and not suppressed, receive the email. This is checked again at the moment of sending.</p>
          </Panel>
        </div>

        <Panel title="Checks">
          <ul className="space-y-2">{r.checks.map((c) => (
            <li key={c.key} className="flex items-start gap-3 text-sm">
              <span className={`mt-0.5 inline-block w-14 shrink-0 rounded px-1.5 py-0.5 text-center text-xs font-medium ${c.ok ? 'bg-forest/10 text-forest' : c.blocking ? 'bg-red-100 text-red-900' : 'bg-gold/20 text-charcoal'}`}>{c.ok ? 'Pass' : c.blocking ? 'Fix' : 'Note'}</span>
              <span className={c.ok ? 'text-charcoal' : 'text-charcoal'}>{c.message}</span>
            </li>))}
          </ul>
        </Panel>

        <Panel title="Preview" action={<div className="flex gap-1"><button className={`rounded px-2 py-1 text-xs ${!mobile ? 'bg-forest text-cream' : 'text-charcoal'}`} onClick={() => setMobile(false)}>Desktop</button><button className={`rounded px-2 py-1 text-xs ${mobile ? 'bg-forest text-cream' : 'text-charcoal'}`} onClick={() => setMobile(true)}>Mobile</button></div>}>
          <div className="overflow-hidden rounded-md border border-border-soft bg-gray-soft"><iframe title="Email preview" sandbox="" srcDoc={r.preview.html} className="mx-auto block h-[30rem] bg-white" style={{ width: mobile ? 375 : '100%', maxWidth: '100%' }} /></div>
        </Panel>

        <Panel title="When to send">
          <fieldset className="space-y-3">
            <legend className="sr-only">When to send</legend>
            <label className="flex items-center gap-2 text-sm"><input type="radio" name="when" checked={mode === 'send_now'} onChange={() => setMode('send_now')} />Send now</label>
            <label className="flex items-center gap-2 text-sm"><input type="radio" name="when" checked={mode === 'schedule'} onChange={() => setMode('schedule')} />Schedule for later</label>
          </fieldset>
          {mode === 'schedule' && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div><label className="field-label" htmlFor="sc-w">Date and time</label><input id="sc-w" type="datetime-local" className="field" value={when} onChange={(e) => setWhen(e.target.value)} /></div>
              <div><label className="field-label" htmlFor="sc-z">Time zone</label><select id="sc-z" className="field" value={tz} onChange={(e) => setTz(e.target.value)}>{ZONES.map((z) => <option key={z}>{z}</option>)}</select></div>
              <p className="text-xs text-charcoal/60 md:col-span-2">{sendAt ? `That is ${sendAt.toUTCString()}.` : 'Pick a date and time.'} {scheduleBad && sendAt ? 'It must be at least 5 minutes from now.' : ''}</p>
            </div>
          )}
        </Panel>

        <Panel title="Confirm">
          {blockers.length > 0 && <div className="mb-4"><Notice kind="warn">Fix this first: {blockers[0].message}</Notice></div>}
          <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-1" checked={ok} onChange={(e) => setOk(e.target.checked)} disabled={!r.canSubmit} />
            <span>I have read the email and checked the recipient list. I want to {mode === 'schedule' ? 'schedule' : 'send'} it to <strong>{r.recipients.eligible}</strong> {r.recipients.eligible === 1 ? 'person' : 'people'}.</span></label>
          <div className="mt-5 flex items-center gap-3">
            <button className="btn-primary" disabled={!canSend} onClick={submit}>{busy ? 'Working' : mode === 'schedule' ? 'Schedule campaign' : 'Send campaign'}</button>
            <button className="btn-secondary" onClick={() => router.push(`/admin/email/campaigns/${id}`)}>Back to editing</button>
          </div>
        </Panel>
      </div>
    </>
  )
}
