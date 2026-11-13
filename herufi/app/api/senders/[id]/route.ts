import { z } from 'zod'
import { setDefaultSender, setSenderVerified } from '@/lib/services/senders'
import { adminRoute, parseWith, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const body = z.object({ verified: z.boolean().optional(), makeDefault: z.boolean().optional() })

/** Marking a sender verified states that its domain passes SPF, DKIM and DMARC. Do it only after the domain checklist. */
export const PATCH = adminRoute<{ id: string }>(async ({ req, params, actor, cid }) => {
  const id = parseWith(z.string().uuid(), params.id)
  const b = await readJson(req, body)
  if (b.verified !== undefined) await setSenderVerified(actor, id, b.verified, cid)
  if (b.makeDefault) await setDefaultSender(actor, id, cid)
  return { updated: true }
})
