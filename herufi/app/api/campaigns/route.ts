import { z } from 'zod'
import { CAMPAIGN_STATUSES } from '@/lib/domain/types'
import { createCampaign, listCampaigns } from '@/lib/services/campaigns'
import { adminRoute, parseWith, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const query = z.object({ q: z.string().max(100).optional(), status: z.enum(CAMPAIGN_STATUSES).optional(), page: z.coerce.number().int().min(1).optional(), perPage: z.coerce.number().int().min(1).max(100).optional() })
const body = z.object({ name: z.string().min(1).max(200), audienceId: z.string().uuid().nullable().optional(), templateId: z.string().uuid().nullable().optional() })

export const GET = adminRoute(async ({ req }) => listCampaigns(parseWith(query, Object.fromEntries(new URL(req.url).searchParams))))
export const POST = adminRoute(async ({ req, actor, cid }) => createCampaign(actor, await readJson(req, body), cid))
