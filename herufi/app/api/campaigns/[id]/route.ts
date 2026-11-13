import { z } from 'zod'
import { archiveCampaign, getCampaign, updateCampaign } from '@/lib/services/campaigns'
import { db } from '@/lib/server/db'
import { adminRoute, parseWith, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const patch = z.object({
  name: z.string().max(200).optional(), subject: z.string().max(500).optional(), previewText: z.string().max(300).nullable().optional(),
  fromName: z.string().max(200).optional(), fromEmail: z.string().max(254).optional(), replyTo: z.string().max(254).nullable().optional(),
  audienceId: z.string().uuid().nullable().optional(), bodyHtml: z.string().max(400_000).optional(), bodyText: z.string().max(50_000).nullable().optional(),
  scheduledAt: z.string().max(40).nullable().optional(), timezone: z.string().max(60).optional(),
})
const id = (p: { id: string }) => parseWith(z.string().uuid(), p.id)

export const GET = adminRoute<{ id: string }>(async ({ params }) => getCampaign(db(), id(params)))
export const PATCH = adminRoute<{ id: string }>(async ({ req, params, actor, cid }) => updateCampaign(actor, id(params), await readJson(req, patch, 500_000), cid))
export const DELETE = adminRoute<{ id: string }>(async ({ params, actor, cid }) => {
  await archiveCampaign(actor, id(params), cid)
  return { archived: true }
})
