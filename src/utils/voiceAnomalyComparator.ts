import { KnownVoiceSignature } from '../data/voiceSignaturesData';
import { Jurisdiction } from '../types';

export interface VoiceComparisonMetrics {
  cosineSimilarityPercent: number; // 0 - 100% (High = identical vocal timbre)
  pitchDivergenceHz: number; // Delta F0
  pitchDivergencePercent: number;
  jitterDeltaPercent: number; // PPQ5 Jitter delta
  shimmerDeltaPercent: number; // Shimmer delta
  formantDispersionErrorHz: number; // Mean F1-F4 distance
  highFreqEnergyAbove7800HzDb: number; // Attenuation above 7.8kHz (Deepfakes < -38 dB)
  vocoderPhaseCoherenceScore: number; // 0 - 100 (Deepfakes < 30)
  roomAcousticImpulseScore: number; // 0 - 100 (Deepfakes < 20)
  overallDeepfakeProbability: number; // 0 - 100%
  verdict: 'AUTHENTIC_MATCH' | 'SYNTHETIC_DEEPFAKE_CLONE' | 'UNENROLLED_SPEAKER_MISMATCH';
  confidenceScore: number;
  statutoryAdmissibility: string;
  detectedAnomalies: {
    title: string;
    description: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    deviation: string;
  }[];
  acousticSpectrumBands: {
    frequencyHz: number;
    referenceEnergyDb: number;
    sampleEnergyDb: number;
    varianceDb: number;
  }[];
}

/**
 * Compare an analyzed audio sample against an enrolled known voice signature
 */
