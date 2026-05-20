'use client'

import { useState } from 'react'

type Tab = 'values' | 'pipeline' | 'squad' | 'markets'

const playerData = [
  { name: 'K. Mensah', age: 17, value: 420, pos: 'MF' },
  { name: 'T. Okonkwo', age: 19, value: 1200, pos: 'FW' },
  { name: 'D. Diallo', age: 20, value: 2100, pos: 'FW' },
  { name: 'A. Kamara', age: 21, value: 3200, pos: 'MF' },
  { name: 'M. Essien', age: 22, value: 2800, pos: 'DF' },
  { name: 'R. Balogun', age: 23, value: 1800, pos: 'FW' },
  { name: 'C. Nkosi', age: 24, value: 950, pos: 'DF' },
  { name: 'F. Traoré', age: 26, value: 600, pos: 'MF' },
]

const pipelineData = [
  { stage: 'U13 Entry', count: 100, color: '#1B4332' },
  { stage: 'U15 Select', count: 65, color: '#2D6A4F' },
  { stage: 'U17 Elite', count: 40, color: '#C9A84C' },
  { stage: 'U21 Squad', count: 22, color: '#E8C96A' },
  { stage: 'Professional', count: 8, color: '#1B4332' },
]

const squadData = [
  { pos: 'GK', pct: 8, color: '#1B4332' },
  { pos: 'DEF', pct: 33, color: '#2D6A4F' },
  { pos: 'MID', pct: 36, color: '#C9A84C' },
  { pos: 'FWD', pct: 23, color: '#E8C96A' },
]

const marketData = [
  { country: 'Nigeria', index: 94 },
  { country: 'Ghana', index: 81 },
  { country: 'Senegal', index: 78 },
  { country: "Côte d'Ivoire", index: 71 },
  { country: 'Kenya', index: 52 },
]

const maxValue = Math.max(...playerData.map((p) => p.value))

function PlayerValueChart() {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div className="space-y-3">
      <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-4">Transfer value (€k) by player age</p>
      {playerData.map((p) => (
        <div
          key={p.name}
          className="group flex items-center gap-3 cursor-default"
          onMouseEnter={() => setHovered(p.name)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="w-24 text-right flex-shrink-0">
            <span className="text-xs font-medium text-charcoal truncate">{p.name}</span>
          </div>
          <div className="flex-1 bg-gray-soft rounded-full h-6 overflow-hidden">
            <div
              className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
              style={{
                width: `${(p.value / maxValue) * 100}%`,
                backgroundColor: hovered === p.name ? '#C9A84C' : '#1B4332',
              }}
            >
              <span className="text-[10px] font-semibold text-cream">
                €{p.value >= 1000 ? `${(p.value / 1000).toFixed(1)}m` : `${p.value}k`}
              </span>
            </div>
          </div>
          <span className="text-xs text-charcoal/40 w-8 flex-shrink-0">Age {p.age}</span>
        </div>
      ))}
    </div>
  )
}

function PipelineChart() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-4">Academy cohort progression (per 100 players)</p>
      {pipelineData.map((d, i) => {
        const width = d.count
        return (
          <div key={d.stage} className="flex items-center gap-3">
            <div className="w-24 text-right flex-shrink-0">
              <span className="text-xs font-medium text-charcoal">{d.stage}</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div
                className="h-8 rounded transition-all duration-700 flex items-center justify-center"
                style={{ width: `${width}%`, backgroundColor: d.color }}
              >
                <span className="text-xs font-bold text-cream">{d.count}</span>
              </div>
            </div>
            {i > 0 && (
              <span className="text-xs text-charcoal/40 w-12 flex-shrink-0">
                {Math.round((d.count / pipelineData[i - 1].count) * 100)}% ret.
              </span>
            )}
          </div>
        )
      })}
      <div className="mt-4 p-3 bg-forest/5 rounded-lg border border-forest/10">
        <p className="text-xs text-charcoal/60">
          <span className="font-semibold text-forest">8% conversion</span> from U13 intake to professional contract. Top-performing African academies achieve 12–18%.
        </p>
      </div>
    </div>
  )
}

