import type { Metadata } from 'next'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import CTASection from '@/components/CTASection'

export const metadata: Metadata = {
  title: 'Platform',
  description: 'The Herufi Research Intelligence Platform — a hybrid of research institution, analytics laboratory, venture intelligence engine, and strategic foresight system.',
}

const capabilities = [
  {
    id: '01',
    title: 'Research Orchestration',
    description: 'Every research project starts with a precise question. The platform defines hypotheses, maps variables, selects methodologies, and structures analysis before any data is collected.',
    details: ['Hypothesis generation', 'Variable mapping', 'Methodology selection', 'Research design', 'Evidence classification'],
    status: 'Live',
  },
  {
    id: '02',
    title: 'Qualitative Analysis Engine',
    description: 'NLP-powered thematic coding, narrative clustering, sentiment analysis, and contradiction detection — applied to policy documents, research papers, interviews, and reports.',
    details: ['Thematic coding', 'Narrative clustering', 'Sentiment analysis', 'Topic modelling', 'Evidence strength classification'],
    status: 'In Development',
  },
  {
    id: '03',
    title: 'Quantitative Research Engine',
    description: 'Regression, forecasting, causal inference, clustering, and machine learning — applied to African market data, sports performance data, and economic indicators.',
    details: ['Regression & econometrics', 'Forecasting (ARIMA, Prophet)', 'Causal inference', 'Clustering & ML', 'Panel data analysis'],
    status: 'In Development',
  },
  {
    id: '04',
    title: 'Reliability & Quality Layer',
    description: 'Every finding is scored for methodological reliability before publication. Confidence levels are explicit. Sources are linked. Limitations are named.',
    details: ['Reliability scoring', 'Confidence classification', 'Triangulation checks', 'Source credibility rating', 'Methodology audit trail'],
    status: 'Live',
  },
  {
    id: '05',
    title: 'Interactive Dashboards',
    description: 'Research findings are published through interactive dashboards — with filtering, drilldowns, geographic views, timeline analysis, and embedded methodology panels.',
    details: ['Dynamic filtering', 'Geographic intelligence', 'Timeline analysis', 'Embedded methodology', 'Source traceability'],
    status: 'Beta',
  },
  {
    id: '06',
    title: 'Membership & Access Control',
    description: 'Tiered access for public visitors, registered members, and admin users. Public summaries are openly available. Full dashboards, datasets, and methodology appendices are member-only.',
    details: ['Public summaries', 'Member-only dashboards', 'Dataset access control', 'Admin publishing controls', 'Email allowlist authentication'],
    status: 'Coming Soon',
  },
]

const dataSources = [
  'World Bank Open Data', 'IMF Data', 'UNData', 'IEA Energy Data',
  'Open Africa Datasets', 'Kaggle', 'GitHub Repositories',
  'StatBomb Open Data', 'FBRef', 'Transfermarkt',
  'FRED Economic Data', 'Government Open Data Portals',
  'Academic Papers & Journals', 'Policy Reports',
]

const statusColor: Record<string, string> = {
  Live: 'text-forest bg-forest/8 border-forest/20',
  Beta: 'text-gold bg-gold/10 border-gold/20',
  'In Development': 'text-charcoal/50 bg-gray-soft border-border-soft',
  'Coming Soon': 'text-charcoal/40 bg-gray-soft border-border-soft',
}

