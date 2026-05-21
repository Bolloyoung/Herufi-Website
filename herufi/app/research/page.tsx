import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import PillarCard from '@/components/PillarCard'
import ResearchFilter from '@/components/ResearchFilter'
import { pillars } from '@/data/pillars'
import { reports } from '@/data/reports'
import { getAllArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Research',
  description: 'Structured research across six pillars: venture strategy, African markets, climate and energy, data analytics, sports business intelligence, and culture and context.',
}

export default function ResearchPage() {
  const articles = getAllArticles()

  return (
    <>
      <PageHeader
        label="Research"
        title="Structured research across six pillars"
        description="Long shelf-life analysis built around African market realities. Not news. Not opinions. Structured intelligence."
      />

      {/* Pillars overview */}
      <section className="py-16 px-6 bg-white border-b border-border-soft">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-6">Research pillars — click to filter</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((p) => (
              <PillarCard key={p.id} pillar={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive search + filter + articles + reports */}
      <ResearchFilter articles={articles} pillars={pillars} reports={reports} />
    </>
  )
}
