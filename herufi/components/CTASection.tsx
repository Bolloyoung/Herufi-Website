import Link from 'next/link'

type CTASectionProps = {
  label?: string
  headline: string
  body: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  dark?: boolean
}

export default function CTASection({
  label,
  headline,
  body,
  primaryCta,
  secondaryCta,
  dark = false,
}: CTASectionProps) {
  return (
    <section className={`py-24 px-6 ${dark ? 'bg-charcoal' : 'bg-forest'}`}>
      <div className="max-w-3xl mx-auto text-center">
        {label && (
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-cream/40 mb-4">
            {label}
          </p>
        )}
        <h2 className="text-3xl md:text-4xl font-semibold text-cream tracking-tight mb-4">
          {headline}
        </h2>
        <p className="text-base text-cream/60 mb-10 leading-relaxed">{body}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href={primaryCta.href}
            className="inline-block bg-cream text-charcoal text-sm font-medium px-6 py-3 rounded hover:bg-gold-light transition-colors duration-200"
          >
            {primaryCta.label}
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-block border border-cream/30 text-cream text-sm font-medium px-6 py-3 rounded hover:border-cream/60 transition-colors duration-200"
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
