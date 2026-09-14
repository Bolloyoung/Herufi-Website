import { FileText } from 'lucide-react'

type EmptyStateProps = {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 border border-dashed border-charcoal/20 rounded-lg">
      <FileText size={22} strokeWidth={1.5} className="mx-auto mb-4 text-charcoal/40" aria-hidden />
      <h3 className="text-base font-semibold text-charcoal mb-1">{title}</h3>
      {description && <p className="text-sm text-charcoal/60 max-w-xs mx-auto">{description}</p>}
    </div>
  )
}
