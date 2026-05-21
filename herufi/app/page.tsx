import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/Hero'
import SectionHeader from '@/components/SectionHeader'
import CTASection from '@/components/CTASection'
import NewsletterSignup from '@/components/NewsletterSignup'
import PillarCard from '@/components/PillarCard'
import ResearchCard from '@/components/ResearchCard'
import FrameworkCard from '@/components/FrameworkCard'
import { pillars } from '@/data/pillars'
import { frameworks } from '@/data/frameworks'
import { getAllArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Herufi | Research and Analytics for African Markets, Ventures and Performance',
}

const whatHerufiDoes = [
  {
    title: 'Research institution',
    body: 'Structured, long shelf-life analysis built around African market realities. Hypotheses, evidence, methodology — made explicit.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    title: 'Analytics laboratory',
    body: 'Quantitative models, forecasting, causal inference, and machine learning — applied to markets, ventures, and sports performance.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    title: 'Venture intelligence',
    body: 'Investment readiness, due diligence, market entry, and fundraising intelligence — built for investors and founders who cannot afford to be wrong.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
  {
    title: 'African context first',
    body: 'Every framework, model, and finding is grounded in the structural realities of African markets — not adapted from Western assumptions after the fact.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
  },
]

export default async function HomePage() {
  const articles = getAllArticles().slice(0, 3)
  const featuredFrameworks = frameworks.filter((f) => f.status === 'Live').slice(0, 3)

  return (
    <>
      {/* Hero */}
      <Hero
        eyebrow="Research Intelligence Platform"
        headline="Structured intelligence for decision-makers."
        subtext="Herufi is a research intelligence platform producing evidence-backed analysis, original frameworks, and data-driven intelligence across African markets, ventures, climate, and sports — built for depth, not speed."
        primaryCta={{ label: 'Explore Research', href: '/research' }}
        secondaryCta={{ label: 'Work With Herufi', href: '/contact' }}
        imageSrc="https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=1200&q=80"
        imageAlt="Professional in African business context"
      />

      {/* What Herufi Does */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="The Platform"
            title="What Herufi does"
            description="A research and analytics platform built for decision-makers who need structured intelligence — not more noise."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whatHerufiDoes.map((item) => (
              <div key={item.title} className="p-6 bg-gray-soft rounded-xl border border-border-soft">
                <div className="w-10 h-10 rounded-lg bg-forest/8 flex items-center justify-center mb-4 text-forest">
                  {item.icon}
                </div>
                <h3 className="text-base font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-charcoal/55 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Pillars */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <SectionHeader
              label="Research Pillars"
              title="Six core research pillars"
              description="Structured intelligence across the domains that matter most to decision-makers in African markets."
              className="mb-0"
            />
            <Link
              href="/research"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-light transition-colors"
            >
              All research
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((pillar) => (
              <PillarCard key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Research */}
      {articles.length > 0 && (
        <section className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <SectionHeader
                label="Latest"
                title="Featured research"
                className="mb-0"
              />
              <Link
                href="/research"
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-light transition-colors"
              >
                View all
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ResearchCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Frameworks */}
      {featuredFrameworks.length > 0 && (
        <section className="py-24 px-6 bg-gray-soft">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <SectionHeader
                label="Frameworks"
                title="Original analytical frameworks"
                description="Reusable tools for structured decision-making — not just research outputs."
                className="mb-0"
              />
              <Link
                href="/frameworks"
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-light transition-colors"
              >
                All frameworks
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredFrameworks.map((fw) => (
                <FrameworkCard key={fw.id} framework={fw} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Platform Capabilities */}
      <section className="py-24 px-6 bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="The Platform"
            title="A research operating system"
            description="Herufi combines qualitative depth, quantitative rigour, and interactive intelligence into a single analytical platform."
            className="mb-12 [&_*]:text-cream [&_.label]:text-gold"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-cream/10 rounded-xl overflow-hidden">
            {[
              {
                domain: 'Research Engine',
                items: ['Hypothesis generation', 'Literature mapping', 'Thematic coding', 'Narrative analysis', 'Evidence classification'],
              },
              {
                domain: 'Analytics Engine',
                items: ['Regression & forecasting', 'Causal inference', 'Clustering & ML', 'Panel data analysis', 'Predictive modelling'],
              },
              {
                domain: 'Intelligence Output',
                items: ['Interactive dashboards', 'Reliability scoring', 'Source transparency', 'Methodology audits', 'Decision briefs'],
              },
            ].map((col) => (
              <div key={col.domain} className="bg-charcoal p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-5">{col.domain}</p>
                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-cream/60">
                      <span className="w-1 h-1 rounded-full bg-forest flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Herufi Works — linked to pillars */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="How it works"
            title="How Herufi works with you"
            description="Research, frameworks, and analytics — built for decision-makers across five domains. Each service connects to a core research pillar."
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {[
              { letter: 'A', title: 'Research & Market Intelligence', href: '/research?pillar=markets-systems', desc: 'Market reports, sector briefs, and ecosystem maps.' },
              { letter: 'B', title: 'Venture Strategy & Investment', href: '/research?pillar=venture-strategy', desc: 'Investment readiness, due diligence, and fundraising support.' },
              { letter: 'C', title: 'Impact, Climate & Development', href: '/research?pillar=climate-energy', desc: 'Climate opportunity mapping and impact program design.' },
              { letter: 'D', title: 'Data, Analytics & Decision Intelligence', href: '/analytics', desc: 'Dashboards, models, and scoring tools for sharper decisions.' },
              { letter: 'E', title: 'Sports Business Analytics', href: '/research?pillar=sports-business', desc: 'Player valuation, recruitment analytics, and academy economics.' },
            ].map((s) => (
              <a
                key={s.letter}
                href={s.href}
                className="group bg-gray-soft border border-border-soft rounded-xl p-5 hover:border-forest/30 hover:shadow-sm transition-all duration-200 block"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-forest text-cream font-bold text-sm flex items-center justify-center flex-shrink-0 group-hover:bg-forest-light transition-colors">
                    {s.letter}
                  </div>
                  <p className="text-sm font-semibold text-charcoal leading-snug group-hover:text-forest transition-colors">{s.title}</p>
                </div>
                <p className="text-xs text-charcoal/50 leading-relaxed pl-11">{s.desc}</p>
              </a>
            ))}
          </div>
          <div className="text-center">
            <a
              href="/services"
              className="inline-flex items-center gap-2 border border-charcoal/20 text-charcoal text-sm font-medium px-6 py-3 rounded hover:border-forest hover:text-forest transition-colors duration-200"
            >
              View all services
            </a>
          </div>
        </div>
      </section>

      {/* Data Lab + Sports Preview */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Data Lab */}
          <div className="bg-charcoal text-cream rounded-2xl p-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3">Data Lab</p>
            <h3 className="text-2xl font-semibold mb-3 leading-snug">
              Analytics and tools
            </h3>
            <p className="text-cream/55 text-sm leading-relaxed mb-6">
              Dashboards, calculators, scoring models, and market maps. The Data Lab is where Herufi research becomes interactive intelligence.
            </p>
            <Link
              href="/analytics#tools"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-light transition-colors"
            >
              Explore Analytics
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Sports */}
          <div className="bg-forest text-cream rounded-2xl p-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-3">Sports Business Intelligence</p>
            <h3 className="text-2xl font-semibold mb-3 leading-snug">
              The intelligence layer for modern football
            </h3>
            <p className="text-cream/55 text-sm leading-relaxed mb-6">
              Player valuation, recruitment analytics, academy economics, and commercial strategy. Built for clubs, academies, and investors — not fans.
            </p>
            <Link
              href="/analytics#sports"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-light transition-colors"
            >
              Sports research
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* About Founder Placeholder */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-forest flex-shrink-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-cream">MO</span>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-forest mb-2">Founder</p>
            <h3 className="text-2xl font-semibold text-charcoal mb-3">Michael Omega — founder, Herufi</h3>
            <p className="text-charcoal/55 leading-relaxed text-sm mb-4">
              Herufi was built to fill a gap: structured, African-context-first research and analytics for decision-makers who cannot afford to be wrong. Combining venture strategy, market research, and sports business intelligence.
            </p>
            <Link
              href="/about"
              className="text-sm font-medium text-forest hover:text-forest-light transition-colors inline-flex items-center gap-1.5"
            >
              About Herufi
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />

      {/* CTA */}
      <CTASection
        label="Get started"
        headline="Looking for research, analytics, or strategy support?"
        body="Herufi works with investors, founders, institutions, and sports organisations on research, strategy, and analytics engagements."
        primaryCta={{ label: "Let's talk", href: '/contact' }}
        secondaryCta={{ label: 'View services', href: '/services' }}
      />
    </>
  )
}
