import { reconcileFromListmonk, syncToListmonk } from '@/lib/integrations/listmonk/sync'
import { reconcileCampaigns } from '@/lib/services/campaigns'
import { getListmonk } from '@/lib/server/factory'
import { jobRoute } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * The scheduled job. Pulls changes made inside Listmonk (unsubscribes, bounces,
 * blocklists) into Herufi first, then pushes pending contact changes to Listmonk,
 * then refreshes campaign status and statistics. Protected by INTERNAL_JOB_SECRET.
 * Vercel Cron sends GET with "Authorization: Bearer $CRON_SECRET", so set
 * CRON_SECRET to the same value as INTERNAL_JOB_SECRET.
 */
const run = jobRoute(async ({ cid, log }) => {
  const lm = getListmonk(log)
  const reconcile = await reconcileFromListmonk({ lm, actor: 'system:schedule', correlationId: cid, log })
  const contacts = await syncToListmonk({ lm, actor: 'system:schedule', correlationId: cid, log, limit: 500 })
  const campaigns = await reconcileCampaigns(lm, log)
  return { reconcile, contacts, campaigns }
})

export const GET = run
export const POST = run
