import { AnalysisResult, ScamCategory, SocialPlatform, ThreatSignal } from '../types/analysis';
import { normalizeRiskScore } from './riskEngine';

interface PatternRule {
  regex: RegExp;
  title: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  points: number;
  category?: ScamCategory;
}

const MESSAGE_RULES: PatternRule[] = [
  // 1. Urgency & Fear Tactics
  {
    regex: /(suspended|deactivated|frozen|terminated|locked|closed|blocked) (within|in) (24|12|48|few|2) (hours|hrs|minutes|mins)|immediate(ly)? (action|attention|verification) (required|needed)|urgent notice|final warning/i,
    title: 'Artificial Urgency & Coercive Deadline',
    severity: 'high',
    description: 'Message imposes an imminent deadline designed to induce anxiety and bypass analytical scrutiny.',
    points: 30,
    category: 'Account Takeover',
  },
  // 2. OTP / Password Harvesting
  {
    regex: /(send|provide|share|reply with) (your )?(otp|one-time|verification code|security pin|2fa code|password|passcode)/i,
    title: 'Explicit Request for Verification Code / OTP',
    severity: 'high',
    description: 'Direct solicitation of temporary authentication credentials or one-time passcodes, which legitimate entities never request via direct message.',
    points: 40,
    category: 'Phishing',
  },
  // 3. Financial & Cryptocurrency Solicitations
  {
    regex: /(send|transfer|wire|pay|deposit) (money|funds|usd|inr|cash|usdt|btc|crypto|bitcoin|gift card|apple card|steam card)/i,
    title: 'Unsolicited Financial or Cryptocurrency Request',
    severity: 'high',
    description: 'Message requests irreversible financial transmissions, peer-to-peer transfers, or non-refundable gift card redemptions.',
    points: 35,
    category: 'Financial Scam',
  },
  // 4. Guaranteed Investment / High Yield Returns
  {
    regex: /(guaranteed|risk-free|100%|daily|weekly) (return|profit|income|yield|doubling)|crypto (expert|signals|trading bot|mentor)|invest \$?\d+ and (get|earn|receive) \$?\d+/i,
    title: 'Guaranteed High-Yield Investment Pitch',
    severity: 'high',
    description: 'Promotes unrealistic investment returns and zero-risk trading yields characteristic of high-yield investment fraud (HYIP).',
    points: 35,
    category: 'Investment Scam',
  },
  // 5. Fake Rewards / Lottery / Giveaways
  {
    regex: /(congratulations|you have won|winner of|claim your prize|selected for|exclusive gift|free iphone|airdrop|jackpot)/i,
    title: 'Unsolicited Prize / Fake Giveaway Bait',
    severity: 'medium',
    description: 'Appeals to greed with unearned winnings or exclusive rewards requiring advance fees or credential submission.',
    points: 25,
    category: 'Fake Giveaway',
  },
  // 6. Authority / Support Impersonation
  {
    regex: /(meta|instagram|whatsapp|facebook|telegram|apple|google|netflix|paypal|bank|irs|support team|security department|compliance team)/i,
    title: 'Authority or Platform Impersonation Language',
    severity: 'medium',
    description: 'Invokes official corporate, administrative, or platform security titles to fabricate institutional legitimacy.',
    points: 20,
    category: 'Impersonation',
  },
  // 7. Delivery / Package Fee Phishing
  {
    regex: /(package|parcel|shipment|delivery) (cannot be delivered|is on hold|requires payment|address is missing|redelivery fee)/i,
    title: 'Delivery Disruption / Smishing Pretext',
    severity: 'high',
    description: 'Employs postal or courier delivery issues to pressure the recipient into clicking phishing tracking links.',
    points: 35,
    category: 'Phishing',
  },
  // 8. Secretive / Move to Alternate Platform
  {
    regex: /(text me on whatsapp|add my telegram|message me privately|keep this confidential|don't tell anyone)/i,
    title: 'Request to Migrate to Unmonitored Channels',
    severity: 'low',
    description: 'Encourages leaving the current platform to bypass automated abuse filters and moderation safeguards.',
    points: 18,
    category: 'Romance Scam',
  },
];

export function analyzeMessageLocally(text: string, platform: SocialPlatform = 'Other'): AnalysisResult {
  const trimmed = text.trim();
  const signals: ThreatSignal[] = [];
  let score = 10;
  const categoriesCount: Record<string, number> = {};

  for (const rule of MESSAGE_RULES) {
    if (rule.regex.test(trimmed)) {
      score += rule.points;
      signals.push({
        id: 'sig-msg-' + signals.length,
        title: rule.title,
        severity: rule.severity,
        description: rule.description,
      });
      if (rule.category) {
        categoriesCount[rule.category] = (categoriesCount[rule.category] || 0) + rule.points;
      }
    }
  }

  // Check URL present in text
  const urlMatches = trimmed.match(/https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/[^\s]*/gi);
  if (urlMatches && urlMatches.length > 0) {
    score += 15;
    signals.push({
      id: 'sig-url-in-msg',
      title: 'Contains External Hyperlink',
      severity: 'medium',
      description: `Message incorporates ${urlMatches.length} external URL string(s) directing traffic outside platform safety controls.`,
    });
  }

  // Determine prominent category
  let topCategory: ScamCategory = 'Unknown / Inconclusive';
  let highestWeight = 0;
  for (const [cat, weight] of Object.entries(categoriesCount)) {
    if (weight > highestWeight) {
      highestWeight = weight;
      topCategory = cat as ScamCategory;
    }
  }

  if (signals.length === 0) {
    score = 15;
    signals.push({
      id: 'sig-msg-benign',
      title: 'No Aggressive Coercive Markers Detected',
      severity: 'info',
      description: 'Text does not contain hallmark phrases of social engineering, extreme urgency, or credential requests.',
    });
  }

  const norm = normalizeRiskScore(score);

  return {
    id: 'scan-' + Date.now(),
    timestamp: Date.now(),
    contentType: 'message',
    platform,
    targetSummary: trimmed.length > 60 ? trimmed.slice(0, 57) + '...' : trimmed,
    riskScore: norm.score,
    riskLevel: norm.level,
    verdictLabel: norm.verdictLabel,
    category: topCategory,
    confidence: 0.86,
    threatSignals: signals,
    signalBreakdown: [
      { name: 'Urgency & Coercive Pressure', score: Math.min(100, norm.score > 40 ? 88 : 15) },
      { name: 'Financial / Credential Demand', score: Math.min(100, norm.score > 60 ? 92 : 20) },
      { name: 'Social Engineering Pattern', score: Math.min(100, Math.round(norm.score * 0.9)) },
      { name: 'Identity & Channel Authenticity', score: Math.min(100, Math.round(norm.score * 0.85)) },
    ],
    explanation: {
      whatWeDetected: signals.map(s => s.title),
      whyItMatters: norm.level === 'HIGH' || norm.level === 'SUSPICIOUS'
        ? 'Social engineering relies on emotional triggers like panic, urgency, or promised windfalls to rush targets into taking unverified actions.'
        : 'The tone appears conversational and lacks standard markers of automated or manipulative social media scams.',
      whyFlaggedSummary: `Message analysis detected ${signals.length} linguistic signature${signals.length === 1 ? '' : 's'}.`,
    },
    recommendations: norm.level === 'HIGH' || norm.level === 'SUSPICIOUS'
      ? [
          'DO NOT send money, gift cards, or cryptocurrency.',
          'NEVER share one-time passwords (OTP) or authentication codes.',
          'Contact the purported sender via a separate, verified phone number or official channel.',
          'Block the sender and report the conversation to the platform administrators.'
        ]
      : [
          'Always remain mindful when clicking unfamiliar external links.',
          'If the sender asks for personal information in follow-up messages, verify their identity independently.'
        ],
    isDemo: false,
    isCloudAnalysis: false,
  };
}
