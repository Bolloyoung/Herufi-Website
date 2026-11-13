'use client'

import { useState } from 'react'
import { api, errMsg, fmtDate, useLoad } from '@/lib/admin/api'
import EmailEditor from '@/components/admin/EmailEditor'
import { Empty, Field, Notice, PageTitle, Panel, Spinner, Td, TableWrap, Th } from '@/components/admin/ui'

type Sender = { id: string; from_name: string; from_email: string; reply_to: string | null; signature_html: string | null; verified: boolean; is_default: boolean }
type Template = { id: string; name: string; subject: string | null; preview_text: string | null; body_html: string; updated_at: string }

export default function SettingsPage() {
  const senders = useLoad(() => api<{ senders: Sender[] }>('/api/senders'))
  const templates = useLoad(() => api<{ templates: Template[] }>('/api/templates'))
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  const [s, setS] = useState({ fromName: 'Herufi', fromEmail: '', replyTo: '', signatureHtml: '' })
  const [t, setT] = useState({ id: '', name: '', subject: '', previewText: '', bodyHtml: '' })
  const [tKey, setTKey] = useState('new')

  async function addSender(e: React.FormEvent) {
    e.preventDefault(); setMsg(null)
    try { await api('/api/senders', { body: { fromName: s.fromName, fromEmail: s.fromEmail, replyTo: s.replyTo || null, signatureHtml: s.signatureHtml || null } }); setS({ fromName: 'Herufi', fromEmail: '', replyTo: '', signatureHtml: '' }); setMsg({ kind: 'success', text: 'Sender added. It cannot be used until you verify it.' }); await senders.reload() }
    catch (err) { setMsg({ kind: 'error', text: errMsg(err) }) }
  }

  async function verify(x: Sender) {
    if (!x.verified && !window.confirm(`Mark ${x.from_email} as verified?\n\nDo this only after the domain passes the checks:\n  1. The sending domain is verified with the email delivery provider.\n  2. SPF and DKIM pass for the domain.\n  3. A DMARC record exists.\n  4. A test email to a real inbox did not land in spam.\n\nSee the domain checklist in docs/email-platform.`)) return
    try { await api(`/api/senders/${x.id}`, { method: 'PATCH', body: { verified: !x.verified } }); await senders.reload() } catch (err) { setMsg({ kind: 'error', text: errMsg(err) }) }
  }

  async function saveTemplate(e: React.FormEvent) {
    e.preventDefault(); setMsg(null)
    try {
      const body = { name: t.name, subject: t.subject || null, previewText: t.previewText || null, bodyHtml: t.bodyHtml }
      if (t.id) await api(`/api/templates/${t.id}`, { method: 'PATCH', body }); else await api('/api/templates', { body })
      setT({ id: '', name: '', subject: '', previewText: '', bodyHtml: '' }); setTKey(`new-${Date.now()}`)
      setMsg({ kind: 'success', text: 'Template saved.' }); await templates.reload()
    } catch (err) { setMsg({ kind: 'error', text: errMsg(err) }) }
  }

  return (
    <>
      <PageTitle title="Senders and templates" intro="Senders are the addresses emails come from. Templates are reusable starting points for campaigns." />
      <div className="space-y-6">
        {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}

        <Panel title="Sender addresses">
          <Notice kind="info">Herufi sends through your email delivery provider, not through a Gmail mailbox. Replies go to the reply to address, which can be your existing mailbox. Your mailbox and its DNS records are not changed by anything here.</Notice>
          <div className="mt-4">
            {senders.loading && !senders.data ? <Spinner /> : !senders.data?.senders.length ? <Empty>No senders yet.</Empty> : (
              <TableWrap><thead><tr><Th>Name and address</Th><Th>Reply to</Th><Th>Status</Th><Th /></tr></thead>
                <tbody>{senders.data.senders.map((x) => (
                  <tr key={x.id} className="border-t border-border-soft"><Td><span className="font-medium">{x.from_name}</span> <span className="text-charcoal/65">({x.from_email})</span>{x.is_default && <span className="ml-2 rounded bg-forest/10 px-1.5 py-0.5 text-xs text-forest">Default</span>}</Td><Td>{x.reply_to ?? ''}</Td>
                    <Td>{x.verified ? <span className="text-forest font-medium">Verified</span> : <span className="text-red-700">Not verified</span>}</Td>
                    <Td className="whitespace-nowrap text-right"><button className="mr-3 text-sm text-forest hover:underline" onClick={() => verify(x)}>{x.verified ? 'Remove verification' : 'Mark as verified'}</button>{!x.is_default && <button className="text-sm text-forest hover:underline" onClick={async () => { await api(`/api/senders/${x.id}`, { method: 'PATCH', body: { makeDefault: true } }); await senders.reload() }}>Make default</button>}</Td></tr>
                ))}</tbody></TableWrap>
            )}
          </div>
          <form onSubmit={addSender} className="mt-6 space-y-4 border-t border-border-soft pt-5">
            <p className="text-sm font-medium">Add a sender</p>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Name recipients see" htmlFor="s-n"><input id="s-n" className="field" required value={s.fromName} onChange={(e) => setS({ ...s, fromName: e.target.value })} /></Field>
              <Field label="From address" htmlFor="s-e"><input id="s-e" type="email" className="field" required value={s.fromEmail} onChange={(e) => setS({ ...s, fromEmail: e.target.value })} placeholder="hello@herufi.org" /></Field>
              <Field label="Reply to address" htmlFor="s-r"><input id="s-r" type="email" className="field" value={s.replyTo} onChange={(e) => setS({ ...s, replyTo: e.target.value })} placeholder="hello@herufi.org" /></Field>
            </div>
            <Field label="Signature (optional)" htmlFor="s-g" hint="Added to the end of every email from this sender"><textarea id="s-g" className="field min-h-[5rem] font-mono text-xs" value={s.signatureHtml} onChange={(e) => setS({ ...s, signatureHtml: e.target.value })} placeholder="<p>The Herufi team</p>" /></Field>
            <button className="btn-primary">Add sender</button>
          </form>
        </Panel>

        <Panel title="Templates">
          {templates.loading && !templates.data ? <Spinner /> : !templates.data?.templates.length ? <Empty>No templates yet.</Empty> : (
            <TableWrap><thead><tr><Th>Name</Th><Th>Subject</Th><Th>Updated</Th><Th /></tr></thead>
              <tbody>{templates.data.templates.map((x) => (
                <tr key={x.id} className="border-t border-border-soft"><Td className="font-medium">{x.name}</Td><Td>{x.subject}</Td><Td className="text-xs">{fmtDate(x.updated_at)}</Td>
                  <Td className="whitespace-nowrap text-right"><button className="mr-3 text-sm text-forest hover:underline" onClick={() => { setT({ id: x.id, name: x.name, subject: x.subject ?? '', previewText: x.preview_text ?? '', bodyHtml: x.body_html }); setTKey(x.id) }}>Edit</button><button className="text-sm text-red-700 hover:underline" onClick={async () => { if (window.confirm(`Remove template "${x.name}"?`)) { await api(`/api/templates/${x.id}`, { method: 'DELETE' }); await templates.reload() } }}>Remove</button></Td></tr>
              ))}</tbody></TableWrap>
          )}
          <form onSubmit={saveTemplate} className="mt-6 space-y-4 border-t border-border-soft pt-5">
            <p className="text-sm font-medium">{t.id ? 'Edit template' : 'New template'}</p>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Name" htmlFor="t-n"><input id="t-n" className="field" required value={t.name} onChange={(e) => setT({ ...t, name: e.target.value })} /></Field>
              <Field label="Subject" htmlFor="t-s"><input id="t-s" className="field" value={t.subject} onChange={(e) => setT({ ...t, subject: e.target.value })} /></Field>
              <Field label="Preview text" htmlFor="t-p"><input id="t-p" className="field" value={t.previewText} onChange={(e) => setT({ ...t, previewText: e.target.value })} /></Field>
            </div>
            <EmailEditor value={t.bodyHtml} docKey={tKey} onChange={(h) => setT((p) => ({ ...p, bodyHtml: h }))} />
            <div className="flex gap-2"><button className="btn-primary">{t.id ? 'Save template' : 'Create template'}</button>{t.id && <button type="button" className="btn-secondary" onClick={() => { setT({ id: '', name: '', subject: '', previewText: '', bodyHtml: '' }); setTKey(`new-${Date.now()}`) }}>Cancel</button>}</div>
          </form>
        </Panel>
      </div>
    </>
  )
}
