'use client'

import EChart from './EChart'
import type { FigureData } from './types'

/** The publication report's figure callout: "Figure N" tag, panel grid, italic caption. Matches .report-doc figure.fig */
export default function Figure({ n, data }: { n: number; data: FigureData }) {
  return (
    <figure className="fig">
      <span className="tag">Figure {n}</span>
      <div className="panels" style={{ '--panel-count': data.panels.length } as React.CSSProperties}>
        {data.panels.map((panel, i) => (
          <div key={i}>
            {panel.title && <p className="panel-title">{panel.title}</p>}
            <EChart panel={panel} />
          </div>
        ))}
      </div>
      <figcaption>{data.caption}</figcaption>
    </figure>
  )
}
