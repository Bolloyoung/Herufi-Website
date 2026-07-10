'use client'

import Link from 'next/link'
import SplineBackdrop from '@/components/SplineBackdrop'

type SplineHeroProps = {
  /** Hue rotation (degrees) applied to the 3D scene — see SplineBackdrop. */
  hue?: number
}

export default function SplineHero({ hue = 0 }: SplineHeroProps) {
  return (
    <section className="relative mt-16 h-[calc(100svh-4rem)] min-h-[560px] bg-charcoal overflow-hidden">
      {/* 3D scene */}
      <SplineBackdrop hue={hue} />

      {/* Readability gradient — lets the scene show through on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal/80 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center pointer-events-none">
        <div className="max-w-2xl pointer-events-auto">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gold mb-6 animate-fade-in">
            Research Intelligence Platform
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-cream leading-[1.08] mb-6">
            Structured intelligence for decision-makers.
          </h1>
          <p className="text-base sm:text-lg text-cream/60 leading-relaxed max-w-xl mb-10">
            Evidence-backed research, original frameworks, and data-driven analysis
            across African markets, ventures, climate, and sports.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/our-work"
              className="inline-flex items-center gap-2 bg-cream text-charcoal text-sm font-semibold px-7 py-3.5 rounded hover:bg-gold hover:text-charcoal transition-colors duration-200"
            >
              Explore Our Work
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-cream/25 text-cream text-sm font-medium px-7 py-3.5 rounded hover:border-gold hover:text-gold transition-colors duration-200"
            >
              Work With Us
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="w-5 h-9 rounded-full border border-cream/25 flex items-start justify-center p-1.5">
          <span className="w-1 h-2 rounded-full bg-cream/50 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
