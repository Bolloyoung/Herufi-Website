#!/usr/bin/env node
/**
 * Readiness check for the email platform. Run it against any environment:
 *
 *   node --env-file=.env.local scripts/email/check-setup.mjs
 *
 * It only READS. It does not send email, change data or print any secret value.
 * Exit code 0 means everything required is in place, 1 means something needs attention.
 */
import { createSign } from 'node:crypto'
import pg from 'pg'

const out = []
const ok = (m) => out.push(['PASS', m])
const bad = (m) => out.push(['FAIL', m])
const note = (m) => out.push(['NOTE', m])
const env = (n) => (process.env[n] ?? '').trim()

// ---- required settings -----------------------------------------------------------------
for (const n of ['DATABASE_URL', 'EMAIL_TOKEN_SECRET', 'INTERNAL_JOB_SECRET', 'LISTMONK_BASE_URL', 'LISTMONK_API_USERNAME', 'LISTMONK_API_TOKEN', 'APP_BASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']) {
  env(n) ? ok(`${n} is set`) : bad(`${n} is missing`)
}
if (env('EMAIL_TOKEN_SECRET') && env('EMAIL_TOKEN_SECRET').length < 32) bad('EMAIL_TOKEN_SECRET must be at least 32 characters')
if (!(env('ADMIN_EMAILS') || env('NEXT_PUBLIC_ADMIN_EMAIL'))) bad('No administrator email is set (ADMIN_EMAILS or NEXT_PUBLIC_ADMIN_EMAIL)')

// ---- safe sending ----------------------------------------------------------------------
const appEnv = env('APP_ENV') || 'development'
const mode = env('EMAIL_SEND_MODE') || 'disabled'
note(`APP_ENV=${appEnv}, EMAIL_SEND_MODE=${mode}`)
if (!['development', 'staging', 'production'].includes(appEnv)) bad('APP_ENV must be development, staging or production')
if (!['disabled', 'allowlist', 'live'].includes(mode)) bad('EMAIL_SEND_MODE must be disabled, allowlist or live')
if (mode === 'live' && appEnv !== 'production') bad('EMAIL_SEND_MODE=live is refused unless APP_ENV=production')
if (mode === 'allowlist' && !env('EMAIL_TEST_ALLOWLIST')) bad('EMAIL_SEND_MODE=allowlist needs EMAIL_TEST_ALLOWLIST')
if (appEnv === 'production' && mode !== 'live') note('Production is not in live mode, so campaigns cannot be sent yet.')
if (env('APP_BASE_URL') && appEnv === 'production' && !env('APP_BASE_URL').startsWith('https://')) bad('APP_BASE_URL must be https in production')
for (const n of Object.keys(process.env)) if (n.startsWith('NEXT_PUBLIC_') && /(SECRET|TOKEN|PRIVATE|PASSWORD|SERVICE_ROLE|DATABASE)/i.test(n)) bad(`${n} would be exposed to browsers. Remove the NEXT_PUBLIC_ prefix.`)

// ---- database ------------------------------------------------------------------------
if (env('DATABASE_URL')) {
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(env('DATABASE_URL'))
  const ssl = env('DATABASE_SSL') === 'disable' || (local && env('DATABASE_SSL') !== 'require') ? false : { rejectUnauthorized: false }
  const client = new pg.Client({ connectionString: env('DATABASE_URL').replace(/([?&])sslmode=[^&]*&?/, '$1').replace(/[?&]$/, ''), ssl, connectionTimeoutMillis: 8000 })
  try {
    await client.connect()
    ok('Database connection works')
    const { rows } = await client.query("select count(*)::int n from information_schema.tables where table_schema = 'public' and table_name like 'email\\_%'")
    rows[0].n >= 15 ? ok(`Email tables exist (${rows[0].n})`) : bad(`Only ${rows[0].n} email tables found. Apply supabase/migrations/20261111000000_email_platform.sql`)
    const rls = await client.query("select count(*)::int n from pg_tables where schemaname = 'public' and tablename like 'email\\_%' and not rowsecurity")
    rls.rows[0].n === 0 ? ok('Row level security is on for every email table') : bad(`${rls.rows[0].n} email table(s) have row level security off`)
    const fn = await client.query("select 1 from pg_proc where proname = 'email_rate_limit_hit'")
    fn.rows.length ? ok('Rate limit function exists') : bad('email_rate_limit_hit function is missing. Apply the migration.')
  } catch (e) {
    bad(`Database check failed: ${e.message.replace(/postgres(ql)?:\/\/[^\s]+/g, '[url]')}`)
  } finally { await client.end().catch(() => {}) }
}

