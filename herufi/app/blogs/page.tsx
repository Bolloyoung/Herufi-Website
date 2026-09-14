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
    'Blog posts from Herufi covering venture strategy, African markets, data analytics and culture and context.',
}

export default function BlogsPage() {
  const articles = getAllArticles()

  return (
    <>
      <PageHeader
        title="Ideas, analysis and field notes"
        description="Shorter reads built on the same evidence standards as our publications. Each blog links to the detailed publication behind it."
      />

      <section className="py-16 px-6 bg-cream border-b border-border-soft">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight">
              The African Startup Investment Series
            </h2>
            <p className="mt-3 text-base text-charcoal/65 leading-relaxed">
              Five explainers, each drawing on a full report in the series.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
