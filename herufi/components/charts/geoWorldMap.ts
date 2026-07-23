import * as echarts from 'echarts'

let registerPromise: Promise<void> | null = null

/** Lazily fetches + registers the world GeoJSON basemap used by the r1_fig3 Africa bubble map. */
export function ensureWorldMapRegistered(): Promise<void> {
  if (!registerPromise) {
    registerPromise = import('@/data/geo/world.json').then((mod) => {
      echarts.registerMap('world', mod.default as any)
    })
  }
  return registerPromise
}
