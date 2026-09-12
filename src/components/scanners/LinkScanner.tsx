import React, { useState } from 'react';
import { Search, Link2, AlertCircle, ShieldAlert, Sparkles, X } from 'lucide-react';
import { SocialPlatform } from '../../types/analysis';

interface LinkScannerProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
  platform: SocialPlatform;
}

const SAMPLE_LINKS = [
  {
    label: 'Chase Phish (.xyz)',
    url: 'http://chase-security-auth-check.xyz/login?session=8912',
  },
  {
    label: 'Instagram Fake Giveaway',
    url: 'http://instagram-free-badges-claim.click/rewards',
  },
  {
    label: 'Shortened Relayed URL',
    url: 'https://bit.ly/3XQ9mKz',
  },
  {
    label: 'Legitimate Domain',
    url: 'https://www.paypal.com/signin',
  },
];

export const LinkScanner: React.FC<LinkScannerProps> = ({
  onAnalyze,
  isLoading,
  platform,
}) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      setError('Please enter a URL or web address to analyze.');
      return;
    }
    setError(null);
    onAnalyze(cleanUrl);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0f19]/90 border border-cyan-500/25 shadow-[0_0_30px_rgba(6,182,212,0.08)]">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Link & URL Inspector</h2>
            <p className="text-xs text-slate-400">
              Scans domain structure, brand spoofing, TLD reputation, and redirects on {platform}.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url-input" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider mb-2">
            Target URL:
          </label>
          <div className="relative">
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste suspicious link here (e.g. http://login-verify-account.xyz)..."
              disabled={isLoading}
              className="w-full px-4 py-3.5 pl-11 pr-10 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 font-mono transition-all"
            />
            <Link2 className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {url && (
              <button
                type="button"
                onClick={() => setUrl('')}
                className="p-1 rounded-md text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {error && (
            <p className="mt-2 text-xs text-rose-400 flex items-center space-x-1.5 font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </p>
          )}
        </div>

        {/* Quick Sample Links */}
        <div className="pt-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
            Quick test examples:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_LINKS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUrl(sample.url);
                  if (error) setError(null);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-4 h-4 text-slate-950" />
            <span>{isLoading ? 'Analyzing URL...' : 'Analyze Link'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
