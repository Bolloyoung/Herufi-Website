import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Looking for research, analytics, or strategy support? Get in touch with Herufi.',
}

const engagementTypes = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-forest flex-shrink-0 mt-0.5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: 'Commission a report',
    body: 'Standalone research or market intelligence.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-forest flex-shrink-0 mt-0.5">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title: 'Venture strategy support',
    body: 'Investment readiness, due diligence, or market entry.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-forest flex-shrink-0 mt-0.5">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Data and analytics',
    body: 'Dashboards, models, and scoring tools.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-forest flex-shrink-0 mt-0.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Research partnership',
    body: 'Ongoing support for funds and institutions.',
  },
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
                  {e.icon}
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
