import { z } from 'zod'
import { cancelCampaign, pauseCampaign, refreshCampaign, resumeCampaign } from '@/lib/services/campaigns'
import { getListmonk } from '@/lib/server/factory'
import { adminRoute, parseWith, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const body = z.object({ action: z.enum(['pause', 'resume', 'cancel', 'refresh']) })

export const POST = adminRoute<{ id: string }>(async ({ req, params, actor, cid, log }) => {
  const id = parseWith(z.string().uuid(), params.id)
  const { action } = await readJson(req, body)
  const lm = getListmonk(log)
  if (action === 'pause') return pauseCampaign(actor, id, lm, cid)
  if (action === 'resume') return resumeCampaign(actor, id, lm, cid, log)
  if (action === 'cancel') return cancelCampaign(actor, id, lm, cid)
  return refreshCampaign(id, lm)
})
