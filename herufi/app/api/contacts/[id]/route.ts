import { z } from 'zod'
import { getContact } from '@/lib/services/contacts'
import { adminRoute, parseWith } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = adminRoute<{ id: string }>(async ({ params }) => getContact(parseWith(z.string().uuid(), params.id)))
