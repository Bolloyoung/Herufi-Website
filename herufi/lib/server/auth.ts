import { adminEmails, jobSecret, supabaseAuthConfig } from './env'
import { ForbiddenError, UnauthorizedError, UpstreamError } from './errors'
import { safeEqual } from './tokens'

export type AdminIdentity = { email: string; userId: string }

export type AdminVerifier = (accessToken: string) => Promise<AdminIdentity | null>

/**
 * Verifies a Supabase access token by asking Supabase Auth who it belongs to
 * (GET /auth/v1/user). No service role key is needed, and the token is never
 * trusted without that round trip.
 */
export const verifySupabaseToken: AdminVerifier = async (accessToken) => {
  const { url, anonKey } = supabaseAuthConfig()
  let res: Response
  try {
    res = await fetch(`${url}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${accessToken}`, apikey: anonKey },
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    })
  } catch {
    throw new UpstreamError('supabase', 'Could not verify your session', true, 503)
  }
  if (res.status === 401 || res.status === 403) return null
  if (!res.ok) throw new UpstreamError('supabase', 'Could not verify your session', true, 503)
  const user = (await res.json()) as { id?: string; email?: string; email_confirmed_at?: string | null }
  if (!user?.email || !user.id) return null
  // A magic link login proves control of the address; an unconfirmed one does not.
  if (!user.email_confirmed_at) return null
  return { email: user.email.toLowerCase(), userId: user.id }
}

export function bearerToken(req: Request): string | null {
  const header = req.headers.get('authorization') ?? ''
  const match = /^Bearer\s+(.+)$/i.exec(header)
  return match ? match[1].trim() : null
}

/** Only addresses listed in ADMIN_EMAILS (or NEXT_PUBLIC_ADMIN_EMAIL) are administrators. */
export async function requireAdmin(req: Request, verifier: AdminVerifier = verifySupabaseToken): Promise<AdminIdentity> {
  const token = bearerToken(req)
  if (!token) throw new UnauthorizedError()
  const identity = await verifier(token)
  if (!identity) throw new UnauthorizedError('Your session is not valid. Please sign in again.')
  if (!adminEmails().includes(identity.email)) throw new ForbiddenError('Administrator access is required')
  return identity
}

/** Scheduled jobs authenticate with INTERNAL_JOB_SECRET as a bearer token. */
export function requireJobSecret(req: Request): void {
  const token = bearerToken(req)
  if (!token || !safeEqual(token, jobSecret())) throw new UnauthorizedError('Invalid job credentials')
}