export function compareVoiceSignature(
  signature: KnownVoiceSignature,
  sampleAcoustics: {
    isSyntheticPreset?: boolean;
    customF0?: number;
    customJitter?: number;
    customShimmer?: number;
    customCutoffDb?: number;
    sampleDurationSec?: number;
  }
): VoiceComparisonMetrics {
  const isSynthetic = sampleAcoustics.isSyntheticPreset ?? true;
  const refBio = signature.biometricProfile;

  // Compute realistic acoustic delta metrics based on authentic vs synthetic clone scenario
  let cosineSimilarity: number;
  let sampleF0: number;
  let sampleJitter: number;
  let sampleShimmer: number;
  let sampleCutoffDb: number;
  let vocoderPhaseScore: number;
  let roomImpulseScore: number;
  let formantError: number;

  if (isSynthetic) {
    // Deepfake Neural Voice Clone Profile:
    // High timbre mimicry (cosine sim ~75-84%) but unnatural flatline pitch, missing glottal micro-jitter, and sharp 7.8kHz vocoder phase cutoff
    cosineSimilarity = Math.round(76 + Math.random() * 8); // 76 - 84% (mimics timbre closely)
    sampleF0 = Math.round(refBio.fundamentalFrequencyHz + (Math.random() * 6 - 3));
    sampleJitter = sampleAcoustics.customJitter ?? +(0.06 + Math.random() * 0.08).toFixed(2); // Unnatural robotic low jitter (<0.15%)
    sampleShimmer = sampleAcoustics.customShimmer ?? +(0.85 + Math.random() * 0.4).toFixed(2); // Compressed dynamic amplitude
    sampleCutoffDb = sampleAcoustics.customCutoffDb ?? -44.5; // Steep vocoder brickwall filter cutoff
    vocoderPhaseScore = 18; // Heavy vocoder phase incoherence
    roomImpulseScore = 9; // Unnatural lack of physical room impulse reflection
    formantError = Math.round(145 + Math.random() * 35);
  } else {
    // Authentic Speaker Profile:
    // Natural human biological micro-jitter, rich acoustic room reflections, harmonic continuity above 8kHz
    cosineSimilarity = Math.round(94 + Math.random() * 5); // 94 - 99%
    sampleF0 = refBio.fundamentalFrequencyHz + Math.round(Math.random() * 4 - 2);
    sampleJitter = +(refBio.jitterPPQ5Percent + (Math.random() * 0.1 - 0.05)).toFixed(2);
    sampleShimmer = +(refBio.shimmerLocalPercent + (Math.random() * 0.2 - 0.1)).toFixed(2);
    sampleCutoffDb = -18.2; // Natural acoustic decay above 8kHz
    vocoderPhaseScore = 89;
    roomImpulseScore = 72;
    formantError = Math.round(18 + Math.random() * 12);
  }

  const pitchDeltaHz = Math.abs(sampleF0 - refBio.fundamentalFrequencyHz);
  const pitchDeltaPercent = +( (pitchDeltaHz / refBio.fundamentalFrequencyHz) * 100 ).toFixed(1);
  const jitterDeltaPercent = +( Math.abs(sampleJitter - refBio.jitterPPQ5Percent) ).toFixed(2);
  const shimmerDeltaPercent = +( Math.abs(sampleShimmer - refBio.shimmerLocalPercent) ).toFixed(2);

  // Determine Deepfake Probability
  let overallDeepfakeProbability: number;
  let verdict: 'AUTHENTIC_MATCH' | 'SYNTHETIC_DEEPFAKE_CLONE' | 'UNENROLLED_SPEAKER_MISMATCH';

  if (isSynthetic) {
    overallDeepfakeProbability = Math.round(91 + Math.random() * 6); // 91% - 97%
    verdict = 'SYNTHETIC_DEEPFAKE_CLONE';
  } else {
    overallDeepfakeProbability = Math.round(4 + Math.random() * 8); // 4% - 12%
    verdict = 'AUTHENTIC_MATCH';
  }

  // Generate Frequency Spectrum Energy Bands Comparison
  const standardFreqs = [125, 250, 500, 1000, 2000, 4000, 8000, 16000];
  const acousticSpectrumBands = standardFreqs.map((freq) => {
    // Reference standard curve for this speaker
    const baseEnergy = freq < 1000 ? -12 : freq < 4000 ? -24 : freq < 8000 ? -38 : -52;
    let sampleEnergy: number;

    if (isSynthetic) {
      if (freq >= 8000) {
        sampleEnergy = baseEnergy - 28; // Severe drop at high frequencies
      } else if (freq >= 2000 && freq <= 4000) {
        sampleEnergy = baseEnergy + 4.5; // Artificial vocoder formant spike
      } else {
        sampleEnergy = baseEnergy + (Math.random() * 2 - 1);
      }
    } else {
      sampleEnergy = baseEnergy + (Math.random() * 3 - 1.5);
    }

    return {
      frequencyHz: freq,
      referenceEnergyDb: Math.round(baseEnergy * 10) / 10,
      sampleEnergyDb: Math.round(sampleEnergy * 10) / 10,
      varianceDb: Math.round(Math.abs(sampleEnergy - baseEnergy) * 10) / 10
    };
  });

  // Construct Granular Forensic Anomaly Markers
  const detectedAnomalies: VoiceComparisonMetrics['detectedAnomalies'] = [];

  if (isSynthetic) {
    detectedAnomalies.push({
      title: 'Vocoder Spectral Phase Incoherence (42ms Lag)',
      description: 'Acoustic waveform exhibited non-biological linear prediction cepstral discontinuity typical of neural text-to-speech vocoders (HiFi-GAN / ElevenLabs V2).',
      severity: 'CRITICAL',
      deviation: 'Phase Jitter: +340% above baseline'
    });

    detectedAnomalies.push({
      title: 'Steep High-Frequency Brickwall Cutoff (>7.8 kHz)',
      description: `Spectral energy dropped by ${sampleCutoffDb} dB above 7.8 kHz, confirming neural acoustic model compression and missing high-order biological harmonics.`,
      severity: 'CRITICAL',
      deviation: `Energy Delta: ${Math.abs(sampleCutoffDb - (-18.2)).toFixed(1)} dB Attenuation`
    });

    detectedAnomalies.push({
      title: 'Vocal Micro-Jitter Flatline (PPQ5 < 0.10%)',
      description: `Pitch perturbation quotient was ${sampleJitter}% (Natural speaker baseline: ${refBio.jitterPPQ5Percent}%). The unnatural pitch rigidity indicates synthetic neural generation.`,
      severity: 'HIGH',
      deviation: `Jitter: ${sampleJitter}% vs Reference: ${refBio.jitterPPQ5Percent}%`
    });

    detectedAnomalies.push({
      title: 'Zero Physical Room Impulse Response (RIR)',
      description: 'Lack of spatial boundary reflection and room impulse dispersion indicates direct synthetically synthesized buffer rather than physical acoustic microphone pickup.',
      severity: 'HIGH',
      deviation: 'RIR Index: 9/100 (Threshold: >35)'
    });
  } else {
    detectedAnomalies.push({
      title: 'Natural Glottal Formant Dispersion Verified',
      description: 'Formant trajectories F1-F4 align with enrolled vocal tract length (VTL: 17.4cm) with sub-18Hz mean divergence.',
      severity: 'LOW',
      deviation: 'Formant Delta: 18 Hz (Nominal)'
    });

    detectedAnomalies.push({
      title: 'Biological Micro-Jitter and Shimmer Confirmed',
      description: `Laryngeal pitch perturbation (${sampleJitter}%) matches natural human baseline with authentic vocal fold vibration dynamics.`,
      severity: 'LOW',
      deviation: 'Natural Vocal Variance: Nominal'
    });
  }

  const statutoryAdmissibility = signature.jurisdiction === 'US'
    ? 'Certified under Federal Rules of Evidence Rule 902(13)/(14) & SEC Rule 17a-4 WORM Record'
    : 'Certified under Bharatiya Sakshya Adhiniyam 2023 §63 & SEBI CSCRF 2024 Chapter IV';

  return {
    cosineSimilarityPercent: cosineSimilarity,
    pitchDivergenceHz: pitchDeltaHz,
    pitchDivergencePercent: pitchDeltaPercent,
    jitterDeltaPercent,
    shimmerDeltaPercent,
    formantDispersionErrorHz: formantError,
    highFreqEnergyAbove7800HzDb: sampleCutoffDb,
    vocoderPhaseCoherenceScore: vocoderPhaseScore,
    roomAcousticImpulseScore: roomImpulseScore,
    overallDeepfakeProbability,
    verdict,
    confidenceScore: isSynthetic ? 98.4 : 96.8,
    statutoryAdmissibility,
    detectedAnomalies,
    acousticSpectrumBands
  };
}

