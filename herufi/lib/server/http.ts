import { randomUUID } from 'node:crypto'
import type { ZodType, ZodTypeDef } from 'zod'
import { ZodError } from 'zod'
import { appBaseUrl } from './env'
import { AppError, ForbiddenError, ValidationError, isAppError } from './errors'
import { createLogger, type Logger } from './logger'
import { requireAdmin, requireJobSecret, type AdminVerifier, verifySupabaseToken } from './auth'

const NO_STORE = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }

export function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...NO_STORE, ...extraHeaders } })
}

export function correlationId(req: Request): string {
  const incoming = req.headers.get('x-correlation-id')
  return incoming && /^[A-Za-z0-9_.-]{8,64}$/.test(incoming) ? incoming : randomUUID()
}

export async function readJson<T>(req: Request, schema: ZodType<T, ZodTypeDef, unknown>, maxBytes = 1_000_000): Promise<T> {
  const declared = Number(req.headers.get('content-length') ?? 0)
  if (declared > maxBytes) throw new ValidationError('Request body is too large')
  const text = await req.text()
  if (text.length > maxBytes) throw new ValidationError('Request body is too large')
  let parsed: unknown
  try {
    parsed = text ? JSON.parse(text) : {}
  } catch {
    throw new ValidationError('Request body must be valid JSON')
  }
  return parseWith(schema, parsed)
}

export function parseWith<T>(schema: ZodType<T, ZodTypeDef, unknown>, value: unknown): T {
  const result = schema.safeParse(value)
  if (!result.success) throw zodToValidation(result.error)
  return result.data
}

export function zodToValidation(err: ZodError): ValidationError {
  const issues = err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
  return new ValidationError(
    issues.length ? `${issues[0].path ? issues[0].path + ': ' : ''}${issues[0].message}` : 'Invalid request',
    issues,
  )
}

/**
 * Public form posts must come from our own pages. Browsers always send Origin
 * on a cross origin POST, so a mismatch is rejected.
 */
export function assertSameOrigin(req: Request): void {
  const origin = req.headers.get('origin')
  const expected = new URL(appBaseUrl()).origin
  if (origin) {
    if (origin !== expected) throw new ForbiddenError('Cross origin request rejected')
    return
  }
  const site = req.headers.get('sec-fetch-site')
  if (site && site !== 'same-origin' && site !== 'none') throw new ForbiddenError('Cross origin request rejected')
}

function errorResponse(err: unknown, cid: string, log: Logger): Response {
  if (isAppError(err)) {
    if (err.status >= 500) log.error('request failed', { code: err.code, message: err.message })
    const body: Record<string, unknown> = { error: { code: err.code, message: err.message }, correlationId: cid }
    if (err.details !== undefined && err.status < 500) (body.error as Record<string, unknown>).details = err.details
    return json(body, err.status, { 'x-correlation-id': cid })
  }
  if (err instanceof ZodError) return errorResponse(zodToValidation(err), cid, log)
  log.error('unhandled error', { message: err instanceof Error ? err.message : String(err) })
  return json({ error: { code: 'internal_error', message: 'Something went wrong' }, correlationId: cid }, 500, {
    'x-correlation-id': cid,
  })
}

type Ctx<P> = { params: P }
type Base<P> = { req: Request; params: P; cid: string; log: Logger }

function wrap<P, A extends Base<P>>(
  authenticate: (req: Request) => Promise<Record<string, unknown>>,
  handler: (args: A) => Promise<unknown>,
) {
  return async (req: Request, ctx: Ctx<P>): Promise<Response> => {
    const cid = correlationId(req)
    const log = createLogger({ cid, route: new URL(req.url).pathname, method: req.method })
    try {
      const extra = await authenticate(req)
      const result = await handler({ req, params: ctx?.params, cid, log, ...extra } as A)
      if (result instanceof Response) {
        result.headers.set('x-correlation-id', cid)
        return result
      }
      return json({ data: result ?? null }, 200, { 'x-correlation-id': cid })
    } catch (err) {
      return errorResponse(err, cid, log)
    }
  }
}

/** Authenticated administrator endpoint. */
export function adminRoute<P = Record<string, string>>(
  handler: (args: Base<P> & { actor: string }) => Promise<unknown>,
  verifier: AdminVerifier = verifySupabaseToken,
) {
  return wrap<P, Base<P> & { actor: string }>(async (req) => {
    const identity = await requireAdmin(req, verifier)
    return { actor: identity.email }
  }, handler)
}

/** Scheduled job endpoint, protected by INTERNAL_JOB_SECRET. */
export function jobRoute<P = Record<string, string>>(handler: (args: Base<P>) => Promise<unknown>) {
  return wrap<P, Base<P>>(async (req) => {
    requireJobSecret(req)
    return {}
  }, handler)
}

/** Unauthenticated endpoint (public forms, webhooks). The handler must do its own checks. */
export function publicRoute<P = Record<string, string>>(handler: (args: Base<P>) => Promise<unknown>) {
  return wrap<P, Base<P>>(async () => ({}), handler)
}

export { AppError }
