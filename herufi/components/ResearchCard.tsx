import Link from 'next/link'
import Tag from './Tag'
import type { ArticleFrontmatter } from '@/lib/content'
import { formatDate } from '@/lib/format'

type ResearchCardProps = { article: ArticleFrontmatter; featured?: boolean }

export default function ResearchCard({ article }: ResearchCardProps) {
  return (
    <Link
      href={`/blogs/${article.slug}`}
      className="group flex flex-col bg-white border border-border-soft rounded-lg p-6 hover:border-charcoal/40 transition-colors duration-150"
    >
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <Tag label={article.pillar} variant="green" />
        <span className="text-xs text-charcoal/55 whitespace-nowrap">{article.readingTime}</span>
      </div>
      <h3 className="font-serif text-lg font-normal text-charcoal leading-snug mb-3 group-hover:underline underline-offset-4 decoration-charcoal/40">
        {article.title}
      </h3>
      <p className="text-sm text-charcoal/65 leading-relaxed line-clamp-3 mb-6">
        {article.summary}
      </p>
      <p className="mt-auto text-xs text-charcoal/55">
        {article.author}, {formatDate(article.date)}
      </p>
    </Link>
  )
}
