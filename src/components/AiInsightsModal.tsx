import React from 'react';
import { 
  Sparkles, 
  X, 
  TrendingUp, 
  Compass, 
  MapPin, 
  Target, 
  CheckCircle, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { TrendAnalysisResult } from '../types';

interface AiInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: TrendAnalysisResult | null;
  isLoading: boolean;
  keywords: string[];
}

export const AiInsightsModal: React.FC<AiInsightsModalProps> = ({
  isOpen,
  onClose,
  insights,
  isLoading,
  keywords,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shadow-lg shadow-sky-500/10">
              <Sparkles className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Gemini AI Trend Intelligence
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  gemini-3.7-flash
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Deep analytical synthesis for: <strong className="text-zinc-200">{keywords.join(' vs ')}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-sm font-semibold text-white">Synthesizing Search Telemetry...</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Correlating inflection points, seasonality, and regional demand dynamics
                </p>
              </div>
            </div>
          ) : !insights ? (
            <div className="text-center py-16 text-zinc-400 text-sm">
              No analysis available. Click "AI Analysis" to generate insights.
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Executive Summary */}
              <div className="bg-zinc-950/80 border border-sky-500/30 rounded-xl p-4.5 space-y-2">
                <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  <span>Executive Synthesis</span>
                </div>
                <p className="text-xs leading-relaxed text-zinc-200">
                  {insights.summary}
                </p>
                {insights.dominantTerm && (
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-400">
                    <span className="font-semibold text-zinc-300">Dominance Vector:</span>
                    <span className="text-sky-400 font-medium">{insights.dominantTerm}</span>
                  </div>
                )}
              </div>

              {/* Key Catalysts / Drivers */}
              {insights.keyDrivers && insights.keyDrivers.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-sky-400" />
                    <span>Primary Demand Drivers & Catalysts</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {insights.keyDrivers.map((driver, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                        <span>{driver}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inflection Points & Events */}
              {insights.inflectionPoints && insights.inflectionPoints.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Identified Spikes & Critical Inflection Points</span>
                  </h4>
                  <div className="space-y-2">
                    {insights.inflectionPoints.map((inf, idx) => (
                      <div
                        key={idx}
                        className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{inf.event}</span>
                            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-mono">
                              {inf.keyword}
                            </span>
                          </div>
                          <p className="text-zinc-400 text-[11px]">{inf.significance}</p>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500 shrink-0 bg-zinc-900 px-2 py-1 rounded">
                          {inf.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regional & Forward Outlook */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-1.5">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Regional Dynamics</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {insights.regionalInsights}
                  </p>
                </div>

                <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-1.5">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                    <span>Forward Outlook (6-12 Mo)</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {insights.futureOutlook}
                  </p>
                </div>
              </div>

              {/* Strategic Takeaways */}
              {insights.strategicTakeaways && insights.strategicTakeaways.length > 0 && (
                <div className="bg-zinc-950/80 border border-sky-500/20 rounded-xl p-4 space-y-2.5">
                  <div className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-sky-400" />
                    <span>Actionable Recommendations & Strategy</span>
                  </div>
                  <div className="space-y-1.5">
                    {insights.strategicTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <ArrowRight className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 font-mono">
            Powered by Google GenAI SDK & Gemini Intelligence
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium transition-colors"
          >
            Close Analysis
          </button>
        </div>

      </div>
    </div>
  );
};
