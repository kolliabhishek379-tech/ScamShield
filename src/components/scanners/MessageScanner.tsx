import React, { useState } from 'react';
import { MessageSquare, Search, AlertCircle, Sparkles, X } from 'lucide-react';
import { SocialPlatform } from '../../types/analysis';

interface MessageScannerProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
  platform: SocialPlatform;
}

const SAMPLE_MESSAGES = [
  {
    label: 'Bank Fraud Alert',
    text: 'CITIBANK ALERT: Your account has been suspended due to suspicious login in Russia. Verify your identity within 1 hour to prevent permanent closure: http://citi-id-verify.top/unlock',
  },
  {
    label: 'Hi Mum / Family Emergency',
    text: 'Hi mum, I dropped my phone in the sink and my screen is shattered. This is my temporary number. I have an urgent bill of $450 due today and my banking app is locked out. Can you please pay it for me? Sort: 20-40-11 Acc: 44019283. Love you!',
  },
  {
    label: 'Telegram VIP Crypto Offer',
    text: 'Hello friend! We have an exclusive AI automated arbitrage bot that guarantees 350% daily return on USDT deposits with 0% risk. Deposit minimum $100 to start earning passive income today.',
  },
  {
    label: 'Job Offer / Remote Tasks',
    text: 'Congratulations! You have been selected for part-time online data optimization work. Earn $200-$500 per day working 30 mins from home. Send $25 activation deposit to receive your first task.',
  },
];

export const MessageScanner: React.FC<MessageScannerProps> = ({
  onAnalyze,
  isLoading,
  platform,
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanText = text.trim();
    if (!cleanText) {
      setError('Please enter or paste the message text to analyze.');
      return;
    }
    if (cleanText.length < 10) {
      setError('Please provide at least 10 characters for a reliable threat analysis.');
      return;
    }
    setError(null);
    onAnalyze(cleanText);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0f19]/90 border border-blue-500/25 shadow-[0_0_30px_rgba(59,130,246,0.08)]">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Social Message Inspector</h2>
            <p className="text-xs text-slate-400">
              Evaluates emotional coercion, OTP requests, financial pretexts, and impersonation from {platform}.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="msg-input" className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
              Suspicious Message Text:
            </label>
            <span className="text-[11px] font-mono text-slate-500">
              {text.length} characters
            </span>
          </div>

          <div className="relative">
            <textarea
              id="msg-input"
              rows={5}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Paste the suspicious message, SMS, DM, or chat body here..."
              disabled={isLoading}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm text-white placeholder-slate-500 font-sans transition-all leading-relaxed"
            />
            {text && (
              <button
                type="button"
                onClick={() => setText('')}
                className="p-1 rounded-md text-slate-400 hover:text-white absolute right-3 top-3"
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

        {/* Quick Sample Messages */}
        <div className="pt-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
            Quick test examples:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_MESSAGES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setText(sample.text);
                  if (error) setError(null);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-blue-300 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer text-left"
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
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-300 hover:to-cyan-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-4 h-4 text-slate-950" />
            <span>{isLoading ? 'Analyzing Text...' : 'Analyze Message'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
