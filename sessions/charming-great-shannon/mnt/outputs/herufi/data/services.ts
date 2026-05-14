export type ServiceDeliverable = string
export type ServiceQuestion = string

export type Service = {
  id: string
  letter: string
  title: string
  tagline: string
  audience: string[]
  problems: string[]
  deliverables: ServiceDeliverable[]
  questions: ServiceQuestion[]
}

export const services: Service[] = [
  {
    id: 'research-intelligence',
    letter: 'A',
    title: 'Research & Market Intelligence',
    tagline: 'Know your market. Understand your context.',
    audience: ['Investors', 'Founders', 'Institutions', 'Strategy teams'],
    problems: [
      'Limited reliable data on African markets',
      'Difficulty understanding informal sector dynamics',
      'Lack of structured competitor or ecosystem maps',
    ],
    deliverables: [
      'Market reports', 'Sector briefs', 'Competitor maps',
      'Country scans', 'Opportunity assessments',
      'Customer research', 'Ecosystem maps',
    ],
    questions: [
      'What does the competitive landscape look like in this market?',
      'Which customer segments represent the highest opportunity?',
      'What are the structural barriers to entry in this sector?',
      'How does informal market activity affect formal growth models?',
    ],
  },
  {
    id: 'venture-strategy',
    letter: 'B',
    title: 'Venture Strategy & Investment Analysis',
    tagline: 'From opportunity to investment decision.',
    audience: ['Startups', 'Funds', 'Venture studios', 'Accelerators', 'Investors'],
    problems: [
      'Weak investment narratives not built for institutional investors',
      'Unclear market sizing and business model assumptions',
      'No structured due diligence process',
    ],
    deliverables: [
      'Investment memos', 'Due diligence reports',
      'Investment readiness diagnostics', 'Fundraising narratives',
      'Market sizing', 'Business model reviews',
      'Go-to-market plans', 'Portfolio support plans',
    ],
    questions: [
      'Is this venture investment-ready?',
      'What story should we be telling institutional investors?',
      'How does this business model hold up against the data?',
      'What are the real risks in this portfolio company?',
    ],
  },
  {
    id: 'impact-climate',
    letter: 'C',
    title: 'Impact, Climate & Development Strategy',
    tagline: 'Strategy for a more useful kind of capital.',
    audience: ['Foundations', 'DFIs', 'Funds', 'Ecosystem builders'],
    problems: [
      'Programs not grounded in local market realities',
      'Impact frameworks disconnected from actual outcomes',
      'Technical assistance that does not translate to results',
    ],
    deliverables: [
      'Theory of change', 'Impact frameworks',
      'Technical assistance strategies', 'Program design',
      'Learning agendas', 'Climate opportunity mapping',
      'Impact measurement support',
    ],
    questions: [
      'Are we measuring the right things?',
      'How do we design a program that actually changes behaviour?',
      'Where is the climate opportunity in this geography?',
      'How do we structure blended finance for this intervention?',
    ],
  },
  {
    id: 'data-analytics',
    letter: 'D',
    title: 'Data, Analytics & Decision Intelligence',
    tagline: 'Better data. Sharper decisions.',
    audience: ['Teams that need better use of data', 'Investors', 'Strategy units'],
    problems: [
      'Data collected but not turned into decisions',
      'No forecasting or scenario planning capability',
      'Research outputs not visualised or made usable',
    ],
    deliverables: [
      'Dashboards', 'Forecasting models',
      'Risk scoring tools', 'Opportunity scoring tools',
      'Data storytelling', 'Python analysis workflows',
      'AI-assisted research workflows',
    ],
    questions: [
      'What does our data actually tell us about performance?',
      'How do we forecast demand or growth in this market?',
      'Which of our portfolio companies carries the most risk?',
      'How do we build a scoring model for opportunity assessment?',
    ],
  },
  {
    id: 'sports-analytics',
    letter: 'E',
    title: 'Sports Business Analytics',
    tagline: 'The intelligence layer for modern football.',
    audience: ['Football clubs', 'Academies', 'Investors', 'Agencies', 'Sports organisations'],
    problems: [
      'Recruitment decisions made without structured data',
      'Academies without ROI or talent pipeline visibility',
      'Sports investments without commercial due diligence',
    ],
    deliverables: [
      'Player valuation models', 'Recruitment intelligence',
      'Squad planning analysis', 'Academy benchmarking',
      'Talent pipeline studies', 'Market opportunity reports',
      'Sports investment briefs', 'Commercial strategy for clubs and academies',
    ],
    questions: [
      'Are we recruiting the right profile for our system and budget?',
      'What is our academy pipeline worth over five years?',
      "How does this player's value compare to comparable transfer targets?",
      'What commercial opportunities are we leaving on the table?',
    ],
  },
]
