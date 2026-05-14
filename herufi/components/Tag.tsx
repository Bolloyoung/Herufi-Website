import clsx from 'clsx'

type TagProps = {
  label: string
  variant?: 'default' | 'green' | 'gold' | 'outline'
  size?: 'sm' | 'md'
}

export default function Tag({ label, variant = 'default', size = 'sm' }: TagProps) {
  return (
    <span
      className={clsx(
        'inline-block rounded-full font-medium tracking-wide uppercase',
        size === 'sm' ? 'text-[10px] px-2.5 py-0.5' : 'text-xs px-3 py-1',
        variant === 'default' && 'bg-gray-100 text-gray-600',
        variant === 'green' && 'bg-forest/10 text-forest',
        variant === 'gold' && 'bg-gold/15 text-gold',
        variant === 'outline' && 'border border-charcoal/20 text-charcoal/60',
      )}
    >
      {label}
    </span>
  )
}
