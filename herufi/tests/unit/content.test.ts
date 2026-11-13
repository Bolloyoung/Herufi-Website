import { describe, expect, it } from 'vitest'
import {
  buildCampaignBody, compileMergeTags, findMergeTags, htmlToText, renderMergePreview,
  sanitizeEmailHtml, validateTemplateSyntax,
} from '@/lib/integrations/email/content'
import { ValidationError } from '@/lib/server/errors'

describe('merge tags', () => {
  it('compiles a tag with a fallback into a guarded Go template expression', () => {
    expect(compileMergeTags('Hello {{first_name|there}},')).toBe(
      'Hello {{ if .Subscriber.Attribs.first_name }}{{ .Subscriber.Attribs.first_name }}{{ else }}there{{ end }},',
    )
  })
  it('uses the subscriber name field for {{name}} and an empty fallback by default', () => {
    expect(compileMergeTags('{{name}}')).toBe('{{ if .Subscriber.Name }}{{ .Subscriber.Name }}{{ else }}{{ end }}')
  })
  it('tolerates spaces inside the braces', () => {
    expect(compileMergeTags('{{ organisation | your organisation }}')).toContain('your organisation')
  })
  it('escapes fallbacks for html, but not for plain text', () => {
    expect(compileMergeTags('{{first_name|Africa & Asia <team>}}')).toContain('Africa &amp; Asia &lt;team&gt;')
    expect(compileMergeTags('{{first_name|Africa & Asia}}', { html: false })).toContain('Africa & Asia')
  })
  it('lists the tags used', () => {
    expect(findMergeTags('Hi {{first_name|there}} at {{organisation}}').map((t) => t.field)).toEqual(['first_name', 'organisation'])
  })
  it('rejects an unknown merge tag', () => {
    expect(validateTemplateSyntax('{{email}}')[0]).toMatch(/Unknown merge tag "email"/)
    expect(() => compileMergeTags('{{nonsense}}')).toThrow(ValidationError)
  })
  it('rejects every kind of raw template action, so content cannot reach template functions', () => {
    const attacks = [
      '{{ env "LISTMONK_db__password" }}',
      '{{ .Subscriber.Email }}',
      '{{ template "content" . }}',
      '{{ range $i := until 1000000 }}x{{ end }}',
      '{{ Safe "<script>" }}',
      '{{ TrackLink "https://evil.example" }}',
      '{{first_name}} {{',
      'text }} more',
      '{{ if true }}',
    ]
    for (const a of attacks) {
      expect(validateTemplateSyntax(a).length, a).toBeGreaterThan(0)
      expect(() => compileMergeTags(a), a).toThrow(ValidationError)
    }
  })
  it('previews with sample values and falls back when a value is missing', () => {
    expect(renderMergePreview('Hi {{first_name|there}} from {{organisation|your team}}', { first_name: 'Ann' })).toBe('Hi Ann from your team')
  })
})

describe('html sanitising', () => {
  it('removes scripts, event handlers, iframes and forms', () => {
    const out = sanitizeEmailHtml('<p onclick="x()">Hi</p><script>alert(1)</script><iframe src="https://e.x"></iframe><form><input></form>')
    expect(out).toContain('Hi')
    for (const bad of ['script', 'alert', 'onclick', 'iframe', 'form', 'input']) expect(out).not.toContain(bad)
  })
  it('blocks javascript: and data: links', () => {
    expect(sanitizeEmailHtml('<a href="javascript:alert(1)">x</a>')).not.toContain('javascript')
    expect(sanitizeEmailHtml('<a href="data:text/html,<b>x</b>">x</a>')).not.toContain('data:')
  })
  it('allows https, http and mailto links, and adds safe rel and target', () => {
    const out = sanitizeEmailHtml('<a href="https://herufi.org/x">a</a><a href="mailto:hello@herufi.org">m</a>')
    expect(out).toContain('href="https://herufi.org/x"')
    expect(out).toContain('href="mailto:hello@herufi.org"')
    expect(out).toContain('rel="noopener noreferrer"')
  })
  it('only allows images served over https', () => {
    expect(sanitizeEmailHtml('<img src="https://cdn.herufi.org/a.png" alt="A">')).toContain('src="https://cdn.herufi.org/a.png"')
    expect(sanitizeEmailHtml('<img src="http://cdn.herufi.org/a.png">')).not.toContain('src=')
    expect(sanitizeEmailHtml('<img src="data:image/png;base64,AAAA">')).not.toContain('data:')
  })
  it('discards author styles and applies its own email safe styles', () => {
    const out = sanitizeEmailHtml('<p style="position:fixed;top:0;background:url(https://track.example/x)">Hi</p>')
    expect(out).not.toContain('position:fixed')
    expect(out).not.toContain('track.example')
    expect(out).toContain('font-size:16px')
  })
  it('maps h1 to the h2 style and keeps lists and quotes', () => {
    const out = sanitizeEmailHtml('<h1>T</h1><ul><li>a</li></ul><blockquote>q</blockquote>')
    expect(out).toContain('<h2')
    expect(out).not.toContain('<h1')
    expect(out).toContain('<ul')
    expect(out).toContain('<blockquote')
  })
  it('keeps merge tags in text intact for the compiler', () => {
    expect(sanitizeEmailHtml('<p>Hello {{first_name|there}},</p>')).toContain('Hello {{first_name|there}},')
  })
})

describe('plain text alternative', () => {
  it('turns links, lists and headings into readable text', () => {
    const t = htmlToText('<h2>Title</h2><p>Read <a href="https://herufi.org/r">the report</a>.</p><ul><li>One</li><li>Two</li></ul>')
    expect(t).toContain('Title')
    expect(t).toContain('Read the report (https://herufi.org/r).')
    expect(t).toContain('- One')
    expect(t).toContain('- Two')
  })
  it('decodes entities and collapses blank lines', () => {
    expect(htmlToText('<p>A &amp; B</p><p></p><p></p><p>C</p>')).toBe('A & B\n\nC')
  })
})

describe('campaign body assembly', () => {
  it('sanitises, appends the signature and compiles merge tags', () => {
    const b = buildCampaignBody({ html: '<p>Hi {{first_name|there}}</p>', signatureHtml: '<p>The Herufi team</p>' })
    expect(b.problems).toEqual([])
    expect(b.html).toContain('{{ if .Subscriber.Attribs.first_name }}')
    expect(b.html).toContain('The Herufi team')
    expect(b.text).toContain('Hi {{ if .Subscriber.Attribs.first_name }}')
    expect(b.text).toContain('The Herufi team')
  })
  it('reports problems instead of compiling content that contains an unsafe tag', () => {
    const b = buildCampaignBody({ html: '<p>{{ env "HOME" }}</p>' })
    expect(b.problems.length).toBeGreaterThan(0)
  })
  it('uses an explicit plain text override when provided', () => {
    const b = buildCampaignBody({ html: '<p>Hi</p>', textOverride: 'Custom plain text {{first_name|friend}}' })
    expect(b.text).toContain('Custom plain text')
    expect(b.text).toContain('friend')
  })
})
