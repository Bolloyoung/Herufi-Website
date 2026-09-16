/**
 * Hero artwork for each top level page. Files live in public/heroes/: six
 * approved engraved style figures cut out of the founder supplied composite
 * (brand green dot grid background removed), each on a transparent
 * 1000x1000 canvas, bottom centred. PhotoHero paints the dot grid in CSS
 * (`.hero-pattern` in globals.css) and stands the figure on the section's
 * bottom right, so a replacement only needs to be a transparent square with
 * the figure at the bottom. `position` is kept for future artwork and is
 * currently unused.
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
