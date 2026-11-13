import { ConfigError } from './errors'

/**
 * Configuration is read lazily, on each call, never at import time. That keeps
 * `next build` working without secrets and lets tests set variables per case.
 * Error messages name the variable but never print a value.
 */

function str(name: string): string | undefined {
  const v = process.env[name]
  return v && v.trim() ? v.trim() : undefined
}

export function requireEnv(name: string): string {
  const v = str(name)
  if (!v) throw new ConfigError(`Missing required environment variable ${name}`)
  return v
}

export type AppEnv = 'development' | 'staging' | 'production'
export type SendMode = 'disabled' | 'allowlist' | 'live'

export function appEnv(): AppEnv {
  const v = str('APP_ENV')
  if (v === 'production' || v === 'staging' || v === 'development') return v
  if (v) throw new ConfigError('APP_ENV must be development, staging or production')
  return 'development'
}

/**
 * Controls whether anything can actually be emailed.
 *   disabled   nothing is sent and no subscribers are pushed to Listmonk (default)
 *   allowlist  only addresses in EMAIL_TEST_ALLOWLIST receive email
 *   live       normal operation, permitted only when APP_ENV is production
 */
export function sendMode(): SendMode {
  const v = str('EMAIL_SEND_MODE') ?? 'disabled'
  if (v !== 'disabled' && v !== 'allowlist' && v !== 'live') {
    throw new ConfigError('EMAIL_SEND_MODE must be disabled, allowlist or live')
  }
  if (v === 'live' && appEnv() !== 'production') {
    throw new ConfigError('EMAIL_SEND_MODE=live is only permitted when APP_ENV=production')
  }
  return v
}

export function testAllowlist(): string[] {
  return (str('EMAIL_TEST_ALLOWLIST') ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function appBaseUrl(): string {
  const v = str('APP_BASE_URL') ?? str('NEXT_PUBLIC_SITE_URL')
  if (!v) throw new ConfigError('Missing required environment variable APP_BASE_URL')
  return v.replace(/\/+$/, '')
}

export function adminEmails(): string[] {
  const raw = str('ADMIN_EMAILS') ?? str('NEXT_PUBLIC_ADMIN_EMAIL') ?? ''
  return raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
}

export function databaseConfig() {
  return {
    connectionString: requireEnv('DATABASE_URL'),
    ssl: str('DATABASE_SSL') ?? 'auto', // auto | require | disable
    sslCa: str('DATABASE_SSL_CA'),
  }
}

export function supabaseAuthConfig() {
  return {
    url: requireEnv('NEXT_PUBLIC_SUPABASE_URL').replace(/\/+$/, ''),
    anonKey: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  }
}

export function listmonkConfig() {
  return {
    baseUrl: requireEnv('LISTMONK_BASE_URL').replace(/\/+$/, ''),
    username: requireEnv('LISTMONK_API_USERNAME'),
    token: requireEnv('LISTMONK_API_TOKEN'),
    proxyToken: str('LISTMONK_PROXY_TOKEN'),
  }
}

export function googleConfig() {
  const rawKey = requireEnv('GOOGLE_PRIVATE_KEY')
  // Accept the PEM with literal \n escapes (common in env UIs) or base64 of the PEM.
  let privateKey = rawKey.replace(/\\n/g, '\n')
  if (!privateKey.includes('BEGIN')) {
    privateKey = Buffer.from(rawKey, 'base64').toString('utf8')
  }
  return {
    clientEmail: requireEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
    privateKey,
    defaultSpreadsheetId: str('GOOGLE_SHEETS_SPREADSHEET_ID'),
    defaultWorksheet: str('GOOGLE_SHEETS_WORKSHEET'),
  }
}

export function tokenSecret(): string {
  const v = requireEnv('EMAIL_TOKEN_SECRET')
  if (v.length < 32) throw new ConfigError('EMAIL_TOKEN_SECRET must be at least 32 characters')
  return v
}

export function jobSecret(): string {
  return requireEnv('INTERNAL_JOB_SECRET')
}

export function webhookSecret(): string {
  return requireEnv('EMAIL_WEBHOOK_SECRET')
}

export function senderDefaults() {
  return {
    fromName: str('DEFAULT_FROM_NAME') ?? 'Herufi',
    fromEmail: (str('DEFAULT_FROM_EMAIL') ?? 'hello@herufi.org').toLowerCase(),
    replyTo: str('DEFAULT_REPLY_TO_EMAIL')?.toLowerCase(),
  }
}

export function requireTestSendBeforeCampaign(): boolean {
  return (str('EMAIL_REQUIRE_TEST_SEND') ?? 'true') !== 'false'
}
