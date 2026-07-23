'use client'

import EChart from './EChart'
import type { FigureData } from './types'

/** The blog explainer's lighter figure box (no "Figure N" tag; caller adds a <blockquote> caption after it). Matches .explainer-doc .figimg */
export default function BlogFigure({ data }: { data: FigureData }) {
  return (
    <div className="figimg">
      <div className="panels" style={{ '--panel-count': data.panels.length } as React.CSSProperties}>
        {data.panels.map((panel, i) => (
          <div key={i}>
            {panel.title && <p className="panel-title">{panel.title}</p>}
            <EChart panel={panel} />
          </div>
        ))}
      </div>
    </div>
  )
}
