import { z } from 'zod'
import { createSender, listSenders } from '@/lib/services/senders'
import { adminRoute, readJson } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const body = z.object({ fromName: z.string().min(1).max(100), fromEmail: z.string().max(254), replyTo: z.string().max(254).nullable().optional(), signatureHtml: z.string().max(20_000).nullable().optional() })

export const GET = adminRoute(async () => ({ senders: await listSenders() }))
export const POST = adminRoute(async ({ req, actor, cid }) => createSender(actor, await readJson(req, body), cid))
