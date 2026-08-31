import React, { useState, useEffect } from 'react';
import { DailyTrendingItem } from '../types';
import { COUNTRIES } from '../data/countries';
import { 
  Flame, 
  Globe, 
  ExternalLink, 
  Search, 
  TrendingUp, 
  Clock, 
  Newspaper, 
  RefreshCw 
} from 'lucide-react';

interface DailyTrendingViewProps {
  onExploreKeyword: (keyword: string) => void;
}

export const DailyTrendingView: React.FC<DailyTrendingViewProps> = ({
  onExploreKeyword,
}) => {
  const [selectedGeo, setSelectedGeo] = useState('US');
  const [trendingList, setTrendingList] = useState<DailyTrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDailyTrends = async (geo: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/trends/daily-trends?geo=${geo}`);
      const data = await res.json();
      if (data.success) {
        setTrendingList(data.trendingSearches || []);
      } else {
        setError(data.error || 'Could not fetch daily trends');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching daily trends');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyTrends(selectedGeo);
  }, [selectedGeo]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Filter */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Daily Real-Time Trending Searches
            </h2>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Live high-velocity search surges with news validation and verified traffic estimates
          </p>
        </div>

        {/* Geo Selector and Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5">
            <Globe className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={selectedGeo}
              onChange={(e) => setSelectedGeo(e.target.value)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
            >
              {COUNTRIES.filter((c) => c.code !== '').map((c) => (
                <option key={c.code} value={c.code} className="bg-zinc-900 text-zinc-200">
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fetchDailyTrends(selectedGeo)}
            disabled={isLoading}
            className="p-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg text-xs transition-colors"
            title="Refresh trends"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content list */}
      {isLoading ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-mono">Querying real-time daily trend feeds...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center text-xs text-red-400">
          {error}
        </div>
      ) : trendingList.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-xs text-zinc-500">
          No active trending searches reported for this region today.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingList.map((item, idx) => (
            <div
              key={idx}
              className="bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              {/* Header: Title, rank, volume */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800 shrink-0">
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                          <TrendingUp className="w-3 h-3" />
                          {item.formattedTraffic} searches
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.pictureUrl && (
                    <img
                      src={item.pictureUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-zinc-800 shrink-0"
                    />
                  )}
                </div>

                {/* News Articles */}
                {item.newsArticles && item.newsArticles.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-zinc-800/80 space-y-2">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                      <Newspaper className="w-3 h-3 text-zinc-500" />
                      <span>Associated News Coverage</span>
                    </div>

                    {item.newsArticles.slice(0, 2).map((article, aIdx) => (
                      <a
                        key={aIdx}
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-2.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-xs"
                      >
                        <div className="text-zinc-200 font-medium line-clamp-1 hover:text-sky-300">
                          {article.title}
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-zinc-500">
                          <span className="font-semibold text-sky-400">{article.source}</span>
                          {article.timeAgo && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              {article.timeAgo}
                            </span>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                {/* Related breakout terms */}
                {item.relatedQueries && item.relatedQueries.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.relatedQueries.map((rq, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded font-mono"
                      >
                        {rq}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Action: Explore in Trends */}
              <button
                onClick={() => onExploreKeyword(item.title)}
                className="w-full mt-2 py-2 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-sky-500/10"
              >
                <Search className="w-3.5 h-3.5" />
                <span>ANALYZE IN DASHBOARD</span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
