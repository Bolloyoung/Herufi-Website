import Tag from './Tag'
import type { Report } from '@/data/reports'

type ReportCardProps = { report: Report }

export default function ReportCard({ report }: ReportCardProps) {
  return (
    <div className="group bg-white border border-border-soft rounded-xl p-6 hover:border-forest/30 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2 mb-3">
        <Tag label={report.category} variant="green" />
        <span className="text-xs text-charcoal/35">{report.date}</span>
      </div>

      <h3 className="text-lg font-semibold text-charcoal mb-2 leading-snug group-hover:text-forest transition-colors">
        {report.title}
      </h3>
      <p className="text-sm text-charcoal/55 leading-relaxed mb-4 line-clamp-3">
        {report.summary}
      </p>

      <div className="flex gap-1.5 flex-wrap mb-5">
        {report.tags.map((tag) => (
          <Tag key={tag} label={tag} variant="outline" />
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border-soft">
        <span className="text-xs text-charcoal/40 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8M4 7l4 4 4-4M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {report.format}
        </span>
        <a
          href={report.fileUrl}
          className="text-sm font-medium text-forest hover:text-forest-light transition-colors inline-flex items-center gap-1"
        >
          Download
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  )
}
