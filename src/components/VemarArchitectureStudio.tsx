import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle2,
  Server,
  ArrowRight,
  AlertTriangle,
  Play,
  Terminal,
  Clock,
  Database,
  Lock,
  RefreshCw,
  GitMerge,
  FileCode,
  Sliders
} from 'lucide-react';
import { VemarLogo } from './VemarLogo';
import { Jurisdiction } from '../types';

interface VemarArchitectureStudioProps {
  jurisdiction: Jurisdiction;
}

interface PipelineStage {
  id: string;
  stageName: string;
  letter: 'V' | 'E' | 'M' | 'A' | 'R';
  title: string;
  description: string;
  neuralTech: string;
  latencyBudget: string;
  latencyActualMs: number;
  status: 'ACTIVE' | 'PROCESSING' | 'READY';
  accuracy: string;
  inputFormat: string;
  outputArtifact: string;
  benchmarks: string;
}

export const VemarArchitectureStudio: React.FC<VemarArchitectureStudioProps> = ({ jurisdiction }) => {
  const isUS = jurisdiction === 'US';
  const [activeStageId, setActiveStageId] = useState<string>('stage_v');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([
    'SYSTEM BOOT: VEMAR Core Neural Engine v3.0 initialized.',
    'HSM Root Key Store: ED25519 PKI active and synchronized.',
    'FIX 4.4 Gateway: Order execution quarantine hook mounted on port 9800.',
    'Latency SLA Target: < 380 ms across all 5 verification stages.'
  ]);

  const stages: PipelineStage[] = [
    {
      id: 'stage_v',
      letter: 'V',
      stageName: 'Stage 1: Acoustic Biometrics & Voice Anti-Spoofing',
      title: 'Voice Clone & Vishing Neutralizer',
      description: 'Ingests high-frequency telephonic and streaming audio chunks. Extracts raw acoustic features to detect synthetic vocoder artifacts, absence of vocal-tract resonant damping, and artificial pitch flatness.',
      neuralTech: 'RawNet3 + WavLM Large Spectral Embeddings + Biometric GMM',
      latencyBudget: '< 80 ms',
      latencyActualMs: 42,
      status: 'ACTIVE',
      accuracy: '99.4% ROC-AUC (ASVspoof 2021)',
      inputFormat: '16kHz PCM Audio Stream / Opus / SIP Telephony VoIP',
      outputArtifact: 'Synthetic Voice Vector Score (0-100) + F0 Pitch Contour Map',
      benchmarks: 'Trained on 45,000+ synthetic voice samples across 12 generative vocoders'
    },
    {
      id: 'stage_e',
      letter: 'E',
      stageName: 'Stage 2: Entity & Regulatory Registry Provenance',
      title: 'Cryptographic Ledger & Entity Verifier',
      description: 'Cross-verifies purporting sender identity against official regulatory ledgers: SEBI registered intermediaries, NSE/BSE announcements, and SEC EDGAR Form 8-K/10-K accession hashes.',
      neuralTech: 'C2PA Manifest v1.3 + SHA-256 PKI X.509 Hardware Security Module (HSM)',
      latencyBudget: '< 40 ms',
      latencyActualMs: 18,
      status: 'ACTIVE',
      accuracy: '100% Deterministic (Zero Hash Collision)',
      inputFormat: 'Document Hash / LEI Code / Accession Number / CIK / SEBI Reg ID',
      outputArtifact: 'Cryptographic Provenance Token + X.509 Chain of Custody Proof',
      benchmarks: 'Direct sync with SEBI Circulars and SEC EDGAR real-time filing feeds'
    },
    {
      id: 'stage_m',
      letter: 'M',
      stageName: 'Stage 3: Multi-Modal Media Deepfake Forensics',
      title: 'Generative Video & Spatial-Temporal Inspector',
      description: 'Processes video streams and broadcast imagery frame-by-frame. Analyzes phoneme-to-viseme lip synchronization latency, corneal light reflection consistency, and diffusion model residual noise patterns.',
      neuralTech: 'Spatial-Temporal Transformer (STT) + ResNet-50 Landmark Flow + Diffusion Noise Filter',
      latencyBudget: '< 160 ms',
      latencyActualMs: 115,
      status: 'ACTIVE',
      accuracy: '99.1% F1-Score (FaceForensics++ / DFDC)',
      inputFormat: 'H.264 / H.265 Video Stream (30fps) / PNG / JPEG Financial Reports',
      outputArtifact: 'Heatmap Tensor + Facial Boundary Warping Index + Viseme Offset (ms)',
      benchmarks: 'Benchmarked across 36,000 deepfake video clips (Wav2Lip, DeepFaceLive, Sora)'
    },
    {
      id: 'stage_a',
      letter: 'A',
      stageName: 'Stage 4: Algorithmic Syndicate & Social Swarm Radar',
      title: 'Coordinated Market Manipulation Sensor',
      description: 'Scans thousands of high-frequency social channels (Telegram VIP tips, WhatsApp syndicates, Discord, X, WallStreetBets) to detect synchronized bot swarms and pump-and-dump coordination before volume spikes.',
      neuralTech: 'Graph Convolutional Networks (GCN) + FinBERT Sentiment Anomaly Classifier',
      latencyBudget: '< 90 ms',
      latencyActualMs: 64,
      status: 'ACTIVE',
      accuracy: '98.6% Precision in Swarm Cluster Identification',
      inputFormat: 'REST Social Webhooks / Telegram MTProto / Discord Gateways / FIX Market Feeds',
      outputArtifact: 'Bot Swarm Graph Cluster + Coordinated Volume Velocity Index',
      benchmarks: 'Tracks 1,200+ monitored financial channels with real-time NLP classification'
    },
    {
      id: 'stage_r',
      letter: 'R',
      stageName: 'Stage 5: Response & Real-Time FIX Execution Halt',
      title: 'Pre-Trade Circuit Breaker & Regulatory Dispatch',
      description: 'Instantly injects pre-trade order quarantine hooks into institutional Order Management Systems (OMS) via FIX 4.4 protocol, and auto-generates regulatory whistleblowing dossiers (SEBI SCORES 2.0 / SEC Form TCR).',
      neuralTech: 'High-Throughput FIX 4.4 Engine + Automated Regulatory XML/JSON Dispatcher',
      latencyBudget: '< 30 ms',
      latencyActualMs: 16,
      status: 'ACTIVE',
      accuracy: 'Sub-millisecond FIX tag-level order diversion (Tag 35=D/F)',
      inputFormat: 'Forensic Aggregated Threat Object (Stages V+E+M+A)',
      outputArtifact: 'FIX Drop-Copy Halt Signal + SEC Form TCR / SEBI SCORES Dossier Package',
      benchmarks: 'Certified with NYSE/Nasdaq FIX specifications and NSE/BSE FIX drop-copy standards'
    }
  ];

  const currentStage = stages.find((s) => s.id === activeStageId) || stages[0];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationLog((prev) => [
      `[${new Date().toLocaleTimeString()}] INCOMING MULTI-MODAL PACKET: Ingesting high-priority trade audio & circular payload...`,
      ...prev.slice(0, 15)
    ]);

    setTimeout(() => {
      setSimulationLog((prev) => [
        `[${new Date().toLocaleTimeString()}] [V] Acoustic Analysis: Synthetic vocoder detected. Pitch jitter anomaly = 8.42 Hz (Synthetic clone risk = 96%).`,
        ...prev.slice(0, 15)
      ]);
    }, 400);

    setTimeout(() => {
      setSimulationLog((prev) => [
        `[${new Date().toLocaleTimeString()}] [E] Entity Check: Purported CIK/Registration does NOT match official PKI registry. Mismatch confirmed.`,
        ...prev.slice(0, 15)
      ]);
    }, 700);

    setTimeout(() => {
      setSimulationLog((prev) => [
        `[${new Date().toLocaleTimeString()}] [M] Media Forensics: Viseme-phoneme sync lag of 48ms identified in executive address.`,
        ...prev.slice(0, 15)
      ]);
    }, 1000);

    setTimeout(() => {
      setSimulationLog((prev) => [
        `[${new Date().toLocaleTimeString()}] [A] Swarm Radar: Correlated spike across 14 Telegram syndicates promoting ticker.`,
        ...prev.slice(0, 15)
      ]);
    }, 1300);

    setTimeout(() => {
      setSimulationLog((prev) => [
        `[${new Date().toLocaleTimeString()}] [R] RESPONSE TRIGGERED: FIX 4.4 Order Halt injected (Tag 35=D quarantined). Total end-to-end latency: 255ms.`,
        `[${new Date().toLocaleTimeString()}] Dossier auto-compiled and dispatched to ${isUS ? 'SEC Whistleblower Office (Form TCR)' : 'SEBI SCORES 2.0 API'}.`,
        ...prev.slice(0, 15)
      ]);
      setIsSimulating(false);
    }, 1700);
  };

  const totalActualLatency = stages.reduce((acc, s) => acc + s.latencyActualMs, 0);

  return (
    <div id="vemar-architecture-studio" className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>VEMAR AI Core Architecture • Production Pipeline Specification</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <VemarLogo size="md" showGlow={false} />
            <span>The VEMAR 5-Stage Neural Defense Pipeline</span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            VEMAR AI (<strong className="text-cyan-300">V</strong>oice, <strong className="text-cyan-300">E</strong>ntity, <strong className="text-cyan-300">M</strong>edia <strong className="text-cyan-300">A</strong>uthentication & <strong className="text-cyan-300">R</strong>isk AI) replaces disjointed point-solutions with an integrated, sub-400ms pre-trade execution defense pipeline built for high-throughput institutional markets.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono">
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <span className="text-slate-400">Total Pipeline Latency:</span>
              <span className="text-cyan-400 font-bold">{totalActualLatency} ms (p99 SLA &lt; 380 ms)</span>
            </div>
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <span className="text-slate-400">Core Protocol:</span>
              <span className="text-emerald-400 font-bold">FIX 4.4 + C2PA v1.3 + REST/WebSocket</span>
            </div>
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
              <span className="text-slate-400">Target Markets:</span>
              <span className="text-white font-bold">{isUS ? 'SEC / FINRA (United States)' : 'SEBI / NSE / BSE (India)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 5-Stage Visual Workflow Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Modular Stage Architecture (Click to inspect neural layers)</span>
          </h3>

          <button
            id="vemar-run-simulation-btn"
            type="button"
            disabled={isSimulating}
            onClick={handleRunSimulation}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition-all shadow-md ${
              isSimulating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/20 active:scale-95'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Simulating Live Trade Interception...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate End-to-End Interception</span>
              </>
            )}
          </button>
        </div>

        {/* 5 Letters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {stages.map((stage) => {
            const isSelected = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageId(stage.id)}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-9 h-9 rounded-xl font-black font-mono text-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {stage.letter}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-cyan-400">
                    {stage.latencyActualMs}ms
                  </span>
                </div>

                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {stage.title}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {stage.letter === 'V'
                    ? 'Voice Biometrics'
                    : stage.letter === 'E'
                    ? 'Entity Provenance'
                    : stage.letter === 'M'
                    ? 'Media Forensics'
                    : stage.letter === 'A'
                    ? 'Algorithmic Radar'
                    : 'Response & Halts'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Deep-Dive Specification Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                {currentStage.stageName}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Latency Budget: <strong className="text-white">{currentStage.latencyBudget}</strong>
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">{currentStage.title}</h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed mt-1">
              {currentStage.description}
            </p>
          </div>

          <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Empirical Accuracy</span>
            <span className="text-sm font-bold text-emerald-400 font-mono block mt-0.5">
              {currentStage.accuracy}
            </span>
          </div>
        </div>

        {/* Technical Deep Dive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
              Neural Architecture & Models
            </span>
            <span className="text-white font-mono font-bold block">{currentStage.neuralTech}</span>
            <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
              Optimized with TensorRT / ONNX Runtime for ultra-low latency sub-second inference.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
              Streaming Input Format
            </span>
            <span className="text-cyan-300 font-mono font-bold block">{currentStage.inputFormat}</span>
            <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
              Accepts continuous asynchronous payloads without buffering delays.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
              Output Artifact & Verdict
            </span>
            <span className="text-emerald-300 font-mono font-bold block">{currentStage.outputArtifact}</span>
            <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
              Downstream tensors forward seamlessly to the FIX execution circuit-breaker engine.
            </p>
          </div>
        </div>
      </div>

      {/* Real-Time Neural Execution Terminal Simulation */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">VEMAR Live Event Bus & SIEM Syslog Stream</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Kafka Ingestion Cluster Active</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl text-xs space-y-1.5 max-h-48 overflow-y-auto text-slate-300 select-text">
          {simulationLog.map((log, index) => (
            <div
              key={index}
              className={`leading-relaxed ${
                log.includes('RESPONSE TRIGGERED')
                  ? 'text-red-400 font-bold'
                  : log.includes('Acoustic Analysis') || log.includes('Voice')
                  ? 'text-cyan-300'
                  : log.includes('Dossier')
                  ? 'text-emerald-300 font-semibold'
                  : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
