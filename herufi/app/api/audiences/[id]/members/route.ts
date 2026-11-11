import { z } from 'zod'
import { setMembership } from '@/lib/services/audiences'
import { adminRoute, parseWith, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const body = z.object({ action: z.enum(['add', 'remove']), contactIds: z.array(z.string().uuid()).min(1).max(5000) })

/** Membership never grants consent. It only chooses who is considered for an audience. */
export const POST = adminRoute<{ id: string }>(async ({ req, params, actor, cid }) => {
  const { action, contactIds } = await readJson(req, body)
  return setMembership(actor, parseWith(z.string().uuid(), params.id), contactIds, action, cid)
})
