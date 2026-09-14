type SectionHeaderProps = {
  title: string
  description?: string
  centered?: boolean
  className?: string
}

export default function SectionHeader({
  title,
  description,
  centered = false,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`${centered ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'} ${className}`}>
      <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-charcoal/65 leading-relaxed">{description}</p>
      )}
    </div>
  )
}
