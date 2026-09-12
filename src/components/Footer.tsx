import React from 'react';
import { Shield, Lock, AlertCircle, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#05070a] text-slate-400 text-xs py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main 4-column footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-base tracking-wider">
                SCAM SHIELD
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered Social Media Scam Detection & Forensic Inspection Engine. Protect yourself and loved ones from deceptive digital content.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Protection Architecture</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="font-mono text-slate-200 uppercase tracking-wider font-bold text-xs">
              Navigation
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-cyan-300 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('scan')} className="hover:text-cyan-300 transition-colors">
                  Scanner Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('how-it-works')} className="hover:text-cyan-300 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('threats')} className="hover:text-cyan-300 transition-colors">
                  Threat Encyclopedia
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('spot-the-glitch')} className="hover:text-cyan-300 transition-colors">
                  Spot The Glitch (Challenge Mode)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('history')} className="hover:text-cyan-300 transition-colors">
                  Scan History
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Supported Ecosystems */}
          <div className="space-y-2">
            <h4 className="font-mono text-slate-200 uppercase tracking-wider font-bold text-xs">
              Supported Platforms
            </h4>
            <div className="grid grid-cols-2 gap-1 text-slate-400 text-xs">
              <span>• Instagram DMs</span>
              <span>• WhatsApp Chats</span>
              <span>• Facebook Posts</span>
              <span>• YouTube Links</span>
              <span>• Telegram Channels</span>
              <span>• X / Twitter DMs</span>
              <span>• Snapchat Snaps</span>
              <span>• QR Pay Terminals</span>
            </div>
          </div>

          {/* Col 4: Privacy Guarantee */}
          <div className="space-y-2">
            <h4 className="font-mono text-slate-200 uppercase tracking-wider font-bold text-xs flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero-Storage Guarantee</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never ask for account credentials. Images and screenshots are processed in memory and never persisted to cloud storage.
            </p>
            <button
              onClick={() => onSelectTab('privacy')}
              className="text-cyan-400 hover:text-cyan-300 underline font-mono text-[11px]"
            >
              Review Privacy Center →
            </button>
          </div>
        </div>

        {/* Mandatory Disclaimer per Section 27 */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-400">Legal & Cybersecurity Disclaimer:</strong> Scam Shield is an educational and threat-detection assistance tool. It does not replace professional cybersecurity incident response services or official platform reporting. Threat assessments, risk scores, and visual overlays represent probabilistic analysis models and cannot guarantee that digital content is safe or fraudulent.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 pt-2 gap-2">
            <span>© 2026 Scam Shield Forensics. All rights reserved.</span>
            <span className="font-mono text-[10px]">Built for social media safety & public cyber awareness.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
