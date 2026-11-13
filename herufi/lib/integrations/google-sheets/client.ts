import { createSign } from 'node:crypto'
import type { ZodType, ZodTypeDef } from 'zod'
import { UpstreamError } from '@/lib/server/errors'
import { spreadsheetMetaSchema, tokenResponseSchema, valuesResponseSchema } from './schemas'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly'
const API = 'https://sheets.googleapis.com/v4/spreadsheets'
export const MAX_SHEET_ROWS = 50_000

export type GoogleSheetsClientOptions = {
  clientEmail: string
  privateKey: string
  fetchImpl?: typeof fetch
  now?: () => number
  sleep?: (ms: number) => Promise<void>
  maxAttempts?: number
  timeoutMs?: number
}

export class GoogleError extends UpstreamError {
  constructor(message: string, retryable: boolean, upstreamStatus?: number, status = 502) {
    super('google', message, retryable, status, upstreamStatus)
    this.name = 'GoogleError'
  }
}

const b64url = (v: string | Buffer) => Buffer.from(v).toString('base64url')

/**
 * Read only Google Sheets access for a service account. Uses the documented
 * OAuth 2.0 JWT bearer flow with no SDK: sign a short lived assertion with the
 * account's private key, exchange it for an access token, call the Sheets API.
 * The spreadsheet must be shared with the service account's email address.
 */
export class GoogleSheetsClient {
  private cached?: { token: string; expiresAt: number }
  private readonly fetchImpl: typeof fetch
  private readonly now: () => number
  private readonly sleep: (ms: number) => Promise<void>
  private readonly maxAttempts: number
  private readonly timeoutMs: number

  constructor(private readonly opts: GoogleSheetsClientOptions) {
    this.fetchImpl = opts.fetchImpl ?? fetch
    this.now = opts.now ?? Date.now
    this.sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)))
    this.maxAttempts = opts.maxAttempts ?? 4
    this.timeoutMs = opts.timeoutMs ?? 20_000
  }

  get serviceAccountEmail(): string {
    return this.opts.clientEmail
  }

  private assertion(): string {
    const iat = Math.floor(this.now() / 1000)
    const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
    const claims = b64url(JSON.stringify({ iss: this.opts.clientEmail, scope: SCOPE, aud: TOKEN_URL, iat, exp: iat + 3600 }))
    const signer = createSign('RSA-SHA256')
    signer.update(`${header}.${claims}`)
    try {
      return `${header}.${claims}.${signer.sign(this.opts.privateKey).toString('base64url')}`
    } catch {
      throw new GoogleError('The Google service account private key is not valid', false, undefined, 500)
    }
  }

  private async accessToken(): Promise<string> {
    if (this.cached && this.cached.expiresAt - 60_000 > this.now()) return this.cached.token
    const body = new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: this.assertion() })
    const res = await this.send(TOKEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    const parsed = await this.parse(res, tokenResponseSchema, 'Google sign in')
    this.cached = { token: parsed.access_token, expiresAt: this.now() + (parsed.expires_in ?? 3600) * 1000 }
    return parsed.access_token
  }

  private async send(url: string, init: RequestInit): Promise<Response> {
    let last: GoogleError | undefined
    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        const res = await this.fetchImpl(url, { ...init, cache: 'no-store', signal: AbortSignal.timeout(this.timeoutMs) })
        const retryable = res.status === 429 || res.status >= 500
        if (!retryable || attempt === this.maxAttempts) return res
        const retryAfter = Number(res.headers.get('retry-after'))
        await this.sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? Math.min(retryAfter * 1000, 30_000) : this.backoff(attempt))
      } catch {
        last = new GoogleError('Could not reach Google', true, undefined, 503)
        if (attempt === this.maxAttempts) throw last
        await this.sleep(this.backoff(attempt))
      }
    }
    throw last ?? new GoogleError('Google request failed', true)
  }

  private backoff(attempt: number): number {
    return Math.min(500 * 2 ** (attempt - 1), 8000) + Math.floor(Math.random() * 200)
  }

  private async parse<T>(res: Response, schema: ZodType<T, ZodTypeDef, unknown>, what: string): Promise<T> {
    if (!res.ok) throw await this.failure(res, what)
    const parsed = schema.safeParse(await res.json().catch(() => null))
    if (!parsed.success) throw new GoogleError(`${what} returned an unexpected response`, false, res.status)
    return parsed.data
  }

  private async failure(res: Response, what: string): Promise<GoogleError> {
    let reason = ''
    try {
      const body = (await res.json()) as { error?: { message?: string; status?: string } | string; error_description?: string }
      reason = typeof body.error === 'string' ? (body.error_description ?? body.error) : (body.error?.message ?? '')
    } catch {
      /* not JSON */
    }
    if (res.status === 403 || res.status === 404) {
      return new GoogleError(
        `Google could not open the spreadsheet. Check the ID and share it with ${this.opts.clientEmail} as a Viewer.`,
        false, res.status, 400,
      )
    }
    if (res.status === 400 && /unable to parse range|range/i.test(reason)) {
      return new GoogleError('That worksheet name was not found in the spreadsheet', false, res.status, 400)
    }
    if (res.status === 400 || res.status === 401) {
      return new GoogleError(`${what} was rejected by Google. Check the service account credentials.`, false, res.status, 502)
    }
    return new GoogleError(`${what} failed (${res.status})`, res.status === 429 || res.status >= 500, res.status)
  }

  private async get<T>(path: string, schema: ZodType<T, ZodTypeDef, unknown>, what: string): Promise<T> {
    const token = await this.accessToken()
    const res = await this.send(`${API}/${path}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
    return this.parse(res, schema, what)
  }

  /** The tabs in a spreadsheet, so an administrator can pick one. */
  async listWorksheets(spreadsheetId: string): Promise<Array<{ title: string; sheetId?: number }>> {
    const meta = await this.get(
      `${encodeURIComponent(spreadsheetId)}?fields=properties.title,sheets.properties(title,sheetId)`,
      spreadsheetMetaSchema, 'Reading the spreadsheet',
    )
    return (meta.sheets ?? []).map((s) => s.properties)
  }

  /** Header row plus data rows, as displayed in the sheet (dates arrive as formatted text). */
  async readSheet(spreadsheetId: string, worksheet: string): Promise<{ headers: string[]; rows: string[][] }> {
    const range = `'${worksheet.replace(/'/g, "''")}'`
    const data = await this.get(
      `${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`,
      valuesResponseSchema, 'Reading the worksheet',
    )
    const values = (data.values ?? []).map((r) => r.map((c) => String(c)))
    if (!values.length) return { headers: [], rows: [] }
    if (values.length - 1 > MAX_SHEET_ROWS) {
      throw new GoogleError(`The worksheet has more than ${MAX_SHEET_ROWS} rows. Split it and import in parts.`, false, undefined, 400)
    }
    const headers = values[0].map((h) => h.trim())
    return { headers, rows: values.slice(1) }
  }
}
