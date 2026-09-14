'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

type FormData = {
  name: string
  email: string
  organisation: string
  type: string
  message: string
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', organisation: '', type: '', message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const update = (k: keyof FormData, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white border border-border-soft rounded-lg p-10" role="status">
        <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center mb-5">
          <Check size={18} strokeWidth={2} aria-hidden />
        </div>
        <h3 className="text-xl font-semibold text-charcoal mb-2">Message received</h3>
        <p className="text-charcoal/65 text-sm leading-relaxed max-w-prose">
          Thank you. We will review your message and reply within two business days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border-soft rounded-lg p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contact-name" className="field-label">Name</label>
          <input id="contact-name" name="name" required type="text" autoComplete="name" className="field" value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">Email</label>
          <input id="contact-email" name="email" required type="email" autoComplete="email" className="field" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-organisation" className="field-label">Organisation <span className="font-normal text-charcoal/50">(optional)</span></label>
        <input id="contact-organisation" name="organisation" type="text" autoComplete="organization" className="field" value={form.organisation} onChange={(e) => update('organisation', e.target.value)} />
      </div>

      <div>
        <label htmlFor="contact-type" className="field-label">Type of engagement</label>
        <select id="contact-type" name="type" className="field" value={form.type} onChange={(e) => update('type', e.target.value)}>
          <option value="">Select one</option>
          <option>Commission a report</option>
          <option>Venture strategy support</option>
          <option>Data and analytics</option>
          <option>Research partnership</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="field-label">What do you need?</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          className="field resize-y"
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
        />
        <p className="mt-1.5 text-xs text-charcoal/55">
          The decision you need to make, the problem you need to understand, or the project you have in mind.
        </p>
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-700" role="alert">
          Something went wrong sending your message. Please try again or email{' '}
          <a href="mailto:hello@herufi.org" className="underline">hello@herufi.org</a> directly.
        </p>
      )}

      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full sm:w-auto">
        {status === 'loading' ? 'Sending' : 'Send message'}
      </button>
    </form>
  )
}
