import React, { useEffect, useState } from 'react';
import { Shield, CheckCircle2, Loader2, Cpu } from 'lucide-react';

interface ScanProgressProps {
  contentType: string;
}

const STEPS = [
  'Initializing scan environment...',
  'Content payload received',
  'Pre-processing format & sanitization',
  'Correlating threat signatures & known scam patterns',
  'Executing multimodal neural signal analysis',
  'Synthesizing probabilistic forensic report',
];

export const ScanProgress: React.FC<ScanProgressProps> = ({ contentType }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(95, Math.round(((currentStepIndex + 1) / STEPS.length) * 100));

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0f19]/95 border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.15)] text-center max-w-xl mx-auto my-8">
      {/* Central rotating cyber scanner icon */}
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/20 animate-ping" />
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Cpu className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
        Forensic Inspection in Progress
      </h3>
      <p className="text-xs text-slate-400 font-mono mt-1">
        Analyzing {contentType.toUpperCase()} against 2026 social media threat models...
      </p>

      {/* Progress Bar */}
      <div className="mt-6 w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
        {STEPS.map((step, index) => {
          const isDone = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={index}
              className={`flex items-center space-x-2.5 text-xs font-mono transition-opacity duration-200 ${
                isDone
                  ? 'text-emerald-400'
                  : isCurrent
                  ? 'text-cyan-300 font-semibold'
                  : 'text-slate-600 opacity-40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-slate-700 inline-block shrink-0" />
              )}
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
