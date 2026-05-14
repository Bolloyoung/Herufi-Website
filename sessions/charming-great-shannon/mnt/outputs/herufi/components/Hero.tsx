import Link from 'next/link'

type HeroProps = {
  eyebrow?: string
  headline: string
  subtext: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  centered?: boolean
}

export default function Hero({
  eyebrow,
  headline,
  subtext,
  primaryCta,
  secondaryCta,
  centered = false,
}: HeroProps) {
  return (
    <section className="relative min-h-[88vh] flex items-center bg-cream overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-forest/4 blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full bg-gold/6 blur-3xl -translate-x-1/4 translate-y-1/4" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#1C1C1E 1px, transparent 1px), linear-gradient(90deg, #1C1C1E 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className={`relative max-w-7xl mx-auto px-6 py-28 w-full ${centered ? 'text-center' : ''}`}>
        <div className={centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'}>
          {eyebrow && (
            <div className="mb-6">
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-forest border border-forest/30 bg-forest/5 px-3 py-1.5 rounded-full">
                {eyebrow}
              </span>
            </div>
          )}

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-charcoal leading-[1.08] tracking-tight mb-6">
            {headline}
          </h1>

          <p className="text-lg md:text-xl text-charcoal/55 leading-relaxed mb-10 max-w-2xl">
            {subtext}
          </p>

          {(primaryCta || secondaryCta) && (
            <div className={`flex gap-4 flex-wrap ${centered ? 'justify-center' : ''}`}>
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center gap-2 bg-charcoal text-cream text-sm font-medium px-6 py-3 rounded hover:bg-forest transition-colors duration-200"
                >
                  {primaryCta.label}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 border border-charcoal/20 text-charcoal text-sm font-medium px-6 py-3 rounded hover:border-charcoal/40 hover:bg-charcoal/5 transition-all duration-200"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
