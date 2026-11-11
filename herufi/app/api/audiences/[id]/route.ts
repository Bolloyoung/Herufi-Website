import { z } from 'zod'
import { archiveAudience, updateAudience } from '@/lib/services/audiences'
import { adminRoute, parseWith, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const rules = z.object({ organisation_type: z.array(z.string().max(100)).max(50).optional(), category: z.array(z.string().max(100)).max(50).optional(), tags: z.array(z.string().max(50)).max(50).optional() })
const patch = z.object({ name: z.string().min(1).max(100).optional(), description: z.string().max(500).nullable().optional(), publicSignup: z.boolean().optional(), autoRules: rules.optional() })

export const PATCH = adminRoute<{ id: string }>(async ({ req, params, actor, cid }) => updateAudience(actor, parseWith(z.string().uuid(), params.id), await readJson(req, patch), cid))
export const DELETE = adminRoute<{ id: string }>(async ({ params, actor, cid }) => {
  await archiveAudience(actor, parseWith(z.string().uuid(), params.id), cid)
  return { archived: true }
})
