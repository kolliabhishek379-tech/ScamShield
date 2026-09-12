import React from 'react';
import { Sparkles, X, ArrowRight, ShieldAlert, AlertTriangle, Smartphone, Link2, MessageSquare, QrCode, Image as ImageIcon } from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario } from '../services/demoScenarios';

interface DemoScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: DemoScenario) => void;
}

const TYPE_ICONS = {
  link: Link2,
  message: MessageSquare,
  image: ImageIcon,
  screenshot: Smartphone,
  qr: QrCode,
  media: Sparkles,
};

export const DemoScenariosModal: React.FC<DemoScenariosModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0b0f19] border border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.15)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Controlled Demo Scenarios</h3>
              <p className="text-xs text-slate-400">
                1-click tests of realistic cyberattacks to demonstrate the Scam Shield engine instantly.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Notice Banner */}
        <div className="px-6 py-2 bg-amber-950/40 border-b border-amber-500/20 text-[11px] font-mono text-amber-300">
          ⚠️ All results in demo mode are synthetic security simulations and clearly tagged as <strong>DEMO ANALYSIS</strong>.
        </div>

        {/* Scenario Cards List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {DEMO_SCENARIOS.map((scenario) => {
            const Icon = TYPE_ICONS[scenario.contentType] || Sparkles;

            return (
              <div
                key={scenario.id}
                onClick={() => {
                  onSelectScenario(scenario);
                  onClose();
                }}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-amber-500/50 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 group-hover:border-amber-500/40">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {scenario.title}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                        {scenario.platform}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{scenario.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <span className="text-xs font-mono font-bold text-rose-400">
                    {scenario.result.riskScore}/100 Risk
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
