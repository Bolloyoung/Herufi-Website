import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import FrameworkCard from '@/components/FrameworkCard'
import CTASection from '@/components/CTASection'
import { frameworks } from '@/data/frameworks'

export const metadata: Metadata = {
  title: 'Frameworks',
  description: 'Original analytical frameworks from Herufi — reusable tools for structured decision-making across ventures, markets, climate, and sports.',
}

export default function FrameworksPage() {
  const live = frameworks.filter((f) => f.status === 'Live')
  const draft = frameworks.filter((f) => f.status === 'Draft')
  const coming = frameworks.filter((f) => f.status === 'Coming Soon')

  return (
    <>
      <PageHeader
        label="Frameworks"
        title="Original analytical frameworks"
        description="Herufi does not just publish opinions. It builds reusable analytical tools — scorecards, diagnostic lenses, and decision frameworks you can apply to real problems."
      />

      {/* Live */}
      {live.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-forest inline-block" />
              Live frameworks
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {live.map((f) => <FrameworkCard key={f.id} framework={f} />)}
            </div>
          </div>
        </section>
      )}

      {/* Draft */}
      {draft.length > 0 && (
        <section className="py-16 px-6 bg-gray-soft border-y border-border-soft">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold inline-block" />
              In development
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draft.map((f) => <FrameworkCard key={f.id} framework={f} />)}
            </div>
          </div>
        </section>
      )}

      {/* Coming Soon */}
      {coming.length > 0 && (
        <section className="py-16 px-6 bg-cream">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-charcoal/30 inline-block" />
              Coming soon
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coming.map((f) => <FrameworkCard key={f.id} framework={f} />)}
            </div>
          </div>
        </section>
      )}

      <CTASection
        headline="Need a custom analytical framework?"
        body="Herufi can build bespoke diagnostic tools and decision frameworks for your organisation."
        primaryCta={{ label: 'Get in touch', href: '/contact' }}
        secondaryCta={{ label: 'View services', href: '/services' }}
      />
    </>
  )
}
