import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  Brush,
} from 'recharts';
import { TimelinePoint, KeywordMetric } from '../types';
import { KEYWORD_COLORS } from '../data/countries';
import { 
  TrendingUp, 
  Layers, 
  Maximize2, 
  BarChart2, 
  HelpCircle 
} from 'lucide-react';

interface InterestTimelineChartProps {
  timeline: TimelinePoint[];
  keywords: string[];
  metrics: KeywordMetric[];
  isLoading: boolean;
}

export const InterestTimelineChart: React.FC<InterestTimelineChartProps> = ({
  timeline,
  keywords,
  metrics,
  isLoading,
}) => {
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [showBrush, setShowBrush] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-96 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-zinc-400 font-mono">Querying Google Trends interest telemetry...</p>
      </div>
    );
  }

  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-96 flex flex-col items-center justify-center space-y-2 text-center">
        <BarChart2 className="w-8 h-8 text-zinc-600" />
        <p className="text-sm font-bold text-zinc-300">No timeline data available</p>
        <p className="text-xs text-zinc-500 max-w-sm">
          Try expanding the time range or selecting broader comparison terms.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-5">
      
      {/* Top Header with title & toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight">Interest Over Time</h2>
            <div className="group relative">
              <HelpCircle className="w-3.5 h-3.5 text-zinc-500 cursor-help" />
              <div className="absolute left-0 bottom-full mb-1.5 hidden group-hover:block w-64 p-2 bg-zinc-950 border border-zinc-700 rounded-lg text-[11px] text-zinc-300 shadow-xl z-50">
                Numbers represent search interest relative to the highest point on the chart for the given region and time. A value of 100 is peak popularity.
              </div>
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            Average interest score and normalized velocity (0 - 100)
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-zinc-950 p-1 rounded-lg border border-zinc-800 flex items-center">
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                chartType === 'area'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                chartType === 'line'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Line
            </button>
          </div>

          <button
            onClick={() => setShowBrush(!showBrush)}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              showBrush 
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-400' 
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
            title="Toggle Timeline Zoom/Pan Brush"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards per Keyword */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map((m, idx) => {
          const color = KEYWORD_COLORS[idx % KEYWORD_COLORS.length];
          return (
            <div
              key={m.keyword}
              className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3.5 relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: color }}
              />
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-zinc-200 truncate max-w-[100px]">
                  {m.keyword}
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
              </div>

              <div className="flex items-baseline justify-between mt-2">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Avg Score</div>
                  <div className="text-xl font-bold text-white font-mono">{m.averageInterest}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Peak</div>
                  <div className="text-xs font-bold text-green-400 font-mono">
                    {m.peakInterest}/100
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Main Visualizer */}
      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {keywords.map((kw, idx) => {
                  const color = KEYWORD_COLORS[idx % KEYWORD_COLORS.length];
                  return (
                    <linearGradient key={kw} id={`grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#71717a" 
                fontSize={11} 
                tickLine={false}
                dy={6}
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={11} 
                domain={[0, 100]} 
                tickLine={false}
                dx={-6}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#09090b', 
                  borderColor: '#27272a', 
                  borderRadius: '0.75rem', 
                  fontSize: '12px',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                  color: '#fafafa'
                }}
                labelStyle={{ color: '#a1a1aa', fontWeight: 600, marginBottom: '4px' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} 
              />
              {keywords.map((kw, idx) => {
                const color = KEYWORD_COLORS[idx % KEYWORD_COLORS.length];
                return (
                  <Area
                    key={kw}
                    type="monotone"
                    dataKey={kw}
                    stroke={color}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#grad-${idx})`}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                  />
                );
              })}
              {showBrush && (
                <Brush 
                  dataKey="date" 
                  height={24} 
                  stroke="#0ea5e9" 
                  fill="#18181b" 
                />
              )}
            </AreaChart>
          ) : (
            <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#71717a" 
                fontSize={11} 
                tickLine={false}
                dy={6}
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={11} 
                domain={[0, 100]} 
                tickLine={false}
                dx={-6}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#09090b', 
                  borderColor: '#27272a', 
                  borderRadius: '0.75rem', 
                  fontSize: '12px',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                  color: '#fafafa'
                }}
                labelStyle={{ color: '#a1a1aa', fontWeight: 600, marginBottom: '4px' }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} 
              />
              {keywords.map((kw, idx) => {
                const color = KEYWORD_COLORS[idx % KEYWORD_COLORS.length];
                return (
                  <Line
                    key={kw}
                    type="monotone"
                    dataKey={kw}
                    stroke={color}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                  />
                );
              })}
              {showBrush && (
                <Brush 
                  dataKey="date" 
                  height={24} 
                  stroke="#0ea5e9" 
                  fill="#18181b" 
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

    </div>
  );
};
