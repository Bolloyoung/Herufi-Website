import { z } from 'zod'
import { sendConfirmationEmail, confirmationUrl } from '@/lib/integrations/email/confirmation-mail'
import { requestSubscription } from '@/lib/services/consent'
import { appEnv, sendMode } from '@/lib/server/env'
import { assertSameOrigin, json, publicRoute, readJson } from '@/lib/server/http'
import { clientIp, enforce } from '@/lib/server/rate-limit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const body = z.object({
  email: z.string().min(3).max(254),
  firstName: z.string().max(100).optional(),
  audiences: z.array(z.string().max(80)).min(1).max(10),
  /** Honeypot. Real visitors never fill this in. */
  website: z.string().max(200).optional(),
})

/**
 * Step one of double opt in. Whatever the outcome, the response is the same, so
 * the form cannot be used to find out whether an address is already known.
 */
export const POST = publicRoute(async ({ req, cid, log }) => {
  assertSameOrigin(req)
  const input = await readJson(req, body, 10_000)
  const generic = json({ data: { ok: true, message: 'If that address can be subscribed, a confirmation email is on its way.' } })

  // Bots fill hidden fields. Pretend it worked.
  if (input.website) return generic

  await enforce('subscribe-ip', clientIp(req), 3600, 10)
  await enforce('subscribe-email', input.email.trim().toLowerCase(), 86_400, 3)

  const result = await requestSubscription({ email: input.email, firstName: input.firstName, audienceSlugs: input.audiences, source: 'website form', correlationId: cid })
  if (result.outcome !== 'sent') return generic

  let devUrl: string | undefined
  try {
    const mail = await sendConfirmationEmail({ to: result.email, token: result.token, audienceNames: result.audienceNames }, log)
    // Only in local development with sending disabled, so the flow can be tried without email.
    if (!mail.sent && appEnv() === 'development' && sendMode() === 'disabled') devUrl = confirmationUrl(result.token)
  } catch (err) {
    log.error('confirmation email failed', { error: err instanceof Error ? err.message : 'unknown' })
    // Still the generic answer: the person can try again, and nothing about the address is revealed.
  }
  return json({ data: { ok: true, message: 'If that address can be subscribed, a confirmation email is on its way.', ...(devUrl ? { devConfirmationUrl: devUrl } : {}) } })
})
