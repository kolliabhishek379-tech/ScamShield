import jsQR from 'jsqr';
import { AnalysisResult, SocialPlatform } from '../types/analysis';
import { normalizeRiskScore } from './riskEngine';
import { analyzeUrlLocally } from './urlAnalyzer';

export interface DecodedQRResult {
  data: string;
  analysis: AnalysisResult;
}

export function decodeAndAnalyzeQR(canvas: HTMLCanvasElement, platform: SocialPlatform = 'Other'): DecodedQRResult | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: 'dontInvert',
  });

  if (!code || !code.data) {
    // Try inverted attempt
    const invertedCode = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'invertFirst',
    });
    if (!invertedCode || !invertedCode.data) {
      return null;
    }
    return buildQRAnalysis(invertedCode.data, platform);
  }

  return buildQRAnalysis(code.data, platform);
}

export function buildQRAnalysis(qrData: string, platform: SocialPlatform = 'Other'): DecodedQRResult {
  const trimmed = qrData.trim();
  const isUrl = /^https?:\/\//i.test(trimmed) || /^[a-z0-9-]+(\.[a-z]{2,})+/i.test(trimmed);
  const isPaymentScheme = /^(upi|bitcoin|ethereum|litecoin|solana|venmo|cashapp):/i.test(trimmed);

  if (isPaymentScheme) {
    const norm = normalizeRiskScore(82);
    const analysis: AnalysisResult = {
      id: 'scan-' + Date.now(),
      timestamp: Date.now(),
      contentType: 'qr',
      platform,
      targetSummary: `QR Direct Payment Scheme (${trimmed.split(':')[0].toUpperCase()})`,
      riskScore: norm.score,
      riskLevel: norm.level,
      verdictLabel: 'HIGH-RISK PAYMENT REDIRECT DETECTED',
      category: 'QR Scam',
      confidence: 0.9,
      threatSignals: [
        {
          id: 'sig-qr-pay',
          title: 'Direct Financial Protocol Execution',
          severity: 'high',
          description: `QR code launches external financial application with pre-filled destination address (${trimmed.slice(0, 30)}...).`,
        },
        {
          id: 'sig-qr-tamper',
          title: 'Physical Sticker Replacement / Quishing Risk',
          severity: 'high',
          description: 'Payment QR codes in public venues or social advertisements are frequently modified by fraudsters to redirect funds to private wallets.',
        }
      ],
      qrDestination: trimmed,
      explanation: {
        whatWeDetected: [
          'Pre-configured payment URI scheme that triggers automatic wallet app opening',
          'Unverified recipient address encoded directly into QR matrix'
        ],
        whyItMatters: 'Quishing (QR Phishing) tricks victims because human eyes cannot read encoded matrix barcodes before scanning.',
        whyFlaggedSummary: 'QR code initiates non-refundable financial transaction.',
      },
      recommendations: [
        'DO NOT authorize transactions or enter transaction PINs.',
        'Verify with the merchant or vendor in person before sending payment.',
        'Check whether a printed QR code has been pasted over an original poster.'
      ],
      isDemo: false,
      isCloudAnalysis: false,
    };
    return { data: trimmed, analysis };
  }

  if (isUrl) {
    const linkAnalysis = analyzeUrlLocally(trimmed, platform);
    // Augment with QR specific context
    const adjustedScore = Math.max(linkAnalysis.riskScore, 65); // elevated scrutiny for QR codes
    const norm = normalizeRiskScore(adjustedScore);

    const qrSignals = [
      {
        id: 'sig-qr-vector',
        title: 'Hidden Destination Vector (Quishing)',
        severity: (norm.level === 'HIGH' ? 'high' : 'medium') as 'high' | 'medium',
        description: `QR payload conceals final address (${trimmed.slice(0, 45)}...) from visual inspection.`,
      },
      ...linkAnalysis.threatSignals,
    ];

    const analysis: AnalysisResult = {
      ...linkAnalysis,
      contentType: 'qr',
      targetSummary: trimmed.length > 55 ? trimmed.slice(0, 52) + '...' : trimmed,
      riskScore: norm.score,
      riskLevel: norm.level,
      verdictLabel: norm.verdictLabel,
      category: 'QR Scam',
      threatSignals: qrSignals,
      qrDestination: trimmed,
      explanation: {
        whatWeDetected: [
          `Decoded destination URL: ${trimmed}`,
          ...linkAnalysis.explanation.whatWeDetected,
        ],
        whyItMatters: 'Malicious QR codes bypass conventional email/chat link preview filters and exploit mobile camera auto-navigation.',
        whyFlaggedSummary: `QR decoded to external destination: ${trimmed.slice(0, 40)}...`,
      },
      recommendations: [
        'Inspect the destination domain carefully before proceeding.',
        'Never submit credentials, two-factor SMS codes, or passwords.',
        'If opened, confirm the browser address bar matches the intended brand.',
      ],
    };
    return { data: trimmed, analysis };
  }

  // Plain text or other payload
  const norm = normalizeRiskScore(30);
  const analysis: AnalysisResult = {
    id: 'scan-' + Date.now(),
    timestamp: Date.now(),
    contentType: 'qr',
    platform,
    targetSummary: trimmed.length > 50 ? trimmed.slice(0, 47) + '...' : trimmed,
    riskScore: norm.score,
    riskLevel: norm.level,
    verdictLabel: norm.verdictLabel,
    category: 'Unknown / Inconclusive',
    confidence: 0.75,
    threatSignals: [
      {
        id: 'sig-qr-plain',
        title: 'Raw Text QR Payload',
        severity: 'info',
        description: 'QR matrix contains plain text data rather than an executable web address or payment URI.',
      }
    ],
    qrDestination: trimmed,
    explanation: {
      whatWeDetected: ['Non-URL arbitrary text payload encoded in barcode'],
      whyItMatters: 'Arbitrary text is generally lower risk unless it contains encoded scripts or deceptive claims.',
      whyFlaggedSummary: 'Decoded plain text payload without web links.',
    },
    recommendations: [
      'Confirm the text matches what you anticipated from the issuer.',
      'Do not execute commands or follow suspicious instructions.'
    ],
    isDemo: false,
    isCloudAnalysis: false,
  };
  return { data: trimmed, analysis };
}
