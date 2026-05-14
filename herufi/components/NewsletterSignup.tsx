'use client'

import { useState } from 'react'

type NewsletterProps = {
  dark?: boolean
}

export default function NewsletterSignup({ dark = false }: NewsletterProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setStatus('submitted')
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
        {status === 'submitted' ? (
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
              className="text-sm font-medium bg-charcoal text-cream px-5 py-2.5 rounded hover:bg-forest transition-colors duration-200 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
