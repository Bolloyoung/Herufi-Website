import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import ReportCard from '@/components/ReportCard'
import CTASection from '@/components/CTASection'
import { reports } from '@/data/reports'

export const metadata: Metadata = {
  title: 'Reports',
  description: 'Long-form downloadable research from Herufi — market reports, sector outlooks, investment theses, sports business reports, and framework papers.',
}

const categories = Array.from(new Set(reports.map((r) => r.category)))

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        label="Reports"
        title="Long-form downloadable research"
        description="Structured analysis designed to inform investment decisions, strategy development, and program design. Available to download."
      />

      <section className="py-16 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          {categories.map((cat) => {
            const catReports = reports.filter((r) => r.category === cat)
            return (
              <div key={cat} className="mb-14 last:mb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-5 border-b border-border-soft pb-3">
                  {cat}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catReports.map((r) => <ReportCard key={r.id} report={r} />)}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <CTASection
        headline="Looking for a specific report?"
        body="Herufi can produce bespoke research reports for investors, institutions, and strategy teams."
        primaryCta={{ label: 'Commission research', href: '/contact' }}
      />
    </>
  )
}
