'use client'

import { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import type { ChartPanel } from './types'
import { ensureWorldMapRegistered } from './geoWorldMap'

export default function EChart({ panel }: { panel: ChartPanel }) {
  const [mapReady, setMapReady] = useState(!panel.needsGeoMap)

  useEffect(() => {
    if (panel.needsGeoMap) {
      ensureWorldMapRegistered().then(() => setMapReady(true))
    }
  }, [panel.needsGeoMap])

  const height = panel.height ?? 380

  if (!mapReady) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-xs text-charcoal/30 bg-black/[0.02] rounded-lg"
      >
        Loading map…
      </div>
    )
  }

  return (
    <ReactECharts
      option={panel.option}
      style={{ height, width: '100%' }}
      notMerge
      lazyUpdate
    />
  )
}
