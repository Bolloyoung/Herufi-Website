import { createHash } from 'node:crypto'
import { beforeAll, describe, expect, it } from 'vitest'
import {
  WRAPPER_TEMPLATE_HTML, WRAPPER_TEMPLATE_NAME, buildCampaignInput, contactToAttribs, displayNameFor, unsubscribeUrl, withPreheader,
} from '@/lib/integrations/listmonk/mapper'
import { verifyUnsubscribeToken } from '@/lib/server/tokens'
import { cleanDisplayName, cleanHeaderText } from '@/lib/domain/text'

const ID = '3f2b1c9e-5a7d-4e1b-9c3d-0a1b2c3d4e5f'
beforeAll(() => { process.env.EMAIL_TOKEN_SECRET = 'z'.repeat(48) })

const contact = {
  id: ID, email: 'ann.lee@example.org', first_name: 'Ann', last_name: 'Lee', organisation: 'Acme', job_title: null,
  country: 'Kenya', organisation_type: 'DFI', category: null, tags: ['dfi'], consent_given_at: '2026-01-02T00:00:00Z',
}

describe('subscriber mapping', () => {
  it('builds a display name from the name, else from the email address', () => {
    expect(displayNameFor(contact)).toBe('Ann Lee')
    expect(displayNameFor({ ...contact, first_name: null, last_name: null })).toBe('ann lee')
    expect(displayNameFor({ ...contact, first_name: null, last_name: null, email: '+@x.org' })).toBe('Subscriber')
  })
  it('sends every attribute, using empty strings so cleared fields are cleared in Listmonk', () => {
    const a = contactToAttribs(contact, 'https://herufi.org')
    expect(a).toMatchObject({ herufi_contact_id: ID, first_name: 'Ann', job_title: '', category: '', organisation: 'Acme', tags: ['dfi'] })
  })
  it('never sends internal notes or status fields to Listmonk', () => {
    const a = contactToAttribs({ ...contact, notes: 'private' } as never, 'https://herufi.org')
    expect(JSON.stringify(a)).not.toContain('private')
    expect(Object.keys(a)).not.toContain('notes')
  })
  it('includes a signed Herufi unsubscribe link that verifies back to the contact', () => {
    const url = new URL(unsubscribeUrl(ID, 'https://herufi.org/'))
    expect(url.origin + url.pathname).toBe('https://herufi.org/unsubscribe')
    expect(verifyUnsubscribeToken(url.searchParams.get('t')!)).toBe(ID)
  })
})

describe('campaign input', () => {
  const base = {
    name: 'Q4 update', subject: 'Hello {{first_name|there}}', fromName: 'Herufi Research', fromEmail: 'Hello@Herufi.org',
    replyTo: 'Hello@Herufi.org', listIds: [3], bodyHtml: '<p>Body</p>', bodyText: 'Body', templateId: 5,
  }
  it('formats From as "Name <address>", lower cases addresses and sets Reply-To as a header', () => {
    const i = buildCampaignInput(base)
    expect(i.from_email).toBe('Herufi Research <hello@herufi.org>')
    expect(i.headers).toEqual([{ 'Reply-To': 'hello@herufi.org' }])
    expect(i).toMatchObject({ type: 'regular', content_type: 'html', messenger: 'email', lists: [3], template_id: 5 })
  })
  it('compiles merge tags in the subject, with a plain text fallback', () => {
    expect(buildCampaignInput(base).subject).toBe('Hello {{ if .Subscriber.Attribs.first_name }}{{ .Subscriber.Attribs.first_name }}{{ else }}there{{ end }}')
  })
  it('refuses a subject that tries to use a template action', () => {
    expect(() => buildCampaignInput({ ...base, subject: '{{ env "HOME" }}' })).toThrow()
  })
  it('cannot be used to inject headers through the subject, name or sender name', () => {
    const i = buildCampaignInput({ ...base, subject: 'Hi\r\nBcc: attacker@evil.example', name: 'x\nBcc: y', fromName: 'Evil\r\nBcc: z <a@b.c>' })
    expect(i.subject).not.toMatch(/[\r\n]/)
    expect(i.name).not.toMatch(/[\r\n]/)
    expect(i.from_email).not.toMatch(/[\r\n]/)
    expect(i.from_email.match(/</g)?.length).toBe(1)
  })
  it('omits Reply-To when none is set and formats send_at as UTC without milliseconds', () => {
    const i = buildCampaignInput({ ...base, replyTo: null, sendAt: new Date('2026-12-01T08:30:15.123Z') })
    expect(i.headers).toEqual([])
    expect(i.send_at).toBe('2026-12-01T08:30:15Z')
  })
  it('adds an escaped hidden preheader, or nothing when there is no preview text', () => {
    expect(withPreheader('<p>x</p>', '  <b>Preview</b> & more ')).toContain('&lt;b&gt;Preview&lt;/b&gt; &amp; more')
    expect(withPreheader('<p>x</p>', '')).toBe('<p>x</p>')
    expect(buildCampaignInput({ ...base, previewText: 'Short summary' }).body.startsWith('<div style="display:none')).toBe(true)
  })
})

describe('header text helpers', () => {
  it('removes control characters and line breaks', () => {
    expect(cleanHeaderText('a\r\nb\u0000c\u2028d')).toBe('a b c d')
  })
  it('strips quote, bracket and separator characters from a display name', () => {
    expect(cleanDisplayName('Jane "J" <x>, Doe; Co')).toBe('Jane J x Doe Co')
  })
})

describe('wrapper template', () => {
  it('is named after a hash of its content, so a changed template is never mistaken for the old one', () => {
    expect(WRAPPER_TEMPLATE_NAME).toMatch(/^Herufi campaign wrapper [0-9a-f]{8}$/)
    const again = createHash('sha256').update(WRAPPER_TEMPLATE_HTML).digest('hex').slice(0, 8)
    expect(WRAPPER_TEMPLATE_NAME.endsWith(again)).toBe(true)
  })
  it('contains the content placeholder exactly once, as Listmonk requires', () => {
    expect(WRAPPER_TEMPLATE_HTML.match(/\{\{ template "content" \. \}\}/g)).toHaveLength(1)
  })
  it('links to the Herufi unsubscribe page with the campaign, falling back to Listmonk', () => {
    expect(WRAPPER_TEMPLATE_HTML).toContain('.Subscriber.Attribs.unsubscribe_url')
    expect(WRAPPER_TEMPLATE_HTML).toContain('&c={{ .Campaign.UUID }}')
    expect(WRAPPER_TEMPLATE_HTML).toContain('{{ UnsubscribeURL }}')
  })
  it('never prints the campaign subject, which Listmonk exposes as raw template source', () => {
    expect(WRAPPER_TEMPLATE_HTML).not.toContain('.Campaign.Subject')
  })
  it('follows the house copy style: no dashes in visible text', () => {
    const visible = WRAPPER_TEMPLATE_HTML.replace(/<[^>]+>/g, ' ').replace(/\{\{[^}]*\}\}/g, ' ')
    expect(visible).not.toMatch(/[–—]/)
  })
})
