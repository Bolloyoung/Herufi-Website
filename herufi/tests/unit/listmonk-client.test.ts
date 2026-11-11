import { describe, expect, it, vi } from 'vitest'
import { ListmonkClient, ListmonkError, sqlLiteral } from '@/lib/integrations/listmonk/client'

type Call = { url: URL; init: RequestInit }
const ok = (data: unknown, status = 200) => new Response(JSON.stringify({ data }), { status, headers: { 'content-type': 'application/json' } })
const fail = (status: number, message = 'nope', headers: Record<string, string> = {}) =>
  new Response(JSON.stringify({ message }), { status, headers })
const sub = (over: Record<string, unknown> = {}) => ({ id: 7, email: 'a@example.org', name: 'A', status: 'enabled', attribs: {}, lists: [], ...over })

function make(responses: Array<Response | Error>, opts: { maxAttempts?: number } = {}) {
  const calls: Call[] = []
  const queue = [...responses]
  const fetchImpl = vi.fn(async (url: URL | string, init: RequestInit) => {
    calls.push({ url: new URL(String(url)), init })
    const next = queue.shift()
    if (!next) throw new Error('unexpected extra request')
    if (next instanceof Error) throw next
    return next
  }) as unknown as typeof fetch
  const sleeps: number[] = []
  const client = new ListmonkClient({
    baseUrl: 'https://lm.example.org/', username: 'herufi_api', token: 'SECRET-TOKEN-VALUE',
    fetchImpl, sleep: async (ms) => { sleeps.push(ms) }, ...opts,
  })
  return { client, calls, sleeps, fetchImpl }
}

describe('ListmonkClient requests', () => {
  it('authenticates with the token scheme and never puts the token in the URL', async () => {
    const { client, calls } = make([ok(true)])
    await client.checkAuthenticated()
    expect(calls[0].init.headers).toMatchObject({ Authorization: 'token herufi_api:SECRET-TOKEN-VALUE' })
    expect(calls[0].url.toString()).toBe('https://lm.example.org/api/health')
    expect(calls[0].url.toString()).not.toContain('SECRET')
  })

  it('sends the proxy token header only when one is configured', async () => {
    const calls: Call[] = []
    const mk = (proxyToken?: string) => new ListmonkClient({
      baseUrl: 'https://lm.example.org', username: 'u', token: 't', proxyToken, sleep: async () => {},
      fetchImpl: (async (url: URL | string, init: RequestInit) => { calls.push({ url: new URL(String(url)), init }); return ok(true) }) as unknown as typeof fetch,
    })
    await mk('secret-proxy-value').checkAuthenticated()
    await mk().checkAuthenticated()
    expect((calls[0].init.headers as Record<string, string>)['X-Herufi-Proxy-Token']).toBe('secret-proxy-value')
    expect(Object.keys(calls[1].init.headers as Record<string, string>)).not.toContain('X-Herufi-Proxy-Token')
  })

  it('creates a subscriber enabled, with preconfirmed subscriptions only when asked', async () => {
    const { client, calls } = make([ok(sub())])
    await client.createSubscriber({ email: 'a@example.org', name: 'A', attribs: { x: 1 }, lists: [3], preconfirm: true })
    expect(JSON.parse(String(calls[0].init.body))).toEqual({
      email: 'a@example.org', name: 'A', status: 'enabled', lists: [3], attribs: { x: 1 }, preconfirm_subscriptions: true,
    })
    expect(calls[0].init.method).toBe('POST')
  })

  it('creates lists as private double opt in, so Listmonk also requires confirmed subscriptions', async () => {
    const { client, calls } = make([ok({ id: 3, name: 'L', type: 'private', optin: 'double' })])
    await client.createList({ name: 'L' })
    expect(JSON.parse(String(calls[0].init.body))).toMatchObject({ type: 'private', optin: 'double' })
  })

  it('escapes quotes in the email used by the subscriber lookup query', async () => {
    const { client, calls } = make([ok({ results: [], total: 0, per_page: 2, page: 1 })])
    await client.findSubscriberByEmail("O'Brien@Example.org")
    expect(calls[0].url.searchParams.get('query')).toBe("subscribers.email='o''brien@example.org'")
  })

  it('escapes SQL literals and refuses NUL bytes', () => {
    expect(sqlLiteral("a'b")).toBe("'a''b'")
    expect(sqlLiteral("'; drop table x; --")).toBe("'''; drop table x; --'")
    expect(() => sqlLiteral('a\0b')).toThrow(ListmonkError)
  })

  it('returns null for a missing subscriber instead of throwing', async () => {
    const { client } = make([fail(404, 'Subscriber not found.')])
    expect(await client.getSubscriber(99)).toBeNull()
  })

  it('walks pages until a short page', async () => {
    const page = (n: number) => ok({ results: Array.from({ length: n }, (_, i) => sub({ id: i + 1 })), total: 5, per_page: 2, page: 1 })
    const { client, calls } = make([page(2), page(2), page(1)])
    const seen: number[] = []
    for await (const batch of client.iterateSubscribers({ perPage: 2 })) seen.push(batch.length)
    expect(seen).toEqual([2, 2, 1])
    expect(calls.map((c) => c.url.searchParams.get('page'))).toEqual(['1', '2', '3'])
  })

  it('accepts either a created template or a list of templates from createTemplate', async () => {
    const t = { id: 5, name: 'W', type: 'campaign' }
    expect((await make([ok(t)]).client.createTemplate({ name: 'W', body: 'x' })).id).toBe(5)
    expect((await make([ok([{ id: 1, name: 'Other', type: 'campaign' }, t])]).client.createTemplate({ name: 'W', body: 'x' })).id).toBe(5)
  })
})

