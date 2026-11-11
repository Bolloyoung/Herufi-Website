import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { tokenSecret } from './env'

export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url')
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function sign(purpose: string, contactId: string, secret: string): string {
  return createHmac('sha256', secret).update(`${purpose}:${contactId}`).digest('base64url')
}

/**
 * Unsubscribe tokens are stateless and never expire, because an unsubscribe
 * link in an old email must keep working. They only ever allow the safe
 * action of unsubscribing that one contact.
 */
export function signUnsubscribeToken(contactId: string, secret = tokenSecret()): string {
  return `${contactId}.${sign('unsubscribe', contactId, secret)}`
}

export function verifyUnsubscribeToken(token: string, secret = tokenSecret()): string | null {
  const [contactId, signature, extra] = token.split('.')
  if (extra !== undefined || !contactId || !signature || !UUID_RE.test(contactId)) return null
  return safeEqual(signature, sign('unsubscribe', contactId, secret)) ? contactId : null
}
