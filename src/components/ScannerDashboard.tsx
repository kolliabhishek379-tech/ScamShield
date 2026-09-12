import React, { useState } from 'react';
import { ContentType, SocialPlatform, AnalysisResult } from '../types/analysis';
import { ScanCard } from './ScanCard';
import { LinkScanner } from './scanners/LinkScanner';
import { MessageScanner } from './scanners/MessageScanner';
import { ImageScanner } from './scanners/ImageScanner';
import { ScreenshotScanner } from './scanners/ScreenshotScanner';
import { QRScanner } from './scanners/QRScanner';
import { MediaScanner } from './scanners/MediaScanner';
import { ScanProgress } from './results/ScanProgress';
import { AnalysisReport } from './results/AnalysisReport';
import { AIService } from '../services/aiService';
import { Sparkles, Shield, AlertTriangle } from 'lucide-react';

interface ScannerDashboardProps {
  selectedPlatform: SocialPlatform;
  onOpenDemoModal: () => void;
  externalResult?: AnalysisResult | null;
  onClearExternalResult?: () => void;
}

export const ScannerDashboard: React.FC<ScannerDashboardProps> = ({
  selectedPlatform,
  onOpenDemoModal,
  externalResult,
  onClearExternalResult,
}) => {
  const [activeType, setActiveType] = useState<ContentType>('link');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // Sync external demo scenario result if loaded
  React.useEffect(() => {
    if (externalResult) {
      setResult(externalResult);
      setActiveType(externalResult.contentType);
      if (externalResult.contentType === 'image') {
        setUploadedImageUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80');
      } else if (externalResult.contentType === 'screenshot') {
        setUploadedImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80');
      } else {
        setUploadedImageUrl(null);
      }
    }
  }, [externalResult]);

  // Handle Scan Link
  const handleAnalyzeLink = async (url: string) => {
    setIsScanning(true);
    setResult(null);
    setUploadedImageUrl(null);
    try {
      const res = await AIService.analyzeLink(url, selectedPlatform);
      setResult(res);
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Scan Message
  const handleAnalyzeMessage = async (text: string) => {
    setIsScanning(true);
    setResult(null);
    setUploadedImageUrl(null);
    try {
      const res = await AIService.analyzeMessage(text, selectedPlatform);
      setResult(res);
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Scan Image
  const handleAnalyzeImage = async (
    dataUrl: string,
    options: { filename: string; sizeBytes: number; mimeType: string }
  ) => {
    setIsScanning(true);
    setResult(null);
    setUploadedImageUrl(dataUrl);
    try {
      const res = await AIService.analyzeImage(dataUrl, {
        ...options,
        platform: selectedPlatform,
      });
      setResult(res);
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Scan Screenshot
  const handleAnalyzeScreenshot = async (
    dataUrl: string,
    options: { filename: string; sizeBytes: number; mimeType: string; extractedTextHint?: string }
  ) => {
    setIsScanning(true);
    setResult(null);
    setUploadedImageUrl(dataUrl);
    try {
      const res = await AIService.analyzeScreenshot(dataUrl, {
        ...options,
        platform: selectedPlatform,
      });
      setResult(res);
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Scan QR
  const handleAnalyzeQR = async (qrData: string) => {
    setIsScanning(true);
    setResult(null);
    setUploadedImageUrl(null);
    try {
      const res = await AIService.analyzeQR(qrData, selectedPlatform);
      setResult(res);
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      setIsScanning(false);
    }
  };

  // Handle Scan Media
  const handleAnalyzeMedia = async (file: File) => {
    setIsScanning(true);
    setResult(null);
    setUploadedImageUrl(null);
    try {
      const res = await AIService.analyzeMedia(file.name, file.size, selectedPlatform);
      setResult(res);
    } catch (e) {
      console.error('Scan error:', e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setUploadedImageUrl(null);
    if (onClearExternalResult) onClearExternalResult();
  };

  return (
    <section id="scanner-section" className="py-8 px-4 max-w-7xl mx-auto">
      {/* Section 7 Header: What do you want to check? */}
      {!result && !isScanning && (
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Shield className="w-3.5 h-3.5" />
            <span>Target Selection</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            What do you want to check?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Select a scanner below to inspect suspicious digital content from <strong>{selectedPlatform}</strong>.
          </p>
        </div>
      )}

      {/* Six Large Scan Cards (Section 7) */}
      {!result && !isScanning && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <ScanCard
            type="link"
            title="🔗 Link"
            subtitle="Check a suspicious URL"
            description="Inspects domain registration, brand typosquatting, disreputable TLDs, and redirection paths."
            badge="Instant URL Pass"
            active={activeType === 'link'}
            onClick={() => setActiveType('link')}
          />
          <ScanCard
            type="message"
            title="💬 Message"
            subtitle="Analyze suspicious text"
            description="Identifies urgency, OTP password theft, financial pretexts, and social engineering language."
            badge="Text & Smishing"
            active={activeType === 'message'}
            onClick={() => setActiveType('message')}
          />
          <ScanCard
            type="image"
            title="🖼 Image"
            subtitle="Check an image for suspicious signals"
            description="Evaluates synthetic diffusion artifacts, frequency noise, and biometric eye reflections."
            badge="Deepfake & Artifacts"
            active={activeType === 'image'}
            onClick={() => setActiveType('image')}
          />
          <ScanCard
            type="screenshot"
            title="📱 Screenshot"
            subtitle="Analyze a social-media screenshot"
            description="Decomposes conversations, profile headers, verified badge forgeries, and embedded links."
            badge="Multi-Layer UI"
            active={activeType === 'screenshot'}
            onClick={() => setActiveType('screenshot')}
          />
          <ScanCard
            type="qr"
            title="▣ QR Code"
            subtitle="Scan and inspect a QR code"
            description="Decodes hidden matrix barcodes, payment URIs, and quishing redirect traps."
            badge="Quishing Defense"
            active={activeType === 'qr'}
            onClick={() => setActiveType('qr')}
          />
          <ScanCard
            type="media"
            title="🎥 Media"
            subtitle="Check suspicious video/media"
            description="Basic container & codec integrity inspection with honest temporal model roadmap."
            badge="Media Containers"
            active={activeType === 'media'}
            onClick={() => setActiveType('media')}
          />
        </div>
      )}

      {/* Scanning In-Progress State */}
      {isScanning && <ScanProgress contentType={activeType} />}

      {/* Active Scanner Input View */}
      {!isScanning && !result && (
        <div className="max-w-3xl mx-auto">
          {activeType === 'link' && (
            <LinkScanner
              onAnalyze={handleAnalyzeLink}
              isLoading={isScanning}
              platform={selectedPlatform}
            />
          )}

          {activeType === 'message' && (
            <MessageScanner
              onAnalyze={handleAnalyzeMessage}
              isLoading={isScanning}
              platform={selectedPlatform}
            />
          )}

          {activeType === 'image' && (
            <ImageScanner
              onAnalyze={handleAnalyzeImage}
              isLoading={isScanning}
              platform={selectedPlatform}
            />
          )}

          {activeType === 'screenshot' && (
            <ScreenshotScanner
              onAnalyze={handleAnalyzeScreenshot}
              isLoading={isScanning}
              platform={selectedPlatform}
            />
          )}

          {activeType === 'qr' && (
            <QRScanner
              onAnalyzeQRData={handleAnalyzeQR}
              isLoading={isScanning}
              platform={selectedPlatform}
            />
          )}

          {activeType === 'media' && (
            <MediaScanner
              onAnalyze={handleAnalyzeMedia}
              isLoading={isScanning}
              platform={selectedPlatform}
            />
          )}
        </div>
      )}

      {/* Analysis Result Report */}
      {!isScanning && result && (
        <AnalysisReport
          result={result}
          uploadedImageUrl={uploadedImageUrl}
          onReset={handleReset}
        />
      )}
    </section>
  );
};
