import { z } from 'zod'
import { acceptClaimedConsent } from '@/lib/services/consent'
import { adminRoute, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const body = z.object({ contactIds: z.array(z.string().uuid()).min(1).max(2000), audienceIds: z.array(z.string().uuid()).min(1).max(50) })

/** Accept consent claimed by an imported sheet, only for contacts whose claim is complete. Others are skipped and reported. */
export const POST = adminRoute(async ({ req, actor, cid }) => {
  const { contactIds, audienceIds } = await readJson(req, body)
  return acceptClaimedConsent(actor, contactIds, audienceIds, cid)
})
