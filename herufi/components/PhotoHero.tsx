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
 * Full bleed illustrated hero. The artwork (figure on the right, flat blue
 * on the left) moves slower than the page on scroll (parallax) and
 * dissolves into the cream page background along its bottom edge. Copy is
 * set straight on the artwork with a soft shadow, no boxes. All motion
 * collapses to static under prefers-reduced-motion.
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
      className={`relative overflow-hidden bg-[#02448B] ${
        size === 'tall' ? 'min-h-[78svh] lg:min-h-[82svh]' : 'min-h-[52svh] lg:min-h-[56svh]'
      } flex items-end`}
    >
      {/* Artwork: a square illustration anchored to the right edge. The section
          paints the same blue as the artwork, so the copy always sits on flat
          colour and the parallax can expose the top edge without a seam. */}
      <motion.div
        className="absolute inset-y-0 right-0 aspect-square max-w-full [mask-image:linear-gradient(to_right,transparent_0%,black_45%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_45%)]"
        style={{ y: imageY }}
        initial={reduce ? false : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease }}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-contain object-right"
        />
      </motion.div>

      {/* Light tint behind the copy (matters on narrow screens, where the
          artwork slides under it) and a dissolve into the page background
          along the bottom edge. The artwork's own left edge is feathered by
          the mask on its wrapper above. */}
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-charcoal/10 via-50% to-transparent" aria-hidden />
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
