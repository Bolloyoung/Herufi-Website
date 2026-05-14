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
    title: 'Not a news site',
    body: 'Herufi does not react to daily headlines. It produces structured research and long shelf-life analysis that holds up over time.',
    icon: '📋',
  },
  {
    title: 'Original frameworks',
    body: 'Herufi builds reusable analytical tools — scorecards, diagnostic lenses, and decision frameworks — not just opinions.',
    icon: '🔬',
  },
  {
    title: 'Data-backed insight',
    body: 'Every piece of analysis is grounded in evidence. Where data is limited, methodology is made explicit.',
    icon: '📊',
  },
  {
    title: 'African context first',
    body: 'Research is built around the structural realities of African markets — not adapted from Western frameworks after the fact.',
    icon: '🌍',
  },
]

export default async function HomePage() {
  const articles = getAllArticles().slice(0, 3)
  const featuredFrameworks = frameworks.filter((f) => f.status === 'Live').slice(0, 3)

  return (
    <>
      {/* Hero */}
      <Hero
        eyebrow="Research & Analytics"
        headline="Research and analytics for markets, ventures, systems, and performance."
        subtext="Herufi produces structured research, original frameworks, and data-backed insights for decision-makers working across African markets, venture strategy, impact, and sports business."
        primaryCta={{ label: 'Read Research', href: '/research' }}
        secondaryCta={{ label: 'Work With Herufi', href: '/contact' }}
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
                <div className="text-3xl mb-4">{item.icon}</div>
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
              label="Research"
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

      {/* Services Preview */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Services"
            title="How Herufi works with you"
            description="Herufi takes on research, strategy, and analytics engagements for investors, founders, institutions, and sports organisations."
            centered
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {[
              { letter: 'A', title: 'Research & Market Intelligence' },
              { letter: 'B', title: 'Venture Strategy & Investment Analysis' },
              { letter: 'C', title: 'Impact, Climate & Development Strategy' },
              { letter: 'D', title: 'Data, Analytics & Decision Intelligence' },
              { letter: 'E', title: 'Sports Business Analytics' },
            ].map((s) => (
              <div
                key={s.letter}
                className="bg-gray-soft border border-border-soft rounded-xl p-5 text-center"
              >
                <div className="w-8 h-8 rounded-lg bg-forest text-cream font-bold text-sm flex items-center justify-center mx-auto mb-3">
                  {s.letter}
                </div>
                <p className="text-sm font-medium text-charcoal leading-snug">{s.title}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-charcoal/20 text-charcoal text-sm font-medium px-6 py-3 rounded hover:border-forest hover:text-forest transition-colors duration-200"
            >
              View all services
            </Link>
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
              Turning research into tools
            </h3>
            <p className="text-cream/55 text-sm leading-relaxed mb-6">
              Dashboards, calculators, scoring models, and market maps. The Data Lab is where Herufi research becomes interactive intelligence.
            </p>
            <Link
              href="/data-lab"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-light transition-colors"
            >
              Explore the Data Lab
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
              href="/research?pillar=sports-business"
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
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gray-soft border-2 border-border-soft flex-shrink-0 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-forest mb-2">Founder</p>
            <h3 className="text-2xl font-semibold text-charcoal mb-3">Built by someone who thinks in frameworks</h3>
            <p className="text-charcoal/55 leading-relaxed text-sm mb-4">
              Herufi was built to fill a gap: structured, African-context-first research for decision-makers who need intelligence, not noise. More detail coming soon.
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
