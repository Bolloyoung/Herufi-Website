import { Pool, types, type PoolClient, type PoolConfig } from 'pg'
import { databaseConfig } from './env'
import { UpstreamError } from './errors'

// Return timestamps as ISO strings, so rows serialise to JSON and compare consistently.
types.setTypeParser(1184, (v: string) => new Date(v).toISOString()) // timestamptz
types.setTypeParser(1114, (v: string) => new Date(v + 'Z').toISOString()) // timestamp

/** Anything with `query`: the pool, a checked out client, or a test double. */
export type Queryable = {
  query: (text: string, params?: unknown[]) => Promise<{ rows: any[]; rowCount: number | null }>
}

const globalForPool = globalThis as unknown as { __herufiEmailPool?: Pool }

function buildPoolConfig(): PoolConfig {
  const { connectionString, ssl, sslCa } = databaseConfig()
  const isLocal = /@(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/.test(connectionString)
  let sslOption: PoolConfig['ssl'] = false
  if (ssl === 'require' || (ssl === 'auto' && !isLocal)) {
    // Supabase poolers present a certificate from their own CA. Supply it with
    // DATABASE_SSL_CA to verify the server; otherwise the connection is encrypted
    // but the certificate is not verified.
    sslOption = sslCa ? { ca: sslCa, rejectUnauthorized: true } : { rejectUnauthorized: false }
  }
  // sslmode in the URL must not override the explicit ssl option above.
  const cleaned = connectionString.replace(/([?&])sslmode=[^&]*&?/, '$1').replace(/[?&]$/, '')
  return {
    connectionString: cleaned,
    ssl: sslOption,
    max: 3, // serverless: keep the footprint small
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    statement_timeout: 20_000,
  }
}

export function getPool(): Pool {
  if (!globalForPool.__herufiEmailPool) {
    const pool = new Pool(buildPoolConfig())
    pool.on('error', () => {
      /* idle client errors are surfaced on the next query */
    })
    globalForPool.__herufiEmailPool = pool
  }
  return globalForPool.__herufiEmailPool
}

export async function closePool(): Promise<void> {
  if (globalForPool.__herufiEmailPool) {
    await globalForPool.__herufiEmailPool.end()
    globalForPool.__herufiEmailPool = undefined
  }
}

/** Run `fn` inside a transaction. Rolls back on any error. */
export async function withTx<T>(fn: (client: PoolClient) => Promise<T>, pool: Pool = getPool()): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('begin')
    const result = await fn(client)
    await client.query('commit')
    return result
  } catch (err) {
    try {
      await client.query('rollback')
    } catch {
      /* the original error is the one that matters */
    }
    throw wrapDbError(err)
  } finally {
    client.release()
  }
}

export function db(): Queryable {
  return getPool()
}

export function wrapDbError(err: unknown): unknown {
  if (err instanceof UpstreamError) return err
  const e = err as { code?: string; message?: string }
  // Keep SQLSTATE class 23 (constraint violations) visible to callers, so they
  // can turn a unique violation into a clean conflict.
  if (e && typeof e.code === 'string' && /^23/.test(e.code)) return err
  if (e && typeof e.code === 'string' && /^[0-9A-Z]{5}$/.test(e.code)) {
    return new UpstreamError('database', 'Database error', false, 500)
  }
  if (e && typeof e.message === 'string' && /(connect|timeout|ECONN|ENOTFOUND)/i.test(e.message)) {
    return new UpstreamError('database', 'Database unavailable', true, 503)
  }
  return err
}

export function isUniqueViolation(err: unknown): boolean {
  return (err as { code?: string })?.code === '23505'
}
