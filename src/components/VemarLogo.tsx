import React from 'react';

interface VemarLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
  animated?: boolean;
}

export const VemarLogo: React.FC<VemarLogoProps> = ({
  size = 'md',
  className = '',
  showGlow = true,
  animated = false
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  const pixelMap = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80
  };

  const px = pixelMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${sizeMap[size]} ${className}`}
    >
      {/* Ambient Cyber Glow */}
      {showGlow && (
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/35 via-blue-600/30 to-emerald-400/25 blur-md pointer-events-none ${
            animated ? 'animate-pulse [animation-duration:2.5s]' : ''
          }`}
        />
      )}

      {/* Main SVG Vector Logo for VEMAR AI */}
      <svg
        width={px}
        height={px}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-[0_2px_14px_rgba(6,182,212,0.4)] transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Base Shield Gradient */}
          <linearGradient id="vemar-base-grad" x1="10" y1="6" x2="70" y2="76" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0a101d" />
            <stop offset="45%" stopColor="#111c30" />
            <stop offset="100%" stopColor="#05080f" />
          </linearGradient>

          {/* Outer Dynamic Rim Gradient */}
          <linearGradient id="vemar-rim-grad" x1="8" y1="8" x2="72" y2="74" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#06b6d4" />
            <stop offset="70%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Stylized V-Chevron Gradient */}
          <linearGradient id="vemar-v-grad" x1="16" y1="16" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="45%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Core Eye & Iris Gradient */}
          <linearGradient id="vemar-core-grad" x1="28" y1="26" x2="52" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* Outer Shield Hull */}
        <path
          d="M40 6L69 17.8V39.6C69 57.2 56.7 70.2 40 75C23.3 70.2 11 57.2 11 39.6V17.8L40 6Z"
          fill="url(#vemar-base-grad)"
        />

        {/* Outer Precision Chamfer Stroke */}
        <path
          d="M40 6L69 17.8V39.6C69 57.2 56.7 70.2 40 75C23.3 70.2 11 57.2 11 39.6V17.8L40 6Z"
          stroke="url(#vemar-rim-grad)"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Inner Geometric Shield Accent */}
        <path
          d="M40 13L62 22.5V39.2C62 53 52.6 63.4 40 67.5C27.4 63.4 18 53 18 39.2V22.5L40 13Z"
          stroke="#0891b2"
          strokeWidth="1"
          strokeDasharray="4 2"
          opacity="0.65"
        />

        {/* Dominant Geometric 'V' Structure (Voice & Verification Emblem) */}
        <path
          d="M23 20L40 56L57 20L50 20L40 42L30 20H23Z"
          fill="url(#vemar-v-grad)"
          opacity="0.85"
        />

        {/* Circular Biometric Radar Rings */}
        <circle cx="40" cy="36" r="14" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />
        <circle cx="40" cy="36" r="9" stroke="#06b6d4" strokeWidth="1.2" strokeOpacity="0.45" />

        {/* Central Iris Verification Core */}
        <circle cx="40" cy="36" r="4.5" fill="#0891b2" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1.8" />
        <circle cx="40" cy="36" r="1.8" fill="#ffffff" />

        {/* Sub-Acoustic Waveform Equalizer Bars (Voice biometrics) */}
        <line x1="32" y1="59" x2="32" y2="62" stroke="#06b6d4" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="36" y1="58" x2="36" y2="64" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="40" y1="57" x2="40" y2="66" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="44" y1="58" x2="44" y2="64" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="48" y1="59" x2="48" y2="62" stroke="#06b6d4" strokeWidth="1.6" strokeLinecap="round" />

        {/* Corner Micro Sensor Nodes */}
        <circle cx="28" cy="22" r="1.4" fill="#38bdf8" />
        <circle cx="52" cy="22" r="1.4" fill="#38bdf8" />
        <circle cx="40" cy="10" r="1.8" fill="#34d399" />
      </svg>
    </div>
  );
};
