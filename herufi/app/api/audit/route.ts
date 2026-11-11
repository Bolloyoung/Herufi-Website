import { z } from 'zod'
import { listAudit } from '@/lib/services/audit'
import { db } from '@/lib/server/db'
import { adminRoute, parseWith } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const query = z.object({ entityType: z.string().max(40).optional(), entityId: z.string().max(100).optional(), limit: z.coerce.number().int().min(1).max(500).optional() })

export const GET = adminRoute(async ({ req }) => ({ entries: await listAudit(db(), parseWith(query, Object.fromEntries(new URL(req.url).searchParams))) }))
