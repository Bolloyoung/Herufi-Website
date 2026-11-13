import { z } from 'zod'
import { submitCampaign } from '@/lib/services/campaigns'
import { getListmonk } from '@/lib/server/factory'
import { adminRoute, parseWith, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const body = z.object({
  mode: z.enum(['send_now', 'schedule']),
  scheduledAt: z.string().max(40).optional(),
  expectedEligibleCount: z.number().int().min(0),
  confirm: z.boolean(),
  idempotencyKey: z.string().min(16).max(100),
})

/** Send or schedule. Needs explicit confirmation, the eligible count the reviewer saw, and a one time request key. */
export const POST = adminRoute<{ id: string }>(async ({ req, params, actor, cid, log }) =>
  submitCampaign(actor, parseWith(z.string().uuid(), params.id), await readJson(req, body), getListmonk(log), cid, log))
