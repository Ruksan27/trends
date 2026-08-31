import React, { useState } from 'react';
import { RegionalDataPoint } from '../types';
import { KEYWORD_COLORS } from '../data/countries';
import { Globe, MapPin, Search, ArrowUpDown } from 'lucide-react';

interface RegionalBreakdownProps {
  regions: RegionalDataPoint[];
  keywords: string[];
  isLoading: boolean;
}

export const RegionalBreakdown: React.FC<RegionalBreakdownProps> = ({
  regions,
  keywords,
  isLoading,
}) => {
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState<'volume' | 'name'>('volume');

  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-80 flex flex-col items-center justify-center space-y-2">
        <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-zinc-400 font-mono">Loading geographic telemetry...</p>
      </div>
    );
  }

  const filteredRegions = regions
    .filter((r) => r.geoName.toLowerCase().includes(filterText.toLowerCase()) || r.geoCode.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.geoName.localeCompare(b.geoName);
      return b.maxValue - a.maxValue;
    });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Top Regions</h3>
          </div>
          <p className="text-xs text-zinc-500">
            Regional breakdown of search popularity share
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter country..."
              className="bg-zinc-950 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-sky-500 w-36 sm:w-44"
            />
          </div>

          {/* Sort toggle */}
          <button
            onClick={() => setSortBy(sortBy === 'volume' ? 'name' : 'volume')}
            className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
            title="Toggle sort"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Region List Bars */}
      {filteredRegions.length === 0 ? (
        <div className="text-center py-10 text-xs text-zinc-500">
          No matching regional data found.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {filteredRegions.map((region, rIdx) => {
            const vals = Object.values(region.values) as number[];
            const total = vals.reduce((a: number, b: number) => a + b, 0) || 1;

            return (
              <div
                key={region.geoCode || rIdx}
                className="bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-3 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-semibold text-zinc-200">
                      {region.geoName}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {region.geoCode}
                    </span>
                  </div>

                  {region.dominantKeyword && (
                    <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
                      <span>Dominant:</span>
                      <span className="text-sky-400 font-semibold">{region.dominantKeyword}</span>
                    </span>
                  )}
                </div>

                {/* Stacked comparison bar */}
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
                  {keywords.map((kw, kIdx) => {
                    const val = region.values[kw] || 0;
                    const percent = (val / total) * 100;
                    const color = KEYWORD_COLORS[kIdx % KEYWORD_COLORS.length];

                    if (percent <= 0) return null;

                    return (
                      <div
                        key={kw}
                        style={{
                          width: `${percent}%`,
                          backgroundColor: color,
                        }}
                        title={`${kw}: ${val} (${Math.round(percent)}%)`}
                        className="h-full transition-all duration-300 hover:opacity-80"
                      />
                    );
                  })}
                </div>

                {/* Legend score details */}
                <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px]">
                  {keywords.map((kw, kIdx) => {
                    const val = region.values[kw] || 0;
                    const color = KEYWORD_COLORS[kIdx % KEYWORD_COLORS.length];
                    return (
                      <div key={kw} className="flex items-center gap-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-zinc-400">{kw}:</span>
                        <span className="text-zinc-200 font-mono font-medium">{val}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
