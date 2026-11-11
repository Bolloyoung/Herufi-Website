import { z } from 'zod'
import { createAudience, listAudiences } from '@/lib/services/audiences'
import { adminRoute, readJson } from '@/lib/server/http'
import { db } from '@/lib/server/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const rules = z.object({ organisation_type: z.array(z.string().max(100)).max(50).optional(), category: z.array(z.string().max(100)).max(50).optional(), tags: z.array(z.string().max(50)).max(50).optional() })
const body = z.object({ name: z.string().min(1).max(100), description: z.string().max(500).nullable().optional(), publicSignup: z.boolean().optional(), autoRules: rules.optional() })

export const GET = adminRoute(async ({ req }) => ({ audiences: await listAudiences(db(), { includeArchived: new URL(req.url).searchParams.get('archived') === 'true' }) }))
export const POST = adminRoute(async ({ req, actor, cid }) => createAudience(actor, await readJson(req, body), cid))