// ---- Listmonk --------------------------------------------------------------------------
if (env('LISTMONK_BASE_URL')) {
  const base = env('LISTMONK_BASE_URL').replace(/\/+$/, '')
  const headers = { Authorization: `token ${env('LISTMONK_API_USERNAME')}:${env('LISTMONK_API_TOKEN')}`, ...(env('LISTMONK_PROXY_TOKEN') ? { 'X-Herufi-Proxy-Token': env('LISTMONK_PROXY_TOKEN') } : {}) }
  try {
    const h = await fetch(`${base}/health`, { signal: AbortSignal.timeout(10000) })
    h.ok ? ok('Listmonk health endpoint answers') : bad(`Listmonk /health returned ${h.status}`)
    const a = await fetch(`${base}/api/health`, { headers, signal: AbortSignal.timeout(10000) })
    a.ok ? ok('Listmonk API credentials are accepted') : bad(`Listmonk rejected the API credentials (${a.status})`)
    const adminOpen = await fetch(`${base}/admin/login`, { redirect: 'manual', signal: AbortSignal.timeout(10000) })
    adminOpen.status === 200 ? note('Listmonk /admin/login is reachable from the internet. Restrict it with your proxy (see docs).') : ok(`Listmonk /admin is not openly reachable (${adminOpen.status})`)
    const t = await fetch(`${base}/api/settings`, { headers, signal: AbortSignal.timeout(10000) })
    if (t.ok) {
      const s = (await t.json()).data
      const smtp = (s.smtp ?? []).filter((x) => x.enabled)
      smtp.length ? ok(`Listmonk has ${smtp.length} SMTP server(s) enabled (${smtp.map((x) => x.host).join(', ')})`) : bad('No SMTP server is enabled in Listmonk (Settings, SMTP)')
      if (smtp.some((x) => /gmail|googlemail/i.test(x.host))) bad('Listmonk is sending through Gmail. Use a bulk email provider such as Resend or Amazon SES.')
      s['privacy.unsubscribe_header'] ? ok('List-Unsubscribe header is on') : bad('privacy.unsubscribe_header is off in Listmonk')
      note(`bounce processing is ${s['bounce.enabled'] ? 'on' : 'off'} in Listmonk`)
      if (!String(s['app.root_url'] ?? '').startsWith('https://') && appEnv === 'production') bad('Listmonk root URL is not https')
    } else note('Could not read Listmonk settings with this API user (needs a settings permission). SMTP was not checked.')
  } catch (e) { bad(`Listmonk check failed: ${e.name === 'TimeoutError' ? 'timed out' : e.message}`) }
}

// ---- Google ----------------------------------------------------------------------------
if (env('GOOGLE_SERVICE_ACCOUNT_EMAIL') && env('GOOGLE_PRIVATE_KEY')) {
  try {
    let key = env('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n')
    if (!key.includes('BEGIN')) key = Buffer.from(env('GOOGLE_PRIVATE_KEY'), 'base64').toString('utf8')
    const b = (v) => Buffer.from(v).toString('base64url')
    const iat = Math.floor(Date.now() / 1000)
    const head = b(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
    const claims = b(JSON.stringify({ iss: env('GOOGLE_SERVICE_ACCOUNT_EMAIL'), scope: 'https://www.googleapis.com/auth/spreadsheets.readonly', aud: 'https://oauth2.googleapis.com/token', iat, exp: iat + 3600 }))
    const sig = createSign('RSA-SHA256').update(`${head}.${claims}`).sign(key).toString('base64url')
    const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claims}.${sig}` }), signal: AbortSignal.timeout(10000) })
    res.ok ? ok('Google accepted the service account credentials') : bad(`Google rejected the service account credentials (${res.status})`)
  } catch (e) { bad(`Google credentials are not usable: ${e.message}`) }
} else note('Google Sheets is not configured. Imports will be unavailable.')

// ---- report ----------------------------------------------------------------------------
const w = Math.max(...out.map(([k]) => k.length))
for (const [k, m] of out) console.log(`${k.padEnd(w)}  ${m}`)
const failed = out.filter(([k]) => k === 'FAIL').length
console.log(`\n${failed ? `${failed} problem(s) need attention.` : 'Everything required is in place.'}`)
process.exit(failed ? 1 : 0)
