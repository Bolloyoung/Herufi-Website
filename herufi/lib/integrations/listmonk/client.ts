import type { ZodType, ZodTypeDef } from 'zod'
import { UpstreamError } from '@/lib/server/errors'
import type { Logger } from '@/lib/server/logger'
import {
  analyticsRowSchema, bounceSchema, campaignSchema, envelope, listSchema, paged, subscriberSchema, templateSchema,
  type ListmonkBounce, type ListmonkCampaign, type ListmonkCampaignStatus, type ListmonkList, type ListmonkSubscriber,
  type ListmonkTemplate,
} from './schemas'
import { z } from 'zod'

export type ListmonkClientOptions = {
  baseUrl: string
  username: string
  token: string
  /** Extra header sent on every request, for a proxy rule that only lets Herufi reach the API. */
  proxyToken?: string
  fetchImpl?: typeof fetch
  timeoutMs?: number
  maxAttempts?: number
  sleep?: (ms: number) => Promise<void>
  log?: Logger
}

export class ListmonkError extends UpstreamError {
  constructor(message: string, retryable: boolean, public readonly upstreamStatusCode?: number) {
    super('listmonk', message, retryable, 502, upstreamStatusCode)
    this.name = 'ListmonkError'
  }
}

/** Escape a value for use inside a single quoted SQL string in Listmonk's query parameter. */
export function sqlLiteral(value: string): string {
  if (value.includes('\0')) throw new ListmonkError('Invalid character in query value', false)
  return `'${value.replace(/'/g, "''")}'`
}

const RETRYABLE_STATUS = new Set([429, 502, 503, 504])
// A POST may already have been processed on a gateway error, so only retry it
// when the server said it did nothing.
const POST_SAFE_RETRY = new Set([429, 503])

export class ListmonkClient {
  private readonly base: string
  private readonly authHeader: string
  private readonly proxyToken?: string
  private readonly fetchImpl: typeof fetch
  private readonly timeoutMs: number
  private readonly maxAttempts: number
  private readonly sleep: (ms: number) => Promise<void>
  private readonly log?: Logger

