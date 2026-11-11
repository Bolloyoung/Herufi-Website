import { z } from 'zod'
import { recordExternalConsent } from '@/lib/services/consent'
import { adminRoute, parseWith, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const body = z.object({
  audienceIds: z.array(z.string().uuid()).min(1).max(50),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  source: z.string().max(200),
  purpose: z.string().max(300),
  evidence: z.string().max(500),
})

/** Record consent obtained outside Herufi. Every piece of evidence is required, and who recorded it is logged. */
export const POST = adminRoute<{ id: string }>(async ({ req, params, actor, cid }) => {
  await recordExternalConsent(actor, parseWith(z.string().uuid(), params.id), await readJson(req, body), cid)
  return { recorded: true }
})