export default function PlatformPage() {
  return (
    <>
      <PageHeader
        label="Platform"
        title="A research operating system"
        description="Herufi is not a content site. It is a research intelligence platform — combining qualitative depth, quantitative rigour, and interactive intelligence into a single analytical system."
      />

      {/* Vision statement */}
      <section className="py-16 px-6 bg-charcoal">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">Platform Vision</p>
            <h2 className="text-3xl font-semibold text-cream mb-4 leading-snug">
              Depth over speed. Evidence over opinion. Reproducibility over aesthetics.
            </h2>
            <p className="text-cream/55 text-sm leading-relaxed">
              The Herufi platform prioritises analytical rigour, source transparency, and long shelf-life intelligence. Every output is reproducible, every finding is linked to evidence, and every confidence level is explicit.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Research Institution' },
              { label: 'Venture Intelligence' },
              { label: 'Analytics Laboratory' },
              { label: 'Economic Strategy Engine' },
              { label: 'Policy Research Hub' },
              { label: 'Mixed Methods System' },
              { label: 'Interactive Intelligence' },
              { label: 'Strategic Foresight' },
            ].map((item) => (
              <div key={item.label} className="border border-cream/10 rounded-lg px-3 py-2.5 text-xs text-cream/50">
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-8">Platform capabilities</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((cap) => (
              <div key={cap.id} className="border border-border-soft rounded-xl p-6 bg-gray-soft hover:border-forest/20 hover:shadow-sm transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl font-bold text-charcoal/10">{cap.id}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor[cap.status]}`}>
                    {cap.status}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-charcoal mb-2">{cap.title}</h3>
                <p className="text-sm text-charcoal/55 leading-relaxed mb-4">{cap.description}</p>
                <ul className="space-y-1.5">
                  {cap.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-xs text-charcoal/45">
                      <span className="w-1 h-1 rounded-full bg-forest flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research vs Analytics */}
      <section className="py-16 px-6 bg-cream border-y border-border-soft">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-8">How the platform is structured</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-border-soft rounded-2xl p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest mb-4">Research</p>
              <h3 className="text-xl font-semibold text-charcoal mb-3">Narrative intelligence</h3>
              <p className="text-sm text-charcoal/55 mb-5 leading-relaxed">Context, hypotheses, qualitative findings, literature reviews, strategic interpretation, and evidence-linked storytelling.</p>
              <ul className="space-y-2">
                {['Context and literature review', 'Hypothesis testing', 'Qualitative findings', 'Strategic implications', 'Evidence-linked narratives'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-charcoal/55">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/research" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-light transition-colors">
                Explore research
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
            <div className="bg-forest text-cream rounded-2xl p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-4">Analytics</p>
              <h3 className="text-xl font-semibold mb-3">Data intelligence</h3>
              <p className="text-sm text-cream/55 mb-5 leading-relaxed">Dashboards, model outputs, quantitative exploration, maps, regressions, correlations, machine learning, and predictive analysis.</p>
              <ul className="space-y-2">
                {['Interactive dashboards', 'Regression and forecasting', 'Machine learning outputs', 'Geographic analysis', 'Predictive models'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-cream/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/analytics" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-gold-light transition-colors">
                Explore analytics
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Data sources */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-2">Data infrastructure</p>
          <h2 className="text-2xl font-semibold text-charcoal mb-2">Open data. Trusted sources.</h2>
          <p className="text-sm text-charcoal/55 mb-8 max-w-xl">The platform draws on verified public datasets, open-source research repositories, and proprietary primary research — with full source attribution.</p>
          <div className="flex flex-wrap gap-2">
            {dataSources.map((src) => (
              <span key={src} className="text-xs bg-gray-soft border border-border-soft text-charcoal/60 px-3 py-1.5 rounded-full">
                {src}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Confidence classification */}
      <section className="py-16 px-6 bg-gray-soft border-y border-border-soft">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-8">Reliability framework</p>
          <h2 className="text-2xl font-semibold text-charcoal mb-6">Every finding is classified</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { level: 'High confidence', desc: 'Multiple sources, tested methodology, validated findings.', color: 'border-forest text-forest bg-forest/5' },
              { level: 'Medium confidence', desc: 'Adequate evidence, some methodological caveats noted.', color: 'border-gold text-gold bg-gold/5' },
              { level: 'Low confidence', desc: 'Limited data, preliminary findings, not for final decisions.', color: 'border-charcoal/30 text-charcoal/50 bg-gray-soft' },
              { level: 'Exploratory only', desc: 'Early signal. Hypothesis-level only. Requires further research.', color: 'border-charcoal/20 text-charcoal/40 bg-white' },
            ].map((c) => (
              <div key={c.level} className={`rounded-xl border p-5 ${c.color}`}>
                <p className="text-xs font-semibold mb-2">{c.level}</p>
                <p className="text-xs opacity-70 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        label="Get access"
        headline="Ready to work with structured intelligence?"
        body="Commission research, access analytics, or explore membership for full platform access."
        primaryCta={{ label: 'Get in touch', href: '/contact' }}
        secondaryCta={{ label: 'View services', href: '/services' }}
      />
    </>
  )
}
