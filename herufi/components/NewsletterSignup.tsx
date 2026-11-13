'use client'

import { useEffect, useState } from 'react'
import { CONSENT_WORDING } from '@/lib/domain/consent-wording'
import { supabase } from '@/lib/supabase'

type Audience = { slug: string; name: string; description: string | null }
type Status = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot: real visitors never see or fill this
  const [audiences, setAudiences] = useState<Audience[] | null>(null)
  const [chosen, setChosen] = useState<string[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [platform, setPlatform] = useState<'unknown' | 'ready' | 'legacy'>('unknown')

  useEffect(() => {
    let cancelled = false
    fetch('/api/subscribe/audiences')
      .then(async (res) => {
        if (cancelled) return
        if (!res.ok) { setPlatform('legacy'); return }
        const body = await res.json()
        const list: Audience[] = body?.data?.audiences ?? []
        if (!list.length) { setPlatform('legacy'); return }
        setAudiences(list)
        setChosen(list.map((a) => a.slug))
        setPlatform('ready')
      })
      .catch(() => { if (!cancelled) setPlatform('legacy') })
    return () => { cancelled = true }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    try {
      if (platform === 'legacy') {
        // The email platform is not set up on this deployment yet, so keep the original behaviour.
        const { error: dbError } = await supabase.from('newsletter_subscribers').insert({ email })
        if (dbError && dbError.code !== '23505') throw new Error('save')
        setStatus('success')
        setEmail('')
        return
      }
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, audiences: chosen, website }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setError(res.status === 429 ? 'Too many attempts. Please try again later.' : (body?.error?.message ?? 'Something went wrong. Please try again.'))
        setStatus('error')
        return
      }
      setStatus('success')
      setEmail('')
    } catch {
      setError('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const toggle = (slug: string) => setChosen((c) => (c.includes(slug) ? c.filter((s) => s !== slug) : [...c, slug]))
  const doubleOptIn = platform === 'ready'

  return (
    <section className="py-14 px-6 bg-white border-t border-border-soft">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
        <div className="lg:col-span-6">
          <h2 className="font-serif text-2xl font-normal text-charcoal mb-2">New research, when it is ready</h2>
          <p className="text-sm text-charcoal/65">No daily updates. One email when a new publication or blog is out.</p>
        </div>
        <div className="lg:col-span-6">
          {status === 'success' ? (
            <p className="text-sm font-medium text-forest" role="status">
              {doubleOptIn
                ? 'Check your inbox. We sent a link to confirm your subscription.'
                : 'You are on the list. We will be in touch when the next piece is published.'}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="lg:max-w-md lg:ml-auto">
              {doubleOptIn && audiences && audiences.length > 1 && (
                <fieldset className="mb-4">
                  <legend className="field-label">Topics</legend>
                  <div className="space-y-2">
                    {audiences.map((a) => (
                      <label key={a.slug} className="flex items-start gap-2.5 text-sm text-charcoal">
                        <input type="checkbox" checked={chosen.includes(a.slug)} onChange={() => toggle(a.slug)} className="mt-0.5 h-4 w-4 rounded border-charcoal/30 text-forest focus:ring-forest" />
                        <span>{a.name}{a.description ? <span className="block text-xs text-charcoal/55">{a.description}</span> : null}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input id="newsletter-email" type="email" required autoComplete="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="field flex-1" />
                <button type="submit" disabled={status === 'loading' || (doubleOptIn && chosen.length === 0)} className="btn-primary whitespace-nowrap">
                  {status === 'loading' ? 'Subscribing' : 'Subscribe'}
                </button>
              </div>
              {/* Honeypot, hidden from people and from assistive technology. */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                <label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
              </div>
              {doubleOptIn && <p className="text-xs text-charcoal/60 mt-3">{CONSENT_WORDING} We will email a link to confirm.</p>}
              {status === 'error' && <p className="text-xs text-red-700 mt-2" role="alert">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
