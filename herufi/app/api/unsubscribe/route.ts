import { z } from 'zod'
import { syncToListmonk } from '@/lib/integrations/listmonk/sync'
import { unsubscribe } from '@/lib/services/consent'
import { assertSameOrigin, publicRoute, readJson } from '@/lib/server/http'
import { clientIp, enforce } from '@/lib/server/rate-limit'
import { getListmonk } from '@/lib/server/factory'
import { NotFoundError } from '@/lib/server/errors'
import { verifyUnsubscribeToken } from '@/lib/server/tokens'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const body = z.object({ token: z.string().min(10).max(200), campaign: z.string().max(100).optional() })

/** Always unsubscribes, immediately and idempotently. The signed token only ever allows this one safe action. */
export const POST = publicRoute(async ({ req, cid, log }) => {
  assertSameOrigin(req)
  await enforce('unsubscribe-ip', clientIp(req), 3600, 60)
  const input = await readJson(req, body, 2_000)
  const contactId = verifyUnsubscribeToken(input.token)
  if (!contactId) throw new NotFoundError('This unsubscribe link is not valid')
  const campaignUuid = input.campaign && /^[0-9a-f-]{36}$/i.test(input.campaign) ? input.campaign : null
  const result = await unsubscribe({ contactId, source: 'unsubscribe link', campaignUuid, correlationId: cid })

  // Tell Listmonk straight away. If that fails, the scheduled sync completes it.
  try {
    await syncToListmonk({ lm: getListmonk(log), actor: 'system:unsubscribe', correlationId: cid, log, onlyContactIds: [contactId], limit: 1 })
  } catch (err) {
    log.warn('could not update Listmonk immediately after unsubscribe; the scheduled sync will', { error: err instanceof Error ? err.message : 'unknown' })
  }
  return { unsubscribed: true, changed: result.changed }
})
