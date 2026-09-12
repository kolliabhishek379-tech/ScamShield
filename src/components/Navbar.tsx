import React, { useState } from 'react';
import { Shield, ShieldAlert, Activity, Sparkles, Eye, Menu, X, History, Lock, HelpCircle, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenScanner: () => void;
  bgEnabled: boolean;
  onToggleBg: () => void;
  onTriggerDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenScanner,
  bgEnabled,
  onToggleBg,
  onTriggerDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'scan', label: 'Scan' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'threats', label: 'Threats' },
    { id: 'spot-the-glitch', label: 'Spot The Glitch' },
    { id: 'history', label: 'History' },
    { id: 'privacy', label: 'Privacy' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-950/40 bg-[#07090e]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Subtitle */}
          <div 
            className="flex items-center space-x-3 cursor-pointer select-none group"
            onClick={() => onSelectTab('home')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:border-cyan-400/70 transition-all">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-wider text-base sm:text-lg text-white">
                  SCAM SHIELD
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  AI FORENSICS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-tight hidden sm:block">
                Protect yourself from digital scams.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-800/50 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Status indicator */}
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden xl:inline">Scam Shield Protection Active</span>
              <span className="xl:hidden">Active</span>
            </div>

            {/* Quick Demo Button */}
            <button
              onClick={onTriggerDemo}
              title="Load interactive sample scam scenarios"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/30 hover:border-amber-500/50 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Scenarios</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenScanner}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-slate-950" />
              <span>Start Scan</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onOpenScanner}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
            >
              Scan
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#07090e]/95 backdrop-blur-xl px-4 pt-2 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2">
          {/* Status bar */}
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Scam Shield Protection Active</span>
            </div>
            <button
              onClick={onToggleBg}
              className="text-[11px] text-slate-400 underline hover:text-slate-200"
            >
              {bgEnabled ? '3D: ON' : '3D: OFF'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1 pt-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-start px-3 py-2 rounded-lg text-xs font-medium text-left ${
                  activeTab === item.id
                    ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-800/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between">
            <button
              onClick={() => {
                onTriggerDemo();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-1.5 text-xs text-amber-300 py-1 px-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try Demo Scenarios</span>
            </button>
            <button
              onClick={() => {
                onOpenScanner();
                setMobileMenuOpen(false);
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400"
            >
              Start Free Scan
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
