import Tag from './Tag'

type SectionHeaderProps = {
  label?: string
  title: string
  description?: string
  centered?: boolean
  className?: string
}

export default function SectionHeader({
  label,
  title,
  description,
  centered = false,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center mx-auto max-w-2xl' : ''} ${className}`}>
      {label && (
        <div className="mb-3">
          <Tag label={label} variant="green" />
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold text-charcoal tracking-tight mb-3">
        {title}
      </h2>
      {description && (
        <p className="text-base text-charcoal/55 leading-relaxed">{description}</p>
      )}
    </div>
  )
}
