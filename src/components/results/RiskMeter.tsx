import React, { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, HelpCircle, AlertTriangle } from 'lucide-react';
import { RiskLevel } from '../../types/analysis';
import { getRiskBadgeClasses } from '../../services/riskEngine';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
  verdictLabel: string;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, level, verdictLabel }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 900;
    const stepTime = 20;
    const increment = score / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Circumference calculation for strokeDashoffset (radius = 70)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Level specific colors
  const strokeColors: Record<RiskLevel, string> = {
    LOW: '#10b981',       // emerald-500
    INCONCLUSIVE: '#0ea5e9', // sky-500
    SUSPICIOUS: '#f59e0b',  // amber-500
    HIGH: '#f43f5e',       // rose-500
  };

  const badgeConfig = getRiskBadgeClasses(level);

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center">
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Background track circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            className="text-slate-800/60"
            fill="transparent"
          />
          {/* Animated risk score stroke */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={strokeColors[level]}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
            {animatedScore}
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            out of 100
          </span>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className="mt-5">
        <span
          className={`inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase border shadow-lg ${badgeConfig.bg} ${badgeConfig.text} ${badgeConfig.border} ${badgeConfig.glow}`}
        >
          {level === 'HIGH' && <ShieldAlert className="w-3.5 h-3.5" />}
          {level === 'SUSPICIOUS' && <AlertTriangle className="w-3.5 h-3.5" />}
          {level === 'INCONCLUSIVE' && <HelpCircle className="w-3.5 h-3.5" />}
          {level === 'LOW' && <ShieldCheck className="w-3.5 h-3.5" />}
          <span>{level} RISK</span>
        </span>
      </div>

      {/* Verdict Label */}
      <h4 className="mt-3 text-base sm:text-lg font-extrabold text-white tracking-tight max-w-sm">
        {verdictLabel}
      </h4>

      <p className="mt-1 text-xs text-slate-400 font-mono">
        Scam Shield Probabilistic Threat Score
      </p>
    </div>
  );
};
