export interface KeywordMetric {
  keyword: string;
  color: string;
  averageInterest: number;
  peakInterest: number;
  peakDate?: string;
}

export interface TimelinePoint {
  date: string;
  formattedTime: string;
  timestamp: number;
  [key: string]: string | number; // keyword values
}

export interface RegionalDataPoint {
  geoCode: string;
  geoName: string;
  values: { [keyword: string]: number };
  maxValue: number;
  dominantKeyword?: string;
}

export interface RelatedQueryItem {
  query: string;
  value: number; // 0-100 or breakout indicator
  formattedValue: string;
  hasBreakout?: boolean;
  link?: string;
}

export interface RelatedTopicItem {
  topicTitle: string;
  topicType: string;
  value: number;
  formattedValue: string;
  hasBreakout?: boolean;
}

export interface DailyTrendingItem {
  title: string;
  formattedTraffic: string;
  trafficValue: number;
  pubDate: string;
  pictureUrl?: string;
  newsArticles: {
    title: string;
    source: string;
    url: string;
    snippet: string;
    timeAgo?: string;
  }[];
  relatedQueries: string[];
}

export interface TrendAnalysisResult {
  summary: string;
  dominantTerm: string;
  keyDrivers: string[];
  inflectionPoints: {
    date: string;
    keyword: string;
    event: string;
    significance: string;
  }[];
  regionalInsights: string;
  futureOutlook: string;
  strategicTakeaways: string[];
}

export type TimeRange =
  | 'now 1-H'
  | 'now 4-H'
  | 'now 1-d'
  | 'now 7-d'
  | 'today 1-m'
  | 'today 3-m'
  | 'today 12-m'
  | 'today 5-y'
  | 'all';

export interface TrendQueryParams {
  keywords: string[];
  timeRange: TimeRange;
  geo: string;
  category?: number;
  property?: '' | 'images' | 'news' | 'youtube' | 'froogle';
}

export interface ApiResponseMeta {
  endpoint: string;
  latencyMs: number;
  status: number;
  timestamp: string;
  cached?: boolean;
  isSimulatedFallback?: boolean;
}

export type TUFaculty = 'all' | 'bca' | 'csit_bit' | 'bba' | 'bim' | 'bbs' | 'engineering_ioe';

export type TUMaterialCategory = 'all' | 'routine_notice' | 'old_questions' | 'notes_pdf' | 'syllabus' | 'results' | 'project_assignment';

export interface TUStudentQuery {
  id: string;
  query: string;
  nepaliQuery?: string;
  faculty: TUFaculty;
  facultyLabel: string;
  semester?: string;
  subject?: string;
  materialType: TUMaterialCategory;
  materialTypeLabel: string;
  searchVolume24h: number;
  formattedVolume: string;
  velocityGrowth: string; // e.g. '+480%', 'Breakout'
  isBreakout: boolean;
  searchIntent: 'Exam Urgent' | 'PDF Download' | 'Official Notice' | 'Academic Reference' | 'Assignment Help';
  peakHour: string;
  sampleQuestionsAsked: string[];
  topRankedCompetitor?: string;
}

export interface CompetitorMetric {
  url: string;
  name: string;
  isUserSite?: boolean;
  monthlyOrganicVisits: number;
  formattedMonthlyVisits: string;
  dailyActiveStudents: number;
  tuKeywordRankings: number;
  domainAuthority: number;
  indexedPages: number;
  mobileSpeedScore: number;
  contentFreshnessScore: number; // 0-100
  topTrafficKeywords: { keyword: string; estimatedClicks: string; rank: number }[];
  strengths: string[];
  weaknesses: string[];
}

export interface CompetitorComparisonAudit {
  mySite: CompetitorMetric;
  competitors: CompetitorMetric[];
  trafficGapRatio: number; // e.g. 8.4x higher traffic
  whyCompetitorIsWinning: {
    title: string;
    factor: 'SEO Structure' | 'Content Velocity' | 'Student Resource Depth' | 'Mobile Experience' | 'Backlinks';
    explanation: string;
    impact: 'High' | 'Critical' | 'Medium';
  }[];
  missedKeywordGaps: {
    keyword: string;
    faculty: string;
    competitorRank: number;
    myRank: number | string;
    searchVolume24h: number;
    opportunityScore: number;
    recommendedAction: string;
  }[];
  actionPlanForNextJs: {
    phase: string;
    action: string;
    expectedTrafficBoost: string;
    technicalImplementation: string;
  }[];
  summaryVerdict: string;
}

// 1. Auto-SEO Generator Types
export interface AutoSeoResult {
  targetTopic: string;
  faculty: string;
  semester?: string;
  itemType: 'note' | 'project' | 'routine' | 'old_questions';
  seoTitle: string;
  metaDescription: string;
  primaryKeywords: string[];
  longTailKeywords: string[];
  nextJsMetadataSnippet: string;
  schemaOrgJsonLd: string;
  suggestedUrlSlug: string;
  estimatedMonthlySearchVolume: string;
  rankingDifficultyScore: number; // 1-100 (lower is easier)
  recommendedHeadingStructure: string[];
}

// 2. Trending Project Ideas Types
export interface TrendingProjectIdea {
  id: string;
  title: string;
  category: 'Web App' | 'Mobile App' | 'AI / Machine Learning' | 'Fintech / Payment' | 'Management System' | 'IoT / Embedded';
  targetFaculty: string[];
  techStack: string[];
  searchDemandScore: number; // 1-100
  trendVelocity: string; // e.g. '+480% Breakout'
  estimatedMarketPriceNpr: string; // e.g. 'Rs. 4,500 - Rs. 8,000'
  targetBuyers: string;
  whySellingWell: string;
  sampleGoogleSearches: string[];
  includedFeatures: string[];
}

// 3. Exam Season Prediction Types
export interface ExamSeasonAlert {
  id: string;
  faculty: string;
  semester: string;
  subjectOrEvent: string;
  spikePercentage: string; // e.g. '+420%'
  daysUntilExamLikely: string; // e.g. '12-18 Days'
  urgencyLevel: 'Critical Spike' | 'High Surge' | 'Moderate';
  alertMessage: string;
  actionRequiredForAdmin: string;
  targetKeywordsToTargetNow: string[];
  historicalSearchPattern: string;
}

// 4. Live Trending Search Tag
export interface TrendingSearchTag {
  id: string;
  tag: string;
  label: string;
  category: 'Routine' | 'Notes' | 'Project' | 'Exam';
  volume: string;
  isHot: boolean;
  targetKeyword: string;
}

