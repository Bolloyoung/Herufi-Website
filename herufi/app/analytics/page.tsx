import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import CTASection from '@/components/CTASection'
import SportsAnalyticsDashboard from '@/components/SportsAnalyticsDashboard'
import { frameworks } from '@/data/frameworks'
import { dataTools } from '@/data/tools'

export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Herufi Analytics — original frameworks, interactive tools, and data-driven intelligence for ventures, markets, and sports.',
}

const modelPillars = [
  {
    title: 'Structured Frameworks',
    description: 'Scorecards and diagnostic lenses built for African market realities — not adapted from elsewhere.',
    stat: '10+',
    statLabel: 'frameworks',
    color: 'bg-forest text-cream',
    accentColor: 'text-gold',
  },
  {
    title: 'Predictive Modelling',
    description: 'Forecasting models, scenario analysis, and risk scoring built from first-principles data.',
    stat: '6',
    statLabel: 'model types',
    color: 'bg-charcoal text-cream',
    accentColor: 'text-gold',
  },
  {
    title: 'Interactive Tools',
    description: 'Live calculators and dashboards that turn research into configurable, decision-ready intelligence.',
    stat: '6',
    statLabel: 'tools in lab',
    color: 'bg-gold text-charcoal',
    accentColor: 'text-forest',
  },
]

const statusDot: Record<string, string> = {
  Live: 'bg-forest',
  Draft: 'bg-gold',
  'Coming Soon': 'bg-charcoal/30',
}
const statusText: Record<string, string> = {
  Live: 'text-forest',
  Draft: 'text-gold',
  'Coming Soon': 'text-charcoal/40',
}
const toolStatusDot: Record<string, string> = {
  Live: 'bg-forest',
  Beta: 'bg-gold',
  'Coming Soon': 'bg-charcoal/30',
}

export default function AnalyticsPage() {
  const liveFrameworks = frameworks.filter((f) => f.status === 'Live')
  const otherFrameworks = frameworks.filter((f) => f.status !== 'Live')

  return (
    <>
      <PageHeader
        label="Analytics"
        title="From data to structured decisions"
        description="Herufi Analytics combines original frameworks, predictive models, and interactive tools to turn data into intelligence decision-makers can act on."
      />

      {/* Three-pillar overview */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {modelPillars.map((p) => (
              <div key={p.title} className={`rounded-2xl p-7 ${p.color}`}>
                <div className={`text-4xl font-bold mb-1 ${p.accentColor}`}>{p.stat}</div>
                <div className={`text-xs uppercase tracking-widest mb-3 opacity-60`}>{p.statLabel}</div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-sm opacity-65 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How the model works — infographic strip */}
      <section className="py-16 px-6 bg-cream border-y border-border-soft">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/40 mb-10 text-center">How Herufi analytics works</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 relative">
            {[
              { n: '01', title: 'Define the decision', body: 'Every analysis starts with a precise question — not a vague brief.' },
              { n: '02', title: 'Collect and structure data', body: 'Primary research, market data, and proprietary datasets are combined and cleaned.' },
              { n: '03', title: 'Apply a framework', body: 'A scored, weighted analytical model is run against the structured data.' },
              { n: '04', title: 'Produce intelligence', body: 'Output is a decision-ready deliverable — a brief, dashboard, or score.' },
            ].map((step, i) => (
              <div key={step.n} className="relative px-5 py-6 text-center">
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 right-0 w-full h-px bg-border-soft translate-x-1/2 pointer-events-none" />
                )}
                <div className="w-10 h-10 rounded-full bg-forest text-cream text-sm font-bold flex items-center justify-center mx-auto mb-3">
                  {step.n}
                </div>
                <h4 className="text-sm font-semibold text-charcoal mb-1.5">{step.title}</h4>
                <p className="text-xs text-charcoal/50 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks — live */}
      <section id="frameworks" className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-forest mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest inline-block" />
                Live frameworks
              </p>
              <h2 className="text-2xl font-semibold text-charcoal">Analytical frameworks</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {liveFrameworks.map((f) => (
              <div key={f.id} className="bg-gray-soft border border-border-soft rounded-xl p-6 hover:border-forest/30 hover:shadow-sm transition-all duration-200 group">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium flex items-center gap-1.5 ${statusText[f.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot[f.status]}`} />
                    {f.status}
                  </span>
                  <span className="text-xs text-charcoal/30">{f.pillar}</span>
                </div>
                <h3 className="text-base font-semibold text-charcoal mb-2 group-hover:text-forest transition-colors">{f.title}</h3>
                <p className="text-sm text-charcoal/55 mb-3 leading-relaxed line-clamp-2">{f.problem}</p>
                <div className="pt-3 border-t border-border-soft">
                  <p className="text-xs text-charcoal/40 font-medium mb-1.5">Output</p>
                  <p className="text-xs text-charcoal/60 leading-relaxed">{f.exampleOutput}</p>
                </div>
              </div>
            ))}
          </div>

          {otherFrameworks.length > 0 && (
            <div className="mt-8 border-t border-border-soft pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold inline-block" />
                In development
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherFrameworks.map((f) => (
                  <div key={f.id} className="border border-border-soft rounded-xl p-5 opacity-70">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium flex items-center gap-1.5 ${statusText[f.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[f.status]}`} />
                        {f.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-charcoal mb-1">{f.title}</h3>
                    <p className="text-xs text-charcoal/50 leading-relaxed line-clamp-2">{f.problem}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sports Analytics Dashboard */}
      <section id="sports" className="py-16 px-6 bg-forest">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-2">Sports Business Intelligence</p>
            <h2 className="text-2xl font-semibold text-cream mb-2">Interactive sports analytics</h2>
            <p className="text-sm text-cream/60 max-w-xl">
              Live data tools for football clubs, academies, and investors. Explore player valuations, academy pipeline economics, and talent market intelligence.
            </p>
          </div>
          <SportsAnalyticsDashboard />
        </div>
      </section>

      {/* Data Lab Tools */}
      <section id="tools" className="py-16 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/40 mb-2">Data Lab</p>
            <h2 className="text-2xl font-semibold text-charcoal mb-2">Interactive tools</h2>
            <p className="text-sm text-charcoal/55 max-w-xl">Calculators, scoring models, and market maps — research turned into configurable, interactive intelligence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dataTools.map((tool) => (
              <div key={tool.id} className="bg-white border border-border-soft rounded-xl p-6 hover:border-forest/30 hover:shadow-sm transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-medium flex items-center gap-1.5 ${tool.status === 'Live' ? 'text-forest' : tool.status === 'Beta' ? 'text-gold' : 'text-charcoal/40'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${toolStatusDot[tool.status]}`} />
                    {tool.status}
                  </span>
                  <span className="text-xs text-charcoal/30">{tool.category}</span>
                </div>
                <h3 className="text-base font-semibold text-charcoal mb-2">{tool.title}</h3>
                <p className="text-sm text-charcoal/55 leading-relaxed mb-4">{tool.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tool.users.slice(0, 3).map((u) => (
                    <span key={u} className="text-xs bg-gray-soft text-charcoal/50 px-2 py-0.5 rounded-full">{u}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        dark
        headline="Need bespoke analysis or a custom tool?"
        body="Herufi builds custom frameworks, dashboards, and scoring models for investors, founders, and sports organisations."
        primaryCta={{ label: 'Request a tool', href: '/contact' }}
        secondaryCta={{ label: 'View services', href: '/services' }}
      />
    </>
  )
}