describe('ListmonkClient resilience', () => {
  it('retries a GET after a 503 and then succeeds', async () => {
    const { client, calls, sleeps } = make([fail(503), ok(true)])
    expect(await client.checkAuthenticated()).toBe(true)
    expect(calls).toHaveLength(2)
    expect(sleeps).toHaveLength(1)
  })

  it('honours Retry-After on a 429', async () => {
    const { client, sleeps } = make([fail(429, 'slow down', { 'retry-after': '2' }), ok(true)])
    await client.checkAuthenticated()
    expect(sleeps).toEqual([2000])
  })

  it('gives up after the maximum attempts and reports a retryable error', async () => {
    const { client, calls } = make([fail(503), fail(503), fail(503)])
    await expect(client.checkAuthenticated()).rejects.toMatchObject({ name: 'ListmonkError', retryable: true })
    expect(calls).toHaveLength(3)
  })

  it('does not retry a POST on a gateway error, because it may already have been applied', async () => {
    const { client, calls } = make([fail(502)])
    await expect(client.createSubscriber({ email: 'a@example.org', name: 'A', attribs: {}, lists: [], preconfirm: false })).rejects.toBeInstanceOf(ListmonkError)
    expect(calls).toHaveLength(1)
  })

  it('does retry a POST on 429 and 503, where the server did nothing', async () => {
    const { client, calls } = make([fail(429, 'busy'), ok(sub())])
    await client.createSubscriber({ email: 'a@example.org', name: 'A', attribs: {}, lists: [], preconfirm: false })
    expect(calls).toHaveLength(2)
  })

  it('does not retry a POST after a network error or timeout', async () => {
    const { client, calls } = make([new Error('socket hang up')])
    await expect(client.createSubscriber({ email: 'a@example.org', name: 'A', attribs: {}, lists: [], preconfirm: false })).rejects.toMatchObject({ retryable: true })
    expect(calls).toHaveLength(1)
  })

  it('retries a GET after a network error', async () => {
    const { client, calls } = make([new Error('ECONNRESET'), ok(true)])
    await client.checkAuthenticated()
    expect(calls).toHaveLength(2)
  })

  it('does not retry client errors', async () => {
    const { client, calls } = make([fail(409, 'E-mail already exists.')])
    await expect(client.createSubscriber({ email: 'a@example.org', name: 'A', attribs: {}, lists: [], preconfirm: false }))
      .rejects.toMatchObject({ upstreamStatus: 409, retryable: false, message: expect.stringContaining('already exists') })
    expect(calls).toHaveLength(1)
  })

  it('explains rejected credentials without revealing them', async () => {
    const { client } = make([fail(403, 'invalid session')])
    const err = (await client.checkAuthenticated().catch((e) => e)) as Error
    expect(err.message).toMatch(/rejected the API credentials/)
    expect(err.message).not.toContain('SECRET-TOKEN-VALUE')
  })

  it('rejects a response that does not match the expected shape', async () => {
    const { client } = make([ok({ results: 'not an array', total: 1 })])
    await expect(client.getLists()).rejects.toMatchObject({ message: 'Listmonk returned an unexpected response' })
  })

  it('rejects a response that is not JSON', async () => {
    const { client } = make([new Response('<html>oops</html>', { status: 200 })])
    await expect(client.getLists()).rejects.toMatchObject({ message: 'Listmonk returned a response that is not JSON' })
  })
})
