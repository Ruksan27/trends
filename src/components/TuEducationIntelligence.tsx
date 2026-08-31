import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  TrendingUp,
  Search,
  Globe,
  Layers,
  Sparkles,
  Zap,
  ArrowUpRight,
  Clock,
  Download,
  Code2,
  Check,
  Copy,
  FileText,
  AlertTriangle,
  Flame,
  BarChart3,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  Radar,
  Tag,
  Share2,
  Eye,
  Sliders,
  Award,
} from 'lucide-react';
import {
  TUStudentQuery,
  CompetitorComparisonAudit,
  TUFaculty,
  TUMaterialCategory,
  AutoSeoResult,
  TrendingProjectIdea,
  ExamSeasonAlert,
  TrendingSearchTag,
} from '../types';

interface TuEducationIntelligenceProps {
  onExploreKeyword?: (keyword: string) => void;
}

const FACULTIES: { id: TUFaculty; label: string; icon: string; count: string }[] = [
  { id: 'all', label: 'All TU Faculties', icon: '🏛️', count: '150K+' },
  { id: 'bca', label: 'BCA (Humanities)', icon: '💻', count: '42.5K' },
  { id: 'csit_bit', label: 'BSc CSIT / BIT (IOST)', icon: '⚡', count: '53.4K' },
  { id: 'bba', label: 'BBA (Management)', icon: '📈', count: '20.1K' },
  { id: 'bim', label: 'BIM (IT & Mgmt)', icon: '📊', count: '15.5K' },
  { id: 'bbs', label: 'BBS (4-Year FOM)', icon: '📚', count: '47.9K' },
  { id: 'engineering_ioe', label: 'IOE Engineering', icon: '⚙️', count: '37.1K' },
];

const MATERIAL_CATEGORIES: { id: TUMaterialCategory; label: string }[] = [
  { id: 'all', label: 'All Materials' },
  { id: 'routine_notice', label: 'Exam Routines & Notices' },
  { id: 'old_questions', label: 'Past Questions & Solutions' },
  { id: 'notes_pdf', label: 'Handwritten & PDF Notes' },
  { id: 'syllabus', label: 'Course Syllabus' },
  { id: 'results', label: 'Results & Cutoffs' },
  { id: 'project_assignment', label: 'Project Reports & Viva' },
];

