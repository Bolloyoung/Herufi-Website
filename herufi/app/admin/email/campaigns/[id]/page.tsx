'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { api, errMsg, fmtDate, useLoad } from '@/lib/admin/api'
import EmailEditor from '@/components/admin/EmailEditor'
import { Field, Notice, PageTitle, Panel, Spinner, Stat, StatusBadge } from '@/components/admin/ui'

type Campaign = {
  id: string; name: string; subject: string; preview_text: string | null; from_name: string | null; from_email: string | null; reply_to: string | null
  audience_id: string | null; body_html: string; body_text: string | null; status: string; scheduled_at: string | null; timezone: string
  eligible_count: number | null; excluded_summary: Record<string, number> | null; test_sent_at: string | null; test_recipients: string[]
  stats: { to_send?: number; sent?: number; views?: number; clicks?: number; bounces?: number; unsubscribes?: number }
  last_error: string | null; submitted_at: string | null; submitted_by: string | null
}
type Sender = { id: string; from_name: string; from_email: string; reply_to: string | null; verified: boolean }
type Review = { preview: { html: string; subject: string }; recipients: { eligible: number } }

const EDITABLE = ['draft', 'test', 'failed']

export default function CampaignPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const camp = useLoad(() => api<Campaign>(`/api/campaigns/${id}`), [id])
  const senders = useLoad(() => api<{ senders: Sender[] }>('/api/senders'))
  const audiences = useLoad(() => api<{ audiences: Array<{ id: string; name: string }> }>('/api/audiences'))

  const [f, setF] = useState({ name: '', subject: '', previewText: '', fromEmail: '', replyTo: '', audienceId: '', bodyHtml: '', bodyText: '' })
  const [ready, setReady] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState<{ kind: 'success' | 'error' | 'warn'; text: string } | null>(null)
  const [testTo, setTestTo] = useState('')
  const [preview, setPreview] = useState<Review | null>(null)
  const [mobile, setMobile] = useState(false)
  const loaded = useRef(false)

  useEffect(() => {
    const c = camp.data
    if (c && !loaded.current) {
      loaded.current = true
      setF({ name: c.name, subject: c.subject, previewText: c.preview_text ?? '', fromEmail: c.from_email ?? '', replyTo: c.reply_to ?? '', audienceId: c.audience_id ?? '', bodyHtml: c.body_html, bodyText: c.body_text ?? '' })
      setReady(true)
    }
  }, [camp.data])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const set = <K extends keyof typeof f>(k: K, v: string) => { setF((p) => ({ ...p, [k]: v })); setDirty(true) }
  const sender = senders.data?.senders.find((s) => s.from_email === f.fromEmail)

  async function save(quiet = false): Promise<boolean> {
    setBusy('save'); if (!quiet) setMsg(null)
    try {
      const s = senders.data?.senders.find((x) => x.from_email === f.fromEmail)
      const updated = await api<Campaign>(`/api/campaigns/${id}`, {
        method: 'PATCH',
        body: {
          name: f.name, subject: f.subject, previewText: f.previewText || null, replyTo: f.replyTo || null, audienceId: f.audienceId || null,
          bodyHtml: f.bodyHtml, bodyText: f.bodyText || null, ...(s ? { fromEmail: s.from_email, fromName: s.from_name } : {}),
        },
      })
      camp.setData(updated); setDirty(false)
      if (!quiet) setMsg({ kind: 'success', text: 'Draft saved.' })
      return true
    } catch (e) { setMsg({ kind: 'error', text: errMsg(e) }); return false } finally { setBusy('') }
  }

  async function loadPreview() {
    if (dirty && !(await save(true))) return
    setBusy('preview')
    try { setPreview(await api<Review>(`/api/campaigns/${id}/review`)) } catch (e) { setMsg({ kind: 'error', text: errMsg(e) }) } finally { setBusy('') }
  }

  async function sendTest() {
    if (dirty && !(await save(true))) return
    const recipients = testTo.split(/[\s,;]+/).filter(Boolean)
    setBusy('test'); setMsg(null)
    try {
      const r = await api<{ queued: string[] }>(`/api/campaigns/${id}/test`, { body: { recipients } })
      setMsg({ kind: 'success', text: `Test email queued for ${r.queued.join(', ')}. "Queued" means Listmonk accepted it. Check your inbox to confirm it arrived and looks right.` })
      await camp.reload()
    } catch (e) { setMsg({ kind: 'error', text: errMsg(e) }) } finally { setBusy('') }
  }

  async function control(action: 'pause' | 'resume' | 'cancel' | 'refresh') {
    if (action === 'cancel' && !window.confirm('Cancel this campaign? Emails not yet sent will not go out.')) return
    setBusy(action); setMsg(null)
    try { camp.setData(await api<Campaign>(`/api/campaigns/${id}/control`, { body: { action } })); if (action !== 'refresh') setMsg({ kind: 'success', text: `Campaign ${action === 'pause' ? 'paused' : action === 'resume' ? 'resumed' : 'cancelled'}.` }) }
    catch (e) { setMsg({ kind: 'error', text: errMsg(e) }) } finally { setBusy('') }
  }

  async function goReview() { if (dirty && !(await save(true))) return; router.push(`/admin/email/campaigns/${id}/review`) }

  if (camp.loading && !camp.data) return <Spinner />
  if (camp.error && !camp.data) return <Notice kind="error">{camp.error}</Notice>
  const c = camp.data
  if (!c || !ready) return <Spinner />
  const editable = EDITABLE.includes(c.status)

  // ---- Submitted: report view ---------------------------------------------------------------
  if (!editable) {
    const s = c.stats ?? {}
    return (
      <>
        <p className="mb-4 text-sm"><Link href="/admin/email/campaigns" className="text-forest hover:underline">Back to campaigns</Link></p>
        <PageTitle title={c.name} intro={c.subject}>
          <StatusBadge status={c.status} />
          <button className="btn-secondary" disabled={busy === 'refresh'} onClick={() => control('refresh')}>{busy === 'refresh' ? 'Refreshing' : 'Refresh'}</button>
          {c.status === 'sending' && <button className="btn-secondary" onClick={() => control('pause')} disabled={!!busy}>Pause</button>}
          {c.status === 'paused' && <button className="btn-primary" onClick={() => control('resume')} disabled={!!busy}>Resume</button>}
          {['scheduled', 'sending', 'paused'].includes(c.status) && <button className="btn-secondary" onClick={() => control('cancel')} disabled={!!busy}>Cancel</button>}
        </PageTitle>
        <div className="space-y-6">
          {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
          {c.last_error && <Notice kind="error">{c.last_error}</Notice>}
          <Panel title="Sending">
            <dl className="grid grid-cols-[10rem_1fr] gap-y-2 text-sm">
              <dt className="text-charcoal/55">Submitted</dt><dd>{c.submitted_at ? `${fmtDate(c.submitted_at)} by ${c.submitted_by}` : 'Not yet'}</dd>
              <dt className="text-charcoal/55">Scheduled for</dt><dd>{c.scheduled_at ? `${fmtDate(c.scheduled_at)} (${c.timezone})` : 'Sent immediately'}</dd>
              <dt className="text-charcoal/55">Eligible recipients</dt><dd>{c.eligible_count ?? 'Not set'}</dd>
              <dt className="text-charcoal/55">Left out</dt><dd>{c.excluded_summary && Object.keys(c.excluded_summary).length ? Object.entries(c.excluded_summary).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ') : 'No one'}</dd>
            </dl>
          </Panel>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <Stat label="Queued to send" value={s.to_send ?? 0} /><Stat label="Accepted by mail server" value={s.sent ?? 0} hint="Not the same as delivered" />
            <Stat label="Bounces" value={s.bounces ?? 0} /><Stat label="Unsubscribes" value={s.unsubscribes ?? 0} hint="From the email link" />
            <Stat label="Opens" value={s.views ?? 0} hint="Estimate only" /><Stat label="Clicks" value={s.clicks ?? 0} />
          </div>
          <Notice kind="info">Delivery confirmations are not available, so this shows how many emails were accepted by the mail server, not how many reached an inbox. Opens are counted from a tiny image that many mail apps block or load automatically, so treat them as a rough guide and not a measure of readership. Last updated {fmtDate(c.stats ? (camp.data as any).last_reconciled_at : null)}.</Notice>
        </div>
      </>
    )
  }

  // ---- Editable: composer ------------------------------------------------------------------
  return (
    <>
      <p className="mb-4 text-sm"><Link href="/admin/email/campaigns" className="text-forest hover:underline">Back to campaigns</Link></p>
      <PageTitle title={f.name || 'Campaign'}>
        <StatusBadge status={c.status} />
        <button className="btn-secondary" onClick={() => save()} disabled={busy === 'save' || !dirty}>{busy === 'save' ? 'Saving' : dirty ? 'Save draft' : 'Saved'}</button>
        <button className="btn-primary" onClick={goReview}>Review and send</button>
      </PageTitle>

      <div className="space-y-6">
        {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
        {c.last_error && <Notice kind="error">The last attempt failed: {c.last_error}</Notice>}

        <Panel title="Details">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Campaign name (internal)" htmlFor="f-n"><input id="f-n" className="field" value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
            <Field label="Audience" htmlFor="f-a"><select id="f-a" className="field" value={f.audienceId} onChange={(e) => set('audienceId', e.target.value)}><option value="">Choose an audience</option>{audiences.data?.audiences.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></Field>
            <Field label="From" htmlFor="f-f" hint={sender ? '' : 'Only verified sender addresses can be used. Add one under Senders and templates.'}>
              <select id="f-f" className="field" value={f.fromEmail} onChange={(e) => { const s = senders.data?.senders.find((x) => x.from_email === e.target.value); set('fromEmail', e.target.value); if (s?.reply_to) set('replyTo', s.reply_to) }}>
                <option value="">Choose a sender</option>
                {senders.data?.senders.filter((s) => s.verified).map((s) => <option key={s.id} value={s.from_email}>{s.from_name} ({s.from_email})</option>)}
              </select>
            </Field>
            <Field label="Reply to" htmlFor="f-r" hint="Replies go to this mailbox"><input id="f-r" type="email" className="field" value={f.replyTo} onChange={(e) => set('replyTo', e.target.value)} /></Field>
            <Field label="Subject" htmlFor="f-s" hint="You can use merge fields, for example {{first_name|colleague}}"><input id="f-s" className="field" maxLength={200} value={f.subject} onChange={(e) => set('subject', e.target.value)} /></Field>
            <Field label="Preview text" htmlFor="f-p" hint="The short line shown beside the subject in an inbox"><input id="f-p" className="field" maxLength={150} value={f.previewText} onChange={(e) => set('previewText', e.target.value)} /></Field>
          </div>
        </Panel>

        <Panel title="Email">
          <EmailEditor value={f.bodyHtml} docKey={id} onChange={(h) => set('bodyHtml', h)} />
          <p className="mt-3 text-xs text-charcoal/60">An unsubscribe link and the sender signature are added automatically. Merge fields look like {'{{first_name|there}}'}, where the text after the bar is used when a value is missing.</p>
          <details className="mt-4 rounded-md border border-border-soft p-4">
            <summary className="cursor-pointer text-sm font-medium">Plain text version</summary>
            <p className="mt-2 text-xs text-charcoal/60">Made from the email automatically. Write your own here only if you want to override it.</p>
            <textarea className="field mt-3 min-h-[8rem] font-mono text-xs" value={f.bodyText} onChange={(e) => set('bodyText', e.target.value)} aria-label="Plain text version" />
          </details>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel title="Send a test">
            <Field label="Send the test to" htmlFor="t-to" hint="Up to 5 addresses, separated by commas. In a test environment only allowlisted addresses are accepted.">
              <input id="t-to" className="field" value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="you@herufi.org" />
            </Field>
            <div className="mt-4 flex items-center gap-3">
              <button className="btn-secondary" onClick={sendTest} disabled={!testTo.trim() || busy === 'test'}>{busy === 'test' ? 'Sending test' : 'Send test'}</button>
              {c.test_sent_at && <span className="text-xs text-charcoal/60">Last test {fmtDate(c.test_sent_at)} to {c.test_recipients.join(', ')}</span>}
            </div>
          </Panel>

          <Panel title="Preview" action={<div className="flex gap-1"><button className={`rounded px-2 py-1 text-xs ${!mobile ? 'bg-forest text-cream' : 'text-charcoal'}`} onClick={() => setMobile(false)}>Desktop</button><button className={`rounded px-2 py-1 text-xs ${mobile ? 'bg-forest text-cream' : 'text-charcoal'}`} onClick={() => setMobile(true)}>Mobile</button></div>}>
            <button className="btn-secondary mb-4" onClick={loadPreview} disabled={busy === 'preview'}>{busy === 'preview' ? 'Preparing' : 'Show preview'}</button>
            {preview && (
              <>
                <p className="mb-2 text-xs text-charcoal/60">Subject: <strong>{preview.preview.subject}</strong>. Shown with sample values for the merge fields.</p>
                <div className="overflow-hidden rounded-md border border-border-soft bg-gray-soft">
                  <iframe title="Email preview" sandbox="" srcDoc={preview.preview.html} className="mx-auto block h-[28rem] bg-white transition-all" style={{ width: mobile ? 375 : '100%', maxWidth: '100%' }} />
                </div>
              </>
            )}
          </Panel>
        </div>
      </div>
    </>
  )
}
