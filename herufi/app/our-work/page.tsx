import type { Metadata } from 'next'
import { Suspense } from 'react'
import PageHeader from '@/components/PageHeader'
import ResearchFilter from '@/components/ResearchFilter'
import SportsAnalyticsDashboard from '@/components/SportsAnalyticsDashboard'
import { pillars } from '@/data/pillars'
import { reports } from '@/data/reports'
import { getAllArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Our Work',
  description:
    'Research publications, reports, and analytics from Herufi — structured intelligence across venture strategy, African markets, climate and energy, data analytics, and sports business.',
}

export default function OurWorkPage() {
  const articles = getAllArticles()

  return (
    <>
      <PageHeader
        label="Our Work"
        title="Research publications and analytics"
        description="Long shelf-life analysis built around African market realities. Search our publications, filter by research domain, or explore our interactive analytics."
      />

      {/* Publications — search, pillar filters, articles, reports */}
      <Suspense>
        <ResearchFilter articles={articles} pillars={pillars} reports={reports} />
      </Suspense>

      {/* Interactive analytics showcase */}
      <section id="analytics" className="py-24 px-6 bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-3">
              Interactive Analytics
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-cream mb-3">
              Where research becomes intelligence
            </h2>
            <p className="text-sm text-cream/55 leading-relaxed">
              A live example from our sports business practice — player valuation,
              academy economics, and talent market analysis, rendered as interactive
              dashboards.
            </p>
          </div>
          <SportsAnalyticsDashboard />
        </div>
      </section>
    </>
  )
}
