type LogoProps = {
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ variant = 'dark', size = 'md' }: LogoProps) {
  const textColor = variant === 'light' ? '#FAFAF8' : '#1C1C1E'
  const accentColor = '#1B4332'
  const goldColor = '#C9A84C'

  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.25 : 1
  const w = Math.round(120 * scale)
  const h = Math.round(32 * scale)

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 120 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Herufi"
    >
      {/* H mark — two vertical bars + crossbar */}
      <rect x="0" y="4" width="4" height="24" rx="1" fill={accentColor} />
      <rect x="12" y="4" width="4" height="24" rx="1" fill={accentColor} />
      <rect x="0" y="14" width="16" height="4" rx="1" fill={accentColor} />
      {/* Gold accent dot */}
      <circle cx="22" cy="28" r="2" fill={goldColor} />
      {/* Wordmark */}
      <text
        x="28"
        y="22"
        fontFamily="'Inter', system-ui, sans-serif"
        fontWeight="700"
        fontSize="14"
        letterSpacing="0.12em"
        fill={textColor}
        style={{ textTransform: 'uppercase' }}
      >
        HERUFI
      </text>
    </svg>
  )
}
