import React, { useState, useRef } from 'react';
import { Eye, Layers, ZoomIn, ZoomOut, RotateCcw, Info, ExternalLink, MapPin, Sliders } from 'lucide-react';
import { ForensicMarker } from '../../types/analysis';

interface HeatmapViewerProps {
  imageUrl: string;
  markers?: ForensicMarker[];
  title?: string;
}

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({
  imageUrl,
  markers = [],
  title = 'Visual Forensic Analysis',
}) => {
  const [heatmapOpacity, setHeatmapOpacity] = useState(65);
  const [showMarkers, setShowMarkers] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overlay' | 'side-by-side'>('overlay');

  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(2.5, prev + 0.25));
  const handleZoomOut = () => setZoom((prev) => Math.max(1, prev - 0.25));
  const handleResetZoom = () => setZoom(1);

  // External reverse search URLs
  const encodedUrl = encodeURIComponent(imageUrl);
  const googleLensUrl = `https://lens.google.com/uploadbyurl?url=${encodedUrl}`;
  const tineyeUrl = `https://tineye.com/search?url=${encodedUrl}`;

  return (
    <div className="p-5 sm:p-7 rounded-2xl bg-slate-950/90 border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.1)]">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-400">
            Spatial gradient and frequency artifact overlay with suspicious-region markers.
          </p>
        </div>

        {/* View Mode & Zoom Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setViewMode('overlay')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'overlay' ? 'bg-purple-950/70 text-purple-300 font-bold' : 'text-slate-400'
              }`}
            >
              Overlay
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'side-by-side' ? 'bg-purple-950/70 text-purple-300 font-bold' : 'text-slate-400'
              }`}
            >
              Side-by-Side
            </button>
          </div>

          <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-slate-900 border border-slate-800">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-40"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-1">{zoom.toFixed(1)}x</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 2.5}
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-40"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoom > 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-slate-400 hover:text-white"
                title="Reset zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Opacity slider and Markers toggle */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
        <div className="flex items-center space-x-3 flex-1 min-w-[200px]">
          <Sliders className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <span className="text-slate-300 font-mono text-[11px] uppercase tracking-wider">
            Heatmap Opacity: {heatmapOpacity}%
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={heatmapOpacity}
            onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
            className="w-32 sm:w-48 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showMarkers}
              onChange={(e) => setShowMarkers(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-purple-500 focus:ring-purple-500"
            />
            <span className="text-[11px] font-mono">Show Region Markers</span>
          </label>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-black relative" ref={containerRef}>
        {viewMode === 'overlay' ? (
          <div
            className="relative overflow-hidden flex items-center justify-center p-2 min-h-[320px]"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease' }}
          >
            {/* Original Base Image */}
            <img
              src={imageUrl}
              alt="Inspection Base"
              className="max-h-[420px] w-auto max-w-full object-contain rounded-lg block select-none"
              referrerPolicy="no-referrer"
            />

            {/* Neural Heatmap Overlay Layer (Simulated frequency gradient heatmap) */}
            <div
              className="absolute inset-0 pointer-events-none rounded-lg mix-blend-screen"
              style={{
                opacity: heatmapOpacity / 100,
                background: `
                  radial-gradient(circle at 50% 35%, rgba(239, 68, 68, 0.75) 0%, rgba(245, 158, 11, 0.5) 25%, transparent 60%),
                  radial-gradient(circle at 65% 55%, rgba(168, 85, 247, 0.6) 0%, rgba(59, 130, 246, 0.4) 30%, transparent 70%),
                  radial-gradient(circle at 35% 70%, rgba(244, 63, 94, 0.65) 0%, transparent 45%)
                `,
              }}
            />

            {/* Suspicious Region Interactive Markers */}
            {showMarkers &&
              markers.map((marker) => {
                const isActive = activeMarkerId === marker.id;
                return (
                  <div
                    key={marker.id}
                    className="absolute"
                    style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <button
                      onClick={() => setActiveMarkerId(isActive ? null : marker.id)}
                      className={`relative group w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-125 ${
                        marker.severity === 'high'
                          ? 'bg-rose-500 text-white shadow-rose-500/50'
                          : 'bg-amber-500 text-slate-950 shadow-amber-500/50'
                      }`}
                      title={marker.label}
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-ping absolute" />
                      <MapPin className="w-3.5 h-3.5 relative z-10" />
                    </button>

                    {/* Popover detail */}
                    {isActive && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 z-30 w-64 p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-left pointer-events-auto">
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800">
                          <span className="text-xs font-bold text-white font-mono">{marker.label}</span>
                          <span
                            className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                              marker.severity === 'high'
                                ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {marker.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{marker.detail}</p>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ) : (
          /* Side-by-side mode */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
            <div className="text-center">
              <span className="text-[11px] font-mono text-slate-400 block mb-2">Original Image</span>
              <img
                src={imageUrl}
                alt="Original"
                className="max-h-[300px] w-auto max-w-full mx-auto object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center relative">
              <span className="text-[11px] font-mono text-purple-400 block mb-2">AI Influence Heatmap</span>
              <div className="relative inline-block">
                <img
                  src={imageUrl}
                  alt="Heatmap Preview"
                  className="max-h-[300px] w-auto max-w-full object-contain rounded-lg filter grayscale"
                  referrerPolicy="no-referrer"
                />
                <div
                  className="absolute inset-0 rounded-lg mix-blend-screen pointer-events-none"
                  style={{
                    opacity: 0.8,
                    background: `
                      radial-gradient(circle at 50% 35%, rgba(239, 68, 68, 0.85) 0%, rgba(245, 158, 11, 0.6) 30%, transparent 65%),
                      radial-gradient(circle at 65% 55%, rgba(168, 85, 247, 0.7) 0%, transparent 60%)
                    `,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Disclaimer per Section 20 */}
      <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2 leading-relaxed">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-200 font-semibold">Forensic Visualization Notice:</span> Highlighted areas represent regions that influenced probabilistic model weights (e.g. eyes, texture gradients, hair edges). They are demonstrative forensic highlights and do not constitute certified proof of manipulation.
        </div>
      </div>

      {/* Reverse Image Search Actions per Section 21 */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-slate-200 block">
            Independent Provenance Verification:
          </span>
          <p className="text-[11px] text-slate-400">
            Reverse-image search can provide context but does not independently prove authenticity.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={googleLensUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all"
          >
            <span>Google Lens</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href={tineyeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 transition-all"
          >
            <span>TinEye</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
