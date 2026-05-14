export type ToolStatus = 'Live' | 'Beta' | 'Coming Soon'

export type DataTool = {
  id: string
  title: string
  description: string
  category: string
  users: string[]
  status: ToolStatus
}

export const dataTools: DataTool[] = [
  {
    id: 'venture-readiness-calculator',
    title: 'Venture Readiness Calculator',
    description: 'An interactive diagnostic that scores a venture across eight investment-readiness dimensions and produces a gap analysis with priority actions.',
    category: 'Scoring Tools',
    users: ['Founders', 'Accelerators', 'Investors'],
    status: 'Coming Soon',
  },
  {
    id: 'climate-opportunity-score',
    title: 'Climate Venture Opportunity Score',
    description: 'A sector-by-geography scoring tool that surfaces climate investment opportunities across African markets using weighted signal indicators.',
    category: 'Scoring Tools',
    users: ['Climate investors', 'DFIs', 'Climate founders'],
    status: 'Coming Soon',
  },
  {
    id: 'football-player-valuation',
    title: 'Football Player Valuation Model',
    description: 'A data-driven tool that combines performance metrics, age curves, market comparables, and league adjustments to produce a transfer value estimate.',
    category: 'Sports Intelligence',
    users: ['Football clubs', 'Academies', 'Agents', 'Sports investors'],
    status: 'Beta',
  },
  {
    id: 'academy-roi-tool',
    title: 'Academy ROI Tool',
    description: 'Models the return on investment for football academy operations using cohort progression data, development costs, and transfer market comparables.',
    category: 'Sports Intelligence',
    users: ['Football academies', 'Club directors', 'Sports investors'],
    status: 'Coming Soon',
  },
  {
    id: 'market-entry-risk-map',
    title: 'Market Entry Risk Map',
    description: 'An interactive map that surfaces market entry risk signals by sector and country across African markets, with configurable weighting.',
    category: 'Market Maps',
    users: ['Investors', 'Founders', 'Strategy teams'],
    status: 'Coming Soon',
  },
  {
    id: 'capital-stack-planner',
    title: 'Capital Stack Planner',
    description: 'Helps founders and fund managers design the right capital stack for their stage, sector, and impact requirements by mapping instruments to profiles.',
    category: 'Calculators',
    users: ['Founders', 'Fund managers', 'DFIs'],
    status: 'Coming Soon',
  },
]
