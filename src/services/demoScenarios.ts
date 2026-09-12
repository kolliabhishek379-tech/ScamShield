import { AnalysisResult, ContentType, SocialPlatform } from '../types/analysis';

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  contentType: ContentType;
  platform: SocialPlatform;
  inputContent: string;
  result: AnalysisResult;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  // Demo 1: Fake bank message
  {
    id: 'demo-1-bank-msg',
    title: 'Fake Banking Security Alert',
    subtitle: 'Urgent WhatsApp SMS threatening account lock in 24 hours',
    contentType: 'message',
    platform: 'WhatsApp',
    inputContent: 'CHASE BANK ALERT: Unauthorized transaction of $1,420.90 detected at BestBuy. Your online access will be FROZEN within 2 hours. Reply immediately with your 6-digit one-time code to cancel this debit or visit: http://chase-secure-verify-auth.xyz/cancel',
    result: {
      id: 'demo-res-1',
      timestamp: Date.now() - 120000,
      contentType: 'message',
      platform: 'WhatsApp',
      targetSummary: 'CHASE BANK ALERT: Unauthorized transaction of $1,420.90...',
      riskScore: 94,
      riskLevel: 'HIGH',
      verdictLabel: 'HIGH-RISK PHISHING & CREDENTIAL THEFT DETECTED',
      category: 'Phishing',
      confidence: 0.96,
      threatSignals: [
        {
          id: 'sig-d1-urgency',
          title: 'Extreme Coercive Deadline (2-hour freeze threat)',
          severity: 'high',
          description: 'Artificial urgency designed to panic the victim into taking action before verifying with their bank.',
        },
        {
          id: 'sig-d1-otp',
          title: 'Direct Solicitation of One-Time Password (OTP)',
          severity: 'high',
          description: 'Requests 6-digit two-factor verification code. Banks strictly forbid staff from asking customers for OTPs.',
        },
        {
          id: 'sig-d1-domain',
          title: 'Deceptive Lookalike Domain (.xyz TLD)',
          severity: 'high',
          description: 'Domain "chase-secure-verify-auth.xyz" mimics Chase branding on an inexpensive high-abuse TLD.',
        },
        {
          id: 'sig-d1-http',
          title: 'Unencrypted HTTP Connection Pattern',
          severity: 'medium',
          description: 'Standard financial institutions enforce strict HTTPS HSTS certificate chains.',
        }
      ],
      signalBreakdown: [
        { name: 'Urgency & Psychological Pressure', score: 98 },
        { name: 'Credential Harvesting Risk', score: 96 },
        { name: 'Domain Infrastructure Authenticity', score: 95 },
        { name: 'Financial Brand Impersonation', score: 92 },
      ],
      explanation: {
        whatWeDetected: [
          'Urgent account suspension threat targeting high-stress emotional reaction',
          'Request to disclose two-factor SMS OTP verification code',
          'Lookalike domain containing Chase keywords hosted on .xyz registry'
        ],
        whyItMatters: 'Financial phishing SMS messages (smishing) are among the most prevalent vectors for immediate unauthorized wire transfers and account takeovers.',
        whyFlaggedSummary: 'Text exhibits 4 distinct indicators of high-threat financial credential theft.',
      },
      recommendations: [
        'DO NOT reply with your one-time password or security code.',
        'DO NOT open the provided URL.',
        'Open your official Chase mobile banking app directly or dial the number on the back of your debit card.',
        'Report this message as spam within WhatsApp.'
      ],
      isDemo: true,
      isCloudAnalysis: false,
    }
  },

  // Demo 2: Suspicious Instagram giveaway
  {
    id: 'demo-2-ig-giveaway',
    title: 'Instagram Celebrity Crypto Giveaway',
    subtitle: 'Bogus influencer story promising free Ethereum with registration fee',
    contentType: 'link',
    platform: 'Instagram',
    inputContent: 'http://mrbeast-official-giveaway-2026.click/claim?ref=instagram_promo_win',
    result: {
      id: 'demo-res-2',
      timestamp: Date.now() - 360000,
      contentType: 'link',
      platform: 'Instagram',
      targetSummary: 'http://mrbeast-official-giveaway-2026.click/claim...',
      riskScore: 89,
      riskLevel: 'HIGH',
      verdictLabel: 'HIGH-RISK ADVANCE-FEE SCAM INDICATORS',
      category: 'Fake Giveaway',
      confidence: 0.94,
      threatSignals: [
        {
          id: 'sig-d2-impersonate',
          title: 'High-Profile Celebrity Brand Name Impersonation',
          severity: 'high',
          description: 'Incorporates recognized public figure name "mrbeast" into a newly minted domain registration.',
        },
        {
          id: 'sig-d2-tld',
          title: 'High-Abuse ".click" Top-Level Domain',
          severity: 'high',
          description: 'TLD regularly associated with short-lived disposable phishing campaign infrastructure.',
        },
        {
          id: 'sig-d2-unencrypted',
          title: 'Unsecured Transmission Protocol (HTTP)',
          severity: 'medium',
          description: 'Lacks TLS encryption credentials, exposing any entered data to third-party interception.',
        },
        {
          id: 'sig-d2-params',
          title: 'Affiliate Tracking Parameter Stacking',
          severity: 'low',
          description: 'Appends deceptive campaign reference tokens to simulate legitimate promotional tracking.',
        }
      ],
      signalBreakdown: [
        { name: 'Brand Impersonation Likelihood', score: 94 },
        { name: 'Domain Reputation & Age', score: 91 },
        { name: 'Advance-Fee Fraud Signatures', score: 88 },
        { name: 'Infrastructure Legitimacy', score: 85 },
      ],
      explanation: {
        whatWeDetected: [
          'Celebrity trademark tokens blended into non-official web domain',
          'Disreputable top-level domain (.click) commonly used in botnet campaigns',
          'Absence of HTTPS certificate'
        ],
        whyItMatters: 'Fake giveaway sites typically ask users to pay a small "gas fee" or "shipping deposit" in crypto, stealing the payment without sending any prize.',
        whyFlaggedSummary: 'Domain pattern matches known social media influencer impersonation templates.',
      },
      recommendations: [
        'Do not submit personal identification or cryptocurrency wallet keys.',
        'Never send advance fees to claim a prize or giveaway reward.',
        'Check the creator’s verified blue checkmark profile on Instagram for official promotions.'
      ],
      isDemo: true,
      isCloudAnalysis: false,
    }
  },

  // Demo 3: Fake delivery message
  {
    id: 'demo-3-delivery-msg',
    title: 'Fake Delivery Notification',
    subtitle: 'Postal smishing text claiming package address is missing a $1.99 redelivery fee',
    contentType: 'message',
    platform: 'Telegram',
    inputContent: 'USPS Notice: Your package #US94055102 has an incomplete postal address. Delivery cannot proceed and the item will be returned in 12 hours. Update your street details and settle the $1.85 handling charge: https://usps-tracking-redeliver-hub.work',
    result: {
      id: 'demo-res-3',
      timestamp: Date.now() - 900000,
      contentType: 'message',
      platform: 'Telegram',
      targetSummary: 'USPS Notice: Your package #US94055102 has an incomplete...',
      riskScore: 91,
      riskLevel: 'HIGH',
      verdictLabel: 'HIGH-RISK POSTAL SMISHING ATTEMPT',
      category: 'Phishing',
      confidence: 0.95,
      threatSignals: [
        {
          id: 'sig-d3-postal',
          title: 'Federal Postal Service Impersonation',
          severity: 'high',
          description: 'Pretends to originate from the United States Postal Service (USPS) regarding an undelivered parcel.',
        },
        {
          id: 'sig-d3-fee',
          title: 'Micro-Payment Credit Card Harvesting Pretext',
          severity: 'high',
          description: 'Requests a minor $1.85 fee as a lure to capture complete credit card numbers and CVV codes.',
        },
        {
          id: 'sig-d3-work',
          title: 'Suspicious Domain ".work" TLD',
          severity: 'high',
          description: 'Official USPS tracking operates strictly on usps.com, never on external .work domains.',
        },
        {
          id: 'sig-d3-urgency',
          title: 'Return-to-Sender Time Limit Pressure',
          severity: 'medium',
          description: '12-hour ultimatum encourages prompt action without independent tracking verification.',
        }
      ],
      signalBreakdown: [
        { name: 'Postal Service Smishing Pattern', score: 96 },
        { name: 'Payment Card Harvesting Vector', score: 94 },
        { name: 'Domain Reputation Mismatch', score: 92 },
        { name: 'Coercive Urgency Level', score: 84 },
      ],
      explanation: {
        whatWeDetected: [
          'Deceptive courier delivery failure pretext',
          'Card harvesting lure disguised as nominal $1.85 redelivery charge',
          'Fraudulent domain usps-tracking-redeliver-hub.work'
        ],
        whyItMatters: 'Once credit card information is entered on the fake postal portal, attackers immediately place large fraudulent charges or enroll cards into mobile wallets.',
        whyFlaggedSummary: 'Matches ubiquitous international courier smishing campaign patterns.',
      },
      recommendations: [
        'Do not click the tracking link or enter payment card data.',
        'Copy the tracking number and paste it manually into the official usps.com website.',
        'Delete the message and block the sender.'
      ],
      isDemo: true,
      isCloudAnalysis: false,
    }
  },

  // Demo 4: Suspicious QR code
  {
    id: 'demo-4-parking-qr',
    title: 'Deceptive Parking / Payment QR',
    subtitle: 'Public QR sticker redirecting to an unauthorized third-party billing gateway',
    contentType: 'qr',
    platform: 'Other',
    inputContent: 'https://quick-park-pay-citymeters.vip/session?meter=8841&fee=4.50',
    result: {
      id: 'demo-res-4',
      timestamp: Date.now() - 1800000,
      contentType: 'qr',
      platform: 'Other',
      targetSummary: 'https://quick-park-pay-citymeters.vip/session?meter=8841...',
      riskScore: 86,
      riskLevel: 'HIGH',
      verdictLabel: 'HIGH-RISK QUISHING (QR PHISHING) VECTOR',
      category: 'QR Scam',
      confidence: 0.91,
      qrDestination: 'https://quick-park-pay-citymeters.vip/session?meter=8841&fee=4.50',
      threatSignals: [
        {
          id: 'sig-d4-quishing',
          title: 'Hidden Quishing Redirection Vector',
          severity: 'high',
          description: 'Visual barcode bypasses initial textual inspection to direct the browser to an unverified third-party payment portal.',
        },
        {
          id: 'sig-d4-tld',
          title: 'Disreputable Top-Level Domain (.vip)',
          severity: 'high',
          description: 'Domain uses a commercial .vip registry rather than legitimate city municipal government or parking authority infrastructure (.gov or official operator).',
        },
        {
          id: 'sig-d4-prefill',
          title: 'Pre-Configured Session Billing Token',
          severity: 'medium',
          description: 'Constructs fake meter session parameters to simulate automated kiosk checkouts.',
        }
      ],
      signalBreakdown: [
        { name: 'Quishing Deception Index', score: 90 },
        { name: 'Payment Gateway Legitimacy', score: 88 },
        { name: 'Domain Infrastructure Trust', score: 85 },
        { name: 'Physical Meter Sticker Overlap Risk', score: 82 },
      ],
      explanation: {
        whatWeDetected: [
          'QR matrix decodes to unofficial payment URL (quick-park-pay-citymeters.vip)',
          'Municipal utility impersonation on a commercial top-level domain',
          'Absence of verified regional parking authority credentials'
        ],
        whyItMatters: 'Fraudulent QR code stickers are frequently pasted over legitimate municipal parking meters, leading motorists into fake payment forms.',
        whyFlaggedSummary: 'Decoded QR destination points to high-risk payment credential collection.',
      },
      recommendations: [
        'Inspect Destination carefully before navigating.',
        'DO NOT enter credit card or banking details on this web page.',
        'Pay using the official municipal parking app or standard physical payment terminal.',
        'Check if a physical QR sticker was pasted over the machine original faceplate.'
      ],
      isDemo: true,
      isCloudAnalysis: false,
    }
  },

  // Demo 5: Potentially manipulated image
  {
    id: 'demo-5-ai-portrait',
    title: 'Synthetic AI Profile Portrait',
    subtitle: 'Facebook / Tinder catfish photo with characteristic diffusion rendering anomalies',
    contentType: 'image',
    platform: 'Facebook',
    inputContent: 'ai_generated_influencer_portrait.webp',
    result: {
      id: 'demo-res-5',
      timestamp: Date.now() - 3600000,
      contentType: 'image',
      platform: 'Facebook',
      targetSummary: 'ai_generated_influencer_portrait.webp (1024×1024)',
      riskScore: 78,
      riskLevel: 'SUSPICIOUS',
      verdictLabel: 'SUSPICIOUS SYNTHETIC IMAGE PATTERNS DETECTED',
      category: 'AI/Deepfake Manipulation',
      confidence: 0.84,
      threatSignals: [
        {
          id: 'sig-d5-pupils',
          title: 'Pupillary Reflection & Iris Boundary Asymmetry',
          severity: 'high',
          description: 'Specular catchlights in the left and right eyes exhibit differing geometry and non-matching virtual illumination angles.',
        },
        {
          id: 'sig-d5-texture',
          title: 'Over-Smoothed Micro-Skin Frequency Discontinuity',
          severity: 'medium',
          description: 'High-frequency pores transition abruptly into hyper-smooth synthetic diffusion blending across the jawline and neck.',
        },
        {
          id: 'sig-d5-earrings',
          title: 'Asymmetric Jewelry & Accessory Hallucination',
          severity: 'medium',
          description: 'Earring ornaments dissolve ambiguously into surrounding hair strands with inconsistent physical perspective.',
        },
        {
          id: 'sig-d5-c2pa',
          title: 'Absent Provenance Manifest (No C2PA Metadata)',
          severity: 'low',
          description: 'No cryptographic content authenticity assertions found in file headers.',
        }
      ],
      signalBreakdown: [
        { name: 'Facial Geometry & Biometric Consistency', score: 81 },
        { name: 'High-Frequency Noise & Texture Patterns', score: 79 },
        { name: 'Accessory & Edge Coherence', score: 74 },
        { name: 'Metadata & Provenance Preservation', score: 25, note: 'Unknown / C2PA absent' },
      ],
      forensicMarkers: [
        {
          id: 'mark-eyes',
          x: 48,
          y: 38,
          label: 'Iris Catchlight Mismatch',
          detail: 'Primary light reflection shows circular shape in left eye but distorted polygon in right eye.',
          severity: 'high',
        },
        {
          id: 'mark-hair',
          x: 68,
          y: 42,
          label: 'Hair Strand Blending Artifact',
          detail: 'Fine hair follicles melt into cheekbone texture without realistic depth of field.',
          severity: 'medium',
        },
        {
          id: 'mark-neck',
          x: 52,
          y: 72,
          label: 'Skin Gradient Discontinuity',
          detail: 'Abrupt boundary between hyper-detailed collarbone and blurred neck texture.',
          severity: 'medium',
        }
      ],
      explanation: {
        whatWeDetected: [
          'Optical catchlight geometry divergence between left and right pupils',
          'Subtle texture blurring characteristic of generative diffusion decoders',
          'Missing physical perspective coherence along accessory boundaries'
        ],
        whyItMatters: 'Synthetic portraiture is the cornerstone of modern romance scams, crypto pig-butchering operations, and fraudulent financial advisor personas.',
        whyFlaggedSummary: 'Visual forensics identified multiple probabilistic synthetic artifacts. These indicators are probabilistic and do not constitute certified proof of manipulation.',
      },
      recommendations: [
        'Perform a reverse-image search (Google Lens / TinEye) to see if this face has been recycled under different names.',
        'Request a live video call or custom gesture photo before establishing financial or emotional commitments.',
        'Never send funds or invest with someone you have only communicated with through social media profiles.'
      ],
      isDemo: true,
      isCloudAnalysis: false,
    }
  },

  // Demo 6: Suspicious investment message
  {
    id: 'demo-6-crypto-invest',
    title: 'Telegram High-Yield Crypto Scheme',
    subtitle: 'Direct message promising 450% guaranteed return in 72 hours via automated AI bot',
    contentType: 'message',
    platform: 'Telegram',
    inputContent: 'Hey brother! I noticed your profile on the crypto trading community. Our VIP AI algorithm guarantees 450% ROI every 72 hours with 0% drawdown risk! Minimum deposit is only $250 USDT to start earning immediate passive income. Register on our audited broker: https://apex-capital-quantum-trade.xyz/ref/vip88',
    result: {
      id: 'demo-res-6',
      timestamp: Date.now() - 5400000,
      contentType: 'message',
      platform: 'Telegram',
      targetSummary: 'Hey brother! I noticed your profile on the crypto trading...',
      riskScore: 93,
      riskLevel: 'HIGH',
      verdictLabel: 'HIGH-RISK FINANCIAL FRAUD & HYIP SCHEME DETECTED',
      category: 'Investment Scam',
      confidence: 0.95,
      threatSignals: [
        {
          id: 'sig-d6-guarantee',
          title: 'Guaranteed Unrealistic Return (450% in 72 Hours)',
          severity: 'high',
          description: 'Promises impossible zero-risk profits, the definitive hallmark of Ponzi schemes and Advance Fee Fraud.',
        },
        {
          id: 'sig-d6-crypto',
          title: 'Irreversible USDT Cryptocurrency Deposit Requirement',
          severity: 'high',
          description: 'Requests stablecoin deposits into private un-regulated addresses that cannot be reversed or insured.',
        },
        {
          id: 'sig-d6-unsolicited',
          title: 'Cold Unsolicited Direct Outreach on Telegram',
          severity: 'high',
          description: 'Approaches targets in public group directories, a key tactic in "pig butchering" and investment fraud rings.',
        },
        {
          id: 'sig-d6-broker',
          title: 'Bogus Trading Platform on .xyz TLD',
          severity: 'medium',
          description: 'Platform "apex-capital-quantum-trade.xyz" is un-registered with any tier-1 financial regulator (SEC, FCA, CySEC).',
        }
      ],
      signalBreakdown: [
        { name: 'Ponzi / HYIP Deception Signals', score: 98 },
        { name: 'Unrealistic Yield Claims', score: 99 },
        { name: 'Unregulated Broker Platform', score: 94 },
        { name: 'Cold Social Engineering Pressure', score: 88 },
      ],
      explanation: {
        whatWeDetected: [
          'Preposterous claim of 450% guaranteed return in 3 days with zero risk',
          'Solicitation of non-custodial cryptocurrency deposits (USDT)',
          'Fictitious trading portal hosted on high-risk domain with affiliate referral tokens'
        ],
        whyItMatters: 'Victims are shown fake dashboard profits to convince them to deposit larger sums, only to find withdrawals locked behind endless "tax" or "fee" demands.',
        whyFlaggedSummary: 'Contains multiple classic signatures of high-yield investment fraud.',
      },
      recommendations: [
        'DO NOT transfer cryptocurrency or funds to this platform or user.',
        'Never trust investment offers delivered via private Telegram or WhatsApp messages.',
        'Verify legitimate brokers through regulatory databases (e.g., FINRA BrokerCheck, FCA Register).',
        'Block and report the user account immediately.'
      ],
      isDemo: true,
      isCloudAnalysis: false,
    }
  }
];
