type PageHeaderProps = {
  title: string
  description?: string
  centered?: boolean
}

export default function PageHeader({ title, description, centered = false }: PageHeaderProps) {
  return (
    <div className={`pt-16 pb-12 px-6 bg-white border-b border-border-soft ${centered ? 'text-center' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.1] max-w-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 text-lg text-charcoal/65 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
