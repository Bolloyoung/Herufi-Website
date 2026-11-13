import { reconcileFromListmonk, syncToListmonk } from '@/lib/integrations/listmonk/sync'
import { reconcileCampaigns } from '@/lib/services/campaigns'
import { getListmonk } from '@/lib/server/factory'
import { adminRoute } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** Manual "sync now": the same work as the scheduled job. */
export const POST = adminRoute(async ({ actor, cid, log }) => {
  const lm = getListmonk(log)
  const reconcile = await reconcileFromListmonk({ lm, actor, correlationId: cid, log })
  const contacts = await syncToListmonk({ lm, actor, correlationId: cid, log, limit: 500 })
  return { reconcile, contacts, campaigns: await reconcileCampaigns(lm, log) }
})
