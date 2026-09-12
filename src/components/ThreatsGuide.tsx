import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, ChevronDown, ChevronUp, Search, ExternalLink } from 'lucide-react';
import { ScamCategory } from '../types/analysis';

interface ThreatItem {
  id: string;
  category: ScamCategory;
  title: string;
  platforms: string[];
  description: string;
  redFlags: string[];
  example: string;
  prevention: string;
}

const THREATS: ThreatItem[] = [
  {
    id: 'phishing',
    category: 'Phishing',
    title: 'Phishing & Credential Harvesting',
    platforms: ['Instagram', 'WhatsApp', 'Telegram', 'X', 'Facebook'],
    description: 'Fraudulent messages directing victims to spoofed login portals designed to steal passwords, two-factor codes, and recovery codes.',
    redFlags: ['Domains mimicking real brands (.xyz, .top, .online)', 'Threats of immediate account deletion or suspension', 'Generic salutations and urgent deadlines'],
    example: '"Meta Alert: Your account violated community standards. Log in here within 12 hours to appeal: http://meta-verify-account.click"',
    prevention: 'Always verify web URLs in your browser address bar. Enable passkeys or hardware security keys (FIDO2) which are immune to credential phishing.',
  },
  {
    id: 'financial',
    category: 'Financial Scam',
    title: 'Financial & Banking Smishing',
    platforms: ['WhatsApp', 'Telegram', 'SMS', 'Instagram'],
    description: 'Deceptive messages claiming unauthorized bank transfers, fraudulent charges, or frozen credit cards, asking victims to confirm OTPs.',
    redFlags: ['Direct requests for one-time passwords (OTPs)', 'Fake caller IDs and claims of pending wire debits', 'Requests to transfer funds to a "safe government account"'],
    example: '"Chase Bank: Did you authorize $2,840.00 at Apple Store? Reply NO to block or call this urgent hotline to verify your identity."',
    prevention: 'Banks will never ask you to read back a verification code or transfer money to protect it. Call the official number on the back of your card.',
  },
  {
    id: 'impersonation',
    category: 'Impersonation',
    title: 'Identity & Brand Impersonation',
    platforms: ['WhatsApp', 'Instagram', 'Facebook', 'Telegram'],
    description: 'Cloned profiles pretending to be trusted family members, colleagues, verified influencers, or customer support representatives.',
    redFlags: ['"I lost my phone / this is my new temporary number"', 'Slightly altered handle handles (@brand_official_help29)', 'Emergency requests for instant cash via Venmo, Zelle, or gift cards'],
    example: '"Hi Mum, I dropped my phone in water and I have an urgent bill due right now. Can you wire $450 to my friend\'s account?"',
    prevention: 'Call the person’s original telephone number directly or ask a private personal question only they would know.',
  },
  {
    id: 'giveaway',
    category: 'Fake Giveaway',
    title: 'Bogus Celebrity & Crypto Giveaways',
    platforms: ['YouTube', 'Instagram', 'X', 'Telegram'],
    description: 'Hacked celebrity channels or cloned influencer accounts advertising fake promotional draws requiring an advance "gas fee" or entry fee.',
    redFlags: ['Celebrity promising to double whatever crypto you send', 'Countdown timers claiming prizes must be claimed in 5 minutes', 'Requirements to connect a Web3 wallet or send ETH/SOL first'],
    example: '"MrBeast 10,000 iPhone Giveaway! First 500 people to pay $12.99 shipping claim their iPhone 16 Pro immediately!"',
    prevention: 'Real giveaways never require winners to pay money, gas fees, or shipping deposits to claim a prize.',
  },
  {
    id: 'investment',
    category: 'Investment Scam',
    title: 'High-Yield Investment Fraud (HYIP & Pig Butchering)',
    platforms: ['Telegram', 'WhatsApp', 'Instagram', 'Facebook'],
    description: 'Sophisticated schemes that groom victims over weeks, directing them to bogus investment apps that show fabricated trading returns.',
    redFlags: ['Promises of guaranteed zero-risk daily returns (e.g. 5% daily ROI)', 'Pressure to deposit cryptocurrency (USDT, BTC)', 'Demands for "withdrawal taxes" or "liquidity fees" when trying to cash out'],
    example: '"Our automated AI trading bot generated $42,000 for my family this month. Deposit minimum $200 USDT to start receiving automated payouts."',
    prevention: 'Verify broker registrations on regulatory platforms (FINRA BrokerCheck, SEC EDGAR, FCA Register). Never trust investment advice from private DMs.',
  },
  {
    id: 'job',
    category: 'Job Scam',
    title: 'Remote Task & Part-Time Job Scams',
    platforms: ['Telegram', 'WhatsApp', 'Snapchat', 'Facebook'],
    description: 'Unsolicited job offers for simple tasks (liking YouTube videos, reviewing apps) that require buying "VIP optimization packages" to unlock earnings.',
    redFlags: ['Unsolicited job offers on encrypted messaging apps', 'Exorbitant pay for low-effort tasks ($300/day for 30 mins work)', 'Requirement to deposit money to "reset your task balance"'],
    example: '"We are hiring freelance hotel raters! Earn $300-$800 daily. Just like 20 hotels on our portal. Pay $50 registration deposit to activate your work wallet."',
    prevention: 'Legitimate employers will never ask candidates to pay onboarding fees, buy cryptocurrency, or deposit cash to work.',
  },
  {
    id: 'romance',
    category: 'Romance Scam',
    title: 'Romance & Catfishing Schemes',
    platforms: ['Instagram', 'Facebook', 'Tinder', 'Snapchat'],
    description: 'Fraudsters create attractive fake personas to build emotional intimacy with victims before inventing emergency financial crises.',
    redFlags: ['Professions of intense love within days or weeks of messaging', 'Reluctance or endless excuses to meet in person or do live video calls', 'Emergencies involving hospital bills, customs fees, or travel visas'],
    example: '"My love, my engineering equipment was detained at international customs and I cannot return home without paying $3,200. Please help me."',
    prevention: 'Never send money, cryptocurrency, or gift cards to someone you have never met face-to-face in the real world.',
  },
  {
    id: 'takeover',
    category: 'Account Takeover',
    title: 'Social Media Account Hijacking',
    platforms: ['Instagram', 'Facebook', 'Telegram', 'Snapchat'],
    description: 'Attackers trick victims into sending them the Instagram or WhatsApp account recovery link or screenshotting a verification code.',
    redFlags: ['"I need 3 friends to help me recover my account, please send me the link you just received"', 'Requests to change your account email to an unverified address', 'Unsolicited password reset texts'],
    example: '"Hey! I\'m trying to sign into my new phone and Instagram gave me your name as a trusted contact. Can you screenshot the code they texted you?"',
    prevention: 'Never forward or screenshot SMS security codes. Those codes grant complete account takeover.',
  },
  {
    id: 'shopping',
    category: 'Shopping Scam',
    title: 'Fake E-Commerce & Sponsored Ad Scams',
    platforms: ['Instagram', 'Facebook', 'TikTok', 'Snapchat'],
    description: 'Sponsored ads advertising clearance sales for luxury goods at 90% discount on fraudulent disposable storefronts.',
    redFlags: ['Unbelievable discounts (e.g. 90% off Dyson, LEGO, Patagonia)', 'Store domain registered only days or weeks prior', 'Only accepts wire transfer, Zelle, or gift cards'],
    example: '"Warehouse liquidation! Overstock brand new designer bags starting at only $19.99 for the next 24 hours only!"',
    prevention: 'Check domain registration age via WHOIS tools. Buy directly from official brand retail websites.',
  },
  {
    id: 'malware',
    category: 'Malware Risk',
    title: 'Malicious Downloads & Infostealers',
    platforms: ['Telegram', 'Discord', 'X', 'YouTube'],
    description: 'Links in descriptions or DMs offering cracked software, beta game testers, or cheat tools that drop RedLine or Lumma infostealer malware.',
    redFlags: ['Password-protected ZIP files with instructions to disable antivirus', 'File extensions ending in .scr, .bat, or disguised executables', 'Offers of pirated software or free game currency hacks'],
    example: '"Download our free private crypto trading indicator (password: 1234). Make sure to temporarily disable Windows Defender to run installer."',
    prevention: 'Never disable antivirus software or run executables received from anonymous online contacts.',
  },
  {
    id: 'qr',
    category: 'QR Scam',
    title: 'Quishing (QR Code Phishing & Tampering)',
    platforms: ['Physical venues', 'Email', 'Instagram flyers', 'Parking terminals'],
    description: 'Fraudulent QR codes that conceal malicious phishing links or direct cryptocurrency/payment URIs from human visual inspection.',
    redFlags: ['QR code stickers visibly pasted over legitimate signs or parking meters', 'QR codes sent in emails that bypass link filtering software', 'Direct prompts to open payment apps with recipient pre-filled'],
    example: 'A counterfeit sticker pasted on a municipal parking payment machine that opens "parking-city-meters.vip" instead of the official city app.',
    prevention: 'Always inspect decoded URL destinations before tapping open. Feel physical signs to check if a counterfeit sticker was layered on top.',
  },
  {
    id: 'deepfake',
    category: 'AI/Deepfake Manipulation',
    title: 'Synthetic AI Portraits & Voice Cloning',
    platforms: ['Instagram', 'X', 'Facebook', 'YouTube'],
    description: 'Generative diffusion portraits used to build realistic fake influencer personas, or audio voice clones of executives or family members.',
    redFlags: ['Asymmetric pupil catchlights and melted jewelry/earrings', 'Unnatural skin smoothing transitioning abruptly into blurred edges', 'Urgent voice notes from family members asking for money transfers'],
    example: 'A cloned voice of a company CEO calling the accounting department demanding an urgent wire transfer to a vendor account.',
    prevention: 'Establish a private family safe-word for emergency calls. Look closely for visual artifacts around hands, accessories, and iris reflections.',
  },
];

