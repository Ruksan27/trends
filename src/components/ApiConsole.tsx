import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Code2, 
  FileJson, 
  Layers, 
  Send, 
  Clock, 
  CheckCircle2, 
  Globe 
} from 'lucide-react';
import { ApiResponseMeta } from '../types';

interface ApiConsoleProps {
  currentKeywords: string[];
  currentTimeRange: string;
  currentGeo: string;
  activeEndpointData: any;
  endpointMeta?: ApiResponseMeta;
}

export const ApiConsole: React.FC<ApiConsoleProps> = ({
  currentKeywords,
  currentTimeRange,
  currentGeo,
  activeEndpointData,
  endpointMeta,
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/trends/interest-over-time');
  const [activeLang, setActiveLang] = useState<'node' | 'python' | 'curl' | 'fetch'>('node');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [snippets, setSnippets] = useState<{ [lang: string]: string }>({});
  const [liveResponse, setLiveResponse] = useState<any>(activeEndpointData);
  const [liveMeta, setLiveMeta] = useState<ApiResponseMeta | undefined>(endpointMeta);
  const [isExecuting, setIsExecuting] = useState(false);
  const [customKeywords, setCustomKeywords] = useState(currentKeywords.join(', '));
  const [customGeo, setCustomGeo] = useState(currentGeo);
  const [customTimeRange, setCustomTimeRange] = useState(currentTimeRange);

  useEffect(() => {
    setCustomKeywords(currentKeywords.join(', '));
    setCustomGeo(currentGeo);
    setCustomTimeRange(currentTimeRange);
  }, [currentKeywords, currentGeo, currentTimeRange]);

  // Fetch Code Snippets
  const fetchSnippets = async () => {
    try {
      const res = await fetch(
        `/api/trends/code-snippets?keywords=${encodeURIComponent(customKeywords)}&geo=${encodeURIComponent(customGeo)}&timeRange=${encodeURIComponent(customTimeRange)}`
      );
      const data = await res.json();
      if (data.snippets) {
        setSnippets(data.snippets);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, [customKeywords, customGeo, customTimeRange]);

  // Execute Live API Request
  const handleExecuteRequest = async () => {
    setIsExecuting(true);
    const start = Date.now();
    try {
      let url = selectedEndpoint;
      if (selectedEndpoint === '/api/trends/interest-over-time' || selectedEndpoint === '/api/trends/interest-by-region') {
        url += `?keywords=${encodeURIComponent(customKeywords)}&timeRange=${encodeURIComponent(customTimeRange)}&geo=${encodeURIComponent(customGeo)}`;
      } else if (selectedEndpoint === '/api/trends/related-queries' || selectedEndpoint === '/api/trends/related-topics') {
        const firstKw = customKeywords.split(',')[0].trim() || 'Google';
        url += `?keyword=${encodeURIComponent(firstKw)}&timeRange=${encodeURIComponent(customTimeRange)}&geo=${encodeURIComponent(customGeo)}`;
      } else if (selectedEndpoint === '/api/trends/daily-trends') {
        url += `?geo=${encodeURIComponent(customGeo || 'US')}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setLiveResponse(data);
      setLiveMeta(data.meta || {
        endpoint: selectedEndpoint,
        latencyMs: Date.now() - start,
        status: res.status,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      setLiveResponse({ error: err.message });
      setLiveMeta({
        endpoint: selectedEndpoint,
        latencyMs: Date.now() - start,
        status: 500,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyCode = () => {
    const code = snippets[activeLang] || '';
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(liveResponse || activeEndpointData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg">
            <Terminal className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Interactive Google Trends API Playground & Code Generator
            </h2>
            <p className="text-xs text-zinc-500">
              Test live endpoints, inspect structured response payloads, and generate ready-to-run code in Node.js, Python, and cURL.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Request Configurator & Code Snippets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Endpoint selection & params */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Endpoint & Query Parameters</span>
            </h3>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 mb-1 block">API Endpoint</label>
              <select
                value={selectedEndpoint}
                onChange={(e) => setSelectedEndpoint(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-sky-400 focus:outline-none focus:border-sky-500"
              >
                <option value="/api/trends/interest-over-time">GET /api/trends/interest-over-time</option>
                <option value="/api/trends/interest-by-region">GET /api/trends/interest-by-region</option>
                <option value="/api/trends/related-queries">GET /api/trends/related-queries</option>
                <option value="/api/trends/related-topics">GET /api/trends/related-topics</option>
                <option value="/api/trends/daily-trends">GET /api/trends/daily-trends</option>
              </select>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 mb-1 block">
                  Keywords (comma separated)
                </label>
                <input
                  type="text"
                  value={customKeywords}
                  onChange={(e) => setCustomKeywords(e.target.value)}
                  placeholder="e.g. React, Vue, Svelte"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 mb-1 block">Time Range</label>
                  <input
                    type="text"
                    value={customTimeRange}
                    onChange={(e) => setCustomTimeRange(e.target.value)}
                    placeholder="today 12-m"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-zinc-400 mb-1 block">Geo Code</label>
                  <input
                    type="text"
                    value={customGeo}
                    onChange={(e) => setCustomGeo(e.target.value)}
                    placeholder="US or empty"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleExecuteRequest}
              disabled={isExecuting}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-sky-500/10 transition-all disabled:opacity-50"
            >
              <Send className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
              <span>{isExecuting ? 'EXECUTING REQUEST...' : 'SEND LIVE REQUEST'}</span>
            </button>
          </div>

          {/* Code Snippets Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Code Generator</span>
              </h3>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Language Tabs */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setActiveLang('node')}
                className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${
                  activeLang === 'node' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Node.js
              </button>
              <button
                onClick={() => setActiveLang('python')}
                className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${
                  activeLang === 'python' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Python
              </button>
              <button
                onClick={() => setActiveLang('curl')}
                className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${
                  activeLang === 'curl' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setActiveLang('fetch')}
                className={`flex-1 py-1 text-xs font-bold rounded-md transition-all ${
                  activeLang === 'fetch' ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Fetch
              </button>
            </div>

            {/* Code Block */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 overflow-x-auto max-h-72">
              <pre className="text-[11px] font-mono text-sky-400 whitespace-pre-wrap leading-relaxed">
                {snippets[activeLang] || '// Loading snippet...'}
              </pre>
            </div>
          </div>

        </div>

        {/* Right Col: Raw JSON Response Viewer (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl space-y-4 h-full flex flex-col">
            
            {/* Header with status badges and copy */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Live Response Payload
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {liveMeta && (
                  <>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" />
                      HTTP {liveMeta.status || 200}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-zinc-400 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      {liveMeta.latencyMs || 45}ms
                    </span>
                  </>
                )}

                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-medium transition-colors"
                >
                  {copiedJson ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>

            {/* JSON Code Viewer */}
            <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-auto max-h-[560px]">
              <pre className="text-xs font-mono text-zinc-300 leading-relaxed">
                {JSON.stringify(liveResponse || activeEndpointData || { message: 'Execute a query to inspect live payload' }, null, 2)}
              </pre>
            </div>

            {/* Schema Note */}
            <div className="text-[11px] text-zinc-500 flex items-center justify-between pt-1 font-mono">
              <span>Schema: {'{ success, meta: { latencyMs, status }, ...data }'}</span>
              <span className="text-zinc-400">Content-Type: application/json</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
