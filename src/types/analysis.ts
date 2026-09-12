export type ContentType = 'link' | 'message' | 'image' | 'screenshot' | 'qr' | 'media';

export type RiskLevel = 'LOW' | 'INCONCLUSIVE' | 'SUSPICIOUS' | 'HIGH';

export type SocialPlatform = 
  | 'Instagram' 
  | 'WhatsApp' 
  | 'Facebook' 
  | 'YouTube' 
  | 'Telegram' 
  | 'X' 
  | 'Snapchat' 
  | 'Other';

export type ScamCategory =
  | 'Phishing'
  | 'Financial Scam'
  | 'Impersonation'
  | 'Fake Giveaway'
  | 'Investment Scam'
  | 'Job Scam'
  | 'Romance Scam'
  | 'Account Takeover'
  | 'Shopping Scam'
  | 'Malware Risk'
  | 'QR Scam'
  | 'AI/Deepfake Manipulation'
  | 'Unknown / Inconclusive';

export interface ThreatSignal {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  description: string;
  tag?: string;
}

export interface SignalScore {
  name: string;
  score: number; // 0 - 100
  note?: string;
}

export interface ForensicMarker {
  id: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  label: string;
  detail: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ScreenshotComponents {
  messageDetected: boolean;
  linkDetected: boolean;
  imageDetected: boolean;
  profileInfoDetected: boolean;
  extractedText?: string;
  extractedUrls?: string[];
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  contentType: ContentType;
  platform: SocialPlatform;
  targetSummary: string; // e.g., URL or truncated message
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  verdictLabel: string; // e.g. "POTENTIAL PHISHING RISK", "SUSPICIOUS PATTERNS DETECTED"
  category: ScamCategory;
  confidence: number; // 0.0 - 1.0
  threatSignals: ThreatSignal[];
  signalBreakdown?: SignalScore[];
  explanation: {
    whatWeDetected: string[];
    whyItMatters: string;
    whyFlaggedSummary: string;
  };
  recommendations: string[];
  forensicMarkers?: ForensicMarker[];
  screenshotComponents?: ScreenshotComponents;
  qrDestination?: string;
  mediaNote?: string;
  isDemo?: boolean;
  isCloudAnalysis?: boolean;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: number;
  contentType: ContentType;
  platform: SocialPlatform;
  summary: string;
  riskScore: number;
  riskLevel: RiskLevel;
  category: ScamCategory;
  isDemo?: boolean;
}

export interface SpotTheGlitchScenario {
  id: string;
  title: string;
  category: ScamCategory;
  platform: SocialPlatform;
  type: 'message' | 'image' | 'link';
  prompt: string;
  content: {
    text?: string;
    sender?: string;
    avatar?: string;
    url?: string;
    imageUrl?: string;
  };
  glitches: {
    id: string;
    title: string;
    description: string;
    isCorrect: boolean;
    hint: string;
  }[];
  explanation: string;
  takeaway: string;
}
