import React, { useState, useRef } from 'react';
import { Video, UploadCloud, Search, AlertCircle, Trash2, Sparkles, Film, Info } from 'lucide-react';
import { SocialPlatform } from '../../types/analysis';

interface MediaScannerProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
  platform: SocialPlatform;
}

export const MediaScanner: React.FC<MediaScannerProps> = ({
  onAnalyze,
  isLoading,
  platform,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (file: File) => {
    // Check if audio or video
    if (!file.type.startsWith('video/') && !file.type.startsWith('audio/')) {
      setError('Please select an MP4, WEBM, MOV, or audio file.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('Media size exceeds 25MB demo upload limit.');
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadSample = () => {
    // Create synthetic demo File
    const sample = new File(['mock_synthetic_voice_clone'], 'suspicious_audio_voice_clone.mp3', {
      type: 'audio/mpeg',
    });
    setSelectedFile(sample);
    setError(null);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError('Please select a video or audio file first.');
      return;
    }
    onAnalyze(selectedFile);
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0b0f19]/90 border border-rose-500/25 shadow-[0_0_30px_rgba(244,63,94,0.08)]">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Video & Media Inspector</h2>
            <p className="text-xs text-slate-400">
              Basic container header and metadata inspection for social video clips from {platform}.
            </p>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,audio/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Prominent honesty banner per Section 15 mandate */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 flex items-start space-x-3">
        <Info className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white block mb-0.5">
            Model Scope Notice:
          </span>
          Basic container codec and metadata inspection is active. Advanced temporal biometric deepfake and synthetic voice cloning models are scheduled for the next major engine release. Scam Shield does not fabricate synthetic video detection results.
        </div>
      </div>

      {!selectedFile ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700/80 hover:border-rose-500/60 rounded-2xl p-8 sm:p-12 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-900/40 transition-all group"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform mb-4">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-300 transition-colors">
            Drop video or audio clip here or click to browse
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Supports MP4, WEBM, MOV, MP3, WAV (Max 25MB)
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || 'Media stream'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs text-rose-400 flex items-center space-x-1.5 font-mono">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </p>
      )}

      {!selectedFile && (
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/60">
          <span className="text-xs text-slate-400">Want to test media inspection?</span>
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-900/40 border border-rose-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Audio Clip</span>
          </button>
        </div>
      )}

      {selectedFile && (
        <div className="mt-6 flex items-center space-x-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-rose-400 to-amber-400 hover:from-rose-300 hover:to-amber-300 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Search className="w-4 h-4 text-slate-950" />
            <span>{isLoading ? 'Inspecting Media Headers...' : 'Inspect Media'}</span>
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
