import { listPublicAudiences } from '@/lib/services/audiences'
import { publicRoute } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** The topics offered on the public form. Only names, never anything about members. */
export const GET = publicRoute(async () => ({ audiences: await listPublicAudiences() }))
