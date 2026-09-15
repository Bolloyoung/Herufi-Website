'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import type { HeroImage } from '@/data/heroes'

type Cta = { label: string; href: string }

type PhotoHeroProps = {
  image: HeroImage
  title: string
  description?: string
  primaryCta?: Cta
  secondaryCta?: Cta
  /** `tall` for the home page, `default` for section landing pages. */
  size?: 'tall' | 'default'
}

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Full bleed photographic hero. The photograph sits behind a soft scrim,
 * moves slower than the page on scroll (parallax) and dissolves into the
 * cream page background along its bottom edge. Copy is set straight on the
 * image with a soft shadow, no boxes. All motion collapses to static under
 * prefers-reduced-motion.
 */
export default function PhotoHero({
  image,
  title,
  description,
  primaryCta,
  secondaryCta,
  size = 'default',
}: PhotoHeroProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '28%'])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '12%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0.35])

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        }

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden bg-charcoal ${
        size === 'tall' ? 'min-h-[78svh] lg:min-h-[82svh]' : 'min-h-[52svh] lg:min-h-[56svh]'
      } flex items-end`}
    >
      {/* Photograph, oversized so the parallax never exposes an edge */}
      <motion.div
        className="absolute inset-x-0 -top-[10%] h-[130%]"
        style={{ y: imageY }}
        initial={reduce ? false : { opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: image.position }}
        />
      </motion.div>

      {/* Scrim: darker where the copy sits, then a dissolve into the page background */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/45 to-charcoal/15" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-charcoal/50 to-transparent" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream via-cream/60 to-transparent" aria-hidden />

      <motion.div
        className="relative w-full max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pb-24"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <div className="max-w-3xl [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
          <motion.h1
            className={`font-serif font-normal text-cream leading-[1.1] ${
              size === 'tall' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-4xl md:text-5xl'
            }`}
            {...enter(0.15)}
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              className="mt-5 text-lg text-cream/85 leading-relaxed max-w-xl"
              {...enter(0.3)}
            >
              {description}
            </motion.p>
          )}
          {(primaryCta || secondaryCta) && (
            <motion.div className="mt-8 flex flex-wrap gap-3 [text-shadow:none]" {...enter(0.45)}>
              {primaryCta && (
                <Link href={primaryCta.href} className="btn-primary-inverse">
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link href={secondaryCta.href} className="btn-secondary-inverse">
                  {secondaryCta.label}
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  )
}
