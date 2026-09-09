import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, ShieldAlert, Cpu, CheckCircle2, Activity } from 'lucide-react';

interface AudioVisualizerProps {
  isSynthetic?: boolean;
  sampleName?: string;
  frequencies?: number[];
}

export const AudioBiometricVisualizer: React.FC<AudioVisualizerProps> = ({
  isSynthetic = true,
  sampleName = 'Executive Telephonic Order / Regulatory Call',
  frequencies
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackMode, setPlaybackMode] = useState<'synthetic' | 'authentic'>(isSynthetic ? 'synthetic' : 'authentic');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Frequency simulation data
  const baseFreqs = frequencies || (playbackMode === 'synthetic'
    ? [92, 88, 90, 89, 87, 85, 84, 18, 8, 3, 1, 0, 0, 0, 0, 0]
    : [65, 78, 85, 72, 80, 75, 68, 62, 55, 48, 42, 38, 30, 24, 18, 12]);

  // Audio tone generation for demonstration
  const togglePlay = () => {
    if (isPlaying) {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (e) {
          // ignore
        }
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          if (playbackMode === 'synthetic') {
            // Robotic, unnatural monotonic square-ish wave
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, ctx.currentTime);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
          } else {
            // Warm human voice fundamental frequency simulation
            osc.type = 'sine';
            osc.frequency.setValueAtTime(125, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
          }

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          oscillatorRef.current = osc;
        }
      } catch (err) {
        console.error('Audio play error:', err);
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {}
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {}
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Draw animated spectral waterfall & waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;

    const render = () => {
      step += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      // Dark background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Bar spectrum rendering
      const barCount = 32;
      const barWidth = width / barCount;

      for (let i = 0; i < barCount; i++) {
        let val: number;
        if (playbackMode === 'synthetic') {
          // Synthetic voice: high robotic mid-band, sharp artificial cutoff at high frequencies
          if (i > 18) {
            val = Math.sin(step + i * 0.2) * 4 + 6; // almost zero high frequencies
          } else {
            val = (baseFreqs[i % baseFreqs.length] || 50) + Math.sin(step * 2 + i) * 8;
          }
        } else {
          // Authentic human voice: natural Gaussian vocal tract formants with continuous decay
          const formant1 = Math.exp(-Math.pow(i - 8, 2) / 16) * 75;
          const formant2 = Math.exp(-Math.pow(i - 20, 2) / 25) * 55;
          val = formant1 + formant2 + Math.sin(step + i * 0.3) * 6;
        }

        const barHeight = Math.min(height - 10, (val / 100) * (height - 30));
        const x = i * barWidth;
        const y = height - barHeight - 10;

        // Gradient color: Red/Orange for synthetic anomalies, Cyan/Emerald for natural human
        const grad = ctx.createLinearGradient(0, y, 0, height);
        if (playbackMode === 'synthetic') {
          grad.addColorStop(0, i > 18 ? '#ef4444' : '#f97316');
          grad.addColorStop(1, '#7f1d1d');
        } else {
          grad.addColorStop(0, '#06b6d4');
          grad.addColorStop(1, '#065f46');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
      }

      // Draw acoustic wave overlay
      ctx.beginPath();
      ctx.strokeStyle = playbackMode === 'synthetic' ? '#ef4444' : '#34d399';
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 4) {
        const factor = playbackMode === 'synthetic' ? 1.8 : 0.8;
        const wave = Math.sin(x * 0.04 + step * (isPlaying ? 5 : 1)) * 14 * factor;
        const y = height * 0.45 + wave;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [playbackMode, isPlaying, baseFreqs]);

  return (
    <div id="audio-biometric-container" className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Activity className={`w-5 h-5 ${playbackMode === 'synthetic' ? 'text-amber-400' : 'text-emerald-400'}`} />
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">Acoustic Biometric & Spectral Analysis</h4>
            <p className="text-xs text-slate-400">{sampleName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle comparison between synthetic vs authentic audio */}
          <div className="bg-slate-800 p-1 rounded-lg flex items-center border border-slate-700">
            <button
              id="audio-mode-synthetic-btn"
              type="button"
              onClick={() => {
                setPlaybackMode('synthetic');
                if (isPlaying) togglePlay();
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                playbackMode === 'synthetic'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Synthetic Clone
            </button>
            <button
              id="audio-mode-authentic-btn"
              type="button"
              onClick={() => {
                setPlaybackMode('authentic');
                if (isPlaying) togglePlay();
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                playbackMode === 'authentic'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Natural Human
            </button>
          </div>

          <button
            id="audio-playback-toggle-btn"
            type="button"
            onClick={togglePlay}
            className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Stop
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Play Biometrics
              </>
            )}
          </button>
        </div>
      </div>

      {/* Canvas Spectrogram */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
        <canvas
          ref={canvasRef}
          width={640}
          height={160}
          className="w-full h-40 block"
        />

        {/* Legend Overlay */}
        <div className="absolute bottom-2 left-3 flex items-center gap-4 text-[11px] font-mono text-slate-400 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded border border-slate-800">
          <span>0 Hz</span>
          <span>4 kHz (F0 Range)</span>
          <span className={playbackMode === 'synthetic' ? 'text-red-400 font-semibold' : 'text-slate-400'}>
            8 kHz (AI Cutoff Anomaly)
          </span>
          <span>16 kHz</span>
        </div>

        <div className="absolute top-2 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
              playbackMode === 'synthetic'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {playbackMode === 'synthetic' ? (
              <>
                <ShieldAlert className="w-3 h-3" /> Cloned Voice Artifact Detected
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3" /> Natural Glottal Harmonics
              </>
            )}
          </span>
        </div>
      </div>

      {/* Forensic markers details */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Pitch Jitter (PPQ5):</span>
          <span className={`font-mono font-semibold ${playbackMode === 'synthetic' ? 'text-red-400' : 'text-emerald-400'}`}>
            {playbackMode === 'synthetic' ? '0.04% (Unnaturally Flat)' : '0.84% (Natural Variation)'}
          </span>
        </div>
        <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block mb-0.5">High-Freq Roll-off:</span>
          <span className={`font-mono font-semibold ${playbackMode === 'synthetic' ? 'text-amber-400' : 'text-emerald-400'}`}>
            {playbackMode === 'synthetic' ? 'Abrupt (-48dB @ 7.8kHz)' : 'Smooth (-12dB Octave)'}
          </span>
        </div>
        <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Room Impulse Response:</span>
          <span className={`font-mono font-semibold ${playbackMode === 'synthetic' ? 'text-red-400' : 'text-emerald-400'}`}>
            {playbackMode === 'synthetic' ? 'Zero (Dry Vocoder Artifact)' : 'Natural Reverb Detected'}
          </span>
        </div>
      </div>
    </div>
  );
};