export const TuEducationIntelligence: React.FC<TuEducationIntelligenceProps> = ({ onExploreKeyword }) => {
  const [activeTab, setActiveTab] = useState<
    'auto_seo' | 'project_ideas' | 'exam_radar' | '24h_searches' | 'competitor_audit' | 'nextjs_code'
  >('auto_seo');

  // Live trending tags
  const [trendingTags, setTrendingTags] = useState<TrendingSearchTag[]>([]);

  // 1. Auto-SEO Generator State
  const [seoTopic, setSeoTopic] = useState('MLS (Microprocessor & Logic Systems)');
  const [seoFaculty, setSeoFaculty] = useState('BCA');
  const [seoSemester, setSeoSemester] = useState('5th Semester');
  const [seoItemType, setSeoItemType] = useState<'note' | 'project' | 'routine' | 'old_questions'>('note');
  const [seoResult, setSeoResult] = useState<AutoSeoResult | null>(null);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  // 2. Trending Projects State
  const [projectsList, setProjectsList] = useState<TrendingProjectIdea[]>([]);
  const [selectedProjectCategory, setSelectedProjectCategory] = useState<string>('all');
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // 3. Exam Radar State
  const [radarAlerts, setRadarAlerts] = useState<ExamSeasonAlert[]>([]);
  const [isLoadingRadar, setIsLoadingRadar] = useState(false);

  // 4. Live Searches State
  const [selectedFaculty, setSelectedFaculty] = useState<TUFaculty>('all');
  const [selectedCategory, setSelectedCategory] = useState<TUMaterialCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tuQueries, setTuQueries] = useState<TUStudentQuery[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoadingQueries, setIsLoadingQueries] = useState(false);

  // 5. Competitor Audit State
  const [mySiteUrl, setMySiteUrl] = useState('https://tunoteshub.vercel.app');
  const [competitorInput, setCompetitorInput] = useState('https://edusanjal.com');
  const [auditResult, setAuditResult] = useState<CompetitorComparisonAudit | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // 6. Next.js snippets state
  const [snippets, setSnippets] = useState<{ dynamicRoute?: string; apiRoute?: string }>({});
  const [activeSnippetTab, setActiveSnippetTab] = useState<'page' | 'api'>('page');

  // Fetch Trending Tags
  useEffect(() => {
    fetch('/api/tu-trends/trending-tags')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTrendingTags(data.tags || []);
      })
      .catch(console.error);
  }, []);

  // Fetch Live searches
  const fetchLiveSearches = async () => {
    setIsLoadingQueries(true);
    try {
      const params = new URLSearchParams({
        faculty: selectedFaculty,
        category: selectedCategory,
        q: searchQuery,
      });
      const res = await fetch(`/api/tu-trends/live-searches?${params}`);
      const data = await res.json();
      if (data.success) {
        setTuQueries(data.queries || []);
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error('Failed to fetch TU live searches:', err);
    } finally {
      setIsLoadingQueries(false);
    }
  };

  useEffect(() => {
    fetchLiveSearches();
  }, [selectedFaculty, selectedCategory]);

  // Fetch Trending Projects
  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch(`/api/tu-trends/project-ideas?category=${selectedProjectCategory}`);
      const data = await res.json();
      if (data.success) {
        setProjectsList(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch project ideas:', err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedProjectCategory]);

  // Fetch Exam Radar
  const fetchRadar = async () => {
    setIsLoadingRadar(true);
    try {
      const res = await fetch('/api/tu-trends/exam-radar');
      const data = await res.json();
      if (data.success) {
        setRadarAlerts(data.alerts || []);
      }
    } catch (err) {
      console.error('Failed to fetch exam radar:', err);
    } finally {
      setIsLoadingRadar(false);
    }
  };

  useEffect(() => {
    fetchRadar();
    fetchSnippets();
    handleGenerateSeo();
  }, []);

  // Auto-SEO Generator Trigger
  const handleGenerateSeo = async (customTopic?: string, customFaculty?: string, customSemester?: string) => {
    setIsGeneratingSeo(true);
    try {
      const res = await fetch('/api/tu-trends/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetTopic: customTopic || seoTopic,
          faculty: customFaculty || seoFaculty,
          semester: customSemester || seoSemester,
          itemType: seoItemType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSeoResult(data.result);
      }
    } catch (err) {
      console.error('Failed to generate SEO package:', err);
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  // Run Competitor Audit
  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/tu-trends/competitor-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          myWebsiteUrl: mySiteUrl,
          competitorUrls: [competitorInput],
          targetFaculty: selectedFaculty,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuditResult(data.audit);
      }
    } catch (err) {
      console.error('Failed to run competitor audit:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const fetchSnippets = async () => {
    try {
      const res = await fetch('/api/tu-trends/nextjs-snippets');
      const data = await res.json();
      if (data.success) {
        setSnippets(data.snippets || {});
      }
    } catch (err) {
      console.error('Failed to fetch Next.js snippets:', err);
    }
  };

  const handleCopyCode = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const handleExploreInternal = (kw: string) => {
    setSeoTopic(kw);
    setActiveTab('auto_seo');
    handleGenerateSeo(kw);
    if (onExploreKeyword) {
      onExploreKeyword(kw);
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 4. LIVE TRENDING SEARCHES TAGS BANNER (INTERACTIVE CHIPS) */}
      {/* ========================================================================= */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 shadow-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="flex items-center gap-1.5 font-bold text-sky-400 shrink-0 text-[11px] bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Live Nepal Trending:</span>
          </span>

          {trendingTags.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                handleExploreInternal(t.targetKeyword);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-sky-500/50 text-zinc-300 hover:text-white transition-all shrink-0 font-mono text-[11px] group"
              title={`Click to generate SEO for ${t.targetKeyword}`}
            >
              <span className="text-sky-400 font-bold">{t.tag}</span>
              <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">({t.volume})</span>
              {t.isHot && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Top Banner Header with Multi-Module Tabs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl">
              <GraduationCap className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  TU Notes Hub &bull; Google Trends Growth & SEO Intelligence
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Nepal 24h Live Radar
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Auto-SEO Meta Tag Generator &bull; Marketplace Trending Projects &bull; Exam Season Radar &bull; Competitor SEO Auditor
              </p>
            </div>
          </div>

          {/* Module Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 shrink-0">
            <button
              onClick={() => setActiveTab('auto_seo')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'auto_seo'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-SEO Generator</span>
            </button>

            <button
              onClick={() => setActiveTab('project_ideas')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'project_ideas'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Trending Projects</span>
            </button>

            <button
              onClick={() => setActiveTab('exam_radar')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 relative ${
                activeTab === 'exam_radar'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Radar className="w-3.5 h-3.5 text-amber-400" />
              <span>Exam Season Radar</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            </button>

            <button
              onClick={() => setActiveTab('24h_searches')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === '24h_searches'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>24h Queries</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('competitor_audit');
                if (!auditResult) handleRunAudit();
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'competitor_audit'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Competitor Auditor</span>
            </button>

            <button
              onClick={() => setActiveTab('nextjs_code')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'nextjs_code'
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Next.js Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: AUTO-SEO META TAG GENERATOR FOR ADMIN */}
      {/* ========================================================================= */}
      {activeTab === 'auto_seo' && (
        <div className="space-y-6">
          {/* Admin Control Input Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Auto-SEO Meta Tag & Schema.org Generator (Admin Smart Tool)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Type any TU note or project subject. The system fetches live Google Nepal search patterns and outputs Google Rank #1 Next.js metadata, keywords, and rich schemas in 1 second.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Note / Project Topic Name
                </label>
                <input
                  type="text"
                  value={seoTopic}
                  onChange={(e) => setSeoTopic(e.target.value)}
                  placeholder="e.g. MLS, Database, MERN E-Commerce"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Target Faculty
                </label>
                <select
                  value={seoFaculty}
                  onChange={(e) => setSeoFaculty(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="BCA">BCA (Humanities)</option>
                  <option value="BSc CSIT">BSc CSIT (IOST)</option>
                  <option value="BBA">BBA (Management)</option>
                  <option value="BIM">BIM (IT & Mgmt)</option>
                  <option value="BBS">BBS (4-Year FOM)</option>
                  <option value="IOE Engineering">IOE Computer / Civil</option>
                  <option value="BIT">BIT (Purbanchal / TU)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Semester / Level
                </label>
                <input
                  type="text"
                  value={seoSemester}
                  onChange={(e) => setSeoSemester(e.target.value)}
                  placeholder="e.g. 5th Semester, 2nd Year"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Material Type
                </label>
                <select
                  value={seoItemType}
                  onChange={(e) => setSeoItemType(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="note">Handwritten / PDF Notes</option>
                  <option value="project">College Marketplace Project</option>
                  <option value="old_questions">Past Questions & Solutions</option>
                  <option value="routine">Exam Routine & Balkhu Notice</option>
                </select>
              </div>
            </div>

            {/* Quick Topic Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] text-zinc-500 font-medium">Quick Presets:</span>
                {[
                  { topic: 'MLS (Microprocessor)', fac: 'BCA', sem: '5th Semester' },
                  { topic: 'Data Structures (DSA)', fac: 'BSc CSIT', sem: '3rd Semester' },
                  { topic: 'MERN E-Commerce with Khalti', fac: 'BCA', sem: 'Final Year' },
                  { topic: 'Cost & Management Accounting', fac: 'BBS', sem: '2nd Year' },
                  { topic: 'Theory of Computation (TOC)', fac: 'IOE Engineering', sem: '4th Semester' },
                ].map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => {
                      setSeoTopic(preset.topic);
                      setSeoFaculty(preset.fac);
                      setSeoSemester(preset.sem);
                      handleGenerateSeo(preset.topic, preset.fac, preset.sem);
                    }}
                    className="px-2 py-0.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-sky-300 border border-zinc-800 rounded text-[11px] font-mono transition-colors"
                  >
                    {preset.topic.split(' ')[0]} ({preset.fac})
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleGenerateSeo()}
                disabled={isGeneratingSeo}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20 shrink-0 disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSeo ? 'animate-spin' : ''}`} />
                <span>{isGeneratingSeo ? 'ANALYZING GOOGLE TRENDS...' : 'GENERATE SEO PACKAGE'}</span>
              </button>
            </div>
          </div>

          {/* Generated Result Container */}
          {isGeneratingSeo ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-14 flex flex-col items-center justify-center space-y-3">
              <div className="w-9 h-9 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-white">Correlating Google Trends Nepal search signals for "{seoTopic}"...</p>
              <p className="text-[11px] text-zinc-500">Generating Next.js generateMetadata(), Schema.org, and high CTR titles</p>
            </div>
          ) : seoResult ? (
            <div className="space-y-6">
              {/* 1. Google SERP Preview Card (Desktop & Mobile Simulation) */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-sky-400" />
                    <span>Google Rank #1 Search Result Simulation (SERP Mockup)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">
                      Estimated Volume: {seoResult.estimatedMonthlySearchVolume}
                    </span>
                    <span className="text-[10px] font-mono bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded border border-sky-500/20">
                      Keyword Difficulty: {seoResult.rankingDifficultyScore}/100 (Easy)
                    </span>
                  </div>
                </div>

                {/* Google Search Card Preview */}
                <div className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 p-4 rounded-xl border border-zinc-700 shadow-inner font-sans space-y-1">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-[9px] text-white font-bold">
                      TU
                    </div>
                    <span className="font-medium text-zinc-400">tunoteshub.com &rsaquo; {seoResult.suggestedUrlSlug}</span>
                  </div>
                  <h4 className="text-base font-semibold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer">
                    {seoResult.seoTitle}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                    {seoResult.metaDescription}
                  </p>
                </div>
              </div>

              {/* 2. Target Keywords & Headings Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Keywords Card */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-sky-400" />
                      <span>Extracted Search Keywords (Google Nepal)</span>
                    </span>
                    <button
                      onClick={() => handleCopyCode('keywords', seoResult.longTailKeywords.join(', '))}
                      className="text-[10px] text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1"
                    >
                      {copiedCodeKey === 'keywords' ? 'Copied!' : 'Copy All'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Primary Keywords:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {seoResult.primaryKeywords.map((pk, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-sky-500/10 text-sky-300 text-xs font-mono rounded border border-sky-500/20">
                            {pk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Long-Tail High-Intent Search Phrases:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {seoResult.longTailKeywords.map((lk, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleExploreInternal(lk)}
                            className="px-2 py-0.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono rounded border border-zinc-800 transition-colors flex items-center gap-1"
                            title="Generate SEO for this phrase"
                          >
                            <span>{lk}</span>
                            <ArrowUpRight className="w-2.5 h-2.5 text-zinc-500" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Heading Architecture */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-sky-400" />
                    <span>Recommended Content Heading Structure (H1, H2s)</span>
                  </span>

                  <div className="space-y-1.5 bg-zinc-950/70 p-3 rounded-lg border border-zinc-800/80 font-mono text-xs text-zinc-300">
                    {seoResult.recommendedHeadingStructure.map((h, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px]">
                        <span className="text-sky-400 font-bold shrink-0">{h.split(':')[0]}:</span>
                        <span className="text-zinc-300 truncate">{h.split(':')[1] || h}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Following this heading hierarchy ensures your page matches Google's Quality Rater & E-E-A-T guidelines for educational study material.
                  </p>
                </div>
              </div>

              {/* 3. Next.js generateMetadata() Code Export */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-sky-400" />
                    <span>Ready-to-Paste Next.js App Router Metadata Snippet</span>
                  </span>
                  <button
                    onClick={() => handleCopyCode('nextjs-meta', seoResult.nextJsMetadataSnippet)}
                    className="flex items-center gap-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    {copiedCodeKey === 'nextjs-meta' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Next.js Metadata</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-sky-400 leading-relaxed whitespace-pre-wrap">
                    {seoResult.nextJsMetadataSnippet}
                  </pre>
                </div>
              </div>

              {/* 4. Schema.org JSON-LD Rich Snippet */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Schema.org Structured Data (Google Rich Results for Courses & Notes)</span>
                  </span>
                  <button
                    onClick={() => handleCopyCode('schema-meta', seoResult.schemaOrgJsonLd)}
                    className="flex items-center gap-1 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    {copiedCodeKey === 'schema-meta' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span>Copied JSON-LD!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Schema JSON-LD</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-amber-300/90 leading-relaxed whitespace-pre-wrap">
                    {seoResult.schemaOrgJsonLd}
                  </pre>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: TRENDING PROJECT IDEAS MARKETPLACE (FOR SELLERS) */}
      {/* ========================================================================= */}
      {activeTab === 'project_ideas' && (
        <div className="space-y-6">
          {/* Header & Filter */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-sky-400" />
                  <span>Trending College Project Ideas & Marketplace Demand Radar</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Insights for student creators and project sellers: discover which tech stacks (Khalti, OpenCV, Flutter, Django) are generating breakout sales in Nepal.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['all', 'Fintech', 'AI', 'Mobile', 'Management'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedProjectCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedProjectCategory === cat
                        ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project Cards Grid */}
          {isLoadingProjects ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-400 font-mono">Analyzing Nepal college project demand signals...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {projectsList.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 shadow-xl transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Badge line */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        {proj.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {proj.trendVelocity}
                        </span>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                          Demand: {proj.searchDemandScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white leading-snug">
                      {proj.title}
                    </h3>

                    {/* Pricing & Buyers */}
                    <div className="grid grid-cols-2 gap-2 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/80 text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Est. Market Price (Nepal):</span>
                        <span className="font-bold text-green-400 font-mono">{proj.estimatedMarketPriceNpr}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Target Students:</span>
                        <span className="font-semibold text-zinc-200 text-[11px] truncate block">{proj.targetBuyers}</span>
                      </div>
                    </div>

                    {/* Tech stack */}
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        Recommended Tech Stack:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.techStack.map((tech, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 font-mono text-[11px] border border-zinc-800">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Why Selling Well */}
                    <div className="bg-sky-500/5 border border-sky-500/20 rounded-lg p-2.5 text-xs text-zinc-300">
                      <strong className="text-sky-400 block mb-0.5">Why this project sells fast:</strong>
                      <p className="text-[11px] leading-relaxed">{proj.whySellingWell}</p>
                    </div>

                    {/* Must-Include Features */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                        Included in Project Package:
                      </span>
                      {proj.includedFeatures.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-1.5 text-[11px] text-zinc-400">
                          <Check className="w-3 h-3 text-green-400 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-zinc-900">
                    <button
                      onClick={() => {
                        setSeoTopic(proj.title);
                        setSeoItemType('project');
                        setActiveTab('auto_seo');
                        handleGenerateSeo(proj.title, 'BCA', 'Final Year');
                      }}
                      className="flex-1 py-1.5 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-500/10"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>GENERATE PROJECT SEO TAGS</span>
                    </button>
                    <button
                      onClick={() => onExploreKeyword(proj.sampleGoogleSearches[0] || proj.title)}
                      className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-medium transition-colors"
                      title="View search trends graph"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: EXAM SEASON & SPIKE PREDICTION RADAR (FOR ADMIN) */}
      {/* ========================================================================= */}
      {activeTab === 'exam_radar' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Radar className="w-4 h-4 text-amber-400" />
                  <span>TU Exam Season Early-Warning Prediction Radar</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Google Trends telemetry detects sudden search velocity surges 2–3 weeks before TU Balkhu exam routine releases. Prepare study packages early to capture 100% of organic traffic.
                </p>
              </div>
              <button
                onClick={fetchRadar}
                disabled={isLoadingRadar}
                className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRadar ? 'animate-spin text-sky-400' : ''}`} />
                <span>Refresh Radar</span>
              </button>
            </div>
          </div>

          {/* Radar Alerts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {radarAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-zinc-950/80 border border-amber-500/30 rounded-xl p-5 shadow-xl space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-mono font-bold border border-sky-500/20">
                      {alert.faculty}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 text-[10px] font-mono border border-zinc-800">
                      {alert.semester}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">
                      {alert.spikePercentage} Surge
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Exam in ~{alert.daysUntilExamLikely}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white">
                  {alert.subjectOrEvent}
                </h4>

                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/80">
                  {alert.alertMessage}
                </p>

                {/* Required Action for Admin */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Action Required for Admin:</span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                    {alert.actionRequiredForAdmin}
                  </p>
                </div>

                {/* Target keywords list */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    High Surge Keywords to Publish Now:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {alert.targetKeywordsToTargetNow.map((kw, kIdx) => (
                      <span key={kIdx} className="px-2 py-0.5 rounded bg-zinc-900 text-sky-400 font-mono text-[11px] border border-zinc-800">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500 italic">{alert.historicalSearchPattern}</span>
                  <button
                    onClick={() => {
                      setSeoTopic(alert.subjectOrEvent);
                      setSeoFaculty(alert.faculty.split(' ')[0]);
                      setSeoSemester(alert.semester);
                      setActiveTab('auto_seo');
                      handleGenerateSeo(alert.subjectOrEvent, alert.faculty.split(' ')[0], alert.semester);
                    }}
                    className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-xs font-bold transition-colors"
                  >
                    Generate SEO Page
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: 24H LIVE STUDENT SEARCHES & MATERIALS DEMAND */}
      {/* ========================================================================= */}
      {activeTab === '24h_searches' && (
        <div className="space-y-6">
          {/* Summary Stat Highlights */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <span className="text-[11px] font-medium text-zinc-500 block">Total 24h TU Search Velocity</span>
                <div className="text-xl font-bold text-white mt-1 flex items-center gap-1.5">
                  <span>{stats.formattedTotalSearches}</span>
                  <span className="text-[10px] text-green-400 font-mono bg-green-500/10 px-1.5 py-0.5 rounded">
                    Live
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 block">Surge window: {stats.peakTrafficTimeWindow}</span>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <span className="text-[11px] font-medium text-zinc-500 block">Breakout Spikes (+400%+)</span>
                <div className="text-xl font-bold text-sky-400 mt-1 flex items-center gap-1.5">
                  <span>{stats.breakoutQueriesCount} Topics</span>
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 block">Urgent exam routines & question solutions</span>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <span className="text-[11px] font-medium text-zinc-500 block">Top Spiking Faculty</span>
                <div className="text-xl font-bold text-white mt-1">BCA & CSIT</div>
                <span className="text-[10px] text-zinc-400 mt-1 block">Highest search query volume in Nepal</span>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <span className="text-[11px] font-medium text-zinc-500 block">Top Demanded Format</span>
                <div className="text-xl font-bold text-green-400 mt-1">Solved PDF & Routine</div>
                <span className="text-[10px] text-zinc-400 mt-1 block">Direct 1-click download intent</span>
              </div>
            </div>
          )}

          {/* Filters & Faculty selector */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
            {/* Faculty Pills */}
            <div>
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                Filter by TU Faculty & Program
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FACULTIES.map((fac) => (
                  <button
                    key={fac.id}
                    onClick={() => setSelectedFaculty(fac.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      selectedFaculty === fac.id
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <span>{fac.icon}</span>
                    <span>{fac.label}</span>
                    <span className={`text-[10px] font-mono px-1 rounded ${selectedFaculty === fac.id ? 'bg-sky-600 text-white' : 'bg-zinc-900 text-zinc-500'}`}>
                      {fac.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Material Category & Search input */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-[11px] text-zinc-500 shrink-0">Material Type:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as TUMaterialCategory)}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  {MATERIAL_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchLiveSearches()}
                    placeholder="Search query, subject, or code..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <button
                  onClick={fetchLiveSearches}
                  disabled={isLoadingQueries}
                  className="p-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg transition-colors"
                  title="Refresh searches"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQueries ? 'animate-spin text-sky-400' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Queries Grid */}
          {isLoadingQueries ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-zinc-400 font-mono">Fetching 24h Tribhuvan University student search signals...</p>
            </div>
          ) : tuQueries.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-xs text-zinc-500">
              No matching search queries found for the selected faculty and category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tuQueries.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 shadow-lg transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {item.facultyLabel}
                        </span>
                        {item.semester && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                            {item.semester}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.isBreakout && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Flame className="w-3 h-3" />
                            {item.velocityGrowth}
                          </span>
                        )}
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-900 text-green-400 border border-zinc-800">
                          {item.formattedVolume} / 24h
                        </span>
                      </div>
                    </div>

                    {/* Primary Query Title */}
                    <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors leading-snug">
                      {item.query}
                    </h3>
                    {item.nepaliQuery && (
                      <p className="text-xs text-zinc-400 font-medium mt-1">
                        {item.nepaliQuery}
                      </p>
                    )}

                    {/* Subject / Material metadata */}
                    <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2.5 border-t border-zinc-900 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 text-zinc-300 font-mono">
                        <FileText className="w-3 h-3 text-sky-400" />
                        {item.materialTypeLabel}
                      </span>
                      <span className="text-zinc-700">&bull;</span>
                      <span className="flex items-center gap-1 text-zinc-400">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        Peak: {item.peakHour}
                      </span>
                    </div>

                    {/* Specific Student Questions Asked */}
                    {item.sampleQuestionsAsked && item.sampleQuestionsAsked.length > 0 && (
                      <div className="mt-3 bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-2.5 space-y-1.5">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                          What Students Asked Google:
                        </span>
                        {item.sampleQuestionsAsked.map((sq, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-1.5 text-xs text-zinc-300">
                            <ChevronRight className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{sq}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-900">
                    <button
                      onClick={() => handleExploreInternal(item.query)}
                      className="flex-1 py-1.5 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-500/10"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>GENERATE AUTO-SEO TAGS</span>
                    </button>
                    <button
                      onClick={() => {
                        setSeoTopic(item.query);
                        setSeoFaculty(item.faculty.toUpperCase());
                        setSeoSemester(item.semester || '');
                        setActiveTab('auto_seo');
                        handleGenerateSeo(item.query, item.faculty.toUpperCase(), item.semester);
                      }}
                      className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sky-400 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                      title="Generate SEO Tags for this search"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                      <span>OPEN</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: COMPETITOR VS MY SITE TRAFFIC & SEO AUDITOR */}
      {/* ========================================================================= */}
      {activeTab === 'competitor_audit' && (
        <div className="space-y-6">
          {/* URL Input & Audit Trigger */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-sky-400" />
                  <span>Educational Website Competitor & Traffic Comparison</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Compare your website against top Nepal education portals (Edusanjal, HamroCSIT, Collegenp) and find why they get more student traffic.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Your Website URL</label>
                <input
                  type="text"
                  value={mySiteUrl}
                  onChange={(e) => setMySiteUrl(e.target.value)}
                  placeholder="https://tunoteshub.vercel.app"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Competitor Website URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={competitorInput}
                    onChange={(e) => setCompetitorInput(e.target.value)}
                    placeholder="https://edusanjal.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-sky-400 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={handleRunAudit}
                    disabled={isAuditing}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-sky-500/10 shrink-0 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                    <span>{isAuditing ? 'AUDITING...' : 'RUN AUDIT'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Competitor Preset Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800 text-xs">
              <span className="text-[11px] text-zinc-500 font-medium">Quick Compare Presets:</span>
              {['https://edusanjal.com', 'https://hamrocsit.com', 'https://collegenp.com', 'https://saralnotes.com'].map((compUrl) => (
                <button
                  key={compUrl}
                  onClick={() => {
                    setCompetitorInput(compUrl);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                    competitorInput === compUrl
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {compUrl.replace('https://', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Results */}
          {isAuditing ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-16 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-sm font-bold text-white">Running Gemini 3.7 Flash Comparative SEO & Traffic Audit...</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Correlating keyword rankings, semester content depth, and notice publishing velocity
                </p>
              </div>
            </div>
          ) : auditResult ? (
            <div className="space-y-6">
              {/* Executive Summary Verdict Callout */}
              <div className="bg-zinc-950 border border-sky-500/30 rounded-xl p-5 shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Gemini AI Executive Verdict: Why Competitor Outperforms Your Site</span>
                </div>
                <p className="text-xs leading-relaxed text-zinc-200">
                  {auditResult.summaryVerdict}
                </p>
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Traffic Disparity Gap: <strong className="text-sky-400 font-mono">{auditResult.trafficGapRatio}x Higher Organic Volume</strong></span>
                  <span className="font-mono text-zinc-500">Model: gemini-3.7-flash</span>
                </div>
              </div>

              {/* Side-by-Side Comparison Table */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  <span>Side-by-Side Traffic & SEO Matrix</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* My Site Card */}
                  <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-sky-400 uppercase font-mono">YOUR WEBSITE</span>
                        <h4 className="text-sm font-bold text-white font-mono truncate">{auditResult.mySite.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                        Next.js Project
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900">
                      <div className="bg-zinc-900/60 p-2 rounded">
                        <span className="text-[10px] text-zinc-500 block">Monthly Organic Visits</span>
                        <span className="text-sm font-bold text-white font-mono">{auditResult.mySite.formattedMonthlyVisits}</span>
                      </div>
                      <div className="bg-zinc-900/60 p-2 rounded">
                        <span className="text-[10px] text-zinc-500 block">Daily Active Students</span>
                        <span className="text-sm font-bold text-white font-mono">{auditResult.mySite.dailyActiveStudents}</span>
                      </div>
                      <div className="bg-zinc-900/60 p-2 rounded">
                        <span className="text-[10px] text-zinc-500 block">Indexed TU Pages</span>
                        <span className="text-sm font-bold text-amber-400 font-mono">{auditResult.mySite.indexedPages} pages</span>
                      </div>
                      <div className="bg-zinc-900/60 p-2 rounded">
                        <span className="text-[10px] text-zinc-500 block">Mobile Speed Index</span>
                        <span className="text-sm font-bold text-green-400 font-mono">{auditResult.mySite.mobileSpeedScore}/100 ⚡</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-zinc-900 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-green-400 block mb-1">YOUR ADVANTAGES:</span>
                        {auditResult.mySite.strengths.map((s, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-zinc-300 text-[11px]">
                            <Check className="w-3 h-3 text-green-400 mt-0.5 shrink-0" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Competitor Card */}
                  {auditResult.competitors.map((comp, cIdx) => (
                    <div key={cIdx} className="bg-zinc-950/80 border border-sky-500/20 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">PRIMARY COMPETITOR</span>
                          <h4 className="text-sm font-bold text-white font-mono truncate">{comp.name}</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {comp.url.replace('https://', '')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900">
                        <div className="bg-zinc-900/60 p-2 rounded">
                          <span className="text-[10px] text-zinc-500 block">Monthly Organic Visits</span>
                          <span className="text-sm font-bold text-sky-400 font-mono">{comp.formattedMonthlyVisits}</span>
                        </div>
                        <div className="bg-zinc-900/60 p-2 rounded">
                          <span className="text-[10px] text-zinc-500 block">Daily Active Students</span>
                          <span className="text-sm font-bold text-sky-400 font-mono">{comp.dailyActiveStudents.toLocaleString()}</span>
                        </div>
                        <div className="bg-zinc-900/60 p-2 rounded">
                          <span className="text-[10px] text-zinc-500 block">Indexed TU Pages</span>
                          <span className="text-sm font-bold text-white font-mono">{comp.indexedPages.toLocaleString()} pages</span>
                        </div>
                        <div className="bg-zinc-900/60 p-2 rounded">
                          <span className="text-[10px] text-zinc-500 block">Domain Authority (DA)</span>
                          <span className="text-sm font-bold text-white font-mono">DA {comp.domainAuthority}/100</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-zinc-900 text-xs">
                        <span className="text-[10px] font-bold text-zinc-400 block">WHERE COMPETITOR CAPTURES TRAFFIC:</span>
                        {comp.topTrafficKeywords.map((kw, kIdx) => (
                          <div key={kIdx} className="flex items-center justify-between text-[11px] bg-zinc-900/40 px-2 py-1 rounded">
                            <span className="text-zinc-200 font-mono truncate">{kw.keyword}</span>
                            <span className="text-sky-400 font-mono font-bold shrink-0">{kw.estimatedClicks} clicks (Rank #{kw.rank})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep Reasoning: Why Competitor is Winning */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Key Factors Behind Competitor's Traffic Dominance</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {auditResult.whyCompetitorIsWinning.map((item, idx) => (
                    <div key={idx} className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {item.factor}
                        </span>
                        <span className="text-[10px] font-bold text-red-400">
                          {item.impact} Impact
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missed Keyword Gaps */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-3">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-sky-400" />
                  <span>High-Opportunity Keyword Gaps (Competitor #1 vs Your Site)</span>
                </h3>

                <div className="space-y-2">
                  {auditResult.missedKeywordGaps.map((gap, gIdx) => (
                    <div
                      key={gIdx}
                      className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-mono font-bold">
                            {gap.faculty}
                          </span>
                          <h4 className="font-bold text-white">{gap.keyword}</h4>
                        </div>
                        <p className="text-zinc-400 text-[11px]">
                          <strong>Action:</strong> {gap.recommendedAction}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-500 block font-mono">Opportunity</span>
                          <span className="text-xs font-bold text-green-400 font-mono">{gap.opportunityScore}/100</span>
                        </div>
                        <button
                          onClick={() => handleExploreInternal(gap.keyword)}
                          className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Generate SEO</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 6: NEXT.JS CODE GENERATOR FOR EDUCATION PROJECT */}
      {/* ========================================================================= */}
      {activeTab === 'nextjs_code' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-sky-400" />
                  <span>Next.js App Router Integration Code for TU Education Project</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Plug-and-play TypeScript routes, SEO schema generators, and live search telemetry fetchers for your Next.js project.
                </p>
              </div>

              {/* Code Snippet Tabs */}
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 shrink-0">
                <button
                  onClick={() => setActiveSnippetTab('page')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    activeSnippetTab === 'page'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Dynamic Subject Route (SSR + SEO)
                </button>
                <button
                  onClick={() => setActiveSnippetTab('api')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    activeSnippetTab === 'api'
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  App Router API Route
                </button>
              </div>
            </div>

            {/* Code Display Area */}
            <div className="relative bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <span className="text-[11px] font-mono text-zinc-500">
                  {activeSnippetTab === 'page' ? 'app/[faculty]/[semester]/[subject]/page.tsx' : 'app/api/tu-trends/route.ts'}
                </span>
                <button
                  onClick={() =>
                    handleCopyCode(
                      activeSnippetTab,
                      activeSnippetTab === 'page' ? snippets.dynamicRoute || '' : snippets.apiRoute || ''
                    )
                  }
                  className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium transition-colors"
                >
                  {copiedCodeKey === activeSnippetTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="text-xs font-mono text-sky-400 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {activeSnippetTab === 'page'
                  ? snippets.dynamicRoute || '// Loading code snippet...'
                  : snippets.apiRoute || '// Loading code snippet...'}
              </pre>
            </div>

            {/* Implementation Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3 text-xs">
                <span className="font-bold text-white block mb-1">1. Programmatic SEO Pages</span>
                <p className="text-zinc-400 text-[11px]">
                  Next.js App Router dynamically generates URLs for every TU faculty, semester, and course to capture long-tail student searches.
                </p>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3 text-xs">
                <span className="font-bold text-white block mb-1">2. Schema.org Rich Snippets</span>
                <p className="text-zinc-400 text-[11px]">
                  Includes structured JSON-LD <code className="text-sky-400 font-mono">LearningResource</code> schema so Google displays rich course snippets.
                </p>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3 text-xs">
                <span className="font-bold text-white block mb-1">3. ISR Revalidation (Cache)</span>
                <p className="text-zinc-400 text-[11px]">
                  Uses <code className="text-sky-400 font-mono">next: &#123; revalidate: 600 &#125;</code> to serve sub-millisecond cached pages while staying up to date.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
