import Link from 'next/link'

type CTASectionProps = {
  headline: string
  body: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export default function CTASection({ headline, body, primaryCta, secondaryCta }: CTASectionProps) {
  return (
    <section className="py-20 px-6 bg-forest">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-cream leading-tight mb-4">
            {headline}
          </h2>
          <p className="text-base text-cream/75 leading-relaxed max-w-2xl">{body}</p>
        </div>
        <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
          <Link href={primaryCta.href} className="btn-primary-inverse">
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link href={secondaryCta.href} className="btn-secondary-inverse">
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
