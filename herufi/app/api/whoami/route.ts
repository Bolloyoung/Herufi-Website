import { adminRoute } from '@/lib/server/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Lets the admin screens check access cheaply. */
export const GET = adminRoute(async ({ actor }) => ({ email: actor }))
