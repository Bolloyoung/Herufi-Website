/** Application errors. The `code` is stable and safe to show to API clients. */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ConfigError extends AppError {
  constructor(message: string) {
    super(500, 'config_error', message)
    this.name = 'ConfigError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, 'validation_error', message, details)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, 'unauthorized', message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have access to this resource') {
    super(403, 'forbidden', message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(404, 'not_found', message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code = 'conflict', details?: unknown) {
    super(409, code, message, details)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(429, 'rate_limited', message)
    this.name = 'RateLimitError'
  }
}

/** A failure talking to an external system. `retryable` drives retry and backoff. */
export class UpstreamError extends AppError {
  constructor(
    public readonly provider: 'listmonk' | 'google' | 'database' | 'resend' | 'supabase',
    message: string,
    public readonly retryable = false,
    status = 502,
    public readonly upstreamStatus?: number,
  ) {
    super(status, `${provider}_error`, message)
    this.name = 'UpstreamError'
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError
}
