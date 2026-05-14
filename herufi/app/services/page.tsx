import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import ServiceCard from '@/components/ServiceCard'
import CTASection from '@/components/CTASection'
import { services } from '@/data/services'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Herufi offers five service lines: research and market intelligence, venture strategy, impact and climate strategy, data analytics, and sports business analytics.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="Services"
        title="How Herufi works with clients"
        description="Herufi takes on research, strategy, and analytics engagements — producing structured intelligence that helps investors, founders, institutions, and sports organisations make better decisions."
      />

      {/* Service intro */}
      <section className="py-10 px-6 bg-white border-b border-border-soft">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-charcoal/60">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded bg-forest/10 text-forest flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
            <p><strong className="text-charcoal font-medium">Project-based engagements</strong> — one-off research reports, diagnostics, and strategy documents</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded bg-forest/10 text-forest flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
            <p><strong className="text-charcoal font-medium">Retained research partnerships</strong> — ongoing support for funds, studios, and institutions</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded bg-forest/10 text-forest flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">✓</span>
            <p><strong className="text-charcoal font-medium">Bespoke tools</strong> — custom dashboards, scoring models, and decision frameworks</p>
          </div>
        </div>
      </section>

      {/* Service cards */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      </section>

      <CTASection
        headline="Ready to start a conversation?"
        body="Tell us about your research or strategy challenge. We will respond with how Herufi can help."
        primaryCta={{ label: 'Get in touch', href: '/contact' }}
      />
    </>
  )
}
