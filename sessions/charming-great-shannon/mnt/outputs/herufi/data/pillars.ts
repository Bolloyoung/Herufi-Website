export type Pillar = {
  id: string
  number: string
  title: string
  description: string
  topics: string[]
  icon: string
  color: string
}

export const pillars: Pillar[] = [
  {
    id: 'venture-strategy',
    number: '01',
    title: 'Venture Strategy & Capital Intelligence',
    description: 'Research and analysis for investors, founders, and venture builders navigating African startup and capital markets.',
    topics: [
      'Venture studio strategy', 'Investment readiness', 'Startup diagnostics',
      'Due diligence', 'Market sizing', 'Investor mapping',
      'Capital raising strategy', 'Fundraising narratives', 'Blended finance',
      'Impact investing', 'Fund strategy', 'Ecosystem mapping',
      'Business model analysis', 'African venture ecosystems',
    ],
    icon: 'TrendingUp',
    color: 'forest',
  },
  {
    id: 'markets-systems',
    number: '02',
    title: 'Markets, Systems & African Economies',
    description: 'Deep structural analysis of how African markets actually work — beyond the formal data layer.',
    topics: [
      'African market trends', 'Informal markets', 'SME ecosystems',
      'Supply chains', 'Trade', 'Consumer behavior',
      'Digital adoption', 'Urbanization', 'Regional economic shifts',
      'Local context and culture', 'Informal networks', 'Trust systems',
    ],
    icon: 'Globe',
    color: 'forest',
  },
  {
    id: 'climate-energy',
    number: '03',
    title: 'Climate, Energy, Food & Infrastructure',
    description: 'Opportunity intelligence for the transition economy — climate, energy access, agriculture, and African resilience.',
    topics: [
      'Climate adaptation', 'Energy access', 'Mobility',
      'Agriculture', 'Food systems', 'Waste-to-value',
      'Productive use of energy', 'Climate finance', 'Infrastructure gaps',
      'African resilience models', 'Green growth opportunities',
    ],
    icon: 'Leaf',
    color: 'forest',
  },
  {
    id: 'data-analytics',
    number: '04',
    title: 'Data, Predictive Analytics & Decision Intelligence',
    description: 'Turning data into structured insight — forecasting, models, dashboards, and AI-assisted research workflows.',
    topics: [
      'Forecasting', 'Python analysis', 'Dashboards',
      'Data storytelling', 'Predictive models', 'Scenario analysis',
      'AI-assisted research workflows', 'Risk scoring',
      'Opportunity scoring', 'Decision frameworks', 'Quantitative research methods',
    ],
    icon: 'BarChart2',
    color: 'forest',
  },
  {
    id: 'sports-business',
    number: '05',
    title: 'Sports Business Intelligence',
    description: 'Business-oriented analytics for football clubs, academies, investors, and sports organisations operating in and around African markets.',
    topics: [
      'Football club strategy', 'Player valuation', 'Recruitment analytics',
      'Squad planning', 'Academy economics', 'Talent development',
      'African football markets', 'Sports investment', 'Performance data as business intelligence',
      'Commercial strategy for clubs and academies', 'Scouting efficiency', 'Youth development ROI',
    ],
    icon: 'Trophy',
    color: 'forest',
  },
  {
    id: 'culture-context',
    number: '06',
    title: 'Culture, Context & Intelligence Notes',
    description: 'Analytical notes on the cultural, behavioural, and contextual factors that shape strategy and market outcomes in Africa.',
    topics: [
      'African business culture', 'Local market behavior', 'Founder psychology',
      'Trust systems', 'Community dynamics', 'Language and markets',
      'Identity and adoption', 'Cultural factors affecting scale',
      'How context changes strategy',
    ],
    icon: 'BookOpen',
    color: 'forest',
  },
]
