import React, { useState, useRef } from 'react';
import { Smartphone, UploadCloud, Search, AlertCircle, Trash2, Sparkles, CheckSquare, Layers, MessageSquare, Link2, UserCheck } from 'lucide-react';
import { SocialPlatform } from '../../types/analysis';

interface ScreenshotScannerProps {
  onAnalyze: (
    imageDataUrl: string,
    options: { filename: string; sizeBytes: number; mimeType: string; extractedTextHint?: string }
  ) => void;
  isLoading: boolean;
  platform: SocialPlatform;
}

export const ScreenshotScanner: React.FC<ScreenshotScannerProps> = ({
  onAnalyze,
  isLoading,
  platform,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: number; type: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please select a JPG, PNG, or WEBP screenshot.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Screenshot exceeds 10MB limit.');
      return;
    }

    setError(null);
    setFileDetails({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Quick screenshot sample
  const handleLoadSample = () => {
    setError(null);
    setFileDetails({
      name: `${platform.toLowerCase()}_suspicious_dm_screenshot.png`,
      size: 215000,
      type: 'image/png',
    });
    setPreviewUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80');
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setFileDetails(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!previewUrl || !fileDetails) {
      setError('Please choose or drop a screenshot first.');
      return;
    }
    onAnalyze(previewUrl, {
      filename: fileDetails.name,
      sizeBytes: fileDetails.size,
      mimeType: fileDetails.type,
      extractedTextHint: `Inspection target: ${platform} direct message containing payment urgency and external link.`,
    });
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0f19]/90 border border-amber-500/25 shadow-[0_0_30px_rgba(245,158,11,0.08)]">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Social Media Screenshot Decomposer</h2>
            <p className="text-xs text-slate-400">
              Isolates conversation bubbles, embedded links, fake verified badges, and payment lures on {platform}.
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {!previewUrl ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700/80 hover:border-amber-500/60 rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-all group"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
            Drop screenshot here or click to browse
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Works with {platform} chats, stories, posts, profile headers, or payment confirmations (Max 10MB)
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">WhatsApp Chats</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Instagram DMs</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Telegram Groups</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">X Direct Messages</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="relative w-32 h-44 rounded-lg overflow-hidden border border-amber-500/30 shrink-0 bg-slate-900">
              <img
                src={previewUrl}
                alt="Screenshot preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                  {fileDetails?.name}
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
                  title="Remove screenshot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Size: {(fileDetails?.size ? fileDetails.size / 1024 : 0).toFixed(1)} KB • Platform Context: {platform}
              </p>

              {/* Component breakdown preview banner */}
              <div className="mt-4 p-3 rounded-lg bg-amber-950/20 border border-amber-500/30">
                <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider block mb-1 font-semibold">
                  Multi-Element Decomposer Armed:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Message Text Isolation</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>OCR Link Extraction</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Profile Header & Badges</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Image Splicing Forensics</span>
                  </div>
                </div>
              </div>
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

      {/* Quick sample screenshot loader */}
      {!previewUrl && (
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60">
          <span className="text-xs text-slate-400">Need a sample screenshot to test?</span>
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Suspicious DM Screenshot</span>
          </button>
        </div>
      )}

      {previewUrl && (
        <div className="mt-6 flex items-center space-x-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Search className="w-4 h-4 text-slate-950" />
            <span>{isLoading ? 'Decomposing Screenshot Layers...' : 'Analyze Screenshot'}</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="px-4 py-3.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            Change File
          </button>
        </div>
      )}
    </div>
  );
};