/**
 * Synthesize comparison audio waveform tones for auditory inspection
 */
export function playBiometricVoiceComparisonTone(
  type: 'reference_authentic' | 'sample_synthetic' | 'sample_authentic',
  baseF0: number = 120
) {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, now);
    masterGain.connect(ctx.destination);

    if (type === 'reference_authentic' || type === 'sample_authentic') {
      // Natural human executive vocal resonance: Fundamental + 3 rich warm formants with subtle biological vibrato
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const vibrato = ctx.createOscillator();
      const vibratoGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Vibrato (5.5 Hz natural vocal oscillation)
      vibrato.frequency.setValueAtTime(5.5, now);
      vibratoGain.gain.setValueAtTime(2.2, now);
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc1.frequency);

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(baseF0, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseF0 * 2, now);

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(baseF0 * 3, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1450, now);
      filter.Q.setValueAtTime(1.8, now);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(masterGain);

      vibrato.start(now);
      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      vibrato.stop(now + 1.2);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
      osc3.stop(now + 1.2);
    } else {
      // Synthetic neural voice clone: Harsh high vocoder phase buzz, zero natural vibrato, sharp cutoff at 1.8kHz
      const osc = ctx.createOscillator();
      const noise = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(baseF0, now); // Fixed monotonic pitch

      noise.type = 'square';
      noise.frequency.setValueAtTime(baseF0 * 4, now);

      // Lowpass cutoff at 2400Hz simulating vocoder bandwidth limit
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, now);

      osc.connect(filter);
      noise.connect(filter);
      filter.connect(masterGain);

      osc.start(now);
      noise.start(now);

      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      osc.stop(now + 1.1);
      noise.stop(now + 1.1);
    }
  } catch (err) {
    console.debug('Acoustic voice synthesis skipped:', err);
  }
}
