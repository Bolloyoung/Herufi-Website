import { createHmac } from 'node:crypto'
import { z } from 'zod'
import { applyDeliveryEvent } from '@/lib/services/consent'
import { db } from '@/lib/server/db'
import { webhookSecret } from '@/lib/server/env'
import { UnauthorizedError, ValidationError } from '@/lib/server/errors'
import { parseWith, publicRoute } from '@/lib/server/http'
import { safeEqual } from '@/lib/server/tokens'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const event = z.object({
  id: z.string().min(1).max(200),
  provider: z.string().min(1).max(50),
  type: z.enum(['bounce', 'complaint', 'delivered']),
  email: z.string().min(3).max(254),
  detail: z.string().max(500).optional(),
})
const payload = z.union([event, z.array(event).min(1).max(100)])

/**
 * Provider neutral delivery events. The sender signs "<timestamp>.<raw body>" with
 * HMAC SHA 256 using EMAIL_WEBHOOK_SECRET and sends it in x-herufi-signature
 * (hex) with x-herufi-timestamp (unix seconds). Events are deduplicated by
 * provider and id, so replays do nothing. Listmonk's own bounce handling is the
 * primary path; this endpoint is for a provider that can post events directly,
 * through a small adapter for that provider.
 */
export const POST = publicRoute(async ({ req, cid }) => {
  const raw = await req.text()
  if (raw.length > 200_000) throw new ValidationError('Payload too large')
  const ts = req.headers.get('x-herufi-timestamp') ?? ''
  const sig = (req.headers.get('x-herufi-signature') ?? '').replace(/^sha256=/, '')
  const expected = createHmac('sha256', webhookSecret()).update(`${ts}.${raw}`).digest('hex')
  if (!sig || !safeEqual(sig, expected)) throw new UnauthorizedError('Invalid signature')
  const age = Math.abs(Date.now() / 1000 - Number(ts))
  if (!Number.isFinite(age) || age > 300) throw new UnauthorizedError('Stale or missing timestamp')

  let json: unknown
  try { json = JSON.parse(raw) } catch { throw new ValidationError('Body must be JSON') }
  const events = [parseWith(payload, json)].flat()

  let applied = 0, duplicates = 0
  for (const e of events) {
    const { rows } = await db().query(
      `insert into email_provider_events (provider, event_id, event_type, email, payload) values ($1,$2,$3,$4,$5::jsonb)
       on conflict (provider, event_id) do nothing returning id`,
      [e.provider, e.id, e.type, e.email.toLowerCase(), JSON.stringify({ detail: e.detail ?? null })],
    )
    if (!rows[0]) { duplicates++; continue }
    if (e.type === 'bounce' || e.type === 'complaint') {
      await applyDeliveryEvent({ email: e.email, type: e.type, source: `provider:${e.provider}`, detail: e.detail, correlationId: cid })
    }
    await db().query('update email_provider_events set processed_at = now() where id = $1', [rows[0].id])
    applied++
  }
  return { received: events.length, applied, duplicates }
})
