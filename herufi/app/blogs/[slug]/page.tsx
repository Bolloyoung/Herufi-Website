import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Tag from '@/components/Tag'
import Comments from '@/components/Comments'
import { getArticleBySlug, getAllArticles } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import { publications } from '@/data/publications'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  return { title: article.title, description: article.summary }
}

export default function BlogPostPage({ params }: Props) {
  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const linkedPublication = article.publication
    ? publications.find((p) => p.id === article.publication)
    : null

  return (
    <article className="max-w-3xl mx-auto px-6 py-24">
      {/* Back */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal mb-10 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to blogs
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex gap-2 flex-wrap mb-4">
          <Tag label={article.pillar} variant="green" size="md" />
          <Tag label={article.category} variant="outline" size="md" />
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-charcoal leading-tight mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-charcoal/55 mb-6">{article.summary}</p>
        <div className="flex items-center gap-4 text-sm text-charcoal/40 border-t border-border-soft pt-4">
          <span>{article.author}</span>
          <span>·</span>
          <span>{article.date}</span>
          <span>·</span>
          <span>{article.readingTime}</span>
        </div>
      </div>

      {/* Body */}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }}
      />

      {/* Linked publication */}
      {linkedPublication && (
        <div className="mt-10 bg-forest text-cream rounded-2xl p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-2">
            Full Publication
          </p>
          <h3 className="text-lg font-semibold mb-2">{linkedPublication.title}</h3>
          <p className="text-sm text-cream/60 leading-relaxed mb-4">
            This blog draws on a detailed publication. Read the full analysis, methodology, and sources.
          </p>
          <a
            href={linkedPublication.fileUrl}
            className="inline-flex items-center gap-2 bg-cream text-charcoal text-sm font-semibold px-5 py-2.5 rounded hover:bg-gold transition-colors"
          >
            Read the publication ({linkedPublication.format})
          </a>
        </div>
      )}

      {/* Tags */}
      {article.tags?.length > 0 && (
        <div className="mt-10 pt-6 border-t border-border-soft flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Tag key={tag} label={tag} variant="outline" size="md" />
          ))}
        </div>
      )}

      {/* Comments */}
      <div className="mt-12">
        <Comments />
      </div>

      {/* Back CTA */}
      <div className="mt-12">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-forest-light transition-colors"
        >
          Back to all blogs
        </Link>
      </div>
    </article>
  )
}
