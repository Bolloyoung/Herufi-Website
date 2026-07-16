import type { Metadata } from 'next'
import { Suspense } from 'react'
import PageHeader from '@/components/PageHeader'
import BlogFilter from '@/components/BlogFilter'
import BlogPostCard from '@/components/BlogPostCard'
import { pillars } from '@/data/pillars'
import { blogPosts } from '@/data/blogPosts'
import { getAllArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Blogs',
  description:
    'Blog posts from Herufi covering venture strategy, African markets, climate and energy, data analytics, and culture and context.',
}

export default function BlogsPage() {
  const articles = getAllArticles()

  return (
    <>
      <PageHeader
        label="Blogs"
        title="Ideas, analysis, and field notes"
        description="Shorter reads built on the same evidence standards as our publications. Each blog links to the detailed publication behind it."
      />

      <section className="py-16 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-8">
            The African Startup Investment Trilogy
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      <Suspense>
        <BlogFilter articles={articles} pillars={pillars} />
      </Suspense>
    </>
  )
}
