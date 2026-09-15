/**
 * Full bleed hero photograph for each top level page. Files live in
 * public/heroes/: six approved frames cropped from the founder supplied
 * photo set (the frames with chalkboards, whiteboards or drawn icon
 * overlays were deliberately left out).
 * `position` is the CSS object-position used when the photo is cropped to
 * the hero's aspect ratio, chosen so the subject stays clear of the copy.
 */
export type HeroImage = {
  src: string
  alt: string
  position: string
}

export const heroImages = {
  home: {
    src: '/heroes/maize-tablet.webp',
    alt: 'A farmer crouching in a maize field, reading a tablet',
    position: '65% 40%',
  },
  blogs: {
    src: '/heroes/field-greens.webp',
    alt: 'A smiling farmer holding freshly picked leafy greens in a field',
    position: '70% 30%',
  },
  publications: {
    src: '/heroes/shop-tablet.webp',
    alt: 'A shopkeeper checking stock on a tablet in front of shelves of products',
    position: '60% 40%',
  },
  about: {
    src: '/heroes/team-laptop.webp',
    alt: 'A small team working together around a laptop',
    position: '55% 40%',
  },
  contact: {
    src: '/heroes/market-payment.webp',
    alt: 'A market vendor taking a mobile payment at a vegetable stall',
    position: '70% 40%',
  },
} satisfies Record<string, HeroImage>

/** The one remaining photograph from the approved set, for a future page. */
export const spareHeroImages: HeroImage[] = [
  { src: '/heroes/tailor.webp', alt: 'A tailor at a sewing machine with a tape measure around her neck', position: '60% 40%' },
]