function SquadChart() {
  const size = 180
  const cx = size / 2
  const cy = size / 2
  const r = 65
  const inner = 38
  let cumulative = 0

  const segments = squadData.map((d) => {
    const start = cumulative
    cumulative += d.pct
    return { ...d, start, end: cumulative }
  })

  function polarToXY(pct: number, radius: number) {
    const angle = (pct / 100) * 2 * Math.PI - Math.PI / 2
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  }

  function arcPath(start: number, end: number) {
    const s = polarToXY(start, r)
    const e = polarToXY(end, r)
    const si = polarToXY(start, inner)
    const ei = polarToXY(end, inner)
    const large = end - start > 50 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} L ${ei.x} ${ei.y} A ${inner} ${inner} 0 ${large} 0 ${si.x} ${si.y} Z`
  }

  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <svg width={size} height={size} className="flex-shrink-0">
        {segments.map((seg) => (
          <path
            key={seg.pos}
            d={arcPath(seg.start, seg.end)}
            fill={hovered === seg.pos ? '#C9A84C' : seg.color}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHovered(seg.pos)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#1C1C1E" fontSize="11" fontWeight="600">Squad</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#1C1C1E" fontSize="11" fontWeight="600">Balance</text>
      </svg>
      <div className="space-y-3 flex-1">
        <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-2">Position distribution</p>
        {squadData.map((d) => (
          <div
            key={d.pos}
            className="flex items-center gap-3 cursor-default"
            onMouseEnter={() => setHovered(d.pos)}
            onMouseLeave={() => setHovered(null)}
          >
            <span
              className="w-3 h-3 rounded-sm flex-shrink-0 transition-colors duration-200"
              style={{ backgroundColor: hovered === d.pos ? '#C9A84C' : d.color }}
            />
            <span className="text-sm font-medium text-charcoal w-10">{d.pos}</span>
            <div className="flex-1 bg-gray-soft rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${d.pct}%`, backgroundColor: hovered === d.pos ? '#C9A84C' : d.color }}
              />
            </div>
            <span className="text-xs text-charcoal/50 w-8 text-right">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MarketsChart() {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div className="space-y-3">
      <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-4">Talent production index (0–100)</p>
      {marketData.map((m) => (
        <div
          key={m.country}
          className="flex items-center gap-3 cursor-default"
          onMouseEnter={() => setHovered(m.country)}
          onMouseLeave={() => setHovered(null)}
        >
          <div className="w-28 text-right flex-shrink-0">
            <span className="text-sm font-medium text-charcoal">{m.country}</span>
          </div>
          <div className="flex-1 bg-gray-soft rounded-full h-8 overflow-hidden">
            <div
              className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
              style={{
                width: `${m.index}%`,
                backgroundColor: hovered === m.country ? '#C9A84C' : '#1B4332',
              }}
            >
              <span className="text-xs font-bold text-cream">{m.index}</span>
            </div>
          </div>
        </div>
      ))}
      <p className="text-xs text-charcoal/40 mt-3">Index combines: youth registrations, international transfers, academy density, and FIFA ranking trajectory.</p>
    </div>
  )
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'values', label: 'Transfer Values' },
  { id: 'pipeline', label: 'Academy Pipeline' },
  { id: 'squad', label: 'Squad Balance' },
  { id: 'markets', label: 'Talent Markets' },
]

export default function SportsAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('values')

  return (
    <div className="bg-white border border-border-soft rounded-2xl overflow-hidden shadow-sm">
      {/* Tab bar */}
      <div className="flex border-b border-border-soft overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-5 py-3.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab.id
                ? 'border-forest text-forest bg-forest/4'
                : 'border-transparent text-charcoal/50 hover:text-charcoal hover:bg-gray-soft'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart panel */}
      <div className="p-6 md:p-8 min-h-[320px]">
        {activeTab === 'values' && <PlayerValueChart />}
        {activeTab === 'pipeline' && <PipelineChart />}
        {activeTab === 'squad' && <SquadChart />}
        {activeTab === 'markets' && <MarketsChart />}
      </div>

      <div className="px-6 py-3 bg-gray-soft border-t border-border-soft flex items-center justify-between">
        <span className="text-xs text-charcoal/40">Demo data — illustrative of Herufi Sports Intelligence tools</span>
        <span className="text-xs font-medium text-forest">Herufi Sports Analytics</span>
      </div>
    </div>
  )
}
