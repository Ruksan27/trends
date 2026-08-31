export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: '', name: 'Worldwide (All Regions)', flag: '🌐' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
];

export const TIME_RANGES = [
  { value: 'now 1-H', label: 'Past hour', description: 'Real-time 1 minute resolution' },
  { value: 'now 4-H', label: 'Past 4 hours', description: 'High resolution' },
  { value: 'now 1-d', label: 'Past 24 hours', description: 'Hourly resolution' },
  { value: 'now 7-d', label: 'Past 7 days', description: 'Daily granular' },
  { value: 'today 1-m', label: 'Past 30 days', description: 'Daily data' },
  { value: 'today 3-m', label: 'Past 90 days', description: 'Weekly data' },
  { value: 'today 12-m', label: 'Past 12 months', description: 'Standard 1 year' },
  { value: 'today 5-y', label: 'Past 5 years', description: 'Multi-year trends' },
  { value: 'all', label: '2004 - Present', description: 'Full historical archive' },
];

export const CATEGORIES = [
  { id: 0, name: 'All Categories' },
  { id: 5, name: 'Computers & Electronics' },
  { id: 18, name: 'Shopping' },
  { id: 3, name: 'Arts & Entertainment' },
  { id: 12, name: 'Business & Industrial' },
  { id: 14, name: 'Finance' },
  { id: 45, name: 'Health' },
  { id: 20, name: 'Sports' },
  { id: 67, name: 'Science' },
  { id: 7, name: 'Finance' },
  { id: 958, name: 'Artificial Intelligence & Tech' },
  { id: 16, name: 'News & Media' },
  { id: 29, name: 'Real Estate' },
  { id: 66, name: 'Travel' },
];

export const KEYWORD_COLORS = [
  '#0ea5e9', // sky-500 (Primary Elegant Dark)
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // purple-500
  '#f43f5e', // rose-500
];
