import { z } from 'zod'
import { archiveTemplate, getTemplate, updateTemplate } from '@/lib/services/templates'
import { db } from '@/lib/server/db'
import { adminRoute, parseWith, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const body = z.object({ name: z.string().min(1).max(100), description: z.string().max(500).nullable().optional(), subject: z.string().max(500).nullable().optional(), previewText: z.string().max(300).nullable().optional(), bodyHtml: z.string().max(400_000) })
const id = (p: { id: string }) => parseWith(z.string().uuid(), p.id)

export const GET = adminRoute<{ id: string }>(async ({ params }) => getTemplate(db(), id(params)))
export const PATCH = adminRoute<{ id: string }>(async ({ req, params, actor, cid }) => updateTemplate(actor, id(params), await readJson(req, body, 500_000), cid))
export const DELETE = adminRoute<{ id: string }>(async ({ params, actor, cid }) => {
  await archiveTemplate(actor, id(params), cid)
  return { archived: true }
})
