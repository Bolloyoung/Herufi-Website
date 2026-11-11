import { z } from 'zod'
import { sendTest } from '@/lib/services/campaigns'
import { getListmonk } from '@/lib/server/factory'
import { adminRoute, parseWith, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export const POST = adminRoute<{ id: string }>(async ({ req, params, actor, cid, log }) => {
  const { recipients } = await readJson(req, z.object({ recipients: z.array(z.string().max(254)).min(1).max(5) }))
  return sendTest(actor, parseWith(z.string().uuid(), params.id), recipients, getListmonk(log), cid)
})
