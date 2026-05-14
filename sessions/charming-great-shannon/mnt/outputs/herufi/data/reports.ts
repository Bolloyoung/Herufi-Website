export type Report = {
  id: string
  title: string
  category: string
  summary: string
  date: string
  format: string
  fileUrl: string
  tags: string[]
}

export const reports: Report[] = [
  {
    id: 'state-of-african-climate-vc',
    title: 'State of African Climate Venture Capital',
    category: 'Sector Outlooks',
    summary: 'An analysis of venture capital flows into climate-related sectors across Sub-Saharan Africa, including deal data, fund mandates, sector gaps, and forward-looking opportunity signals.',
    date: '2024-Q4',
    format: 'PDF',
    fileUrl: '#',
    tags: ['Climate', 'Venture Capital', 'Africa', 'Energy'],
  },
  {
    id: 'african-sports-talent-market',
    title: 'African Sports Talent Market Brief',
    category: 'Sports Business Reports',
    summary: 'A structured overview of how African football talent flows through domestic leagues, academies, and international transfer markets — with commercial and investment implications.',
    date: '2025-Q1',
    format: 'PDF',
    fileUrl: '#',
    tags: ['Football', 'Sports Business', 'Talent', 'Transfer Market'],
  },
  {
    id: 'aid-contraction-private-capital',
    title: 'Aid Contraction & Private Capital in Africa',
    category: 'Investment Theses',
    summary: 'Examines the structural shift away from ODA and what it means for capital flows into African markets. Identifies sectors where private capital can step in — and where it cannot.',
    date: '2025-Q1',
    format: 'PDF',
    fileUrl: '#',
    tags: ['Development Finance', 'ODA', 'Private Capital', 'Africa'],
  },
  {
    id: 'football-recruitment-framework',
    title: 'Football Recruitment Intelligence Framework',
    category: 'Framework Papers',
    summary: 'A practical framework for structuring recruitment decisions using performance data, positional profiling, market comparables, and strategic fit criteria.',
    date: '2024-Q3',
    format: 'PDF',
    fileUrl: '#',
    tags: ['Football', 'Recruitment', 'Analytics', 'Sports Intelligence'],
  },
  {
    id: 'african-mobility-energy',
    title: 'African Mobility & Energy Opportunity Map',
    category: 'Market Reports',
    summary: 'A geographic and sectoral analysis of where mobility and energy-access opportunities are most compelling across African cities, with investment signal scoring.',
    date: '2025-Q2',
    format: 'PDF',
    fileUrl: '#',
    tags: ['Mobility', 'Energy', 'Infrastructure', 'African Markets'],
  },
  {
    id: 'venture-studio-strategy',
    title: 'Venture Studio Strategy in African Markets',
    category: 'Investment Theses',
    summary: 'Analyses the venture studio model in the context of African startup ecosystems — where it works, where it does not, and how to structure it for local market conditions.',
    date: '2024-Q2',
    format: 'PDF',
    fileUrl: '#',
    tags: ['Venture Studios', 'Startup Ecosystems', 'Africa', 'Investment'],
  },
  {
    id: 'informal-markets-scalable-models',
    title: 'Informal Markets & Scalable Business Models',
    category: 'Market Reports',
    summary: 'Explores how scalable business models can be designed around informal market dynamics rather than against them — with case analysis and structural frameworks.',
    date: '2024-Q4',
    format: 'PDF',
    fileUrl: '#',
    tags: ['Informal Markets', 'Business Models', 'Scale', 'Africa'],
  },
]
