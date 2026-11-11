import { z } from 'zod'
import { getReview } from '@/lib/services/campaigns'
import { adminRoute, parseWith } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Recipients, exclusions with reasons, checks and a preview. Recomputed on every request. */
export const GET = adminRoute<{ id: string }>(async ({ params }) => getReview(parseWith(z.string().uuid(), params.id)))
