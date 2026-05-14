import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import ToolCard from '@/components/ToolCard'
import CTASection from '@/components/CTASection'
import { dataTools } from '@/data/tools'

export const metadata: Metadata = {
  title: 'Data Lab',
  description: 'The Herufi Data Lab — dashboards, calculators, scoring tools, and market maps that turn research into interactive intelligence.',
}

const toolCategories = [...new Set(dataTools.map((t) => t.category))]

export default function DataLabPage() {
  return (
    <>
      <PageHeader
        label="Data Lab"
        title="Where research becomes tools"
        description="The Data Lab is where Herufi turns structured research into interactive intelligence — calculators, dashboards, scoring models, and market maps."
      />

      {/* Purpose statement */}
      <section className="py-12 px-6 bg-charcoal">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: '📊', title: 'Dashboards', desc: 'Visual summaries of complex data' },
            { icon: '🔢', title: 'Calculators', desc: 'Configurable decision-support tools' },
            { icon: '🗺️', title: 'Market Maps', desc: 'Geographic intelligence visualised' },
          ].map((item) => (
            <div key={item.title} className="text-cream">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-cream/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools by category */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          {toolCategories.map((cat) => {
            const catTools = dataTools.filter((t) => t.category === cat)
            return (
              <div key={cat} className="mb-14 last:mb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-5 border-b border-border-soft pb-3">
                  {cat}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catTools.map((t) => <ToolCard key={t.id} tool={t} />)}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <CTASection
        dark
        headline="Need a custom dashboard or scoring tool?"
        body="Herufi can build bespoke data tools, forecasting models, and decision dashboards for your team."
        primaryCta={{ label: 'Request a tool', href: '/contact' }}
        secondaryCta={{ label: 'Data analytics service', href: '/services' }}
      />
    </>
  )
}
