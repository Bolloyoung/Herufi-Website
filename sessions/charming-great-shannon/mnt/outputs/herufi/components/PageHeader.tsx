import Tag from './Tag'

type PageHeaderProps = {
  label?: string
  title: string
  description?: string
  centered?: boolean
}

export default function PageHeader({ label, title, description, centered = false }: PageHeaderProps) {
  return (
    <div className={`pt-24 pb-14 px-6 bg-white border-b border-border-soft ${centered ? 'text-center' : ''}`}>
      <div className="max-w-4xl mx-auto">
        {label && (
          <div className="mb-4">
            <Tag label={label} variant="green" size="md" />
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-semibold text-charcoal tracking-tight leading-tight mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-charcoal/60 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
