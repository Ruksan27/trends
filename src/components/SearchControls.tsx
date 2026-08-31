import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Search, 
  Globe, 
  Calendar, 
  SlidersHorizontal, 
  Sparkles, 
  Layers
} from 'lucide-react';
import { COUNTRIES, TIME_RANGES, CATEGORIES, KEYWORD_COLORS } from '../data/countries';
import { PRESET_COMPARISONS, PresetComparison } from '../data/presets';
import { TimeRange } from '../types';

interface SearchControlsProps {
  keywords: string[];
  setKeywords: (kws: string[]) => void;
  timeRange: TimeRange;
  setTimeRange: (t: TimeRange) => void;
  geo: string;
  setGeo: (g: string) => void;
  category: number;
  setCategory: (c: number) => void;
  onSearch: () => void;
  isLoading: boolean;
  onSelectPreset: (preset: PresetComparison) => void;
}

export const SearchControls: React.FC<SearchControlsProps> = ({
  keywords,
  setKeywords,
  timeRange,
  setTimeRange,
  geo,
  setGeo,
  category,
  setCategory,
  onSearch,
  isLoading,
  onSelectPreset,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    if (keywords.includes(trimmed)) {
      setInputVal('');
      return;
    }
    if (keywords.length >= 5) {
      return;
    }
    setKeywords([...keywords, trimmed]);
    setInputVal('');
  };

  const handleRemoveKeyword = (indexToRemove: number) => {
    if (keywords.length <= 1) return; // Keep at least one
    setKeywords(keywords.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl">
      <div className="space-y-4">
        
        {/* Top: Keyword Chips & Add input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span>Search Terms to Compare ({keywords.length}/5)</span>
            </label>
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors font-medium"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showPresets ? 'Hide Presets' : 'Browse Presets'}</span>
            </button>
          </div>

          {/* Preset list expander */}
          {showPresets && (
            <div className="mb-3 p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl">
              <p className="text-xs text-zinc-400 mb-2 font-medium">Quick comparison presets:</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_COMPARISONS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset);
                      setShowPresets(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-sky-400 rounded-lg text-xs transition-all text-left font-medium"
                  >
                    <span>{preset.title}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">({preset.keywords.length})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keywords input and tags flex container */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-zinc-950/60 border border-zinc-800 rounded-xl min-h-[50px] focus-within:border-sky-500/60 focus-within:ring-2 focus-within:ring-sky-500/10 transition-all">
            {keywords.map((kw, idx) => {
              const color = KEYWORD_COLORS[idx % KEYWORD_COLORS.length];
              return (
                <div
                  key={kw}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border animate-in fade-in zoom-in-95 duration-150"
                  style={{
                    backgroundColor: `${color}15`,
                    borderColor: `${color}40`,
                    color: color,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span>{kw}</span>
                  {keywords.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(idx)}
                      className="hover:opacity-75 transition-opacity ml-1 p-0.5 rounded-full hover:bg-white/10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {keywords.length < 5 && (
              <form onSubmit={handleAddKeyword} className="flex-1 min-w-[160px] flex items-center">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={keywords.length === 0 ? "Enter keyword..." : "+ Add comparison term"}
                  className="w-full bg-transparent px-2 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
                {inputVal && (
                  <button
                    type="submit"
                    className="p-1 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-xs mr-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Filter controls row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
          
          {/* Time Range */}
          <div>
            <label className="text-[11px] font-medium text-zinc-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-500" />
              <span>Timeframe</span>
            </label>
            <select
              id="select-time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
            >
              {TIME_RANGES.map((t) => (
                <option key={t.value} value={t.value} className="bg-zinc-900 text-zinc-200">
                  {t.label} ({t.description})
                </option>
              ))}
            </select>
          </div>

          {/* Country / Geo */}
          <div>
            <label className="text-[11px] font-medium text-zinc-400 mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-zinc-500" />
              <span>Geographic Region</span>
            </label>
            <select
              id="select-geo"
              value={geo}
              onChange={(e) => setGeo(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-zinc-900 text-zinc-200">
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-[11px] font-medium text-zinc-400 mb-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-zinc-500" />
              <span>Search Category</span>
            </label>
            <select
              id="select-category"
              value={category}
              onChange={(e) => setCategory(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-zinc-900 text-zinc-200">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Query Execute Button */}
          <div className="flex items-end">
            <button
              id="btn-fetch-trends"
              onClick={onSearch}
              disabled={isLoading || keywords.length === 0}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-lg shadow-sky-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-[36px]"
            >
              <Search className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'QUERYING...' : 'RUN TELEMETRY QUERY'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
