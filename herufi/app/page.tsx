import type { Metadata } from 'next'
import Link from 'next/link'
import SplineHero from '@/components/SplineHero'
import SectionHeader from '@/components/SectionHeader'
import ResearchCard from '@/components/ResearchCard'
import BlogPostCard from '@/components/BlogPostCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import CTASection from '@/components/CTASection'
import { pillars } from '@/data/pillars'
import { blogPosts } from '@/data/blogPosts'
import { getAllArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Herufi | Research and Analytics for African Markets and Ventures',
}

export default async function HomePage() {
  const articles = getAllArticles().slice(0, 3)

  return (
    <>
      {/* 3D Hero */}
      <SplineHero />

      {/* What we do */}
      <section className="py-14 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-forest mb-5">What we do</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-charcoal leading-snug mb-6">
            Herufi produces structured research and analytics grounded in evidence,
            built for decision makers working across African markets.
          </h2>
          <p className="text-charcoal/55 leading-relaxed max-w-2xl mx-auto">
            Depth over speed. Evidence over opinion. Every finding is rooted in
            African market realities: venture strategy, economies and systems,
            climate and energy, data intelligence, and culture and context.
          </p>
        </div>
      </section>

      {/* Research domains */}
      <section className="py-14 px-6 bg-cream border-t border-border-soft">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <SectionHeader
              label="Research Domains"
              title="Where we focus"
              className="mb-0"
            />
            <Link
              href="/blogs"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-light transition-colors"
            >
              All blogs
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-soft rounded-xl overflow-hidden border border-border-soft">
            {pillars.map((pillar) => (
              <Link
                key={pillar.id}
                href={`/blogs?pillar=${pillar.id}`}
                className="group bg-white p-8 hover:bg-gray-soft transition-colors duration-200"
              >
                <p className="text-xs font-semibold text-gold mb-4">{pillar.number}</p>
                <h3 className="text-base font-semibold text-charcoal mb-2 group-hover:text-forest transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-charcoal/50 leading-relaxed">{pillar.description}</p>
              </Link>
            ))}
            {/* Publications tile completes the grid */}
            <Link
              href="/publications"
              className="group bg-forest p-8 hover:bg-forest-light transition-colors duration-200"
            >
              <p className="text-xs font-semibold text-gold mb-4">+</p>
              <h3 className="text-base font-semibold text-cream mb-2">
                Publications
              </h3>
              <p className="text-sm text-cream/60 leading-relaxed">
                Detailed reports with full methodology and sources. The depth behind every blog.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest blogs */}
      <section className="py-14 px-6 bg-white border-t border-border-soft">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <SectionHeader
              label="Latest"
              title="Recent blogs"
              className="mb-0"
            />
            <Link
              href="/blogs"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-light transition-colors"
            >
              View all blogs
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.length > 0
              ? articles.map((article) => <ResearchCard key={article.slug} article={article} />)
              : blogPosts.map((post) => <BlogPostCard key={post.id} post={post} />)}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />

      {/* CTA */}
      <CTASection
        label="Get started"
        headline="Looking for research, analytics, or strategy support?"
        body="Herufi works with investors, founders, and institutions on research, strategy, and analytics engagements."
        primaryCta={{ label: "Let's talk", href: '/contact' }}
        secondaryCta={{ label: 'Read the blogs', href: '/blogs' }}
      />
    </>
  )
}
