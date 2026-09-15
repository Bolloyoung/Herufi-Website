import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PhotoHero from '@/components/PhotoHero'
import Reveal from '@/components/Reveal'
import FeaturedPublication from '@/components/FeaturedPublication'
import SectionHeader from '@/components/SectionHeader'
import Tag from '@/components/Tag'
import NewsletterSignup from '@/components/NewsletterSignup'
import CTASection from '@/components/CTASection'
import { heroImages } from '@/data/heroes'
import { pillars } from '@/data/pillars'
import { publications } from '@/data/publications'
import { getAllArticles } from '@/lib/content'
import { formatDate } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Herufi | Research and Analytics for African Markets and Ventures',
}

const FEATURED_PUBLICATION_ID = 'filling-the-missing-middle-2026'

export default async function HomePage() {
  const featured = publications.find((p) => p.id === FEATURED_PUBLICATION_ID) ?? publications[0]
  const [lead, ...rest] = getAllArticles().slice(0, 4)

  return (
    <>
      <PhotoHero
        size="tall"
        image={heroImages.home}
        title="Structured intelligence for African markets."
        description="Research, original frameworks and analysis grounded in evidence, for investors, founders and institutions."
        primaryCta={{ label: 'Read the publications', href: '/publications' }}
        secondaryCta={{ label: 'Work with Herufi', href: '/contact' }}
      />

      {/* Featured publication */}
      <section className="px-6 pb-16 lg:pb-20 bg-cream">
        <Reveal className="relative -mt-10 lg:-mt-14 max-w-7xl mx-auto">
          <FeaturedPublication
            publication={featured}
            stat={{
              value: '$300M to $750M',
              label: "Illustrative unmet annual Series A financing demand across Africa's venture market",
            }}
          />
        </Reveal>
      </section>

      {/* Statement */}
      <section className="py-16 lg:py-20 px-6 bg-white border-y border-border-soft">
        <Reveal className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight">
              Depth over speed. Evidence over opinion. African context first.
            </h2>
            <p className="mt-5 text-base md:text-lg text-charcoal/65 leading-relaxed">
              Herufi is a research intelligence platform. Every publication states its methodology, links its sources and names its uncertainty, so that the analysis is still useful long after the news cycle has moved on.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Research pillars */}
      <section className="py-16 lg:py-20 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <SectionHeader title="Four research pillars" className="mb-10" />
          </Reveal>
          <Reveal delay={0.1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border-soft border border-border-soft">
            {pillars.map((pillar) => (
              <Link
                key={pillar.id}
                href={`/blogs?pillar=${pillar.id}`}
                className="group flex flex-col bg-white p-7 hover:bg-gray-soft transition-colors duration-150"
              >
                <h3 className="font-serif text-lg font-normal text-charcoal leading-snug mb-3">
                  {pillar.title}
                </h3>
                <p className="text-sm text-charcoal/65 leading-relaxed mb-6">{pillar.description}</p>
                <span className="mt-auto text-link group-hover:text-forest-light">
                  View blogs
                  <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
                </span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Latest blogs: one lead piece and a short list */}
      {lead && (
        <section className="py-16 lg:py-20 px-6 bg-white border-y border-border-soft">
          <div className="max-w-7xl mx-auto">
            <Reveal className="flex items-end justify-between gap-6 mb-10">
              <SectionHeader title="Latest from the blog" />
              <Link href="/blogs" className="text-link whitespace-nowrap">
                All blogs
                <ArrowRight size={14} strokeWidth={1.5} aria-hidden />
              </Link>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <Reveal delay={0.1} className="lg:col-span-7">
                <Link href={`/blogs/${lead.slug}`} className="group block">
                  <Tag label={lead.pillar} variant="green" />
                  <h3 className="mt-3 font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight group-hover:underline underline-offset-4 decoration-charcoal/40">
                    {lead.title}
                  </h3>
                  <p className="mt-4 text-base text-charcoal/65 leading-relaxed max-w-2xl">{lead.summary}</p>
                  <p className="mt-4 text-sm text-charcoal/55">
                    {lead.author}, {formatDate(lead.date)}. {lead.readingTime}
                  </p>
                </Link>
              </Reveal>

              <Reveal delay={0.2} className="lg:col-span-5 divide-y divide-border-soft border-t border-border-soft lg:border-t-0">
                {rest.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blogs/${article.slug}`}
                    className="group block py-5 first:lg:pt-0"
                  >
                    <Tag label={article.pillar} variant="green" />
                    <h3 className="mt-2 font-serif text-lg font-normal text-charcoal leading-snug group-hover:underline underline-offset-4 decoration-charcoal/40">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs text-charcoal/55">
                      {formatDate(article.date)}. {article.readingTime}
                    </p>
                  </Link>
                ))}
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <NewsletterSignup />

      <CTASection
        headline="Research, analytics or strategy support for a decision you need to get right?"
        body="Herufi works with investors, founders and institutions on commissioned research, venture strategy and analytics engagements."
        primaryCta={{ label: 'Work with Herufi', href: '/contact' }}
        secondaryCta={{ label: 'About Herufi', href: '/about' }}
      />
    </>
  )
}
