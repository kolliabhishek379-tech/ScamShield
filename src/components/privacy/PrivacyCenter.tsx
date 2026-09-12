import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, EyeOff, Server, HardDrive, Trash2, CheckCircle2, ToggleLeft, ToggleRight, Sparkles, AlertCircle } from 'lucide-react';
import { AIService } from '../../services/aiService';

export const PrivacyCenter: React.FC = () => {
  const [cloudOptIn, setCloudOptIn] = useState(false);

  useEffect(() => {
    setCloudOptIn(AIService.isCloudAnalysisEnabled());
  }, []);

  const handleToggleCloud = () => {
    const next = !cloudOptIn;
    setCloudOptIn(next);
    AIService.setCloudAnalysisEnabled(next);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Knowledge Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Your Privacy Comes First.
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Scam Shield is engineered to evaluate threats without scraping private feeds, storing media, or demanding access tokens.
        </p>
      </div>

      {/* Interactive Processing Mode Selector: Local (Preferred) vs Cloud (Optional) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0f19]/95 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Engine Mode Configuration</h3>
            <p className="text-xs text-slate-400">
              Select whether content evaluation stays inside your browser or utilizes optional server-side AI acceleration.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-300">
              Active: <strong className={cloudOptIn ? 'text-cyan-400' : 'text-emerald-400'}>{cloudOptIn ? 'Cloud Neural' : 'Local Sandbox'}</strong>
            </span>
          </div>
        </div>

        {/* The Two Modes Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mode 1: Local Analysis (Preferred) */}
          <div
            onClick={() => {
              if (cloudOptIn) handleToggleCloud();
            }}
            className={`p-5 rounded-xl border text-left cursor-pointer transition-all ${
              !cloudOptIn
                ? 'bg-emerald-950/30 border-emerald-500/80 ring-1 ring-emerald-500/40'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">Local Analysis (Preferred)</span>
              </div>
              {!cloudOptIn && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ACTIVE
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              Heuristic decomposition, regex entropy, domain token parsing, and canvas frequency analysis execute directly inside your browser. No content leaves your device.
            </p>

            <ul className="mt-3 space-y-1.5 text-[11px] text-emerald-400 font-mono">
              <li>✓ Zero data transmitted over the network</li>
              <li>✓ Instant evaluation with no API limits</li>
              <li>✓ Ideal for personal DMs and screenshots</li>
            </ul>
          </div>

          {/* Mode 2: Cloud Analysis (Optional) */}
          <div
            onClick={() => {
              if (!cloudOptIn) handleToggleCloud();
            }}
            className={`p-5 rounded-xl border text-left cursor-pointer transition-all ${
              cloudOptIn
                ? 'bg-cyan-950/30 border-cyan-500/80 ring-1 ring-cyan-500/40'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">Cloud Neural (Optional)</span>
              </div>
              {cloudOptIn && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  ACTIVE
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              Sends content payloads to the secure backend Gemini API model for nuanced multi-layer psychological social-engineering analysis.
            </p>

            <ul className="mt-3 space-y-1.5 text-[11px] text-cyan-400 font-mono">
              <li>✓ Advanced LLM contextual understanding</li>
              <li>✓ Memory-only processing (no database storage)</li>
              <li>✓ Uncertainty-aware probabilistic scores</li>
            </ul>
          </div>
        </div>

        {/* Toggle bar */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Switch between strictly local heuristics and cloud assistance at any time:
          </span>
          <button
            onClick={handleToggleCloud}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 border border-slate-700 hover:border-slate-500 cursor-pointer"
          >
            {cloudOptIn ? (
              <ToggleRight className="w-5 h-5 text-cyan-400" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-emerald-400" />
            )}
            <span>{cloudOptIn ? 'Opt-out of Cloud' : 'Enable Cloud Engine'}</span>
          </button>
        </div>
      </div>

      {/* Six Pillars of Scam Shield Privacy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-sm font-bold text-white">We never ask for account credentials</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Scam Shield will never ask for your Instagram, WhatsApp, Facebook, or bank login. We operate purely on content you choose to inspect.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-sm font-bold text-white">Scanning is purely user-initiated</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            There is no background crawler or screen recorder. Analysis only occurs when you click "Analyze".
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-sm font-bold text-white">Ephemeral, in-memory processing</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Uploaded images, screenshots, and text strings are kept temporarily in memory for forensic inspection and are discarded immediately after.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-sm font-bold text-white">Original images are never stored</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            We do not host or archive your images, personal photos, or chat screenshots in any cloud database or CDN.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-sm font-bold text-white">Cloud analysis is fully optional</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            If you do not want data leaving your machine, keep Local Analysis active. All regex, heuristic, and frequency tools run locally.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-sm font-bold text-white">You own and control your scan history</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Scan logs reside only in your browser's private storage. You can wipe every trace in one click via the History tab.
          </p>
        </div>
      </div>
    </div>
  );
};
