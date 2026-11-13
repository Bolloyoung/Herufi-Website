/**
 * Structured JSON logging with a correlation id. Sensitive keys are redacted
 * and email addresses are masked, so logs can be shared without leaking
 * credentials or unnecessary personal data.
 */

const SENSITIVE_KEY = /(key|token|secret|password|authorization|cookie|credential|private)/i
const EMAIL_RE = /([A-Za-z0-9._%+-])[A-Za-z0-9._%+-]*@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g

export function maskEmail(email: string): string {
  return email.replace(EMAIL_RE, (_m, first: string, domain: string) => `${first}***@${domain}`)
}

export function redact(value: unknown, depth = 0): unknown {
  if (depth > 5) return '[truncated]'
  if (typeof value === 'string') return maskEmail(value)
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => redact(v, depth + 1))
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEY.test(k) ? '[redacted]' : redact(v, depth + 1)
    }
    return out
  }
  return value
}

export type Logger = {
  info: (msg: string, ctx?: Record<string, unknown>) => void
  warn: (msg: string, ctx?: Record<string, unknown>) => void
  error: (msg: string, ctx?: Record<string, unknown>) => void
  child: (extra: Record<string, unknown>) => Logger
}

export function createLogger(base: Record<string, unknown> = {}): Logger {
  const emit = (level: string, msg: string, ctx?: Record<string, unknown>) => {
    const line = JSON.stringify({
      level,
      msg,
      time: new Date().toISOString(),
      ...(redact({ ...base, ...ctx }) as Record<string, unknown>),
    })
    if (level === 'error') console.error(line)
    else if (level === 'warn') console.warn(line)
    else console.log(line)
  }
  return {
    info: (m, c) => emit('info', m, c),
    warn: (m, c) => emit('warn', m, c),
    error: (m, c) => emit('error', m, c),
    child: (extra) => createLogger({ ...base, ...extra }),
  }
}
