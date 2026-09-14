'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function NewsletterSignup() {
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
    <section className="py-14 px-6 bg-white border-t border-border-soft">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-center">
        <div className="lg:col-span-6">
          <h2 className="font-serif text-2xl font-normal text-charcoal mb-2">
            New research, when it is ready
          </h2>
          <p className="text-sm text-charcoal/65">
            No daily updates. One email when a new publication or blog is out.
          </p>
        </div>
        <div className="lg:col-span-6">
          {status === 'success' ? (
            <p className="text-sm font-medium text-forest" role="status">
              You are on the list. We will be in touch when the next piece is published.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 lg:max-w-md lg:ml-auto">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field flex-1"
              />
              <button type="submit" disabled={status === 'loading'} className="btn-primary whitespace-nowrap">
                {status === 'loading' ? 'Subscribing' : 'Subscribe'}
              </button>
            </form>
          )}
          {status === 'duplicate' && (
            <p className="text-xs text-charcoal/60 mt-2 lg:text-right" role="status">That email is already subscribed.</p>
          )}
          {status === 'error' && (
            <p className="text-xs text-red-700 mt-2 lg:text-right" role="alert">Something went wrong. Please try again.</p>
          )}
        </div>
      </div>
    </section>
  )
}
