export type ChartPanel = {
  title?: string | null
  /** Raw ECharts option object, as dumped by pyecharts. */
  option: Record<string, unknown>
  /** Set on the one panel (r1_fig3) that needs the Africa/world geo map registered before render. */
  needsGeoMap?: boolean
  height?: number
}

export type FigureData = {
  id: string
  title: string
  caption: string
  panels: ChartPanel[]
}
