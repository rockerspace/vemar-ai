import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Eye, Zap, Check, SlidersHorizontal } from 'lucide-react';
import { BackgroundTheme } from './DynamicBackground';

interface AmbienceControlProps {
  currentTheme: BackgroundTheme;
  onSelectTheme: (theme: BackgroundTheme) => void;
  animationEnabled: boolean;
  onToggleAnimation: (enabled: boolean) => void;
}

export const AmbienceControl: React.FC<AmbienceControlProps> = ({
  currentTheme,
  onSelectTheme,
  animationEnabled,
  onToggleAnimation
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const themes: {
    id: BackgroundTheme;
    name: string;
    description: string;
    accentColor: string;
    bgPreview: string;
    badge: string;
  }[] = [
    {
      id: 'cyber_command',
      name: 'Cyber Command Grid',
      description: 'Tactical cyan & sapphire financial defense with real-time radar sweep',
      accentColor: 'bg-cyan-500',
      bgPreview: 'from-cyan-950/60 to-slate-950',
      badge: 'DEFAULT'
    },
    {
      id: 'neural_matrix',
      name: 'Neural Matrix',
      description: 'Deep violet AI synapse mesh simulating 5-pillar neural forensic engines',
      accentColor: 'bg-purple-500',
      bgPreview: 'from-purple-950/60 to-slate-950',
      badge: 'VERTEX AI'
    },
    {
      id: 'quantum_mesh',
      name: 'Quantum Mesh',
      description: 'Emerald cryptographic node topology for tamper-proof C2PA & WORM',
      accentColor: 'bg-emerald-500',
      bgPreview: 'from-emerald-950/60 to-slate-950',
      badge: 'CRYPTOGRAPHIC'
    },
    {
      id: 'deep_obsidian',
      name: 'Deep Obsidian',
      description: 'Ultra-low contrast slate aesthetic for dense institutional market desks',
      accentColor: 'bg-slate-400',
      bgPreview: 'from-slate-900 to-black',
      badge: 'MINIMAL'
    }
  ];

  const currentThemeObj = themes.find((t) => t.id === currentTheme) || themes[0];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        id="ambience-control-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
        title="Customize dynamic background ambience and particle stream"
        aria-expanded={isOpen}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentThemeObj.accentColor}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${currentThemeObj.accentColor}`}
          />
        </span>
        <Palette className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden lg:inline text-[11px]">{currentThemeObj.name}</span>
        <span className="lg:hidden text-[11px]">Ambience</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop click barrier */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Ambience Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-4 z-50 space-y-3 ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Dynamic Ambience Engine
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                Live 60 FPS
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Personalize your institutional surveillance command environment. Visual backdrops adapt real-time lighting and particle node density.
            </p>

            {/* Themes Grid */}
            <div className="space-y-2">
              {themes.map((t) => {
                const isSelected = t.id === currentTheme;
                return (
                  <button
                    key={t.id}
                    type="button"
                    id={`ambience-theme-${t.id}`}
                    onClick={() => {
                      onSelectTheme(t.id);
                      localStorage.setItem('vemar_bg_theme', t.id);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${t.accentColor} shadow-sm`}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">{t.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {t.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {t.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Motion Toggle */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-slate-300 font-medium">
                  Dynamic Particle Network
                </span>
              </div>
              <button
                type="button"
                id="toggle-bg-animation-btn"
                onClick={() => {
                  const nextState = !animationEnabled;
                  onToggleAnimation(nextState);
                  localStorage.setItem('vemar_bg_anim', String(nextState));
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  animationEnabled
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {animationEnabled ? 'ACTIVE (60FPS)' : 'PAUSED'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
