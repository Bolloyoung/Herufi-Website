import { createPublicKey, createVerify, generateKeyPairSync } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { GoogleError, GoogleSheetsClient, MAX_SHEET_ROWS } from '@/lib/integrations/google-sheets/client'

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  publicKeyEncoding: { type: 'spki', format: 'pem' },
})
const SA = 'herufi-sync@project.iam.gserviceaccount.com'
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } })
const tokenOk = () => json({ access_token: 'ya29.test-token-abcdef', expires_in: 3600, token_type: 'Bearer' })

function make(handlers: Array<(url: string, init: RequestInit) => Response | Error>, over: Record<string, unknown> = {}) {
  const calls: Array<{ url: string; init: RequestInit }> = []
  const queue = [...handlers]
  const fetchImpl = vi.fn(async (url: string, init: RequestInit) => {
    calls.push({ url: String(url), init })
    const h = queue.shift()
    if (!h) throw new Error('unexpected extra request')
    const r = h(String(url), init)
    if (r instanceof Error) throw r
    return r
  }) as unknown as typeof fetch
  const sleeps: number[] = []
  const client = new GoogleSheetsClient({
    clientEmail: SA, privateKey, fetchImpl, sleep: async (ms) => { sleeps.push(ms) }, now: () => 1_800_000_000_000, ...over,
  })
  return { client, calls, sleeps }
}

describe('GoogleSheetsClient authentication', () => {
  it('signs a valid RS256 service account assertion and exchanges it for a token', async () => {
    const { client, calls } = make([
      (url, init) => {
        expect(url).toBe('https://oauth2.googleapis.com/token')
        const form = new URLSearchParams(String(init.body))
        expect(form.get('grant_type')).toBe('urn:ietf:params:oauth:grant-type:jwt-bearer')
        const [h, c, s] = form.get('assertion')!.split('.')
        expect(JSON.parse(Buffer.from(h, 'base64url').toString())).toEqual({ alg: 'RS256', typ: 'JWT' })
        const claims = JSON.parse(Buffer.from(c, 'base64url').toString())
        expect(claims).toMatchObject({ iss: SA, scope: 'https://www.googleapis.com/auth/spreadsheets.readonly', aud: 'https://oauth2.googleapis.com/token' })
        expect(claims.exp - claims.iat).toBe(3600)
        const verify = createVerify('RSA-SHA256'); verify.update(`${h}.${c}`)
        expect(verify.verify(createPublicKey(publicKey), Buffer.from(s, 'base64url'))).toBe(true)
        return tokenOk()
      },
      () => json({ values: [['Email'], ['a@example.org']] }),
    ])
    await client.readSheet('sheet-id-1234567', 'Contacts')
    expect(calls).toHaveLength(2)
  })

  it('requests read only access and caches the token between calls', async () => {
    const { client, calls } = make([() => tokenOk(), () => json({ values: [['Email']] }), () => json({ values: [['Email']] })])
    await client.readSheet('sheet-id-1234567', 'A')
    await client.readSheet('sheet-id-1234567', 'B')
    expect(calls.filter((c) => c.url.includes('oauth2')).length).toBe(1)
    expect((calls[1].init.headers as Record<string, string>).Authorization).toBe('Bearer ya29.test-token-abcdef')
  })

  it('refreshes an expired token', async () => {
    let t = 1_800_000_000_000
    const { client, calls } = make([() => tokenOk(), () => json({ values: [] }), () => tokenOk(), () => json({ values: [] })], { now: () => t })
    await client.readSheet('sheet-id-1234567', 'A')
    t += 3_600_000
    await client.readSheet('sheet-id-1234567', 'A')
    expect(calls.filter((c) => c.url.includes('oauth2')).length).toBe(2)
  })

  it('reports an unusable private key clearly', async () => {
    const { client } = make([], { privateKey: 'not a key' })
    await expect(client.readSheet('sheet-id-1234567', 'A')).rejects.toMatchObject({ message: 'The Google service account private key is not valid' })
  })
})

