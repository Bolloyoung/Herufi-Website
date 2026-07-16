import Link from 'next/link'
import Tag from './Tag'
import type { ArticleFrontmatter } from '@/lib/content'

type ResearchCardProps = { article: ArticleFrontmatter; featured?: boolean }

export default function ResearchCard({ article, featured = false }: ResearchCardProps) {
  return (
    <Link
      href={`/blogs/${article.slug}`}
      className={`group block bg-white border border-border-soft rounded-xl overflow-hidden hover:border-forest/40 hover:shadow-md transition-all duration-200 ${
        featured ? 'md:flex' : ''
      }`}
    >
      {/* Color accent bar */}
      <div className="h-1 bg-forest group-hover:bg-gold transition-colors duration-300" />

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag label={article.pillar} variant="green" />
          <span className="text-xs text-charcoal/35">{article.readingTime}</span>
        </div>
        <h3 className="text-lg font-semibold text-charcoal mb-2 leading-snug group-hover:text-forest transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-charcoal/55 leading-relaxed mb-4 line-clamp-3">
          {article.summary}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-charcoal">{article.author}</p>
            <p className="text-xs text-charcoal/40">{article.date}</p>
          </div>
          <div className="flex gap-1 flex-wrap justify-end">
            {article.tags?.slice(0, 2).map((tag) => (
              <Tag key={tag} label={tag} variant="outline" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
