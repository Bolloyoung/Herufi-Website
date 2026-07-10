'use client'

import dynamic from 'next/dynamic'

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-[#12241C] to-forest" />
  ),
})

type SplineBackdropProps = {
  /** Spline scene URL. Defaults to the Herufi particle-wave scene. */
  scene?: string
  /**
   * Recolors the scene by rotating its hue (degrees, 0–360).
   * e.g. 0 = original red/cyan, 120 = green/violet, 200 = blue/amber.
   * Lets each page or section carry its own accent without re-exporting
   * the scene from the Spline editor.
   */
  hue?: number
  /** Extra classes for the wrapper (positioning, opacity, etc.). */
  className?: string
}

const DEFAULT_SCENE = 'https://prod.spline.design/Cr41gNTFdE9v8ZKt/scene.splinecode'

export default function SplineBackdrop({ scene = DEFAULT_SCENE, hue = 0, className = '' }: SplineBackdropProps) {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={hue ? { filter: `hue-rotate(${hue}deg)` } : undefined}
    >
      <Spline scene={scene} />
    </div>
  )
}
