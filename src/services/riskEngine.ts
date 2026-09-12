import { RiskLevel, ScamCategory } from '../types/analysis';

export function normalizeRiskScore(score: number): {
  score: number;
  level: RiskLevel;
  verdictLabel: string;
  colorClass: string;
  borderClass: string;
  badgeBg: string;
} {
  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));

  if (boundedScore <= 25) {
    return {
      score: boundedScore,
      level: 'LOW',
      verdictLabel: 'LOW RISK INDICATORS DETECTED',
      colorClass: 'text-emerald-400',
      borderClass: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    };
  } else if (boundedScore <= 60) {
    return {
      score: boundedScore,
      level: 'INCONCLUSIVE',
      verdictLabel: 'EVIDENCE IS INCONCLUSIVE',
      colorClass: 'text-amber-400',
      borderClass: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    };
  } else if (boundedScore <= 80) {
    return {
      score: boundedScore,
      level: 'SUSPICIOUS',
      verdictLabel: 'SUSPICIOUS PATTERNS DETECTED',
      colorClass: 'text-orange-400',
      borderClass: 'border-orange-500/40',
      badgeBg: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    };
  } else {
    return {
      score: boundedScore,
      level: 'HIGH',
      verdictLabel: 'HIGH-RISK INDICATORS DETECTED',
      colorClass: 'text-rose-400',
      borderClass: 'border-rose-500/40',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    };
  }
}

export function getRiskBadgeClasses(level: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  glow: string;
} {
  switch (level) {
    case 'HIGH':
      return {
        bg: 'bg-rose-950/70',
        text: 'text-rose-300',
        border: 'border-rose-500/60',
        glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
      };
    case 'SUSPICIOUS':
      return {
        bg: 'bg-amber-950/70',
        text: 'text-amber-300',
        border: 'border-amber-500/60',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
      };
    case 'INCONCLUSIVE':
      return {
        bg: 'bg-sky-950/70',
        text: 'text-sky-300',
        border: 'border-sky-500/60',
        glow: 'shadow-[0_0_15px_rgba(14,165,233,0.3)]',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-950/70',
        text: 'text-emerald-300',
        border: 'border-emerald-500/60',
        glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]',
      };
  }
}

export function getCategoryBadgeColor(category: ScamCategory): string {
  switch (category) {
    case 'Phishing':
    case 'Malware Risk':
    case 'Account Takeover':
      return 'bg-rose-950/60 text-rose-300 border-rose-800/40';
    case 'Financial Scam':
    case 'Investment Scam':
      return 'bg-amber-950/60 text-amber-300 border-amber-800/40';
    case 'Impersonation':
    case 'Romance Scam':
      return 'bg-purple-950/60 text-purple-300 border-purple-800/40';
    case 'Fake Giveaway':
    case 'Shopping Scam':
    case 'Job Scam':
      return 'bg-orange-950/60 text-orange-300 border-orange-800/40';
    case 'AI/Deepfake Manipulation':
      return 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40';
    case 'QR Scam':
      return 'bg-blue-950/60 text-blue-300 border-blue-800/40';
    default:
      return 'bg-slate-800/60 text-slate-300 border-slate-700/40';
  }
}

export function getSeverityStyle(severity: 'high' | 'medium' | 'low' | 'info'): {
  badge: string;
  iconBg: string;
  dot: string;
} {
  switch (severity) {
    case 'high':
      return {
        badge: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
        iconBg: 'bg-rose-500/20 text-rose-400',
        dot: 'bg-rose-500',
      };
    case 'medium':
      return {
        badge: 'bg-orange-500/15 text-orange-300 border border-orange-500/30',
        iconBg: 'bg-orange-500/20 text-orange-400',
        dot: 'bg-orange-500',
      };
    case 'low':
      return {
        badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
        iconBg: 'bg-amber-500/20 text-amber-400',
        dot: 'bg-amber-500',
      };
    case 'info':
    default:
      return {
        badge: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30',
        iconBg: 'bg-cyan-500/20 text-cyan-400',
        dot: 'bg-cyan-500',
      };
  }
}
