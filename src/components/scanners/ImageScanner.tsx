import React, { useState, useRef } from 'react';
import { Image as ImageIcon, UploadCloud, Search, AlertCircle, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { SocialPlatform } from '../../types/analysis';

interface ImageScannerProps {
  onAnalyze: (imageDataUrl: string, options: { filename: string; sizeBytes: number; mimeType: string }) => void;
  isLoading: boolean;
  platform: SocialPlatform;
}

// Synthetic portrait sample for testing
const SAMPLE_IMAGE_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

export const ImageScanner: React.FC<ImageScannerProps> = ({
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
      setError('Please select a JPG, PNG, or WEBP image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB upload limit.');
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

  const handleLoadSample = async () => {
    try {
      setError(null);
      setFileDetails({
        name: 'sample_ai_portrait_synthetic.webp',
        size: 142000,
        type: 'image/webp',
      });
      setPreviewUrl(SAMPLE_IMAGE_URL);
    } catch {
      setError('Could not load sample image.');
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setFileDetails(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (!previewUrl || !fileDetails) {
      setError('Please choose or drop an image file first.');
      return;
    }
    onAnalyze(previewUrl, {
      filename: fileDetails.name,
      sizeBytes: fileDetails.size,
      mimeType: fileDetails.type,
    });
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0f19]/90 border border-purple-500/25 shadow-[0_0_30px_rgba(168,85,247,0.08)]">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Visual & Deepfake Inspector</h2>
            <p className="text-xs text-slate-400">
              Evaluates synthetic diffusion artifacts, edge frequencies, iris reflections, and metadata for {platform}.
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
          className="border-2 border-dashed border-slate-700/80 hover:border-purple-500/60 rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-all group"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors">
            Drop image here or click to browse
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Supports JPG, JPEG, PNG, WEBP (Max 10MB)
          </p>
          <div className="mt-4 inline-flex items-center space-x-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Files are processed in memory and never permanently stored</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="relative w-36 h-36 rounded-lg overflow-hidden border border-purple-500/30 shrink-0 bg-slate-900">
              <img
                src={previewUrl}
                alt="Upload preview"
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
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Size: {(fileDetails?.size ? fileDetails.size / 1024 : 0).toFixed(1)} KB • Type: {fileDetails?.type}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  Ready for frequency & biometric pass
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  EXIF analysis queued
                </span>
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

      {/* Quick sample image loader */}
      {!previewUrl && (
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60">
          <span className="text-xs text-slate-400">Need a sample image to test?</span>
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium text-purple-300 bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Synthetic Portrait Sample</span>
          </button>
        </div>
      )}

      {previewUrl && (
        <div className="mt-6 flex items-center space-x-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Search className="w-4 h-4 text-slate-950" />
            <span>{isLoading ? 'Scanning Visual Artifacts...' : 'Analyze Image'}</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="px-4 py-3.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
          >
            Change Image
          </button>
        </div>
      )}
    </div>
  );
};
