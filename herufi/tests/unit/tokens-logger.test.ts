import { describe, expect, it } from 'vitest'
import { generateToken, hashToken, signUnsubscribeToken, verifyUnsubscribeToken } from '@/lib/server/tokens'
import { maskEmail, redact } from '@/lib/server/logger'

const SECRET = 'x'.repeat(40)
const ID = '3f2b1c9e-5a7d-4e1b-9c3d-0a1b2c3d4e5f'

describe('unsubscribe tokens', () => {
  it('round trips', () => {
    expect(verifyUnsubscribeToken(signUnsubscribeToken(ID, SECRET), SECRET)).toBe(ID)
  })
  it('rejects a tampered signature, a different contact id, and a different secret', () => {
    const t = signUnsubscribeToken(ID, SECRET)
    expect(verifyUnsubscribeToken(t.slice(0, -2) + 'AA', SECRET)).toBeNull()
    expect(verifyUnsubscribeToken(t.replace(ID, '00000000-0000-4000-8000-000000000000'), SECRET)).toBeNull()
    expect(verifyUnsubscribeToken(t, 'y'.repeat(40))).toBeNull()
  })
  it('rejects malformed input without throwing', () => {
    for (const bad of ['', 'abc', `${ID}`, `${ID}.`, `.sig`, `${ID}.a.b`, 'not-a-uuid.sig']) {
      expect(verifyUnsubscribeToken(bad, SECRET)).toBeNull()
    }
  })
  it('does not let an unsubscribe token be reused as another kind of token', () => {
    const t = signUnsubscribeToken(ID, SECRET)
    expect(t.endsWith(hashToken(ID))).toBe(false)
  })
})

describe('opaque tokens', () => {
  it('generates unguessable, unique, url safe values', () => {
    const a = generateToken(), b = generateToken()
    expect(a).not.toBe(b)
    expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/)
  })
  it('stores only a stable hash', () => {
    expect(hashToken('abc')).toBe(hashToken('abc'))
    expect(hashToken('abc')).not.toBe(hashToken('abd'))
    expect(hashToken('abc')).toMatch(/^[0-9a-f]{64}$/)
  })
})

describe('log redaction', () => {
  it('masks email addresses', () => {
    expect(maskEmail('contact jane.doe@example.org now')).toBe('contact j***@example.org now')
  })
  it('redacts credential like keys at any depth and masks addresses in values', () => {
    const out = redact({ user: 'jane@example.org', token: 'abc', nested: { api_key: 'k', Authorization: 'Bearer x', ok: 1 }, list: [{ password: 'p' }] }) as any
    expect(out.user).toBe('j***@example.org')
    expect(out.token).toBe('[redacted]')
    expect(out.nested).toEqual({ api_key: '[redacted]', Authorization: '[redacted]', ok: 1 })
    expect(out.list[0].password).toBe('[redacted]')
  })
})
