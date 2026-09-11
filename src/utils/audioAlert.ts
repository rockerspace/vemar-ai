/**
 * Institutional Acoustic Synthesizer for Real-Time Threat Notification Audio
 * Uses native Web Audio API without external audio assets or network requests.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (e) {
    return null;
  }
}

/**
 * Play a synthesized institutional alert chime based on threat category.
 * Volume is calibrated to a gentle, non-jarring level (gain <= 0.05).
 */
export function playThreatChime(type: 'voice_spoof' | 'high_risk_entity' | 'pre_trade_halt' | 'critical' | 'info' = 'critical'): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.04, now);
    masterGain.connect(ctx.destination);

    if (type === 'voice_spoof') {
      // Voice Spoofing: Two-stage acoustic frequency ping (960Hz -> 720Hz)
      // Mimicking spectral bandpass intercept
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(960, now);
      osc1.frequency.exponentialRampToValueAtTime(780, now + 0.12);
      gain1.gain.setValueAtTime(0.05, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(720, now + 0.10);
      osc2.frequency.exponentialRampToValueAtTime(540, now + 0.26);
      gain2.gain.setValueAtTime(0.04, now + 0.10);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc1.connect(gain1);
      gain1.connect(masterGain);
      osc2.connect(gain2);
      gain2.connect(masterGain);

      osc1.start(now);
      osc1.stop(now + 0.15);
      osc2.start(now + 0.10);
      osc2.stop(now + 0.30);
    } else if (type === 'high_risk_entity') {
      // High-Risk Entity Impersonation: Tri-tone alert (660Hz -> 880Hz -> 1100Hz)
      const tones = [660, 880, 1100];
      tones.forEach((freq, idx) => {
        const toneStart = now + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, toneStart);
        gain.gain.setValueAtTime(0.04, toneStart);
        gain.gain.exponentialRampToValueAtTime(0.001, toneStart + 0.09);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(toneStart);
        osc.stop(toneStart + 0.10);
      });
    } else if (type === 'pre_trade_halt') {
      // Pre-trade Execution Halt: Urgent downward warning pulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1020, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.22);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.26);
    } else {
      // Generic subtle notification
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.20);
    }
  } catch (err) {
    // Fail silently without disrupting UI
    console.debug('Acoustic alert playback skipped:', err);
  }
}
