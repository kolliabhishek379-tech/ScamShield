import React from 'react';
import { Upload, Cpu, ShieldCheck, AlertCircle, ArrowRight, Layers, Lock, Sparkles } from 'lucide-react';

interface HowItWorksProps {
  onStartScan: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartScan }) => {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-12 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <Layers className="w-3.5 h-3.5" />
          <span>Multimodal Cybersecurity Pipeline</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          How Scam Shield Protects You
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From deceptive links to synthetic AI portraits, understand the three-phase forensic process that safeguards your digital presence.
        </p>
      </div>

      {/* The 3 Core Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Step 01 */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0b0f19]/90 border border-slate-800 space-y-4 relative group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black font-mono text-cyan-400">01</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            UPLOAD & INPUT
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Bring any suspicious digital content you encounter across social media platforms:
          </p>

          <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
            <li>• Phishing URLs & shortened links</li>
            <li>• DMs, SMS texts, and emails</li>
            <li>• Photos, avatars, and profile pictures</li>
            <li>• Full chat screenshots with headers</li>
            <li>• Barcode matrices & QR stickers</li>
            <li>• Social video clips & audio voicemails</li>
          </ul>
        </div>

        {/* Step 02 */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0b0f19]/90 border border-slate-800 space-y-4 relative group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black font-mono text-blue-400">02</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            FORENSIC ANALYSIS
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Scam Shield correlates multi-layer threat signals across forensic models:
          </p>

          <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
            <li>• Artificial urgency & emotional coercion</li>
            <li>• Brand typosquatting & disreputable TLDs</li>
            <li>• Solicitation of OTP passwords & bank PINs</li>
            <li>• Advance-fee fraud & crypto yield claims</li>
            <li>• Biometric & frequency diffusion anomalies</li>
            <li>• Quishing payment redirects & URI protocols</li>
          </ul>
        </div>

        {/* Step 03 */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0b0f19]/90 border border-slate-800 space-y-4 relative group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black font-mono text-emerald-400">03</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <h3 className="text-lg font-bold text-white uppercase tracking-wide">
            PROTECT & ACT
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Receive transparent, uncertainty-aware evidence and direct defensive next steps:
          </p>

          <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
            <li>• 0–100 Normalized Probabilistic Risk Meter</li>
            <li>• Categorized Threat Classification</li>
            <li>• Clear rationale of detected anomalies</li>
            <li>• Visual heatmap & region markers for images</li>
            <li>• Actionable next-step checklist</li>
            <li>• One-click exportable forensic summary</li>
          </ul>
        </div>
      </div>

      {/* Mandatory Disclaimer Box (Section 22) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 flex items-start space-x-3 text-xs text-slate-400 leading-relaxed">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-200 font-bold block mb-1">
            Important Cybersecurity Notice & Disclaimer:
          </span>
          Scam Shield provides probabilistic security analysis and educational guidance. No automated detection system can guarantee that content is safe or fraudulent. Always exercise independent critical judgment, verify out-of-band with official organizations, and never disclose private cryptographic keys, passwords, or one-time verification codes.
        </div>
      </div>

      {/* Start Scan CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onStartScan}
          className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all cursor-pointer"
        >
          <span>Run A Security Scan Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