  constructor(opts: ListmonkClientOptions) {
    this.base = opts.baseUrl.replace(/\/+$/, '')
    this.authHeader = `token ${opts.username}:${opts.token}`
    this.proxyToken = opts.proxyToken
    this.fetchImpl = opts.fetchImpl ?? fetch
    this.timeoutMs = opts.timeoutMs ?? 15_000
    this.maxAttempts = opts.maxAttempts ?? 3
    this.sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)))
    this.log = opts.log
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    opts: { query?: Record<string, string | number | undefined | Array<string | number>>; body?: unknown; schema?: ZodType<T, ZodTypeDef, unknown>; allow404?: boolean } = {},
  ): Promise<T | null> {
    const url = new URL(this.base + path)
    for (const [k, v] of Object.entries(opts.query ?? {})) {
      if (v === undefined) continue
      for (const item of Array.isArray(v) ? v : [v]) url.searchParams.append(k, String(item))
    }

    let lastError: ListmonkError | undefined
    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      let res: Response
      try {
        res = await this.fetchImpl(url, {
          method,
          headers: {
            Authorization: this.authHeader,
            Accept: 'application/json',
            ...(this.proxyToken ? { 'X-Herufi-Proxy-Token': this.proxyToken } : {}),
            ...(opts.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
          },
          body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
          cache: 'no-store',
          signal: AbortSignal.timeout(this.timeoutMs),
        })
      } catch (err) {
        lastError = new ListmonkError(
          err instanceof Error && err.name === 'TimeoutError' ? 'Listmonk did not respond in time' : 'Could not reach Listmonk',
          true,
        )
        // A timed out or dropped POST may have been applied, so it is not retried.
        if (method === 'POST' || attempt === this.maxAttempts) throw lastError
        await this.sleep(this.backoff(attempt))
        continue
      }

      if (res.ok) {
        const text = await res.text()
        if (!opts.schema) return null
        let parsed: unknown
        try {
          parsed = text ? JSON.parse(text) : {}
        } catch {
          throw new ListmonkError('Listmonk returned a response that is not JSON', false, res.status)
        }
        const result = opts.schema.safeParse(parsed)
        if (!result.success) {
          this.log?.error('unexpected listmonk response shape', { path, issues: result.error.issues.slice(0, 3).map((i) => i.path.join('.')) })
          throw new ListmonkError('Listmonk returned an unexpected response', false, res.status)
        }
        return result.data
      }

      if (res.status === 404 && opts.allow404) return null

      const retryable = RETRYABLE_STATUS.has(res.status) && (method !== 'POST' || POST_SAFE_RETRY.has(res.status))
      const message = await this.errorMessage(res)
      lastError = new ListmonkError(message, RETRYABLE_STATUS.has(res.status), res.status)
      if (!retryable || attempt === this.maxAttempts) throw lastError
      await this.sleep(this.retryAfterMs(res) ?? this.backoff(attempt))
    }
    throw lastError ?? new ListmonkError('Listmonk request failed', true)
  }

  private backoff(attempt: number): number {
    return Math.min(250 * 2 ** (attempt - 1), 4000) + Math.floor(Math.random() * 100)
  }

  private retryAfterMs(res: Response): number | null {
    const v = Number(res.headers.get('retry-after'))
    return Number.isFinite(v) && v > 0 ? Math.min(v * 1000, 10_000) : null
  }

  private async errorMessage(res: Response): Promise<string> {
    let detail = ''
    try {
      const body = (await res.json()) as { message?: unknown }
      if (typeof body?.message === 'string') detail = body.message.slice(0, 200)
    } catch {
      /* not JSON */
    }
    const base = res.status === 401 || res.status === 403 ? 'Listmonk rejected the API credentials' : `Listmonk returned ${res.status}`
    return detail ? `${base}: ${detail}` : base
  }

  // ---- health -------------------------------------------------------------
  /** Authenticated health check. Confirms the URL is reachable and the credentials work. */
  async checkAuthenticated(): Promise<boolean> {
    const r = await this.request('GET', '/api/health', { schema: envelope(z.boolean()) })
    return r?.data === true
  }

  // ---- lists --------------------------------------------------------------
  async getLists(): Promise<ListmonkList[]> {
    const r = await this.request('GET', '/api/lists', { query: { per_page: 'all' }, schema: paged(listSchema) })
    return r!.data.results
  }

  async createList(input: { name: string; description?: string; tags?: string[] }): Promise<ListmonkList> {
    // Double opt in lists only send to confirmed subscriptions, a second safeguard
    // behind Herufi's own consent checks. Lists are private, never publicly listed.
    const r = await this.request('POST', '/api/lists', {
      body: { name: input.name, type: 'private', optin: 'double', description: input.description ?? '', tags: input.tags ?? [] },
      schema: envelope(listSchema),
    })
    return r!.data
  }

  // ---- subscribers --------------------------------------------------------
  async getSubscriber(id: number): Promise<ListmonkSubscriber | null> {
    const r = await this.request('GET', `/api/subscribers/${id}`, { schema: envelope(subscriberSchema), allow404: true })
    return r?.data ?? null
  }

  async findSubscriberByEmail(email: string): Promise<ListmonkSubscriber | null> {
    const r = await this.request('GET', '/api/subscribers', {
      query: { query: `subscribers.email=${sqlLiteral(email.toLowerCase())}`, per_page: 2 },
      schema: paged(subscriberSchema),
    })
    return r!.data.results[0] ?? null
  }

  async createSubscriber(input: {
    email: string; name: string; attribs: Record<string, unknown>; lists: number[]; preconfirm: boolean
  }): Promise<ListmonkSubscriber> {
    const r = await this.request('POST', '/api/subscribers', {
      body: {
        email: input.email, name: input.name, status: 'enabled', lists: input.lists,
        attribs: input.attribs, preconfirm_subscriptions: input.preconfirm,
      },
      schema: envelope(subscriberSchema),
    })
    return r!.data
  }

  /** Partial update. Attributes are merged, and `lists` (when given) replaces the subscriptions. */
  async patchSubscriber(
    id: number,
    input: { name?: string; status?: 'enabled' | 'disabled' | 'blocklisted'; attribs?: Record<string, unknown> },
  ): Promise<ListmonkSubscriber> {
    const r = await this.request('PATCH', `/api/subscribers/${id}`, { body: input, schema: envelope(subscriberSchema) })
    return r!.data
  }

  async setSubscriptions(input: {
    ids: number[]; action: 'add' | 'remove' | 'unsubscribe'; listIds: number[]; status?: 'confirmed' | 'unconfirmed'
  }): Promise<void> {
    await this.request('PUT', '/api/subscribers/lists', {
      body: { ids: input.ids, action: input.action, target_list_ids: input.listIds, ...(input.status ? { status: input.status } : {}) },
      schema: envelope(z.boolean()),
    })
  }

  async blocklistSubscriber(id: number): Promise<void> {
    await this.request('PUT', `/api/subscribers/${id}/blocklist`, { schema: envelope(z.boolean()) })
  }

  async querySubscribers(input: {
    query?: string; listId?: number; subscriptionStatus?: 'unconfirmed' | 'confirmed' | 'unsubscribed'; page?: number; perPage?: number
  }): Promise<{ results: ListmonkSubscriber[]; total: number }> {
    const r = await this.request('GET', '/api/subscribers', {
      query: {
        query: input.query, list_id: input.listId, subscription_status: input.subscriptionStatus,
        page: input.page ?? 1, per_page: input.perPage ?? 500, order_by: 'created_at', order: 'ASC',
      },
      schema: paged(subscriberSchema),
    })
    return { results: r!.data.results, total: r!.data.total }
  }

  /** Walk every page of a subscriber query. Stops when a page comes back short. */
  async *iterateSubscribers(
    input: { query?: string; listId?: number; subscriptionStatus?: 'unconfirmed' | 'confirmed' | 'unsubscribed'; perPage?: number },
  ): AsyncGenerator<ListmonkSubscriber[]> {
    const perPage = input.perPage ?? 500
    for (let page = 1; ; page++) {
      const { results } = await this.querySubscribers({ ...input, page, perPage })
      if (results.length) yield results
      if (results.length < perPage) return
    }
  }

  // ---- templates ----------------------------------------------------------
  async getTemplates(): Promise<ListmonkTemplate[]> {
    const r = await this.request('GET', '/api/templates', { schema: envelope(z.array(templateSchema)) })
    return r!.data
  }

  async createTemplate(input: { name: string; body: string }): Promise<ListmonkTemplate> {
    const r = await this.request('POST', '/api/templates', {
      body: { name: input.name, type: 'campaign', body: input.body },
      schema: envelope(z.union([templateSchema, z.array(templateSchema)])),
    })
    const d = r!.data
    if (!Array.isArray(d)) return d
    // Some versions return the template list rather than the created row.
    const found = d.find((t) => t.name === input.name)
    if (!found) throw new ListmonkError('Listmonk did not return the created template', false)
    return found
  }

  // ---- campaigns ----------------------------------------------------------
  async createCampaign(input: ListmonkCampaignInput): Promise<ListmonkCampaign> {
    const r = await this.request('POST', '/api/campaigns', { body: input, schema: envelope(campaignSchema) })
    return r!.data
  }

  async updateCampaign(id: number, input: ListmonkCampaignInput): Promise<ListmonkCampaign> {
    const r = await this.request('PUT', `/api/campaigns/${id}`, { body: input, schema: envelope(campaignSchema) })
    return r!.data
  }

  async getCampaign(id: number): Promise<ListmonkCampaign | null> {
    const r = await this.request('GET', `/api/campaigns/${id}`, { query: { no_body: 'true' }, schema: envelope(campaignSchema), allow404: true })
    return r?.data ?? null
  }

  async setCampaignStatus(id: number, status: 'scheduled' | 'running' | 'paused' | 'cancelled' | 'draft'): Promise<ListmonkCampaign> {
    const r = await this.request('PUT', `/api/campaigns/${id}/status`, { body: { status }, schema: envelope(campaignSchema) })
    return r!.data
  }

  /** Queues a test email. A successful response means queued, not delivered. */
  async testCampaign(id: number, input: ListmonkCampaignInput & { subscribers: string[] }): Promise<void> {
    await this.request('POST', `/api/campaigns/${id}/test`, { body: input, schema: envelope(z.boolean()) })
  }

  async getCampaignAnalytics(
    type: 'views' | 'clicks' | 'bounces' | 'links', ids: number[], from: string, to: string,
  ): Promise<Array<z.infer<typeof analyticsRowSchema>>> {
    const r = await this.request('GET', `/api/campaigns/analytics/${type}`, {
      query: { id: ids, from, to }, schema: envelope(z.array(analyticsRowSchema).nullish().transform((v) => v ?? [])),
    })
    return r!.data
  }

  // ---- bounces ------------------------------------------------------------
  async listBounces(input: { page?: number; perPage?: number } = {}): Promise<{ results: ListmonkBounce[]; total: number }> {
    const r = await this.request('GET', '/api/bounces', {
      query: { page: input.page ?? 1, per_page: input.perPage ?? 500, order_by: 'created_at', order: 'asc' },
      schema: paged(bounceSchema),
    })
    return { results: r!.data.results, total: r!.data.total }
  }
}

export type ListmonkCampaignInput = {
  name: string
  subject: string
  lists: number[]
  from_email: string
  type: 'regular'
  content_type: 'html'
  body: string
  altbody: string
  template_id: number
  messenger: 'email'
  headers: Array<Record<string, string>>
  send_at?: string | null
  tags?: string[]
}

export type { ListmonkCampaignStatus }
