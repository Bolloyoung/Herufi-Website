type EmptyStateProps = {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-12 h-12 rounded-full bg-gray-soft flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📄</span>
      </div>
      <h3 className="text-lg font-semibold text-charcoal mb-2">{title}</h3>
      {description && <p className="text-charcoal/50 max-w-xs mx-auto">{description}</p>}
    </div>
  )
}
