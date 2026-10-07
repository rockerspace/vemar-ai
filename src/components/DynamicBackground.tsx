import React, { useEffect, useRef, useState } from 'react';

export type BackgroundTheme = 'cyber_command' | 'neural_matrix' | 'quantum_mesh' | 'deep_obsidian';

interface DynamicBackgroundProps {
  theme?: BackgroundTheme;
  interactive?: boolean;
  animationEnabled?: boolean;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  theme = 'cyber_command',
  interactive = true,
  animationEnabled: animationEnabledProp
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTheme, setActiveTheme] = useState<BackgroundTheme>(theme);
  const [animationEnabled, setAnimationEnabled] = useState<boolean>(() => {
    return animationEnabledProp !== undefined ? animationEnabledProp : true;
  });

  // Sync prop theme with state
  useEffect(() => {
    setActiveTheme(theme);
  }, [theme]);

  // Sync prop animationEnabled with state
  useEffect(() => {
    if (animationEnabledProp !== undefined) {
      setAnimationEnabled(animationEnabledProp);
    }
  }, [animationEnabledProp]);

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('vemar_bg_theme') as BackgroundTheme;
    if (saved) {
      setActiveTheme(saved);
    }
    const animSaved = localStorage.getItem('vemar_bg_anim');
    if (animSaved !== null) {
      setAnimationEnabled(animSaved === 'true');
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !animationEnabled) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palettes based on theme
    const themePalettes = {
      cyber_command: {
        nodeColor: 'rgba(6, 182, 212, 0.45)', // cyan
        lineColor: 'rgba(6, 182, 212, 0.12)',
        radarColor: 'rgba(14, 165, 233, 0.04)',
        highlightColor: 'rgba(56, 189, 248, 0.6)'
      },
      neural_matrix: {
        nodeColor: 'rgba(168, 85, 247, 0.45)', // purple/violet
        lineColor: 'rgba(168, 85, 247, 0.12)',
        radarColor: 'rgba(192, 132, 252, 0.04)',
        highlightColor: 'rgba(216, 180, 254, 0.6)'
      },
      quantum_mesh: {
        nodeColor: 'rgba(16, 185, 129, 0.45)', // emerald
        lineColor: 'rgba(16, 185, 129, 0.12)',
        radarColor: 'rgba(52, 211, 153, 0.04)',
        highlightColor: 'rgba(110, 231, 183, 0.6)'
      },
      deep_obsidian: {
        nodeColor: 'rgba(148, 163, 184, 0.25)', // slate
        lineColor: 'rgba(148, 163, 184, 0.06)',
        radarColor: 'rgba(203, 213, 225, 0.02)',
        highlightColor: 'rgba(226, 232, 240, 0.4)'
      }
    };

    const currentPalette = themePalettes[activeTheme] || themePalettes.cyber_command;

    // Generate lightweight particles
    const particleCount = Math.min(42, Math.floor((width * height) / 32000));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 1,
      pulse: Math.random() * Math.PI,
      pulseSpeed: 0.02 + Math.random() * 0.02
    }));

    // Radar scan sweep angle
    let radarAngle = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Radar Sweep Effect from Center
      radarAngle += 0.003;
      const centerX = width * 0.5;
      const centerY = height * 0.35;
      const maxRadarRadius = Math.max(width, height) * 0.7;

      ctx.save();
      const radarGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadarRadius
      );
      radarGrad.addColorStop(0, currentPalette.radarColor);
      radarGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = radarGrad;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 2. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around bounds softly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        p.pulse += p.pulseSpeed;
        const currentRadius = p.radius + Math.sin(p.pulse) * 0.6;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = currentPalette.nodeColor;
        ctx.fill();

        // 3. Draw Connecting Filaments between neighboring nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = currentPalette.lineColor.replace(/[\d.]+\)$/, `${alpha})`);
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTheme, animationEnabled]);

  // CSS theme gradient overlays
  const themeGradients = {
    cyber_command:
      'radial-gradient(ellipse at 50% 0%, rgba(8, 51, 68, 0.4) 0%, rgba(4, 13, 26, 0.8) 50%, rgba(2, 6, 15, 0.98) 100%)',
    neural_matrix:
      'radial-gradient(ellipse at 50% 0%, rgba(59, 7, 100, 0.35) 0%, rgba(13, 10, 28, 0.8) 50%, rgba(4, 3, 12, 0.98) 100%)',
    quantum_mesh:
      'radial-gradient(ellipse at 50% 0%, rgba(6, 78, 59, 0.35) 0%, rgba(5, 23, 20, 0.8) 50%, rgba(2, 10, 8, 0.98) 100%)',
    deep_obsidian:
      'radial-gradient(ellipse at 50% 0%, rgba(30, 41, 59, 0.3) 0%, rgba(15, 23, 42, 0.75) 50%, rgba(3, 7, 18, 0.98) 100%)'
  };

  return (
    <div
      id="vemar-dynamic-background"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* 1. Underlying Cybernetic Grid Matrix (SVG pattern) */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage: `
            linear-gradient(to right, #06b6d4 1px, transparent 1px),
            linear-gradient(to bottom, #06b6d4 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* 2. Secondary Hexagonal/Dot Accent Grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* 3. Base High-Tech Radial Vignette */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          background: themeGradients[activeTheme] || themeGradients.cyber_command
        }}
      />

      {/* 4. Ambient Glowing Energy Centers */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[130px] animate-pulse" />
      <div className="absolute top-[30%] right-[-5%] w-[450px] h-[450px] rounded-full bg-blue-600/8 blur-[140px]" />
      <div className="absolute bottom-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-900/10 blur-[160px]" />

      {/* 5. Live Interactive Particle & Network Stream Canvas */}
      {animationEnabled && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-85"
        />
      )}
    </div>
  );
};
