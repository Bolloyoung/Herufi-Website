import { createHash } from 'node:crypto'
import { db, type Queryable } from './db'
import { RateLimitError } from './errors'

/** Hash identifiers before storing them, so the limiter keeps no raw IPs or addresses. */
export function limiterKey(scope: string, identifier: string): string {
  return `${scope}:${createHash('sha256').update(identifier).digest('hex').slice(0, 32)}`
}

/** Returns true when the call is allowed. Atomic, shared across serverless instances. */
export async function hit(key: string, windowSeconds: number, max: number, q: Queryable = db()): Promise<boolean> {
  const { rows } = await q.query('select email_rate_limit_hit($1, $2, $3) as allowed', [key, windowSeconds, max])
  return rows[0]?.allowed === true
}

export async function enforce(
  scope: string,
  identifier: string,
  windowSeconds: number,
  max: number,
  q: Queryable = db(),
): Promise<void> {
  if (!(await hit(limiterKey(scope, identifier), windowSeconds, max, q))) throw new RateLimitError()
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}
