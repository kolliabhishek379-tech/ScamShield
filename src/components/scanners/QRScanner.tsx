import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, UploadCloud, Search, AlertCircle, Trash2, Sparkles, ExternalLink, ShieldAlert, Eye, VideoOff } from 'lucide-react';
import jsQR from 'jsqr';
import { SocialPlatform } from '../../types/analysis';
import { decodeAndAnalyzeQR } from '../../services/qrAnalyzer';

interface QRScannerProps {
  onAnalyzeQRData: (decodedData: string) => void;
  isLoading: boolean;
  platform: SocialPlatform;
}

const SAMPLE_QRS = [
  {
    label: 'Fake Parking Meter (.vip)',
    data: 'https://quick-park-pay-citymeters.vip/session?meter=8841&fee=4.50',
  },
  {
    label: 'Cryptocurrency Wallet URI',
    data: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.054&message=UrgentAccountVerification',
  },
  {
    label: 'Direct UPI Payment Link',
    data: 'upi://pay?pa=fraudster.merchant@okaxis&pn=CustomerSupportRefund&am=500.00&cu=INR',
  },
  {
    label: 'Legitimate Corporate Portal',
    data: 'https://www.apple.com/support',
  },
];

export const QRScanner: React.FC<QRScannerProps> = ({
  onAnalyzeQRData,
  isLoading,
  platform,
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'camera'>('upload');
  const [decodedData, setDecodedData] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Stop camera stream
  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start Camera
  const startCamera = async () => {
    setError(null);
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera streaming is not supported on this browser or environment.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        scanVideoFrame();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(err.message || 'Unable to access camera device. Please use image upload instead.');
      setCameraActive(false);
    }
  };

  const scanVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height);
        if (code && code.data) {
          stopCamera();
          setDecodedData(code.data);
          return;
        }
      }
    }
    animFrameRef.current = requestAnimationFrame(scanVideoFrame);
  };

  // Process uploaded image file for QR
  const handleImageFile = (file: File) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setError('Failed to initialize canvas for QR decoding.');
          return;
        }
        ctx.drawImage(img, 0, 0);
        const decoded = decodeAndAnalyzeQR(canvas, platform);
        if (decoded && decoded.data) {
          setDecodedData(decoded.data);
        } else {
          setError('No legible QR code found in this image. Please ensure the code is well-lit and in focus.');
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    stopCamera();
    setPreviewUrl(null);
    setDecodedData(null);
    setError(null);
    setCameraError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartAnalysis = () => {
    if (!decodedData) {
      setError('Please decode a QR code first.');
      return;
    }
    onAnalyzeQRData(decodedData);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0f19]/90 border border-emerald-500/25 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 mb-6 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">QR Code & Quishing Inspector</h2>
            <p className="text-xs text-slate-400">
              Extracts concealed payloads and checks against malicious payment redirects and spoofing.
            </p>
          </div>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setActiveMode('upload');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeMode === 'upload'
                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Upload Image
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('camera');
              startCamera();
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeMode === 'camera'
                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Camera Scanner</span>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleImageFile(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Mode 1: Upload */}
      {activeMode === 'upload' && !previewUrl && !decodedData && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleImageFile(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500/60 rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-all group"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
            Drop QR code image or screenshot here
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Supports parking stickers, social flyers, promo codes, or receipt QR codes
          </p>
        </div>
      )}

      {/* Mode 2: Camera Stream */}
      {activeMode === 'camera' && !decodedData && (
        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-4 text-center">
          {cameraActive ? (
            <div className="relative max-w-sm mx-auto aspect-square rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-black">
              <video ref={videoRef} className="w-full h-full object-cover" />
              {/* Scan box reticle */}
              <div className="absolute inset-8 border-2 border-dashed border-emerald-400/70 rounded-xl pointer-events-none animate-pulse" />
              <div className="absolute top-2 left-2 right-2 px-2 py-1 rounded bg-black/70 text-[11px] font-mono text-emerald-300">
                Align QR barcode inside square
              </div>
            </div>
          ) : (
            <div className="py-8">
              <VideoOff className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-xs text-slate-400 mb-4">
                {cameraError || 'Camera inactive. Click below to request camera access.'}
              </p>
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 cursor-pointer"
              >
                Enable Camera
              </button>
            </div>
          )}
        </div>
      )}

      {/* Decoded QR Card */}
      {decodedData && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>QR Matrix Successfully Decoded:</span>
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Scan Another QR
              </button>
            </div>

            {/* Decoded destination view */}
            <div className="p-3 rounded-lg bg-black/60 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 break-all select-all">
              {decodedData}
            </div>

            {/* Crucial Section 14 Mandate:
                Do not automatically navigate the user to the QR destination.
                Provide: [Inspect Destination] and [Open Only If Safe]
                Never claim something is completely safe! */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Analyzing Payload...' : 'Inspect Destination'}</span>
                </button>

                {/* Open Only If Safe button */}
                <a
                  href={decodedData.startsWith('http') ? decodedData : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!decodedData.startsWith('http')) {
                      e.preventDefault();
                      alert('This QR code payload is not a standard web URL and cannot be opened directly.');
                    }
                  }}
                  className="inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-950/30 hover:bg-amber-950/50 border border-amber-500/30 transition-all cursor-pointer"
                  title="Caution: No automated tool can guarantee content is completely safe"
                >
                  <span>Open Only If Safe</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <span className="text-[11px] text-slate-500 font-mono text-center sm:text-right">
                Auto-navigation blocked for protection
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs text-rose-400 flex items-center space-x-1.5 font-mono">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}

      {/* Quick sample QR payloads */}
      {!decodedData && (
        <div className="mt-4 pt-3 border-t border-slate-800/60">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
            Or test with a sample payload:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QRS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  stopCamera();
                  setDecodedData(sample.data);
                  setError(null);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
