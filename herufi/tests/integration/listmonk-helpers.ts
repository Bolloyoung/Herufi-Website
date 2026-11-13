import { randomBytes } from 'node:crypto'
import { ListmonkClient } from '@/lib/integrations/listmonk/client'
import { devEnv } from './helpers'

export const RUN = randomBytes(3).toString('hex')

export function configureListmonkEnv(sendMode: 'allowlist' | 'disabled' | 'live' = 'allowlist'): void {
  const env = devEnv()
  process.env.LISTMONK_BASE_URL = 'http://127.0.0.1:9000'
  process.env.LISTMONK_API_USERNAME = env.LISTMONK_API_USERNAME
  process.env.LISTMONK_API_TOKEN = env.LISTMONK_API_TOKEN
  process.env.APP_ENV = 'development'
  process.env.EMAIL_SEND_MODE = sendMode
  // Only these domains can ever receive email from the tests.
  process.env.EMAIL_TEST_ALLOWLIST = '@example.org,@herufi.test'
}

export function lmClient(): ListmonkClient {
  const env = devEnv()
  return new ListmonkClient({ baseUrl: 'http://127.0.0.1:9000', username: env.LISTMONK_API_USERNAME, token: env.LISTMONK_API_TOKEN })
}

/** Raw call for things the product client deliberately does not expose (cleanup). */
export async function lmRaw(method: string, path: string, body?: unknown): Promise<any> {
  const env = devEnv()
  const res = await fetch(`http://127.0.0.1:9000${path}`, {
    method,
    headers: { Authorization: `token ${env.LISTMONK_API_USERNAME}:${env.LISTMONK_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

export const testEmail = (n: number | string) => `it-${RUN}-${n}@example.org`

/** Remove everything a test run created in Listmonk. Safe to call more than once. */
export async function cleanupListmonk(): Promise<void> {
  const subs = await lmRaw('GET', `/api/subscribers?query=${encodeURIComponent(`subscribers.email like 'it-${RUN}-%'`)}&per_page=all`)
  const ids = (subs?.data?.results ?? []).map((s: { id: number }) => s.id)
  if (ids.length) await lmRaw('DELETE', `/api/subscribers?${ids.map((i: number) => `id=${i}`).join('&')}`)
  const camps = await lmRaw('GET', `/api/campaigns?query=${encodeURIComponent(`it-${RUN}`)}&per_page=all`)
  for (const c of camps?.data?.results ?? []) await lmRaw('DELETE', `/api/campaigns/${c.id}`)
  const lists = await lmRaw('GET', '/api/lists?per_page=all')
  for (const l of lists?.data?.results ?? []) if (String(l.name).includes(`it-${RUN}`)) await lmRaw('DELETE', `/api/lists/${l.id}`)
}

// ---------------------------------------------------------------------------
// Mail catcher. DEVELOPMENT ONLY: points Listmonk's SMTP at Mailpit so that
// campaigns can be tested end to end without any real email being sent.
// ---------------------------------------------------------------------------
const MAILPIT = 'http://127.0.0.1:8025'

export async function useMailpit(): Promise<void> {
  const cur = await lmRaw('GET', '/api/settings')
  const s = cur.data
  if (s.smtp[0].host === 'mailpit' && s.smtp[0].enabled) return
  s.smtp = s.smtp.map((x: Record<string, unknown>, i: number) =>
    i === 0
      ? { ...x, enabled: true, host: 'mailpit', port: 1025, auth_protocol: 'none', username: '', password: '', tls_type: 'none', max_conns: 2, idle_timeout: '15s', wait_timeout: '5s', max_msg_retries: 1, tls_skip_verify: false }
      : { ...x, enabled: false },
  )
  await lmRaw('PUT', '/api/settings', s)
  // Listmonk restarts itself to apply settings.
  await new Promise((r) => setTimeout(r, 2500))
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch('http://127.0.0.1:9000/health')).ok) { await new Promise((r) => setTimeout(r, 500)); return } } catch { /* restarting */ }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('Listmonk did not come back after changing settings')
}

export async function mailpitClear(): Promise<void> {
  await fetch(`${MAILPIT}/api/v1/messages`, { method: 'DELETE' })
}

export type CaughtMail = {
  id: string
  to: string[]
  from: string
  fromName: string
  replyTo: string[]
  subject: string
  html: string
  text: string
  listUnsubscribe: { header: string; links: string[] } | null
}

export async function mailpitMessages(): Promise<CaughtMail[]> {
  const list = (await (await fetch(`${MAILPIT}/api/v1/messages?limit=200`)).json()) as { messages: Array<{ ID: string }> }
  const out: CaughtMail[] = []
  for (const m of list.messages) {
    const d = (await (await fetch(`${MAILPIT}/api/v1/message/${m.ID}`)).json()) as any
    out.push({
      id: m.ID,
      to: (d.To ?? []).map((t: { Address: string }) => t.Address.toLowerCase()),
      from: d.From?.Address ?? '',
      fromName: d.From?.Name ?? '',
      replyTo: (d.ReplyTo ?? []).map((t: { Address: string }) => t.Address.toLowerCase()),
      subject: d.Subject ?? '',
      html: d.HTML ?? '',
      text: d.Text ?? '',
      listUnsubscribe: d.ListUnsubscribe?.Header ? { header: d.ListUnsubscribe.Header, links: d.ListUnsubscribe.Links ?? [] } : null,
    })
  }
  return out
}

export async function waitForMail(count: number, timeoutMs = 60_000): Promise<CaughtMail[]> {
  const t0 = Date.now()
  for (;;) {
    const m = await mailpitMessages()
    if (m.length >= count) return m
    if (Date.now() - t0 > timeoutMs) throw new Error(`Expected ${count} emails, caught ${m.length}`)
    await new Promise((r) => setTimeout(r, 500))
  }
}
