import React, { useState } from 'react';
import { Eye, ShieldAlert, Scan, Sparkles, Layers, Sliders } from 'lucide-react';

interface VisualArtifactInspectorProps {
  imageSrc?: string;
  title?: string;
  isSynthetic?: boolean;
}

export const VisualArtifactInspector: React.FC<VisualArtifactInspectorProps> = ({
  imageSrc,
  title = 'Executive Video Broadcast Frame Analysis',
  isSynthetic = true
}) => {
  const [activeLayer, setActiveLayer] = useState<'raw' | 'boundary' | 'specular' | 'fft'>('boundary');
  const [sensitivity, setSensitivity] = useState(85);

  return (
    <div id="visual-artifact-inspector-card" className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-cyan-400" />
          <div>
            <h4 className="text-sm font-semibold text-white">Visual Artifact & Boundary Heatmap</h4>
            <p className="text-xs text-slate-400">{title}</p>
          </div>
        </div>

        {/* View mode selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            id="view-mode-raw-btn"
            type="button"
            onClick={() => setActiveLayer('raw')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'raw' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw Frame
          </button>
          <button
            id="view-mode-boundary-btn"
            type="button"
            onClick={() => setActiveLayer('boundary')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'boundary' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Face Blending Mask
          </button>
          <button
            id="view-mode-specular-btn"
            type="button"
            onClick={() => setActiveLayer('specular')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'specular' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Corneal Reflection
          </button>
          <button
            id="view-mode-fft-btn"
            type="button"
            onClick={() => setActiveLayer('fft')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'fft' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2D FFT Spectrum
          </button>
        </div>
      </div>

      {/* Frame canvas with responsive overlays */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 min-h-[220px] flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Analyzed media frame"
            className="w-full max-h-72 object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* High-fidelity procedural executive frame simulator */
          <div className="w-full h-64 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center relative p-6">
            {/* Background corporate studio backdrop */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
            
            {/* Silhouette / simulated executive head */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-28 rounded-full border-2 border-slate-700 bg-slate-800/90 relative flex items-center justify-center shadow-2xl">
                {/* Simulated eyes */}
                <div className="absolute top-8 left-5 w-3 h-2 rounded-full bg-slate-400 border border-slate-500" />
                <div className="absolute top-8 right-5 w-3 h-2 rounded-full bg-slate-400 border border-slate-500" />
                {/* Simulated mouth */}
                <div className="absolute bottom-6 w-8 h-2 rounded-md bg-slate-600" />

                {/* Overlays according to active layer */}
                {activeLayer === 'boundary' && (
                  <div
                    className="absolute -inset-2 rounded-full border-2 border-dashed border-red-500 animate-pulse"
                    style={{
                      boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)'
                    }}
                  >
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow">
                      Discontinuity: 94.2%
                    </span>
                  </div>
                )}

                {activeLayer === 'specular' && (
                  <>
                    <div className="absolute top-7 left-4 w-5 h-5 rounded-full border border-amber-400 bg-amber-500/20 animate-ping" />
                    <div className="absolute top-7 right-4 w-5 h-5 rounded-full border border-amber-400 bg-amber-500/20" />
                    <div className="absolute -bottom-7 bg-amber-600/90 text-white text-[9px] font-mono px-2 py-0.5 rounded shadow whitespace-nowrap">
                      Asymmetric Glare Vectors (AI Artifact)
                    </div>
                  </>
                )}
              </div>

              {/* Shoulders */}
              <div className="w-48 h-16 rounded-t-3xl bg-slate-800 border-t border-slate-700 mt-2 relative">
                <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono">
                  [CEO Impersonation Broadcast]
                </div>
              </div>
            </div>

            {/* FFT overlay */}
            {activeLayer === 'fft' && (
              <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center">
                <div className="w-36 h-36 rounded-full border-2 border-purple-400/80 border-dashed flex items-center justify-center relative animate-spin [animation-duration:20s]">
                  <div className="w-20 h-20 rounded-full border border-purple-300/40" />
                  <div className="absolute top-0 w-2 h-2 bg-purple-400 rounded-full" />
                  <div className="absolute bottom-0 w-2 h-2 bg-purple-400 rounded-full" />
                  <div className="absolute left-0 w-2 h-2 bg-purple-400 rounded-full" />
                  <div className="absolute right-0 w-2 h-2 bg-purple-400 rounded-full" />
                </div>
                <span className="mt-3 text-[11px] font-mono text-purple-200 bg-purple-900/80 px-2.5 py-1 rounded border border-purple-700">
                  Periodic Checkerboard Frequencies Detected
                </span>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-sm px-2 py-1 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Layer: {activeLayer.toUpperCase()}</span>
        </div>

        {isSynthetic && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-950/90 text-red-300 border border-red-800 px-2 py-1 rounded text-[11px] font-mono">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>GAN / DIFFUSION CONF: 92.4%</span>
          </div>
        )}
      </div>

      {/* Sensitivity control & findings summary */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span>Detection Sensitivity:</span>
          <span className="font-mono font-semibold text-cyan-400">{sensitivity}%</span>
        </div>

        <input
          id="visual-artifact-sensitivity-slider"
          type="range"
          min="50"
          max="99"
          value={sensitivity}
          onChange={(e) => setSensitivity(Number(e.target.value))}
          className="w-32 accent-cyan-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
        />

        <div className="text-slate-400 text-[11px]">
          Target: <strong className="text-slate-200">Facial Warping & Phoneme-Viseme Sync</strong>
        </div>
      </div>
    </div>
  );
};
