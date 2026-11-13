'use client'

import { useState } from 'react'
import { api, errMsg, useLoad } from '@/lib/admin/api'
import { Empty, Field, Notice, PageTitle, Panel, Spinner, Td, TableWrap, Th } from '@/components/admin/ui'

type Audience = {
  id: string; name: string; slug: string; description: string | null; public_signup: boolean; listmonk_list_id: number | null
  auto_rules: { organisation_type?: string[]; category?: string[]; tags?: string[] }; member_count: number; consented_count: number
}

const split = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean)

export default function AudiencesPage() {
  const { data, error, loading, reload } = useLoad(() => api<{ audiences: Audience[] }>('/api/audiences'))
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const blank = { name: '', description: '', publicSignup: false, types: '', categories: '', tags: '' }
  const [form, setForm] = useState(blank)

  function edit(a: Audience) {
    setEditing(a.id)
    setForm({ name: a.name, description: a.description ?? '', publicSignup: a.public_signup, types: (a.auto_rules.organisation_type ?? []).join(', '), categories: (a.auto_rules.category ?? []).join(', '), tags: (a.auto_rules.tags ?? []).join(', ') })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg(null)
    const body = { name: form.name, description: form.description || null, publicSignup: form.publicSignup, autoRules: { organisation_type: split(form.types), category: split(form.categories), tags: split(form.tags) } }
    try {
      if (editing) await api(`/api/audiences/${editing}`, { method: 'PATCH', body })
      else await api('/api/audiences', { body })
      setMsg({ kind: 'success', text: editing ? 'Audience updated.' : 'Audience created.' })
      setForm(blank); setEditing(null); await reload()
    } catch (err) { setMsg({ kind: 'error', text: errMsg(err) }) } finally { setBusy(false) }
  }

  async function archive(a: Audience) {
    if (!window.confirm(`Archive "${a.name}"? Its members are taken off the Listmonk list. Contacts and their consent records are kept.`)) return
    try { await api(`/api/audiences/${a.id}`, { method: 'DELETE' }); await reload() } catch (err) { setMsg({ kind: 'error', text: errMsg(err) }) }
  }

  return (
    <>
      <PageTitle title="Audiences" intro="Audiences are the groups you send to, such as foundations or development finance institutions. Consent is recorded per audience, because people agree to receive specific things." />
      <div className="space-y-6">
        {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}

        <Panel title={editing ? 'Edit audience' : 'New audience'}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name" htmlFor="au-n"><input id="au-n" className="field" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Description" htmlFor="au-d" hint="Shown beside the topic on the public signup form"><input id="au-d" className="field" maxLength={500} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            </div>
            <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" checked={form.publicSignup} onChange={(e) => setForm({ ...form, publicSignup: e.target.checked })} /><span>Offer as a topic on the public signup form<span className="block text-xs text-charcoal/55">People who subscribe through the form and confirm by email are added with consent.</span></span></label>
            <details className="rounded-md border border-border-soft p-4">
              <summary className="cursor-pointer text-sm font-medium">Automatic rules for imported contacts</summary>
              <p className="mt-2 text-xs text-charcoal/60">Imported contacts that match are added to this audience. This never gives them consent. Separate values with commas.</p>
              <div className="mt-3 grid gap-4 md:grid-cols-3">
                <Field label="Organisation types" htmlFor="au-t"><input id="au-t" className="field" value={form.types} onChange={(e) => setForm({ ...form, types: e.target.value })} placeholder="DFI, Foundation" /></Field>
                <Field label="Categories" htmlFor="au-c"><input id="au-c" className="field" value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} /></Field>
                <Field label="Tags" htmlFor="au-g"><input id="au-g" className="field" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></Field>
              </div>
            </details>
            <div className="flex gap-2">
              <button className="btn-primary" disabled={busy}>{editing ? 'Save changes' : 'Create audience'}</button>
              {editing && <button type="button" className="btn-secondary" onClick={() => { setEditing(null); setForm(blank) }}>Cancel</button>}
            </div>
          </form>
        </Panel>

        <Panel title="All audiences">
          {loading && !data ? <Spinner /> : error ? <Notice kind="error">{error}</Notice> : !data?.audiences.length ? <Empty>No audiences yet. Create one above.</Empty> : (
            <TableWrap><thead><tr><Th>Audience</Th><Th>Public form</Th><Th className="text-right">Members</Th><Th className="text-right">With consent</Th><Th>Rules</Th><Th /></tr></thead>
              <tbody>{data.audiences.map((a) => {
                const rules = [...(a.auto_rules.organisation_type ?? []), ...(a.auto_rules.category ?? []), ...(a.auto_rules.tags ?? [])]
                return (
                  <tr key={a.id} className="border-t border-border-soft">
                    <Td><span className="font-medium">{a.name}</span><div className="text-xs text-charcoal/55">{a.description}</div></Td>
                    <Td>{a.public_signup ? 'Offered' : 'Hidden'}</Td>
                    <Td className="text-right font-mono">{a.member_count}</Td>
                    <Td className="text-right font-mono">{a.consented_count}</Td>
                    <Td className="text-xs text-charcoal/65">{rules.length ? rules.join(', ') : 'None'}</Td>
                    <Td className="whitespace-nowrap text-right"><button className="mr-3 text-sm text-forest hover:underline" onClick={() => edit(a)}>Edit</button><button className="text-sm text-red-700 hover:underline" onClick={() => archive(a)}>Archive</button></Td>
                  </tr>
                )
              })}</tbody></TableWrap>
          )}
        </Panel>
      </div>
    </>
  )
}
