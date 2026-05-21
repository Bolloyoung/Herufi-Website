'use client'

import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend,
} from 'recharts'

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
  { stage: 'U13', count: 100, retention: 100 },
  { stage: 'U15', count: 65, retention: 65 },
  { stage: 'U17', count: 40, retention: 40 },
  { stage: 'U21', count: 22, retention: 22 },
  { stage: 'Pro', count: 8, retention: 8 },
]

const squadData = [
  { name: 'GK', value: 8 },
  { name: 'DEF', value: 33 },
  { name: 'MID', value: 36 },
  { name: 'FWD', value: 23 },
]

const marketData = [
  { country: 'Nigeria', index: 94, transfers: 82, academies: 91, potential: 96 },
  { country: 'Ghana', index: 81, transfers: 76, academies: 78, potential: 85 },
  { country: 'Senegal', index: 78, transfers: 71, academies: 74, potential: 82 },
  { country: "Côte d'Ivoire", index: 71, transfers: 68, academies: 65, potential: 77 },
  { country: 'Kenya', index: 52, transfers: 44, academies: 55, potential: 61 },
]

const radarData = [
  { subject: 'Nigeria', A: 94 },
  { subject: 'Ghana', A: 81 },
  { subject: 'Senegal', A: 78 },
  { subject: "Côte d'Ivoire", A: 71 },
  { subject: 'Kenya', A: 52 },
]

const COLORS = ['#1B4332', '#2D6A4F', '#C9A84C', '#E8C96A']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-charcoal text-cream text-xs px-3 py-2 rounded-lg shadow-lg">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.dataKey === 'value' ? `€${p.value >= 1000 ? (p.value/1000).toFixed(1)+'m' : p.value+'k'}` : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function PlayerValueChart() {
  return (
    <div>
      <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-4">Transfer value (€k) by player</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={playerData} layout="vertical" margin={{ left: 10, right: 20 }}>
          <XAxis type="number" tick={{ fontSize: 10, fill: '#1C1C1E99' }} tickFormatter={(v) => v >= 1000 ? `€${(v/1000).toFixed(1)}m` : `€${v}k`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#1C1C1E' }} width={70} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" name="Value" fill="#1B4332" radius={[0, 4, 4, 0]}>
            {playerData.map((_, i) => (
              <Cell key={i} fill={i === 3 ? '#C9A84C' : '#1B4332'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-charcoal/40 mt-2">Highlight: top transfer value at age 21 — peak market window for African midfielders.</p>
    </div>
  )
}

function PipelineChart() {
  return (
    <div>
      <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-4">Academy cohort progression (per 100 players)</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={pipelineData} margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E3" />
          <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#1C1C1E' }} />
          <YAxis tick={{ fontSize: 10, fill: '#1C1C1E99' }} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="count" name="Players retained" stroke="#1B4332" strokeWidth={2.5} dot={{ fill: '#1B4332', r: 5 }} activeDot={{ r: 7, fill: '#C9A84C' }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-3 p-3 bg-forest/5 rounded-lg border border-forest/10">
        <p className="text-xs text-charcoal/60">
          <span className="font-semibold text-forest">8% conversion</span> — U13 to professional contract. Top African academies achieve 12–18%.
        </p>
      </div>
    </div>
  )
}

function SquadChart() {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <ResponsiveContainer width={220} height={220}>
        <PieChart>
          <Pie data={squadData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
            {squadData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-3">
        <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-3">Position distribution</p>
        {squadData.map((d, i) => (
          <div key={d.name} className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
            <span className="text-sm font-medium text-charcoal w-10">{d.name}</span>
            <div className="flex-1 bg-gray-soft rounded-full h-2">
              <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${d.value}%`, backgroundColor: COLORS[i] }} />
            </div>
            <span className="text-xs text-charcoal/50 w-8 text-right">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MarketsChart() {
  return (
    <div>
      <p className="text-xs text-charcoal/40 uppercase tracking-widest mb-4">Multi-factor talent index by market</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={marketData} margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E3" />
          <XAxis dataKey="country" tick={{ fontSize: 10, fill: '#1C1C1E' }} />
          <YAxis tick={{ fontSize: 10, fill: '#1C1C1E99' }} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} />
          <Bar dataKey="transfers" name="Transfer activity" fill="#1B4332" radius={[2, 2, 0, 0]} />
          <Bar dataKey="academies" name="Academy density" fill="#2D6A4F" radius={[2, 2, 0, 0]} />
          <Bar dataKey="potential" name="Growth potential" fill="#C9A84C" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-charcoal/40 mt-2">Index combines: international transfers, academy density, FIFA ranking trajectory, and youth registration data.</p>
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
      <div className="p-6 md:p-8 min-h-[340px]">
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
