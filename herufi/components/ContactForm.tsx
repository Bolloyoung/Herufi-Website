'use client'

import { useState } from 'react'

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
  const [submitted, setSubmitted] = useState(false)

  const update = (k: keyof FormData, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-forest/10 border border-forest/20 rounded-xl p-8 text-center">
        <div className="text-3xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-charcoal mb-2">Message received</h3>
        <p className="text-charcoal/55 text-sm">
          We will review your message and get back to you. Thanks for reaching out.
        </p>
      </div>
    )
  }

  const inputClass = "w-full text-sm border border-border-soft rounded-lg px-4 py-3 bg-white text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-forest transition-colors"
  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-charcoal/50 mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border-soft rounded-xl p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Name</label>
          <input required type="text" placeholder="Your name" className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input required type="email" placeholder="your@email.com" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Organisation</label>
        <input type="text" placeholder="Organisation or fund" className={inputClass} value={form.organisation} onChange={(e) => update('organisation', e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>Type of engagement</label>
        <select className={inputClass} value={form.type} onChange={(e) => update('type', e.target.value)}>
          <option value="">Select one</option>
          <option>Commission a report</option>
          <option>Venture strategy support</option>
          <option>Data and analytics</option>
          <option>Research partnership</option>
          <option>Other</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>What do you need?</label>
        <textarea
          required
          rows={5}
          placeholder="Describe the decision you need to make, the problem you need to understand, or the project you have in mind..."
          className={`${inputClass} resize-none`}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-charcoal text-cream text-sm font-medium py-3 rounded-lg hover:bg-forest transition-colors duration-200"
      >
        Send message
      </button>

      <p className="text-xs text-charcoal/35 text-center">
        We respond to all enquiries within 2 business days.
      </p>
    </form>
  )
}
