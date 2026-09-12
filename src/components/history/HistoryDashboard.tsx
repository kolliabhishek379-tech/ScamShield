import React, { useState, useEffect } from 'react';
import { History, Trash2, ShieldAlert, ShieldCheck, AlertTriangle, HelpCircle, Filter, Sparkles, ExternalLink } from 'lucide-react';
import { AIService } from '../../services/aiService';
import { ContentType, RiskLevel, ScanHistoryItem } from '../../types/analysis';
import { getRiskBadgeClasses } from '../../services/riskEngine';

interface HistoryDashboardProps {
  onSelectScanItem?: (item: ScanHistoryItem) => void;
  onOpenScanner: () => void;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({ onOpenScanner }) => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const loadHistory = () => {
    setHistory(AIService.getHistory());
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = () => {
    if (confirm('Clear local scan history? (This removes local records stored in your browser).')) {
      AIService.clearHistory();
      loadHistory();
    }
  };

  const filteredHistory = history.filter((item) => {
    if (filterType !== 'all' && item.contentType !== filterType) return false;
    if (filterLevel !== 'all' && item.riskLevel !== filterLevel) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Local Scan History</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Private records preserved strictly in your local browser cache. Original media files are never stored.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Privacy guarantee banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span className="font-mono text-[11px]">
          🔒 Zero Cloud Storage: Scan history exists entirely in your browser's private localStorage.
        </span>
        <span className="text-cyan-400 font-mono text-[11px]">
          {history.length} Record{history.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Filters Strip */}
      {history.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Content Types</option>
              <option value="link">Links</option>
              <option value="message">Messages</option>
              <option value="image">Images</option>
              <option value="screenshot">Screenshots</option>
              <option value="qr">QR Codes</option>
              <option value="media">Media</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400">Risk Level:</span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Levels</option>
              <option value="HIGH">High Risk</option>
              <option value="SUSPICIOUS">Suspicious</option>
              <option value="INCONCLUSIVE">Inconclusive</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>
        </div>
      )}

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No scan history recorded yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you analyze suspicious links, messages, images, screenshots, or QR codes, records will appear here.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenScanner}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 cursor-pointer"
            >
              Start First Scan
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredHistory.map((item) => {
            const badge = getRiskBadgeClasses(item.riskLevel);
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#0b0f19]/80 hover:bg-[#101726] border border-slate-800/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center space-x-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 border ${
                      item.riskLevel === 'HIGH'
                        ? 'bg-rose-950/60 text-rose-400 border-rose-500/40'
                        : item.riskLevel === 'SUSPICIOUS'
                        ? 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                        : item.riskLevel === 'INCONCLUSIVE'
                        ? 'bg-sky-950/60 text-sky-400 border-sky-500/40'
                        : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    {item.riskScore}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-900 border border-slate-700 text-slate-300">
                        {item.contentType}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950/50 border border-cyan-700/40 text-cyan-300">
                        {item.platform}
                      </span>
                      {item.isDemo && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Demo
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-white truncate max-w-md mt-1">
                      {item.summary}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Category: {item.category} • {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase border ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {item.riskLevel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
