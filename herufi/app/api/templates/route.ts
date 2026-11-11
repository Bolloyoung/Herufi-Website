import { z } from 'zod'
import { createTemplate, listTemplates } from '@/lib/services/templates'
import { adminRoute, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const templateBody = z.object({ name: z.string().min(1).max(100), description: z.string().max(500).nullable().optional(), subject: z.string().max(500).nullable().optional(), previewText: z.string().max(300).nullable().optional(), bodyHtml: z.string().max(400_000) })

export const GET = adminRoute(async () => ({ templates: await listTemplates() }))
export const POST = adminRoute(async ({ req, actor, cid }) => createTemplate(actor, await readJson(req, templateBody, 500_000), cid))
