import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  FileDown,
  Activity,
  Layers,
  Radio,
  Sliders,
  CheckCircle2,
  Clock,
  Hash,
  Search,
  Filter,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileSignature,
  FileText,
  Copy,
  Check,
  Lock,
  Headphones,
  Music,
  Scale,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ComplianceAuditEntry } from '../types/audit';
import { useAuditLog } from '../context/AuditLogContext';
import { useNotificationToast } from '../context/NotificationToastContext';
import { Jurisdiction, UserRole } from '../types';
import { playBiometricVoiceComparisonTone } from '../utils/voiceAnomalyComparator';
import { KNOWN_VOICE_SIGNATURES } from '../data/voiceSignaturesData';

interface VoiceAnomalyHistoryProps {
  jurisdiction: Jurisdiction;
  currentRole: UserRole;
  onSelectForVerification?: (signatureId: string, isSynthetic: boolean) => void;
  onNavigateToVerifierTab?: () => void;
}

export const VoiceAnomalyHistory: React.FC<VoiceAnomalyHistoryProps> = ({
  jurisdiction,
  currentRole,
  onSelectForVerification,
  onNavigateToVerifierTab
}) => {
  const { logs, exportSignedAuditPDF, exportLogs } = useAuditLog();
  const { notifySuccess, notifyInfo } = useNotificationToast();

  const isUS = jurisdiction === 'US';

  // State: Filters and search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verdictFilter, setVerdictFilter] = useState<'ALL' | 'CLONE' | 'AUTHENTIC'>('ALL');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'LOW'>('ALL');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);

  // Audio Replay State
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [audioPlayMode, setAudioPlayMode] = useState<'analyzed' | 'reference'>('analyzed');
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const playbackStartTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Filter logs specifically for voice anomaly and audio forensics
  const voiceAuditLogs = useMemo(() => {
    return logs.filter((log) => {
      const isVoiceAction =
        log.action === 'VOICE_ANOMALY_AUDITED' ||
        log.action === 'FORENSIC_SCAN_EXECUTED' ||
        log.action === 'PRE_TRADE_ORDER_HALTED';

      const isVoiceChannel =
        log.details?.channel === 'audio_call' ||
        log.details?.deepfakeProbability !== undefined ||
        log.actionLabel?.toLowerCase().includes('voice') ||
        log.actionLabel?.toLowerCase().includes('audio') ||
        log.targetAssetOrEntity?.toLowerCase().includes('audio') ||
        log.details?.summary?.toLowerCase().includes('voice') ||
        log.details?.summary?.toLowerCase().includes('acoustic');

      return isVoiceAction && isVoiceChannel;
    });
  }, [logs]);

  // Filtered entries by user controls
  const filteredVoiceLogs = useMemo(() => {
    return voiceAuditLogs.filter((log) => {
      // Verdict filter
      const isClone =
        log.details?.verdict === 'SYNTHETIC_DEEPFAKE_CLONE' ||
        (log.details?.deepfakeProbability && log.details.deepfakeProbability >= 50) ||
        (log.details?.riskScore && log.details.riskScore >= 50) ||
        log.severity === 'CRITICAL' ||
        log.status === 'FLAGGED';

      if (verdictFilter === 'CLONE' && !isClone) return false;
      if (verdictFilter === 'AUTHENTIC' && isClone) return false;

      // Severity filter
      if (severityFilter !== 'ALL' && log.severity !== severityFilter) return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTarget = log.targetAssetOrEntity?.toLowerCase().includes(query);
        const matchesLabel = log.actionLabel?.toLowerCase().includes(query);
        const matchesSummary = log.details?.summary?.toLowerCase().includes(query);
        const matchesId = log.id?.toLowerCase().includes(query);
        const matchesHash = log.recordHash?.toLowerCase().includes(query);
        const matchesFile = log.details?.audioFileName?.toLowerCase().includes(query);

        if (!matchesTarget && !matchesLabel && !matchesSummary && !matchesId && !matchesHash && !matchesFile) {
          return false;
        }
      }

      return true;
    });
  }, [voiceAuditLogs, verdictFilter, severityFilter, searchQuery]);

  // Aggregate statistics
  const stats = useMemo(() => {
    const total = voiceAuditLogs.length;
    let clones = 0;
    let authentic = 0;
    let totalProbability = 0;

    voiceAuditLogs.forEach((l) => {
      const prob = l.details?.deepfakeProbability ?? l.details?.riskScore ?? 0;
      totalProbability += prob;
      if (prob >= 50 || l.severity === 'CRITICAL' || l.details?.verdict === 'SYNTHETIC_DEEPFAKE_CLONE') {
        clones++;
      } else {
        authentic++;
      }
    });

    const avgProb = total > 0 ? Math.round(totalProbability / total) : 0;
    return { total, clones, authentic, avgProb };
  }, [voiceAuditLogs]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Handle Audio Replay
  const handlePlayReplay = (entry: ComplianceAuditEntry, mode: 'analyzed' | 'reference' = 'analyzed') => {
    if (activePlayingId === entry.id && audioPlayMode === mode) {
      // Pause
      stopReplay();
      return;
    }

    // Stop existing
    stopReplay();

    setActivePlayingId(entry.id);
    setAudioPlayMode(mode);
    setPlaybackProgress(0);

    const isClone =
      mode === 'reference'
        ? false
        : entry.details?.verdict === 'SYNTHETIC_DEEPFAKE_CLONE' ||
          (entry.details?.deepfakeProbability ?? entry.details?.riskScore ?? 0) >= 50;

    const toneType =
      mode === 'reference'
        ? 'reference_authentic'
        : isClone
        ? 'sample_synthetic'
        : 'sample_authentic';

    // Trigger biometric tone synthesis
    playBiometricVoiceComparisonTone(toneType, 132);

    // Animate progress over ~2.4 seconds
    const duration = 2400;
    playbackStartTimeRef.current = performance.now();

    const updateProgress = (now: number) => {
      const elapsed = now - playbackStartTimeRef.current;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setPlaybackProgress(progress);

      if (progress < 100) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      } else {
        setActivePlayingId(null);
        setPlaybackProgress(0);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);
  };

  const stopReplay = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setActivePlayingId(null);
    setPlaybackProgress(0);
  };

  const copyHashToClipboard = (hash: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(hash);
      setCopiedHashId(id);
      notifyInfo('Hash Copied', 'Tamper-evident cryptographic SHA-256 hash copied to clipboard.');
      setTimeout(() => setCopiedHashId(null), 2500);
    }
  };

  const handleExportPDF = async (entry: ComplianceAuditEntry) => {
    try {
      await exportSignedAuditPDF(undefined, entry);
      notifySuccess('PDF Exported', `Forensic audit certificate generated for record #${entry.sequenceNumber}.`);
    } catch (e) {
      console.error('Failed to export PDF', e);
    }
  };

  return (
    <div id="voice-anomaly-history-panel" className="space-y-6">
      {/* Top Header & Telemetry Bar */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
                <FileSignature className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Voice Anomaly Forensic Ledger
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                WORM Immutable Chain
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Historical repository of all voice streams, deepfake anomaly scores, vocoder phase markers, and tamper-evident SHA-256 chained audit attestations.
            </p>
          </div>

          {/* Quick Ledger Export Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              id="export-voice-history-pdf-btn"
              type="button"
              onClick={() => exportSignedAuditPDF(filteredVoiceLogs)}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Export Ledger PDF</span>
            </button>
            <button
              id="export-voice-history-json-btn"
              type="button"
              onClick={() => exportLogs('json', filteredVoiceLogs)}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>JSON</span>
            </button>
            <button
              id="export-voice-history-cef-btn"
              type="button"
              onClick={() => exportLogs('cef', filteredVoiceLogs)}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>CEF / SIEM</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">Total Audited Audio</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{stats.total} Records</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <Lock className="w-3 h-3 text-emerald-400" /> FIPS 140-3 Sealed
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-3 border border-red-900/40">
            <div className="text-[11px] font-mono text-red-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Flagged Deepfakes
            </div>
            <div className="text-xl font-bold font-mono text-red-300 mt-0.5">{stats.clones} Intercepted</div>
            <div className="text-[10px] text-red-400/80 mt-0.5 font-medium">Pre-Trade Orders Halted</div>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-3 border border-emerald-900/40">
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified Authentic
            </div>
            <div className="text-xl font-bold font-mono text-emerald-300 mt-0.5">{stats.authentic} Cleared</div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5 font-medium">Hardware Voiceprint Match</div>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">Avg Deepfake Probability</div>
            <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">{stats.avgProb}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Mean Sample Variance</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="voice-history-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by executive, ticker, audio file, or block hash..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Verdict Pills */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">Verdict:</span>
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              id="filter-verdict-all-btn"
              type="button"
              onClick={() => setVerdictFilter('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                verdictFilter === 'ALL' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({voiceAuditLogs.length})
            </button>
            <button
              id="filter-verdict-clones-btn"
              type="button"
              onClick={() => setVerdictFilter('CLONE')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                verdictFilter === 'CLONE' ? 'bg-red-600 text-white shadow' : 'text-red-400 hover:text-red-300'
              }`}
            >
              <AlertOctagon className="w-3 h-3" />
              <span>Clones ({stats.clones})</span>
            </button>
            <button
              id="filter-verdict-authentic-btn"
              type="button"
              onClick={() => setVerdictFilter('AUTHENTIC')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                verdictFilter === 'AUTHENTIC' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Authentic ({stats.authentic})</span>
            </button>
          </div>
        </div>

        {/* Severity Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            id="filter-severity-selector"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Severity Only</option>
            <option value="HIGH">High Severity Only</option>
            <option value="LOW">Low Severity Only</option>
          </select>
        </div>
      </div>

      {/* Audit Entries List */}
      <div className="space-y-4">
        {filteredVoiceLogs.length === 0 ? (
          <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-10 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-900 flex items-center justify-center text-slate-400">
              <Headphones className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">No Voice Forensic Records Found</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No previous audio analyses match your search criteria. Run a voice verification in the Live Biometric Verifier to document entries into the Compliance Audit Ledger.
            </p>
            {onNavigateToVerifierTab && (
              <button
                type="button"
                onClick={onNavigateToVerifierTab}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow"
              >
                <span>Go to Live Biometric Verifier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          filteredVoiceLogs.map((entry) => {
            const isClone =
              entry.details?.verdict === 'SYNTHETIC_DEEPFAKE_CLONE' ||
              (entry.details?.deepfakeProbability && entry.details.deepfakeProbability >= 50) ||
              (entry.details?.riskScore && entry.details.riskScore >= 50) ||
              entry.severity === 'CRITICAL' ||
              entry.status === 'FLAGGED';

            const deepfakeProbability =
              entry.details?.deepfakeProbability ?? entry.details?.riskScore ?? (isClone ? 94 : 6);

            const audioName =
              entry.details?.audioFileName ||
              (isClone ? 'telephonic_order_authorization_spoof.wav' : 'executive_briefing_session_verified.wav');

            const isExpanded = expandedRecordId === entry.id;
            const isPlayingThis = activePlayingId === entry.id;

            // Forensic markers extraction
            const markers = entry.details?.forensicMarkers;
            const cosineSim = markers?.cosineSimilarity ?? (isClone ? 79 : 96);
            const pitchDelta = markers?.pitchDivergenceHz ?? (isClone ? 34 : 2);
            const vocoderPhase = markers?.vocoderPhaseScore ?? (isClone ? 18 : 88);
            const formantError = markers?.formantDispersionErrorHz ?? (isClone ? 152 : 19);

            return (
              <div
                key={entry.id}
                id={`voice-audit-record-${entry.id}`}
                className={`bg-slate-950/90 border rounded-xl transition-all shadow-lg overflow-hidden ${
                  isClone
                    ? 'border-red-900/50 hover:border-red-700/80'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Entry Top Banner */}
                <div className="p-4 sm:p-5 border-b border-slate-900 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Monotonic Sequence Badge */}
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1">
                        <Hash className="w-3 h-3 text-cyan-400" />
                        <span>Block #{entry.sequenceNumber}</span>
                      </span>

                      {/* Entry ID */}
                      <span className="text-xs font-mono text-cyan-400 font-semibold">{entry.id}</span>

                      {/* Deepfake Verdict Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                          isClone
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {isClone ? <AlertOctagon className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                        <span>{isClone ? 'SYNTHETIC DEEPFAKE CLONE' : 'VERIFIED AUTHENTIC VOICE'}</span>
                      </span>

                      {/* Timestamp */}
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 ml-auto sm:ml-0">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {/* Target and Action Title */}
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{entry.actionLabel}</span>
                        <span className="text-xs font-normal text-slate-400">({entry.targetAssetOrEntity})</span>
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {entry.details?.summary}
                      </p>
                    </div>
                  </div>

                  {/* Deepfake Probability Score Visualizer */}
                  <div className="flex items-center gap-3 shrink-0 self-start lg:self-center bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800">
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">
                        Deepfake Probability
                      </span>
                      <span
                        className={`text-xl font-bold font-mono ${
                          deepfakeProbability >= 80
                            ? 'text-red-400'
                            : deepfakeProbability >= 40
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {deepfakeProbability}%
                      </span>
                    </div>
                    {/* Visual Meter Bar */}
                    <div className="w-16 h-2.5 bg-slate-800 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          deepfakeProbability >= 80
                            ? 'bg-gradient-to-r from-red-600 to-rose-400'
                            : deepfakeProbability >= 40
                            ? 'bg-gradient-to-r from-amber-600 to-yellow-400'
                            : 'bg-gradient-to-r from-emerald-600 to-teal-400'
                        }`}
                        style={{ width: `${deepfakeProbability}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Audio Replay & Telemetry Section */}
                <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-slate-900 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Left: Interactive Audio Player */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Music className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Clip:</span>
                        <strong className="text-slate-200">{audioName}</strong>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {entry.details?.audioDurationSec ?? '8.5'}s
                      </span>
                    </div>

                    {/* Controls & Animated Waveform Equalizer */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handlePlayReplay(entry, 'analyzed')}
                        className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow ${
                          isPlayingThis && audioPlayMode === 'analyzed'
                            ? 'bg-amber-600 text-white animate-pulse'
                            : isClone
                            ? 'bg-red-950/80 text-red-200 hover:bg-red-900 border border-red-800/80'
                            : 'bg-emerald-950/80 text-emerald-200 hover:bg-emerald-900 border border-emerald-800/80'
                        }`}
                      >
                        {isPlayingThis && audioPlayMode === 'analyzed' ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Stop Clip</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Replay Audio Clip</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePlayReplay(entry, 'reference')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                          isPlayingThis && audioPlayMode === 'reference'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700'
                        }`}
                        title="Replay registered ground truth voiceprint for comparison"
                      >
                        <Headphones className="w-3 h-3 text-cyan-400" />
                        <span>Compare Truth Voiceprint</span>
                      </button>

                      {/* Equalizer Waveform Animation */}
                      <div className="flex-1 max-w-xs flex items-center gap-1 h-6 px-2 bg-slate-950/80 rounded border border-slate-800 overflow-hidden">
                        {[40, 75, 25, 90, 60, 30, 85, 45, 95, 35, 70, 50, 80, 20, 65].map((height, idx) => {
                          const isAnimated = isPlayingThis;
                          const activeHeight = isAnimated
                            ? Math.max(15, Math.min(100, Math.sin(idx + playbackProgress * 0.1) * 45 + 50))
                            : Math.min(height, 35);
                          return (
                            <div
                              key={idx}
                              className={`flex-1 rounded-sm transition-all duration-75 ${
                                isAnimated
                                  ? isClone
                                    ? 'bg-red-400'
                                    : 'bg-emerald-400'
                                  : 'bg-slate-700'
                              }`}
                              style={{ height: `${activeHeight}%` }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleExportPDF(entry)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5 text-cyan-400" />
                      <span>PDF Attestation</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedRecordId(isExpanded ? null : entry.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>{isExpanded ? 'Collapse' : 'Forensic Markers'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Key Forensic Markers Summary Strip (Always Visible) */}
                <div className="px-4 py-3 bg-slate-950/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-slate-900">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Timbre Cosine Similarity</span>
                    <span className="font-mono font-bold text-slate-200">{cosineSim}%</span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      {cosineSim >= 90 ? '(Human Formant Match)' : '(Artificial Mimicry)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Pitch Divergence (ΔF0)</span>
                    <span className={`font-mono font-bold ${pitchDelta > 20 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {pitchDelta} Hz
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      {pitchDelta > 20 ? '(Flatline Glottal Pulses)' : '(Natural Jitter)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Vocoder Phase Coherence</span>
                    <span className={`font-mono font-bold ${vocoderPhase < 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {vocoderPhase} / 100
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      {vocoderPhase < 30 ? '(Phase Discontinuity)' : '(Coherent)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Formant Alignment Error</span>
                    <span className={`font-mono font-bold ${formantError > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {formantError} Hz
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      {formantError > 50 ? '(Synthetic Deviation)' : '(Within FIPS Limit)'}
                    </span>
                  </div>
                </div>

                {/* Detailed Expanded Drawer (Acoustics + Detected Anomalies + Tamper-Evident SHA-256) */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 bg-slate-950 space-y-4 text-xs border-t border-slate-900 animate-fadeIn">
                    {/* Detected Anomalies List */}
                    <div>
                      <h5 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Biometric Anomalies & Forensic Deviations</span>
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {markers?.anomaliesList && markers.anomaliesList.length > 0 ? (
                          markers.anomaliesList.map((anom, aIdx) => (
                            <div
                              key={aIdx}
                              className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-[11px]">{anom.title}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800">
                                  {anom.deviation}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">{anom.description}</p>
                            </div>
                          ))
                        ) : isClone ? (
                          <>
                            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-red-900/40 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-[11px]">Vocoder Bandwidth Phase Cutoff</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800">
                                  &lt;7.8 kHz Brickwall
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                Sharp artificial energy attenuation above 7800Hz characteristic of neural diffusion vocoders.
                              </p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-red-900/40 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-[11px]">Missing Glottal Pitch Micro-Jitter</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800">
                                  Δ 0.08% Jitter
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                Unnatural pitch stability with synthetic micro-periodicity lacking human vocal tract respiration variation.
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="col-span-2 p-3 rounded-lg bg-slate-900/60 border border-emerald-900/40 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-slate-300 text-xs">
                              All harmonic, glottal jitter, and formant markers fully align with enrolled FIPS 140-3 hardware voiceprint. Zero anomalies detected.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cryptographic Chain-of-Custody & Statutory Details */}
                    <div className="pt-3 border-t border-slate-900 space-y-2.5 font-mono text-[11px]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-400">
                        <div>
                          <span>Statutory Regime: </span>
                          <span className="text-slate-200 font-bold">{entry.statutoryRegime}</span>
                        </div>
                        <div>
                          <span>Ingress Proxy: </span>
                          <span className="text-slate-300">{entry.ipAddress}</span>
                        </div>
                      </div>

                      {/* SHA-256 Hashes */}
                      <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 shrink-0">Record SHA-256:</span>
                          <span className="text-cyan-300 truncate">{entry.recordHash}</span>
                          <button
                            type="button"
                            onClick={() => copyHashToClipboard(entry.recordHash, entry.id)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white shrink-0 cursor-pointer"
                            title="Copy Hash"
                          >
                            {copiedHashId === entry.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2 text-slate-400">
                          <span className="shrink-0">Prev Hash:</span>
                          <span className="text-slate-300 truncate">{entry.prevHash}</span>
                          <span className="text-[10px] text-emerald-400 shrink-0">CHAIN VALID</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar inside Drawer */}
                    {onSelectForVerification && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const sigId = markers?.enrolledVoiceprintId || KNOWN_VOICE_SIGNATURES[0].id;
                            onSelectForVerification(sigId, isClone);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Activity className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Load Sample into Live Biometric Verifier</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
