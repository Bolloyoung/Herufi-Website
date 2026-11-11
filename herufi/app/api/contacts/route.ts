import { z } from 'zod'
import { CONTACT_STATUSES } from '@/lib/domain/types'
import { listContacts, statusCounts } from '@/lib/services/contacts'
import { adminRoute } from '@/lib/server/http'
import { parseWith } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const query = z.object({
  q: z.string().max(100).optional(),
  status: z.enum(CONTACT_STATUSES).optional(),
  audienceId: z.string().uuid().optional(),
  claim: z.enum(['complete', 'incomplete']).optional(),
  archived: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).max(10_000).optional(),
  perPage: z.coerce.number().int().min(1).max(200).optional(),
})

export const GET = adminRoute(async ({ req }) => {
  const raw = Object.fromEntries(new URL(req.url).searchParams)
  const f = parseWith(query, raw)
  const [list, counts] = await Promise.all([listContacts({ ...f, archived: f.archived === 'true' }), statusCounts()])
  return { ...list, counts }
})
