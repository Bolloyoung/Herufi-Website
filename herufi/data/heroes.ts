/**
 * Full bleed hero artwork for each top level page. Files live in
 * public/heroes/: six approved 1:1 engraved style illustrations on the
 * Herufi blue (#02448B) with a dotted Africa map, cropped from the founder
 * supplied composite. PhotoHero anchors the square to the right edge and
 * paints the same blue behind the copy, so a replacement only needs to be
 * a square frame on that blue. `position` is kept for future non square
 * artwork and is currently unused.
 */
export type HeroImage = {
  src: string
  alt: string
  position: string
}

export const heroImages = {
  home: {
    src: '/heroes/maize-tablet.webp',
    alt: 'Illustration of a farmer in a hat crouching among crops',
    position: 'right center',
  },
  blogs: {
    src: '/heroes/field-greens.webp',
    alt: 'Illustration of a smiling farmer holding freshly picked leafy greens',
    position: 'right center',
  },
  publications: {
    src: '/heroes/shop-tablet.webp',
    alt: 'Illustration of a shopkeeper checking stock on a tablet in front of shelves',
    position: 'right center',
  },
  about: {
    src: '/heroes/team-laptop.webp',
    alt: 'Illustration of four colleagues gathered around a laptop',
    position: 'right center',
  },
  contact: {
    src: '/heroes/market-payment.webp',
    alt: 'Illustration of a market vendor handing produce to a customer',
    position: 'right center',
  },
} satisfies Record<string, HeroImage>

/** The one remaining illustration from the approved set, for a future page. */
export const spareHeroImages: HeroImage[] = [
  { src: '/heroes/tailor.webp', alt: 'Illustration of a tailor working at a sewing machine', position: 'right center' },
]
