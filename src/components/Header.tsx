import React from 'react';
import { 
  GraduationCap, 
  Share2, 
  Check, 
  Flame,
  FileCode2,
  RefreshCw
} from 'lucide-react';

interface HeaderProps {
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onRefreshData,
  isRefreshing = false,
}) => {
  const [copiedShare, setCopiedShare] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20 border border-sky-400/30">
              <GraduationCap className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  TU Notes Hub <span className="text-sky-400 font-semibold text-sm">SEO Engine</span>
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Nepal Live 24h Radar
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Auto-SEO Generator &bull; Marketplace Trending Projects &bull; Exam Season Radar &bull; Competitor Auditor
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onRefreshData && (
              <button
                onClick={onRefreshData}
                disabled={isRefreshing}
                title="Refresh Nepal Search Telemetry"
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh Data</span>
              </button>
            )}

            {/* Share / Copy link button */}
            <button
              id="btn-share"
              onClick={handleCopyLink}
              title="Share Link"
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-sky-500/10"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>SHARE</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

