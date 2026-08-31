import React, { useState } from 'react';
import { Header } from './components/Header';
import { TuEducationIntelligence } from './components/TuEducationIntelligence';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* App Header */}
      <Header 
        onRefreshData={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between text-xs text-red-300 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-400 hover:text-white underline font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dedicated TU Notes Hub SEO & Education Intelligence Engine */}
        <TuEducationIntelligence key={refreshKey} />

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="font-semibold text-white">TU Notes Hub</span>
            <span>&bull;</span>
            <span>Nepal Higher Education Search Telemetry & Programmatic SEO</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-500 font-mono text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              24h Live Stream
            </span>
            <span className="text-zinc-800">|</span>
            <span>Tribhuvan University IOST &bull; FOM &bull; FOHSS &bull; IOE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
