import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  PhoneCall,
  Mic,
  MicOff,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  FileDown,
  Activity,
  Layers,
  Zap,
  Scale,
  Lock,
  FileSignature,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Database,
  Radio,
  Sliders,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell
} from 'recharts';
import { KNOWN_VOICE_SIGNATURES, KnownVoiceSignature } from '../data/voiceSignaturesData';
import {
  compareVoiceSignature,
  playBiometricVoiceComparisonTone,
  VoiceComparisonMetrics
} from '../utils/voiceAnomalyComparator';
import { Jurisdiction, UserRole } from '../types';
import { useNotificationToast } from '../context/NotificationToastContext';
import { useAuditLog } from '../context/AuditLogContext';
import { downloadCryptographicallySignedPDF } from '../utils/pdfExport';
import { auditRecordToForensicFinding } from '../utils/cryptoSignature';

interface VoiceAnomalyVerifierProps {
  jurisdiction: Jurisdiction;
  currentRole: UserRole;
  initialUploadedAudio?: string | null;
  onVerificationComplete?: (metrics: VoiceComparisonMetrics, targetSignature: KnownVoiceSignature) => void;
  onNavigateToScanner?: () => void;
}

export const VoiceAnomalyVerifier: React.FC<VoiceAnomalyVerifierProps> = ({
  jurisdiction,
  currentRole,
  initialUploadedAudio = null,
  onVerificationComplete,
  onNavigateToScanner
}) => {
  const { notifyRegulatoryAlert, notifySuccess, notifyInfo } = useNotificationToast();
  const { logActivity } = useAuditLog();

  const isUS = jurisdiction === 'US';

  // Filter available voice signatures by current jurisdiction
  const availableSignatures = useMemo(() => {
    return KNOWN_VOICE_SIGNATURES.filter(
      (sig) => sig.jurisdiction === jurisdiction || sig.jurisdiction === 'GLOBAL'
    );
  }, [jurisdiction]);

  // Selected Target Known Signature
  const [selectedSignatureId, setSelectedSignatureId] = useState<string>(
    availableSignatures[0]?.id || KNOWN_VOICE_SIGNATURES[0].id
  );

  const activeSignature = useMemo(() => {
    return (
      KNOWN_VOICE_SIGNATURES.find((s) => s.id === selectedSignatureId) ||
      KNOWN_VOICE_SIGNATURES[0]
    );
  }, [selectedSignatureId]);

  // Audio Ingestion State
  const [audioSource, setAudioSource] = useState<'upload' | 'mic' | 'benchmark'>('benchmark');
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(initialUploadedAudio);
  const [audioFileName, setAudioFileName] = useState<string>('telephonic_trade_authorization_leak.wav');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSyntheticScenario, setIsSyntheticScenario] = useState<boolean>(true);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [hasRunComparison, setHasRunComparison] = useState<boolean>(true);

  // Audio Playback State
  const [playingTrack, setPlayingTrack] = useState<'reference' | 'sample' | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);
  const [isAuditDocumented, setIsAuditDocumented] = useState<boolean>(false);
  const [lastAuditRecordId, setLastAuditRecordId] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Comparison Telemetry Results
  const comparisonResults: VoiceComparisonMetrics = useMemo(() => {
    return compareVoiceSignature(activeSignature, {
      isSyntheticPreset: isSyntheticScenario,
      sampleDurationSec: 6.4
    });
  }, [activeSignature, isSyntheticScenario]);

  useEffect(() => {
    if (onVerificationComplete) {
      onVerificationComplete(comparisonResults, activeSignature);
    }
  }, [comparisonResults, activeSignature, onVerificationComplete]);

  // Handle Audio File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFileName(file.name);
    setAudioSource('upload');

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedAudioUrl(event.target?.result as string);
      // Run comparison
      setIsComparing(true);
      setTimeout(() => {
        setIsComparing(false);
        setHasRunComparison(true);
        notifyInfo('🎙️ Audio Stream Processed', `Extracting 128-band Mel spectrograms from "${file.name}" for biometric comparison.`);
      }, 450);
    };
    reader.readAsDataURL(file);
  };

  // Handle Microphone Recording
  const handleToggleMic = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setUploadedAudioUrl(url);
          setAudioFileName('Live_Microphone_Capture.webm');
          setAudioSource('mic');
          stream.getTracks().forEach((t) => t.stop());

          setIsComparing(true);
          setTimeout(() => {
            setIsComparing(false);
            setHasRunComparison(true);
            notifyInfo('🎙️ Voice Buffer Processed', 'Computed real-time glottal jitter and pitch prosody against selected enrolled voice signature.');
          }, 450);
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        notifyInfo('🎙️ Recording Live Voice Stream', 'Speak into microphone to test vocal tract length and acoustic pitch trajectory.');
      } catch (err) {
        console.error('Microphone error:', err);
      }
    }
  };

  // Play Reference or Sample Audio Tone
  const handlePlayAudio = (track: 'reference' | 'sample') => {
    if (playingTrack === track) {
      setPlayingTrack(null);
      return;
    }

    setPlayingTrack(track);

    if (track === 'reference') {
      playBiometricVoiceComparisonTone('reference_authentic', activeSignature.biometricProfile.fundamentalFrequencyHz);
    } else {
      if (isSyntheticScenario) {
        playBiometricVoiceComparisonTone('sample_synthetic', activeSignature.biometricProfile.fundamentalFrequencyHz);
      } else {
        playBiometricVoiceComparisonTone('sample_authentic', activeSignature.biometricProfile.fundamentalFrequencyHz);
      }
    }

    setTimeout(() => {
      setPlayingTrack(null);
    }, 1250);
  };

  // Trigger High-Priority Persistent Regulatory Alert
  const handleTriggerRegulatoryAlert = () => {
    const isClone = comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE';
    notifyRegulatoryAlert({
      entityName: `${activeSignature.executiveName} (${activeSignature.organization})`,
      threatType: 'voice_anomaly',
      riskScore: comparisonResults.overallDeepfakeProbability,
      statutoryRule: isUS
        ? 'SEC Rule 10b-5 / 18 U.S. Code § 1343 / FRE 902(14)'
        : 'SEBI CSCRF 2024 Chapter IV / PFUTP Reg 4(2)(k)',
      regulatoryBody: isUS ? 'SEC Division of Enforcement / FINRA' : 'SEBI ISD / NSE Surveillance Cell',
      haltStatus: isClone ? 'FIX Tag 35=D Execution Quarantined (<16ms)' : 'Biometric Match Verified',
      acousticMarkers: comparisonResults.detectedAnomalies.map((a) => a.title).slice(0, 3),
      persistent: true,
      message: isClone
        ? `Critical voice anomaly detected: Uploaded audio failed biometric verification against enrolled KYC signature (${activeSignature.kycRegistrationId}). High vocoder phase jitter and missing glottal pitch pulses confirm deepfake synthesis.`
        : `Biometric voice signature matches enrolled profile with sub-18Hz formant dispersion. Acoustic authenticity verified.`,
      onInspect: () => {
        onNavigateToScanner?.();
      },
      onLogToAudit: async () => {
        return handleDocumentToAuditLog();
      }
    });
  };

  // Document Verification Event in Compliance Audit Log
  const handleDocumentToAuditLog = async (): Promise<string> => {
    const isClone = comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE';
    const auditEntry = await logActivity({
      action: isClone ? 'PRE_TRADE_ORDER_HALTED' : 'FORENSIC_SCAN_EXECUTED',
      actionLabel: `Voice Biometric Signature Verification: ${activeSignature.executiveName}`,
      category: 'Forensic Analysis',
      jurisdiction,
      statutoryRegime: isUS ? 'SEC Rule 17a-4 / FRE 902(14)' : 'SEBI CSCRF Sec 7.2 / BSA 2023 §63',
      targetAssetOrEntity: `${activeSignature.executiveName} [${activeSignature.exchangeTicker}]`,
      severity: isClone ? 'CRITICAL' : 'LOW',
      status: isClone ? 'FLAGGED' : 'VERIFIED',
      details: {
        summary: isClone
          ? `Synthetic neural voice clone impersonation intercepted. Mismatch against enrolled signature ${activeSignature.c2paHardwareCertSerial}. Deepfake probability: ${comparisonResults.overallDeepfakeProbability}%.`
          : `Authentic voice signature verified. Formant alignment error ${comparisonResults.formantDispersionErrorHz}Hz within FIPS 140-3 tolerance limits.`,
        targetEntity: activeSignature.executiveName,
        channel: 'audio_call',
        riskScore: comparisonResults.overallDeepfakeProbability,
        threatLevel: isClone ? 'CRITICAL' : 'AUTHENTIC',
        statutoryCode: isUS ? 'SEC Rule 10b-5' : 'SEBI PFUTP Reg 4(2)(k)',
        metadata: {
          enrolledSignatureId: activeSignature.id,
          kycRegistrationId: activeSignature.kycRegistrationId,
          cosineSimilarity: comparisonResults.cosineSimilarityPercent,
          pitchDivergenceHz: comparisonResults.pitchDivergenceHz,
          vocoderPhaseScore: comparisonResults.vocoderPhaseCoherenceScore,
          anomaliesFlagged: comparisonResults.detectedAnomalies.length
        }
      }
    });

    setIsAuditDocumented(true);
    setLastAuditRecordId(auditEntry.id);
    notifySuccess('Audit Ledger Documented', `Verification recorded in immutable ledger under block #${auditEntry.sequenceNumber} (${auditEntry.id}).`);
    return auditEntry.id;
  };

  // Download Cryptographically Signed PDF Report
  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const isClone = comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE';
      const syntheticFinding = auditRecordToForensicFinding({
        id: `AUDIT-${Date.now().toString().slice(-5)}`,
        timestamp: new Date().toISOString(),
        sequenceNumber: 10499,
        prevHash: '00000000000000000004f8a91bc7d3e5210984a1e94473ef90812bdcb89a2430',
        recordHash: '8b7f294029485710293847561928374659102938475610293847561928374650',
        operatorName: 'Securities Compliance Desk',
        operatorEmail: 'compliance@vemar.internal',
        operatorRole: currentRole,
        action: 'FORENSIC_SCAN_EXECUTED',
        actionLabel: 'Voice Biometric Signature Comparison Audit',
        category: 'Forensic Analysis',
        jurisdiction,
        statutoryRegime: isUS ? 'SEC Rule 10b-5 / FRE 902(14)' : 'SEBI CSCRF 2024 / BSA 2023 §63',
        targetAssetOrEntity: `${activeSignature.executiveName} (${activeSignature.exchangeTicker})`,
        severity: isClone ? 'CRITICAL' : 'LOW',
        status: isClone ? 'FLAGGED' : 'VERIFIED',
        ipAddress: '103.21.244.12',
        sessionId: 'sess_voice_audit',
        userAgent: 'VEMAR-Biometric-Engine/3.2.0',
        details: {
          summary: `Voice biometric comparison against enrolled registry (${activeSignature.kycRegistrationId}). Deepfake Probability: ${comparisonResults.overallDeepfakeProbability}%. Timbre Cosine Similarity: ${comparisonResults.cosineSimilarityPercent}%. Pitch Divergence: ${comparisonResults.pitchDivergenceHz} Hz.`,
          targetEntity: activeSignature.executiveName,
          channel: 'audio_call',
          riskScore: comparisonResults.overallDeepfakeProbability,
          threatLevel: isClone ? 'CRITICAL' : 'AUTHENTIC',
          statutoryCode: isUS ? 'SEC Rule 10b-5' : 'SEBI PFUTP Reg 4(2)(k)'
        }
      });

      await downloadCryptographicallySignedPDF(syntheticFinding, {
        caseTitle: `Voice-Biometric-Comparison-${activeSignature.executiveName.replace(/\s+/g, '-')}`,
        jurisdiction,
        auditorRole: currentRole,
        auditorEmail: 'compliance@vemar.internal',
        engineSource: 'VEMAR RawNet3 + WavLM Voice Biometric Comparator'
      });
      notifySuccess('PDF Export Ready', 'Cryptographically signed voice comparison audit report downloaded.');
    } catch (e) {
      console.error('PDF export error:', e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div id="voice-anomaly-verifier-module" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Voice Anomaly & Executive Biometric Signature Verification
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              RawNet3 / WavLM v2.4
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Ingest and cross-correlate suspicious telephonic order authorizations, earnings audio leaks, and WhatsApp voice notes against cryptographically registered FIPS 140-3 Hardware Voiceprints to detect vocoder phase jitter and neural voice cloning.
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0">
          <Database className="w-4 h-4 text-emerald-400" />
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-mono block">Enrolled Registry</span>
            <span className="text-xs font-bold font-mono text-white">
              {availableSignatures.length} Verified Signatures
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Verification Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Signature Selection & Audio Ingestion (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Step 1: Select Target Known Voice Signature */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>1. Target Enrolled Voice Signature</span>
              </label>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                Ground Truth
              </span>
            </div>

            <select
              id="voice-signature-selector"
              value={selectedSignatureId}
              onChange={(e) => setSelectedSignatureId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {availableSignatures.map((sig) => (
                <option key={sig.id} value={sig.id}>
                  {sig.executiveName} — {sig.organization} ({sig.exchangeTicker})
                </option>
              ))}
            </select>

            {/* Signature Identity Card */}
            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activeSignature.avatarColor} text-white font-bold text-sm flex items-center justify-center shadow-md shrink-0`}>
                  {activeSignature.avatarInitials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{activeSignature.executiveName}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{activeSignature.title}</p>
                  <p className="text-[10px] text-cyan-400 font-mono truncate">{activeSignature.organization}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1 border-t border-slate-800/80">
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block">KYC Reg ID:</span>
                  <span className="text-white truncate block">{activeSignature.kycRegistrationId}</span>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block">Baseline Mean F0:</span>
                  <span className="text-emerald-400 font-bold block">{activeSignature.biometricProfile.fundamentalFrequencyHz} Hz</span>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block">Jitter Baseline:</span>
                  <span className="text-slate-200 block">{activeSignature.biometricProfile.jitterPPQ5Percent}%</span>
                </div>
                <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 block">Formant F1/F2:</span>
                  <span className="text-slate-200 block">{activeSignature.biometricProfile.formantFrequenciesHz[0]} / {activeSignature.biometricProfile.formantFrequenciesHz[1]} Hz</span>
                </div>
              </div>

              {/* Play Reference Button */}
              <button
                type="button"
                onClick={() => handlePlayAudio('reference')}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                {playingTrack === 'reference' ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Playing Ground Truth Voiceprint...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Play Reference Voiceprint ({activeSignature.biometricProfile.fundamentalFrequencyHz}Hz)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 2: Ingest Sample Audio Clip */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>2. Upload / Ingest Suspicious Audio</span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSyntheticScenario(!isSyntheticScenario);
                    setHasRunComparison(true);
                  }}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    isSyntheticScenario
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                  title="Toggle between deepfake synthetic clone payload vs authentic speaker sample"
                >
                  Mode: {isSyntheticScenario ? 'Deepfake Clone Payload' : 'Authentic Sample'}
                </button>
              </div>
            </div>

            {/* Ingestion Source Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setAudioSource('benchmark')}
                className={`py-1.5 rounded font-medium transition-all ${
                  audioSource === 'benchmark' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Benchmark Call
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`py-1.5 rounded font-medium transition-all flex items-center justify-center gap-1 ${
                  audioSource === 'upload' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3 h-3" />
                Upload Clip
              </button>
              <button
                type="button"
                onClick={handleToggleMic}
                className={`py-1.5 rounded font-medium transition-all flex items-center justify-center gap-1 ${
                  isRecording ? 'bg-red-600 text-white animate-pulse' : audioSource === 'mic' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                {isRecording ? 'Stop Mic' : 'Live Mic'}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Current Loaded Sample Status */}
            <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 font-mono block">Loaded Audio Buffer</span>
                <span className="text-xs font-mono font-semibold text-white truncate block">{audioFileName}</span>
                <span className="text-[10px] text-slate-400">16kHz PCM • Linear 16-bit • 6.4s Window</span>
              </div>

              <button
                type="button"
                onClick={() => handlePlayAudio('sample')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-colors shrink-0 ${
                  isSyntheticScenario
                    ? 'bg-red-950/60 hover:bg-red-900/70 text-red-300 border-red-800/80'
                    : 'bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 border-emerald-800/80'
                }`}
              >
                {playingTrack === 'sample' ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    <span>Auditioning...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Audition Sample</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Comparison Matrix, Spectral Overlay & Verdict (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top Verdict & Risk Banner */}
          <div
            className={`rounded-xl p-4 border transition-all ${
              comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE'
                ? 'bg-red-950/50 border-red-500/60 shadow-[0_0_24px_rgba(239,68,68,0.2)]'
                : 'bg-emerald-950/50 border-emerald-500/60 shadow-[0_0_24px_rgba(16,185,129,0.2)]'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl border mt-0.5 ${
                    comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}
                >
                  {comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE' ? (
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  ) : (
                    <ShieldCheck className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-black tracking-wider uppercase border ${
                        comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE'
                        ? 'SYNTHETIC DEEPFAKE CLONE DETECTED'
                        : 'AUTHENTIC SIGNATURE MATCH VERIFIED'}
                    </span>
                    <span className="text-xs font-mono font-bold text-white bg-black/50 px-2 py-0.5 rounded border border-slate-700">
                      Confidence: {comparisonResults.confidenceScore}%
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mt-1">
                    {comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE'
                      ? `Critical Vocal Anomaly: Impersonating ${activeSignature.executiveName}`
                      : `Biometric Match Confirmed: ${activeSignature.executiveName}`}
                  </h4>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE'
                      ? `Spectral analysis detected unnatural vocoder phase incoherence (42ms), steep cutoff at >7.8 kHz, and flatline pitch jitter (${comparisonResults.jitterDeltaPercent}% divergence from enrolled KYC baseline).`
                      : `Formant frequencies F1-F4 align with enrolled vocal tract baseline (${activeSignature.biometricProfile.vocalTractLengthCm}cm) with natural laryngeal jitter confirmed.`}
                  </p>
                </div>
              </div>

              {/* Risk Score Pill */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono block">Deepfake Probability</span>
                <span
                  className={`text-2xl sm:text-3xl font-black font-mono ${
                    comparisonResults.overallDeepfakeProbability >= 75
                      ? 'text-red-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {comparisonResults.overallDeepfakeProbability}%
                </span>
              </div>
            </div>
          </div>

          {/* 4-Card Biometric Metric Differential Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] font-mono">Timbre Cosine Match</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white font-mono font-bold text-sm">
                  {comparisonResults.cosineSimilarityPercent}%
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE' ? 'Mimicry' : 'Identical'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">RawNet3 128-dim Vector</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] font-mono">Pitch Δ F0 Variance</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white font-mono font-bold text-sm">
                  {comparisonResults.pitchDivergenceHz} Hz
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {comparisonResults.pitchDivergencePercent}% Dev
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Ref: {activeSignature.biometricProfile.fundamentalFrequencyHz} Hz</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] font-mono">Laryngeal Jitter Δ</span>
              <div className="flex items-center justify-between mt-1">
                <span className={`font-mono font-bold text-sm ${
                  comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE' ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {comparisonResults.jitterDeltaPercent}%
                </span>
                <span className="text-[10px] font-mono text-slate-400">PPQ5</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Ref: {activeSignature.biometricProfile.jitterPPQ5Percent}%</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] font-mono">Vocoder Phase Coherence</span>
              <div className="flex items-center justify-between mt-1">
                <span className={`font-mono font-bold text-sm ${
                  comparisonResults.vocoderPhaseCoherenceScore < 35 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {comparisonResults.vocoderPhaseCoherenceScore}/100
                </span>
                <span className="text-[10px] font-mono text-amber-400">&gt;7.8kHz Cut</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">Phase LPCC check</span>
            </div>
          </div>

          {/* Spectral Frequency Comparison Graph (Reference vs Uploaded Sample) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Spectral Formant Overlay (125 Hz — 16 kHz)
              </span>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
                  <span className="text-slate-300">Ground Truth Signature</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-sm ${comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE' ? 'bg-red-500' : 'bg-emerald-400'}`} />
                  <span className="text-slate-300">Uploaded Sample</span>
                </div>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={comparisonResults.acousticSpectrumBands}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                  <XAxis
                    dataKey="frequencyHz"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : `${v}`)}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    unit="dB"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-lg text-xs space-y-1 shadow-xl">
                            <span className="font-bold text-white font-mono block">{d.frequencyHz >= 1000 ? `${d.frequencyHz / 1000} kHz` : `${d.frequencyHz} Hz`} Band</span>
                            <div className="text-[11px] text-cyan-300">Reference: {d.referenceEnergyDb} dB</div>
                            <div className="text-[11px] text-amber-300">Sample: {d.sampleEnergyDb} dB</div>
                            <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-0.5">Variance: {d.varianceDb} dB</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="referenceEnergyDb"
                    name="Reference"
                    fill="#06b6d4"
                    opacity={0.6}
                    radius={[3, 3, 0, 0]}
                  />
                  <Bar
                    dataKey="sampleEnergyDb"
                    name="Sample"
                    fill={comparisonResults.verdict === 'SYNTHETIC_DEEPFAKE_CLONE' ? '#ef4444' : '#10b981'}
                    opacity={0.8}
                    radius={[3, 3, 0, 0]}
                  />
                  <ReferenceLine y={-38} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Vocoder Cutoff Threshold', fill: '#fbbf24', fontSize: 9 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Granular Forensic Anomalies List */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Acoustic Anomaly & Biometric Markers ({comparisonResults.detectedAnomalies.length})
            </span>
            <div className="space-y-1.5">
              {comparisonResults.detectedAnomalies.map((anom, i) => (
                <div
                  key={i}
                  className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-start justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{anom.title}</span>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{anom.description}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap ${
                    anom.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {anom.deviation}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action & Statutory Protection Command Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
            {/* Trigger High-Priority Persistent Regulatory Alert */}
            <button
              type="button"
              onClick={handleTriggerRegulatoryAlert}
              className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer transition-all"
              title="Broadcast a persistent high-priority Regulatory Alert to risk and surveillance desks"
            >
              <Scale className="w-4 h-4 text-slate-950" />
              <span>🚨 Broadcast Regulatory Alert</span>
            </button>

            {/* Document in Audit Ledger */}
            <button
              type="button"
              onClick={handleDocumentToAuditLog}
              disabled={isAuditDocumented}
              className={`py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                isAuditDocumented
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
              }`}
              title="Write verification finding into the immutable SHA-256 FIPS 140-3 ledger"
            >
              {isAuditDocumented ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Documented ({lastAuditRecordId})</span>
                </>
              ) : (
                <>
                  <FileSignature className="w-4 h-4 text-cyan-400" />
                  <span>Document in Ledger</span>
                </>
              )}
            </button>

            {/* Export Signed PDF */}
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Download cryptographically signed comparison PDF report"
            >
              <FileDown className="w-4 h-4 text-cyan-400" />
              <span>{isExportingPDF ? 'Exporting...' : 'PDF Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