describe('GoogleSheetsClient reading', () => {
  it('quotes the worksheet name and asks for formatted values', async () => {
    const { client, calls } = make([() => tokenOk(), () => json({ values: [['Email']] })])
    await client.readSheet('sheet-id-1234567', "Donor's List")
    const u = new URL(calls[1].url)
    expect(decodeURIComponent(u.pathname)).toContain("/values/'Donor''s List'")
    expect(u.searchParams.get('valueRenderOption')).toBe('FORMATTED_VALUE')
  })

  it('returns trimmed headers and tolerates ragged rows', async () => {
    const { client } = make([() => tokenOk(), () => json({ values: [[' Email ', 'Name'], ['a@example.org'], ['b@example.org', 'Bo']] })])
    expect(await client.readSheet('sheet-id-1234567', 'A')).toEqual({
      headers: ['Email', 'Name'], rows: [['a@example.org'], ['b@example.org', 'Bo']],
    })
  })

  it('returns empty results for an empty sheet', async () => {
    const { client } = make([() => tokenOk(), () => json({})])
    expect(await client.readSheet('sheet-id-1234567', 'A')).toEqual({ headers: [], rows: [] })
  })

  it('refuses a sheet larger than the row limit', async () => {
    const big = [['Email'], ...Array.from({ length: MAX_SHEET_ROWS + 1 }, () => ['a@example.org'])]
    const { client } = make([() => tokenOk(), () => json({ values: big })])
    await expect(client.readSheet('sheet-id-1234567', 'A')).rejects.toBeInstanceOf(GoogleError)
  })

  it('lists worksheet tabs', async () => {
    const { client } = make([() => tokenOk(), () => json({ sheets: [{ properties: { title: 'Contacts', sheetId: 0 } }, { properties: { title: 'Archive', sheetId: 9 } }] })])
    expect((await client.listWorksheets('sheet-id-1234567')).map((s) => s.title)).toEqual(['Contacts', 'Archive'])
  })
})

describe('GoogleSheetsClient failures', () => {
  it('tells the user to share the sheet with the service account when access is denied, without retrying', async () => {
    const { client, calls } = make([() => tokenOk(), () => json({ error: { message: 'The caller does not have permission' } }, 403)])
    const err = (await client.readSheet('sheet-id-1234567', 'A').catch((e) => e)) as GoogleError
    expect(err.message).toContain(SA)
    expect(err.message).toContain('Viewer')
    expect(calls).toHaveLength(2)
  })

  it('explains an unknown worksheet name', async () => {
    const { client } = make([() => tokenOk(), () => json({ error: { message: 'Unable to parse range: Nope' } }, 400)])
    await expect(client.readSheet('sheet-id-1234567', 'Nope')).rejects.toMatchObject({ message: 'That worksheet name was not found in the spreadsheet' })
  })

  it('retries a quota error (429) honouring Retry-After, then succeeds', async () => {
    const { client, sleeps } = make([() => tokenOk(), () => json({ error: { message: 'quota' } }, 429, { 'retry-after': '3' }), () => json({ values: [['Email']] })])
    await client.readSheet('sheet-id-1234567', 'A')
    expect(sleeps).toEqual([3000])
  })

  it('retries a temporary 503 and recovers', async () => {
    const { client, calls } = make([() => tokenOk(), () => json({}, 503), () => json({}, 503), () => json({ values: [['Email']] })])
    await client.readSheet('sheet-id-1234567', 'A')
    expect(calls).toHaveLength(4)
  })

  it('retries a network failure, then reports a retryable error once attempts are exhausted', async () => {
    const boom = () => new Error('ECONNRESET')
    const { client, calls } = make([() => tokenOk(), boom, boom, boom, boom])
    await expect(client.readSheet('sheet-id-1234567', 'A')).rejects.toMatchObject({ retryable: true, status: 503 })
    expect(calls).toHaveLength(5)
  })
})
