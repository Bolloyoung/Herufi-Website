import { z } from 'zod'
import { confirmSubscription } from '@/lib/services/consent'
import { assertSameOrigin, publicRoute, readJson } from '@/lib/server/http'
import { clientIp, enforce } from '@/lib/server/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Step two of double opt in. This is a POST that the confirmation page sends when
 * the person presses the button, not a GET on the emailed link. Mail security
 * scanners open links automatically, and must not be able to subscribe anyone.
 */
export const POST = publicRoute(async ({ req, cid }) => {
  assertSameOrigin(req)
  await enforce('confirm-ip', clientIp(req), 3600, 30)
  const { token } = await readJson(req, z.object({ token: z.string().min(10).max(200) }), 2_000)
  await confirmSubscription(token, cid)
  return { confirmed: true }
})
