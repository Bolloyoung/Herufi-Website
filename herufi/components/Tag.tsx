import clsx from 'clsx'

type TagProps = {
  label: string
  variant?: 'default' | 'green' | 'gold' | 'outline'
  size?: 'sm' | 'md'
}

/** Typographic category label. Deliberately not a pill: the site reserves
 *  filled shapes for buttons and interactive chips. */
export default function Tag({ label, variant = 'default', size = 'sm' }: TagProps) {
  return (
    <span
      className={clsx(
        'inline-block font-semibold uppercase tracking-[0.08em]',
        size === 'sm' ? 'text-[11px]' : 'text-xs',
        variant === 'green' && 'text-forest',
        variant === 'gold' && 'text-gold',
        (variant === 'default' || variant === 'outline') && 'text-charcoal/55',
      )}
    >
      {label}
    </span>
  )
}