export const ThreatsGuide: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('phishing');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreats = THREATS.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.platforms.some((p) => p.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Threat Intelligence Library</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Social Media Scam Encyclopedia
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Detailed breakdowns of the 12 most dangerous digital fraud categories targeting social platforms today.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search scam types, keywords, or platforms..."
          className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-cyan-400 text-xs sm:text-sm text-white placeholder-slate-500 font-sans"
        />
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Threat Items Accordion */}
      <div className="space-y-3">
        {filteredThreats.map((threat) => {
          const isExpanded = expandedId === threat.id;

          return (
            <div
              key={threat.id}
              className="rounded-2xl border border-slate-800 bg-[#0b0f19]/80 overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : threat.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold text-xs font-mono">
                    {threat.category.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">{threat.title}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {threat.platforms.map((p) => (
                        <span
                          key={p}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs text-cyan-400 font-mono hidden sm:inline">
                    {isExpanded ? 'Hide Analysis' : 'Inspect Threat'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-800/80 space-y-4 text-xs animate-in fade-in">
                  <p className="text-slate-300 leading-relaxed mt-4">{threat.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Red Flags */}
                    <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                      <span className="font-mono text-rose-300 uppercase tracking-wider font-bold block">
                        Telltale Red Flags:
                      </span>
                      <ul className="space-y-1 text-slate-300">
                        {threat.redFlags.map((flag, i) => (
                          <li key={i}>• {flag}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Example */}
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                      <span className="font-mono text-amber-300 uppercase tracking-wider font-bold block">
                        Real-World Pretext Example:
                      </span>
                      <p className="text-slate-300 italic">"{threat.example}"</p>
                    </div>
                  </div>

                  {/* Prevention */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                    <span className="font-mono text-emerald-300 uppercase tracking-wider font-bold block">
                      Recommended Defense:
                    </span>
                    <p className="text-slate-300 leading-relaxed">{threat.prevention}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
