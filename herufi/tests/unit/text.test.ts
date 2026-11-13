import { describe, expect, it } from 'vitest'
import { cleanText, cleanNotes, isValidEmail, normaliseEmail, parseTags, slugify } from '@/lib/domain/text'

describe('email validation', () => {
  it.each([
    'a@example.org', 'first.last@sub.example.co.ke', 'o\'brien@example.org', 'x+tag@example.org', 'a_b@example-domain.org',
  ])('accepts %s', (e) => expect(isValidEmail(e)).toBe(true))

  it.each([
    '', 'plain', '@example.org', 'a@', 'a@b', 'a@@b.org', 'a b@example.org', '.a@example.org', 'a.@example.org',
    'a..b@example.org', 'a@-example.org', 'a@example-.org', 'a@example.c', 'a@example.123', 'a@exa mple.org',
    `${'x'.repeat(65)}@example.org`,
  ])('rejects %j', (e) => expect(isValidEmail(e)).toBe(false))

  it('normalises case, whitespace, mailto and brackets', () => {
    expect(normaliseEmail('  Jane.Doe@Example.ORG ')).toBe('jane.doe@example.org')
    expect(normaliseEmail('mailto:Jane@example.org')).toBe('jane@example.org')
    expect(normaliseEmail('<jane@example.org>')).toBe('jane@example.org')
    expect(normaliseEmail('jane@exam\u200Bple.org')).toBe('jane@example.org')
    expect(normaliseEmail(null)).toBe('')
  })
})

describe('text hygiene', () => {
  it('removes angle brackets so markup cannot reach a template', () => {
    expect(cleanText('<script>alert(1)</script>Ann')).toBe('scriptalert(1)/scriptAnn')
    expect(cleanText('Ann <b>Bold</b>')).toBe('Ann bBold/b')
  })
  it('strips control and zero width characters and collapses whitespace', () => {
    expect(cleanText('A\u0000n\u200Bn\n  Lee\t')).toBe('A nn Lee')
  })
  it('returns null for empty and truncates long values', () => {
    expect(cleanText('   ')).toBeNull()
    expect(cleanText(null)).toBeNull()
    expect(cleanText('x'.repeat(500), 10)).toBe('xxxxxxxxxx')
  })
  it('keeps notes private data but still strips brackets', () => {
    expect(cleanNotes('Met at  summit <3')).toBe('Met at summit 3')
  })
  it('parses and dedupes tags case insensitively', () => {
    expect(parseTags('Foundation, DFI, foundation ,  ,NGO')).toEqual(['Foundation', 'DFI', 'NGO'])
    expect(parseTags('a;b;c', ';')).toEqual(['a', 'b', 'c'])
    expect(parseTags(Array.from({ length: 40 }, (_, i) => `t${i}`).join(',')).length).toBe(20)
  })
  it('slugifies', () => {
    expect(slugify('Development Finance Institutions')).toBe('development-finance-institutions')
    expect(slugify('  Fondations & Philanthropie! ')).toBe('fondations-philanthropie')
  })
})
