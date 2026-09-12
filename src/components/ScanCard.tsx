import React from 'react';
import { Link2, MessageSquare, Image as ImageIcon, Smartphone, QrCode, Video, ArrowUpRight } from 'lucide-react';
import { ContentType } from '../types/analysis';

interface ScanCardProps {
  type: ContentType;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  active: boolean;
  onClick: () => void;
}

const ICONS = {
  link: Link2,
  message: MessageSquare,
  image: ImageIcon,
  screenshot: Smartphone,
  qr: QrCode,
  media: Video,
};

const ACCENTS = {
  link: 'group-hover:border-cyan-500/60 text-cyan-400 group-hover:bg-cyan-500/10 border-cyan-500/30',
  message: 'group-hover:border-blue-500/60 text-blue-400 group-hover:bg-blue-500/10 border-blue-500/30',
  image: 'group-hover:border-purple-500/60 text-purple-400 group-hover:bg-purple-500/10 border-purple-500/30',
  screenshot: 'group-hover:border-amber-500/60 text-amber-400 group-hover:bg-amber-500/10 border-amber-500/30',
  qr: 'group-hover:border-emerald-500/60 text-emerald-400 group-hover:bg-emerald-500/10 border-emerald-500/30',
  media: 'group-hover:border-rose-500/60 text-rose-400 group-hover:bg-rose-500/10 border-rose-500/30',
};

export const ScanCard: React.FC<ScanCardProps> = ({
  type,
  title,
  subtitle,
  description,
  badge,
  active,
  onClick,
}) => {
  const Icon = ICONS[type];

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative text-left p-5 sm:p-6 rounded-2xl border transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
        active
          ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
          : 'bg-[#0b0f19]/70 hover:bg-[#101726]/80 border-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-200 ${ACCENTS[type]}`}>
          <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50">
            {badge}
          </span>
          <ArrowUpRight className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
            active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
          }`} />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
          {title}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-cyan-400/90 mt-0.5">
          {subtitle}
        </p>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {active && (
        <div className="mt-3.5 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono text-cyan-300">
          <span>SELECTED SCANNER</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
      )}
    </div>
  );
};
