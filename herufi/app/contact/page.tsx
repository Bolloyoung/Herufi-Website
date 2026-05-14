import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Looking for research, analytics, or strategy support? Get in touch with Herufi.',
}

const engagementTypes = [
  { icon: '📄', title: 'Commission a report', body: 'One-off research or market intelligence.' },
  { icon: '🔍', title: 'Venture strategy support', body: 'Investment readiness, due diligence, or go-to-market.' },
  { icon: '📊', title: 'Data and analytics', body: 'Dashboards, models, and scoring tools.' },
  { icon: '⚽', title: 'Sports intelligence', body: 'Recruitment, valuation, and academy analytics.' },
  { icon: '🤝', title: 'Research partnership', body: 'Ongoing support for funds and institutions.' },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="Contact"
        title="Looking for research, analytics, or strategy support?"
        description="Let's talk. Tell us about the decision you need to make or the problem you need to understand."
      />

      <section className="py-16 px-6 bg-cream">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: info */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-charcoal mb-5">Ways to engage</h3>
            <div className="space-y-4">
              {engagementTypes.map((e) => (
                <div key={e.title} className="flex gap-3">
                  <span className="text-xl flex-shrink-0">{e.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{e.title}</p>
                    <p className="text-sm text-charcoal/50">{e.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-border-soft space-y-3">
              <a
                href="mailto:hello@herufi.org"
                className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
                hello@herufi.org
              </a>
              <a
                href="https://linkedin.com/company/herufi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
