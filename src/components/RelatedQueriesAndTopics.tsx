import React, { useState } from 'react';
import { RelatedQueryItem, RelatedTopicItem } from '../types';
import { 
  Sparkles, 
  TrendingUp, 
  Plus, 
  Hash, 
  Layers, 
  ExternalLink,
  Flame
} from 'lucide-react';

interface RelatedQueriesAndTopicsProps {
  keywords: string[];
  activeKeyword: string;
  setActiveKeyword: (kw: string) => void;
  relatedQueries: { top: RelatedQueryItem[]; rising: RelatedQueryItem[] };
  relatedTopics: { top: RelatedTopicItem[]; rising: RelatedTopicItem[] };
  onAddComparisonTerm: (term: string) => void;
  isLoading: boolean;
}

export const RelatedQueriesAndTopics: React.FC<RelatedQueriesAndTopicsProps> = ({
  keywords,
  activeKeyword,
  setActiveKeyword,
  relatedQueries,
  relatedTopics,
  onAddComparisonTerm,
  isLoading,
}) => {
  const [subTab, setSubTab] = useState<'queries' | 'topics'>('queries');

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
      
      {/* Top Header with Keyword Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Related Search Intelligence</span>
          </h3>
          <p className="text-xs text-zinc-500">
            Top keywords and breakout rising topics associated with your search
          </p>
        </div>

        {/* Selected Keyword Pill Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {keywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setActiveKeyword(kw)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeKeyword === kw
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tab switcher: Queries vs Topics */}
      <div className="flex items-center justify-between">
        <div className="bg-zinc-950 p-1 rounded-lg border border-zinc-800 flex items-center">
          <button
            onClick={() => setSubTab('queries')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              subTab === 'queries'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Related Queries</span>
          </button>
          <button
            onClick={() => setSubTab('topics')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              subTab === 'topics'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Related Topics</span>
          </button>
        </div>

        <span className="text-[11px] text-zinc-500 hidden sm:inline font-medium">
          Telemetry for <strong className="text-zinc-300">"{activeKeyword}"</strong>
        </span>
      </div>

      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-2">
          <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-mono">Fetching related telemetry...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          
          {/* Column 1: Top Queries / Topics (Index 0-100) */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                <span>Top {subTab === 'queries' ? 'Queries' : 'Topics'}</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Index Score</span>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {subTab === 'queries' ? (
                relatedQueries.top.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">No top queries found</p>
                ) : (
                  relatedQueries.top.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-all"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="text-zinc-600 font-mono text-[10px] w-4">{idx + 1}.</span>
                        <span className="text-zinc-200 group-hover:text-sky-300 transition-colors truncate">
                          {item.query}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-zinc-400 font-mono text-[11px] font-medium bg-zinc-800 px-2 py-0.5 rounded">
                          {item.formattedValue}
                        </span>
                        <button
                          onClick={() => onAddComparisonTerm(item.query)}
                          className="opacity-0 group-hover:opacity-100 p-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-[10px] transition-all"
                          title="Add as comparison term"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                relatedTopics.top.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">No top topics found</p>
                ) : (
                  relatedTopics.top.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-all"
                    >
                      <div className="truncate pr-2">
                        <div className="text-zinc-200 group-hover:text-sky-300 font-medium truncate">
                          {item.topicTitle}
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate">{item.topicType}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-zinc-400 font-mono text-[11px] font-medium bg-zinc-800 px-2 py-0.5 rounded">
                          {item.formattedValue}
                        </span>
                        <button
                          onClick={() => onAddComparisonTerm(item.topicTitle)}
                          className="opacity-0 group-hover:opacity-100 p-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-[10px] transition-all"
                          title="Add as comparison term"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

          {/* Column 2: Rising & Breakout Queries / Topics */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Rising & Breakout</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Growth %</span>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {subTab === 'queries' ? (
                relatedQueries.rising.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">No rising queries found</p>
                ) : (
                  relatedQueries.rising.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-all"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="text-zinc-600 font-mono text-[10px] w-4">{idx + 1}.</span>
                        <span className="text-zinc-200 group-hover:text-amber-300 transition-colors truncate">
                          {item.query}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.hasBreakout ? (
                          <span className="text-amber-300 font-mono text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <Flame className="w-2.5 h-2.5" />
                            Breakout
                          </span>
                        ) : (
                          <span className="text-green-400 font-mono text-[11px] font-medium bg-green-500/10 px-2 py-0.5 rounded">
                            {item.formattedValue}
                          </span>
                        )}
                        <button
                          onClick={() => onAddComparisonTerm(item.query)}
                          className="opacity-0 group-hover:opacity-100 p-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] transition-all"
                          title="Add as comparison term"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : (
                relatedTopics.rising.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">No rising topics found</p>
                ) : (
                  relatedTopics.rising.map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-xs transition-all"
                    >
                      <div className="truncate pr-2">
                        <div className="text-zinc-200 group-hover:text-amber-300 font-medium truncate">
                          {item.topicTitle}
                        </div>
                        <div className="text-[10px] text-zinc-500 truncate">{item.topicType}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.hasBreakout ? (
                          <span className="text-amber-300 font-mono text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <Flame className="w-2.5 h-2.5" />
                            Breakout
                          </span>
                        ) : (
                          <span className="text-green-400 font-mono text-[11px] font-medium bg-green-500/10 px-2 py-0.5 rounded">
                            {item.formattedValue}
                          </span>
                        )}
                        <button
                          onClick={() => onAddComparisonTerm(item.topicTitle)}
                          className="opacity-0 group-hover:opacity-100 p-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] transition-all"
                          title="Add as comparison term"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
