'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type NewsletterProps = {
  dark?: boolean
}

export default function NewsletterSignup({ dark = false }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    const { error } = await supabase.from('newsletter_subscribers').insert({ email })
    if (error) {
      setStatus(error.code === '23505' ? 'duplicate' : 'error')
      return
    }
    setStatus('success')
    setEmail('')
  }

  return (
    <section className={`py-16 px-6 border-t ${dark ? 'bg-charcoal/5 border-border-soft' : 'bg-gray-soft border-border-soft'}`}>
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-forest mb-2">
          Newsletter
        </p>
        <h3 className="text-2xl font-semibold text-charcoal mb-2">
          New research, straight to you
        </h3>
        <p className="text-sm text-charcoal/55 mb-6">
          No noise. No daily updates. Just structured analysis when it is ready.
        </p>
        {status === 'success' ? (
          <div className="bg-forest/10 text-forest text-sm rounded px-6 py-3 font-medium">
            You are on the list. We will be in touch.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 text-sm border border-border-soft rounded px-4 py-2.5 bg-white text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-forest transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="text-sm font-medium bg-charcoal text-cream px-5 py-2.5 rounded hover:bg-forest transition-colors duration-200 whitespace-nowrap disabled:opacity-60"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
        {status === 'duplicate' && (
          <p className="text-xs text-charcoal/40 mt-3">That email is already subscribed.</p>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-600 mt-3">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  )
}
