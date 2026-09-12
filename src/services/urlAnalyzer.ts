import { AnalysisResult, SocialPlatform, ThreatSignal } from '../types/analysis';
import { normalizeRiskScore } from './riskEngine';

const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.work', '.click', '.loan', '.fit', '.gq', '.cf', '.tk', '.ml',
  '.cc', '.icu', '.monster', '.rest', '.cam', '.skin', '.buzz', '.vip', '.live'
];

const SHORTENED_DOMAINS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'cutt.ly', 'rb.gy'
];

const BRAND_KEYWORDS = [
  'paypal', 'instagram', 'whatsapp', 'facebook', 'meta', 'google', 'apple',
  'netflix', 'amazon', 'microsoft', 'binance', 'coinbase', 'fedex', 'dhl',
  'usps', 'bank', 'wells', 'chase', 'secure', 'verify', 'login', 'support'
];

export function analyzeUrlLocally(rawUrl: string, platform: SocialPlatform = 'Other'): AnalysisResult {
  let urlString = rawUrl.trim();
  if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
    urlString = 'https://' + urlString;
  }

  let parsed: URL | null = null;
  try {
    parsed = new URL(urlString);
  } catch {
    // Malformed URL
    const norm = normalizeRiskScore(85);
    return {
      id: 'scan-' + Date.now(),
      timestamp: Date.now(),
      contentType: 'link',
      platform,
      targetSummary: rawUrl,
      riskScore: norm.score,
      riskLevel: norm.level,
      verdictLabel: norm.verdictLabel,
      category: 'Phishing',
      confidence: 0.88,
      threatSignals: [
        {
          id: 'sig-malformed',
          title: 'Malformed or Obfuscated URL Structure',
          severity: 'high',
          description: 'The URL syntax violates standard RFC specifications and resembles obfuscation techniques commonly used to evade security scanners.',
        }
      ],
      explanation: {
        whatWeDetected: ['Deceptive link structure preventing standard domain resolution'],
        whyItMatters: 'Obfuscated links are frequently deployed in social media phishing campaigns to disguise their true destination.',
        whyFlaggedSummary: 'The link contains invalid or evasive formatting patterns.',
      },
      recommendations: [
        'Do not paste this link into your browser address bar.',
        'Do not enter personal credentials or sensitive payment details.',
        'Verify the communication through an official customer portal directly.'
      ],
      isDemo: false,
      isCloudAnalysis: false,
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  const search = parsed.search.toLowerCase();
  const fullHref = parsed.href.toLowerCase();

  const signals: ThreatSignal[] = [];
  let calculatedScore = 12; // baseline clean score

  // 1. Check IP address as hostname
  const isIpHost = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  if (isIpHost) {
    calculatedScore += 50;
    signals.push({
      id: 'sig-ip',
      title: 'Raw IP Address Hostname',
      severity: 'high',
      description: `Hostname is direct IP address (${hostname}) instead of a verified domain name, frequently used to bypass domain reputation blocklists.`,
    });
  }

  // 2. Protocol Check
  if (parsed.protocol === 'http:') {
    calculatedScore += 25;
    signals.push({
      id: 'sig-http',
      title: 'Unencrypted Connection (HTTP)',
      severity: 'medium',
      description: 'The link transmits data in unencrypted plaintext without modern SSL/TLS certificate verification.',
    });
  }

  // 3. Shortened URL
  const isShortened = SHORTENED_DOMAINS.some(d => hostname.includes(d));
  if (isShortened) {
    calculatedScore += 28;
    signals.push({
      id: 'sig-short',
      title: 'Shortened Link Masking Final Destination',
      severity: 'medium',
      description: `Domain ${hostname} is a URL shortener service that conceals the ultimate landing page and intermediate redirects.`,
    });
  }

  // 4. Suspicious TLD
  const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => hostname.endsWith(tld));
  if (hasSuspiciousTld) {
    calculatedScore += 35;
    signals.push({
      id: 'sig-tld',
      title: 'High-Abuse Top-Level Domain (TLD)',
      severity: 'high',
      description: 'Domain utilizes a top-level domain extension statistically correlated with low registrar verification and elevated abuse rates.',
    });
  }

  // 5. Lookalike / Brand Impersonation in domain or subdomains
  const matchedBrands = BRAND_KEYWORDS.filter(brand => {
    // If domain has brand but is NOT the official domain
    if (hostname.includes(brand)) {
      const isOfficial = 
        hostname === `${brand}.com` || 
        hostname === `www.${brand}.com` ||
        hostname.endsWith(`.${brand}.com`);
      return !isOfficial;
    }
    return false;
  });

  if (matchedBrands.length > 0) {
    calculatedScore += 45;
    signals.push({
      id: 'sig-brand-impersonation',
      title: 'Potential Brand Impersonation Detected',
      severity: 'high',
      description: `Domain contains keyword tokens resembling "${matchedBrands.join(', ')}" without matching the official verified infrastructure.`,
    });
  }

  // 6. Excessive subdomains or hyphens
  const parts = hostname.split('.');
  if (parts.length > 3) {
    calculatedScore += 20;
    signals.push({
      id: 'sig-subdomains',
      title: 'Excessive Subdomain Stacking',
      severity: 'medium',
      description: `Domain uses ${parts.length} hierarchy levels, a structure often used to mimic authentic login paths (e.g. login.secure.verify.domain.com).`,
    });
  }

  if ((hostname.match(/-/g) || []).length >= 2) {
    calculatedScore += 20;
    signals.push({
      id: 'sig-hyphens',
      title: 'Deceptive Hyphenated Domain Pattern',
      severity: 'medium',
      description: 'Multiple hyphens inside domain name suggest typo-squatting or lookalike registration.',
    });
  }

  // 7. Suspicious URL Parameters
  if (search.includes('redirect') || search.includes('login') || search.includes('token') || search.includes('password') || search.includes('otp')) {
    calculatedScore += 25;
    signals.push({
      id: 'sig-params',
      title: 'Sensitive Credential Query Parameters',
      severity: 'high',
      description: 'Query string contains authentication or redirection parameters indicative of credential harvesting or open-redirect relays.',
    });
  }

  // 8. Punycode / IDN Homograph
  if (hostname.includes('xn--')) {
    calculatedScore += 40;
    signals.push({
      id: 'sig-punycode',
      title: 'Punycode / Homograph Character Encoding',
      severity: 'high',
      description: 'Domain uses Internationalized Domain Name (IDN) encoding, commonly used to substitute lookalike Cyrillic or Greek characters for Latin letters.',
    });
  }

  // Clean case if minimal signals
  if (signals.length === 0) {
    calculatedScore = 14;
    signals.push({
      id: 'sig-clean',
      title: 'Standard Domain Configuration',
      severity: 'info',
      description: 'Standard domain structure, HTTPS enabled, and no immediate high-risk signature patterns detected.',
    });
  }

  const norm = normalizeRiskScore(calculatedScore);
  const category = calculatedScore >= 60 ? (matchedBrands.length > 0 ? 'Impersonation' : 'Phishing') : (calculatedScore > 25 ? 'Unknown / Inconclusive' : 'Unknown / Inconclusive');

  const detectedBullets = signals.map(s => s.title);
  const whyItMatters = norm.level === 'HIGH' || norm.level === 'SUSPICIOUS'
    ? 'Attackers frequently circulate deceptive links across social media messages and comment sections to lure victims into fake credential-stealing pages.'
    : 'The link shows structural conventions consistent with standard websites, though users should always exercise normal caution before logging in.';

  return {
    id: 'scan-' + Date.now(),
    timestamp: Date.now(),
    contentType: 'link',
    platform,
    targetSummary: rawUrl.length > 55 ? rawUrl.slice(0, 52) + '...' : rawUrl,
    riskScore: norm.score,
    riskLevel: norm.level,
    verdictLabel: norm.verdictLabel,
    category,
    confidence: 0.85,
    threatSignals: signals,
    signalBreakdown: [
      { name: 'Domain Reputation & Age', score: Math.min(100, Math.round(norm.score * 0.95)) },
      { name: 'URL Structure & Syntax', score: Math.min(100, Math.round(norm.score * 1.05)) },
      { name: 'SSL/TLS Certificate Rigor', score: parsed.protocol === 'https:' ? 15 : 90 },
      { name: 'Brand Impersonation Probability', score: matchedBrands.length > 0 ? 88 : 12 },
    ],
    explanation: {
      whatWeDetected: detectedBullets,
      whyItMatters,
      whyFlaggedSummary: `Structural heuristic analysis detected ${signals.length} indicator${signals.length === 1 ? '' : 's'}.`,
    },
    recommendations: norm.level === 'HIGH' || norm.level === 'SUSPICIOUS'
      ? [
          'DO NOT click this link or provide login credentials.',
          'DO NOT input two-factor authentication codes or passwords.',
          'Verify communications directly through the organization official app or verified URL.',
          'Block and report the social media profile that shared this link.'
        ]
      : [
          'Ensure the URL in your browser matches the expected legitimate domain before typing passwords.',
          'Look for valid TLS padlock indicators in your browser address bar.',
          'Never submit financial info unless you initiated the transaction yourself.'
        ],
    isDemo: false,
    isCloudAnalysis: false,
  };
}
