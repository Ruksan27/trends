export interface PresetComparison {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  geo: string;
  timeRange: 'now 7-d' | 'today 12-m' | 'today 3-m' | 'today 5-y';
  description: string;
  iconName: string;
}

export const PRESET_COMPARISONS: PresetComparison[] = [
  {
    id: 'tu-faculties-nepal',
    title: 'TU Faculties: BCA vs CSIT vs BBA vs BIM',
    category: 'Nepal Education',
    keywords: ['TU BCA', 'BSc CSIT', 'TU BBA', 'TU BIM'],
    geo: 'NP',
    timeRange: 'today 12-m',
    description: 'Tribhuvan University student search volume across IT and Management bachelor faculties in Nepal.',
    iconName: 'GraduationCap',
  },
  {
    id: 'tu-materials-demand',
    title: 'TU Study Materials: Routine vs Notes vs Old Questions',
    category: 'Nepal Education',
    keywords: ['TU Exam Routine', 'TU Old Questions', 'TU Notes PDF', 'TU Result'],
    geo: 'NP',
    timeRange: 'today 12-m',
    description: 'Breakdown of what study materials TU students search for leading up to exam season in Nepal.',
    iconName: 'BookOpen',
  },
  {
    id: 'nepal-edu-competitors',
    title: 'Nepal EdTech: Edusanjal vs HamroCSIT vs Collegenp',
    category: 'Competitor Search',
    keywords: ['Edusanjal', 'Hamro CSIT', 'Collegenp', 'Saral Notes'],
    geo: 'NP',
    timeRange: 'today 12-m',
    description: 'Search interest and brand navigation queries across leading educational portals in Nepal.',
    iconName: 'Globe',
  },
  {
    id: 'ai-models',
    title: 'Frontier AI Models',
    category: 'Technology',
    keywords: ['ChatGPT', 'Gemini', 'Claude', 'DeepSeek'],
    geo: '',
    timeRange: 'today 12-m',
    description: 'Compare search interest across global leading AI assistants and reasoning models.',
    iconName: 'Bot',
  },
  {
    id: 'frontend-frameworks',
    title: 'Frontend Ecosystem',
    category: 'Development',
    keywords: ['React', 'Vue', 'Next.js', 'Svelte'],
    geo: '',
    timeRange: 'today 12-m',
    description: 'Track developer attention and adoption shifts across modern JavaScript frameworks.',
    iconName: 'Code',
  },
  {
    id: 'cloud-infrastructure',
    title: 'Cloud Giants',
    category: 'Enterprise',
    keywords: ['AWS', 'Google Cloud', 'Microsoft Azure'],
    geo: '',
    timeRange: 'today 12-m',
    description: 'Global search volume and enterprise cloud adoption inquiries over time.',
    iconName: 'Cloud',
  },
  {
    id: 'crypto-majors',
    title: 'Major Cryptocurrencies',
    category: 'Finance',
    keywords: ['Bitcoin', 'Ethereum', 'Solana'],
    geo: '',
    timeRange: 'today 3-m',
    description: 'Retail and institutional crypto market momentum and search sentiment.',
    iconName: 'Coins',
  },
  {
    id: 'gaming-consoles',
    title: 'Next-Gen Gaming',
    category: 'Gaming',
    keywords: ['PlayStation 5', 'Nintendo Switch', 'Xbox Series X'],
    geo: 'US',
    timeRange: 'today 12-m',
    description: 'Holiday seasonality and hardware demand patterns in video games.',
    iconName: 'Gamepad2',
  },
  {
    id: 'ev-automakers',
    title: 'Electric Vehicles',
    category: 'Automotive',
    keywords: ['Tesla', 'BYD', 'Rivian', 'Lucid Motors'],
    geo: '',
    timeRange: 'today 12-m',
    description: 'Global shift in electric vehicle manufacturers and market buzz.',
    iconName: 'Zap',
  },
];
