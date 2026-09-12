import React from 'react';
import { ShieldCheck, Search, HelpCircle, ArrowRight, Lock, Eye, CheckCircle2, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { SocialPlatform } from '../types/analysis';

interface HeroProps {
  onStartScan: () => void;
  onLearnMore: () => void;
  onSelectPlatform: (platform: SocialPlatform) => void;
  selectedPlatform: SocialPlatform;
}

const PLATFORMS: Array<{ name: SocialPlatform; iconLabel: string; color: string }> = [
  { name: 'Instagram', iconLabel: 'IG', color: 'from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/30' },
  { name: 'WhatsApp', iconLabel: 'WA', color: 'from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30' },
  { name: 'Facebook', iconLabel: 'FB', color: 'from-blue-600/20 to-indigo-500/20 text-blue-300 border-blue-500/30' },
  { name: 'YouTube', iconLabel: 'YT', color: 'from-red-500/20 to-rose-500/20 text-rose-300 border-rose-500/30' },
  { name: 'Telegram', iconLabel: 'TG', color: 'from-sky-500/20 to-blue-500/20 text-sky-300 border-sky-500/30' },
  { name: 'X', iconLabel: 'X', color: 'from-slate-700/30 to-slate-800/30 text-slate-200 border-slate-600/30' },
  { name: 'Snapchat', iconLabel: 'SC', color: 'from-yellow-500/20 to-amber-500/20 text-amber-300 border-yellow-500/30' },
  { name: 'Other', iconLabel: '🌐', color: 'from-cyan-500/20 to-teal-500/20 text-cyan-300 border-cyan-500/30' },
];

export const Hero: React.FC<HeroProps> = ({
  onStartScan,
  onLearnMore,
  onSelectPlatform,
  selectedPlatform,
}) => {
  return (
    <section className="relative pt-10 pb-14 sm:pt-16 sm:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Protected status banner */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-medium text-slate-300">
              Scam Shield Protection Active
            </span>
            <span className="text-slate-600 text-xs">•</span>
            <span className="text-[11px] text-cyan-400 font-mono">v1.4 Neural Engine</span>
          </div>
        </div>

        {/* Hero headline & subtext */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none">
            Detect scams <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              before they cost you.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            AI-powered analysis for suspicious links, messages, images, screenshots, QR codes and media from social platforms.
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onStartScan}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>Start Free Scan</span>
            </button>

            <button
              onClick={onLearnMore}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-200 bg-slate-900/70 hover:bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Learn How It Works</span>
            </button>
          </div>
        </div>

        {/* Platform Selection Strip */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Select platform context (optional):
            </span>
            <span className="text-xs text-cyan-400/80 font-mono">
              Active: {selectedPlatform}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {PLATFORMS.map((p) => {
              const isSelected = selectedPlatform === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => onSelectPlatform(p.name)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center group cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-900/40 hover:bg-slate-800/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mb-1 border bg-gradient-to-br ${p.color}`}>
                    {p.iconLabel}
                  </span>
                  <span className={`text-[11px] font-medium tracking-tight truncate w-full ${
                    isSelected ? 'text-cyan-300 font-semibold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Security Trust Features Row */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-900/30 border border-slate-800/60 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono">
                Zero Password Access
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                We never ask for account credentials or scrape private accounts. Scanning is purely user-initiated.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-900/30 border border-slate-800/60 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono">
                Multimodal Signal Engine
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Evaluates URL structure, social engineering text, synthetic diffusion patterns, and deceptive QR payloads.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-xl bg-slate-900/30 border border-slate-800/60 backdrop-blur-sm">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono">
                Probabilistic Honesty
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Provides uncertainty-aware risk scores and transparent evidence, without unscientific absolute claims.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
