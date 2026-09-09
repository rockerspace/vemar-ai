import React, { useState } from 'react';
import {
  Cpu,
  Database,
  ShieldCheck,
  Activity,
  Layers,
  Zap,
  Server,
  Lock,
  GitMerge,
  HardDrive,
  Terminal,
  ArrowRight,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Globe,
  RefreshCw,
  Play,
  Radio,
  FileText,
  Sliders,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Share2,
  FileCheck
} from 'lucide-react';
import { Jurisdiction } from '../types';

interface TechnicalArchitectureDiagramProps {
  jurisdiction?: Jurisdiction;
  onSelectJurisdiction?: (j: Jurisdiction) => void;
  compact?: boolean;
}

interface NodeDetail {
  id: string;
  name: string;
  category: 'INGRESS' | 'STREAMING' | 'NEURAL' | 'PERSISTENCE' | 'CONTAINMENT';
  latency: string;
  latencyMs: number;
  protocol: string;
  techStack: string;
  compliance: string;
  description: string;
  samplePayload: string;
}

export const TechnicalArchitectureDiagram: React.FC<TechnicalArchitectureDiagramProps> = ({
  jurisdiction = 'IN',
  onSelectJurisdiction,
  compact = false
}) => {
  const isIndia = jurisdiction === 'IN';
  const [activeNodeId, setActiveNodeId] = useState<string>('node_neural_v');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [activeView, setActiveView] = useState<'diagram' | 'latency' | 'matrix'>('diagram');
  const [copiedMermaid, setCopiedMermaid] = useState<boolean>(false);

  const nodeDetails: Record<string, NodeDetail> = {
    node_ingress_audio: {
      id: 'node_ingress_audio',
      name: 'Telephony & Streaming Audio Ingress',
      category: 'INGRESS',
      latency: '< 15 ms',
      latencyMs: 15,
      protocol: 'SIP / VoIP / Opus (16kHz PCM)',
      techStack: 'FreeSWITCH / WebRTC Gateway / Cloud Armor',
      compliance: 'SEBI CSCRF 2024 / FINRA Rule 4511 Voice Logs',
      description: 'Ingests institutional trade line voice recordings, earnings call webcasts, and executive audio streams in 200ms sliding audio chunks.',
      samplePayload: `{
  "streamId": "sip_call_90482_bkc",
  "codec": "audio/opus",
  "sampleRate": 16000,
  "channels": 1,
  "callerId": "+91-22-6789-XXXX",
  "targetDesk": "INSTITUTIONAL_EQUITY_BLOCK",
  "timestamp": 1773216892100
}`
    },
    node_ingress_market: {
      id: 'node_ingress_market',
      name: 'Exchange Tick & Order Feeds',
      category: 'INGRESS',
      latency: '< 2 ms',
      latencyMs: 2,
      protocol: 'FIX 4.4 Drop-Copy / ITCH / Multicast',
      techStack: 'Direct Exchange Colocation BKC / Mahwah',
      compliance: 'SEBI MII Colocation Guidelines / SEC Rule 611',
      description: 'Ultra-low latency tick-by-tick and pre-trade order drop-copy feed capturing Tag 35=D (New Order Single) before matching engine execution.',
      samplePayload: `8=FIX.4.4|9=178|35=D|49=INST_BROKER_IN|56=NSE_MATCHING|34=1092|52=20260909-07:44:12.102|11=ORD_982104|55=RELIANCE|54=1|38=50000|40=1|10=218|`
    },
    node_ingress_filings: {
      id: 'node_ingress_filings',
      name: 'Regulatory Gazettes & Corporate Filings',
      category: 'INGRESS',
      latency: '< 35 ms',
      latencyMs: 35,
      protocol: 'HTTPS / RSS / SEC EDGAR / SEBI Gazette Feed',
      techStack: 'Cloud Functions v2 / mTLS 1.3 Ingestion Agent',
      compliance: 'SEBI LODR Reg 30 / SEC Form 8-K Accessions',
      description: 'Real-time scraper and webhook ingestion for corporate material disclosures, exchange press releases, and regulatory circulars.',
      samplePayload: `{
  "filingType": "REGULATORY_DISCLOSURE",
  "source": "${isIndia ? 'BSE_CORPORATE_ANNOUNCEMENTS' : 'SEC_EDGAR_8K'}",
  "companyId": "${isIndia ? 'INE002A01018' : '0001018724'}",
  "accessionHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "headline": "Material Event: Acquisition of AI Infrastructure Unit"
}`
    },
    node_ingress_social: {
      id: 'node_ingress_social',
      name: 'Social & Messaging Syndicate Radar',
      category: 'INGRESS',
      latency: '< 45 ms',
      latencyMs: 45,
      protocol: 'MTProto / Discord Gateway / X Firehose',
      techStack: 'Cloud Run Ingress Workers / Distributed Scraper',
      compliance: 'SEBI (PFUTP) Reg 2003 / SEC Rule 10b-5',
      description: 'Continuous monitoring of 1,200+ public and private Telegram VIP groups, WhatsApp syndicates, and financial social channels for coordinated pumps.',
      samplePayload: `{
  "channelId": "telegram_vip_multibagger_calls",
  "messageText": "BUY BUY BUY #TICKER target 45% in next 10 mins insider news confirm!!",
  "memberCount": 48200,
  "velocityMessagesPerMin": 142
}`
    },
    node_pubsub: {
      id: 'node_pubsub',
      name: 'Google Cloud Pub/Sub Streaming Bus',
      category: 'STREAMING',
      latency: '< 12 ms ACK',
      latencyMs: 12,
      protocol: 'gRPC / HTTP/2 Streaming Ingestion',
      techStack: 'Google Cloud Pub/Sub (250k+ msgs/sec)',
      compliance: 'MeitY Empanelled / SOC2 Type II / ISO 27001',
      description: 'Geographically partitioned pub/sub backbone providing FIFO message ordering per ticker, sub-12ms ACK latency, and zero data loss dead-letter queues.',
      samplePayload: `{
  "topic": "projects/vemar-surveillance-prod/topics/surveillance-ingest-stream",
  "messageId": "pubsub_msg_982410984",
  "orderingKey": "RELIANCE.NS",
  "publishTime": "2026-09-09T07:44:12.115Z",
  "attributes": {
    "jurisdiction": "${isIndia ? 'IN' : 'US'}",
    "feed": "VOICE_AND_ORDER_CORRELATED"
  }
}`
    },
    node_dataflow: {
      id: 'node_dataflow',
      name: 'Google Cloud Dataflow (Apache Beam)',
      category: 'STREAMING',
      latency: '< 28 ms',
      latencyMs: 28,
      protocol: 'Streaming Beam Pipeline / Sliding Windows',
      techStack: 'Dataflow Prime (Auto-scaling Worker Pool)',
      compliance: 'SEBI CSCRF High-Throughput Stream Audit',
      description: 'Performs sliding 30-second tumbling windows to dynamically join telephonic audio events, order book liquidity surges, and social swarm velocity.',
      samplePayload: `{
  "windowStart": "2026-09-09T07:43:42Z",
  "windowEnd": "2026-09-09T07:44:12Z",
  "correlatedEntity": "${isIndia ? 'TCS.NS' : 'MSFT'}",
  "socialVolumeDelta": "+840%",
  "orderBookImbalanceRatio": 4.82,
  "confidenceScore": 0.94
}`
    },
    node_neural_v: {
      id: 'node_neural_v',
      name: 'Pillar V: Acoustic Anti-Spoofing Engine',
      category: 'NEURAL',
      latency: '42 ms',
      latencyMs: 42,
      protocol: 'TensorFlow Serving / TensorRT gRPC',
      techStack: 'Vertex AI Dedicated NVIDIA L4 GPUs / RawNet3 + WavLM',
      compliance: 'ASVspoof 2021 Benchmark (99.4% ROC-AUC)',
      description: 'Analyzes 128-band Mel spectrograms, vocal tract linear prediction (LPCC), and vocoder phase jitter to identify voice clones and synthetic speech in 42ms.',
      samplePayload: `{
  "acousticFeatures": {
    "jitterPercentage": 0.048,
    "shimmerPercentage": 0.082,
    "pitchContourSmoothness": 0.98,
    "syntheticVocoderSignatureDetected": true,
    "voiceCloneConfidence": 98.6
  },
  "verdict": "SYNTHETIC_CLONE_CONFIRMED",
  "computeTimeMs": 41.8
}`
    },
    node_neural_e: {
      id: 'node_neural_e',
      name: 'Pillar E: Cryptographic Entity Provenance',
      category: 'NEURAL',
      latency: '18 ms',
      latencyMs: 18,
      protocol: 'C2PA Manifest v1.3 / X.509 PKI Verifier',
      techStack: 'Google Cloud KMS (FIPS 140-3 Level 3 HSM)',
      compliance: 'SEC Rule 17a-4 / SEBI Intermediary Registry',
      description: 'Cross-verifies purported corporate spokespersons and research analysts against SEBI registration databases (INZ, INH) or SEC EDGAR CIK hashes.',
      samplePayload: `{
  "c2paManifestVerified": true,
  "hsmSignature": "VALID_GOOGLE_CLOUD_KMS_ED25519",
  "registryCheck": {
    "regId": "${isIndia ? 'INH000010928' : 'CRD# 182904'}",
    "status": "OFFICIAL_ACTIVE_REGISTRATION",
    "hashCollision": false
  },
  "latencyMs": 17.6
}`
    },
    node_neural_m: {
      id: 'node_neural_m',
      name: 'Pillar M: Multi-Modal Media Forensics',
      category: 'NEURAL',
      latency: '115 ms',
      latencyMs: 115,
      protocol: 'Vision Transformer Tensor Pipeline',
      techStack: 'Vertex AI Spatial-Temporal Transformer + ResNet-50',
      compliance: 'FaceForensics++ (99.1% F1-Score)',
      description: 'Processes broadcast video frames to detect viseme-to-phoneme lip sync delays, boundary pixel warping, and diffusion model residual noise patterns.',
      samplePayload: `{
  "opticalFlowTensor": "resnet50_viseme_layer4",
  "visemePhonemeSyncLagMs": 48.2,
  "cornealReflectionSymmetryScore": 0.32,
  "facialBoundaryDistortionScore": 0.89,
  "deepfakeClassification": "WARPED_GAN_FACESWAP"
}`
    },
    node_neural_a: {
      id: 'node_neural_a',
      name: 'Pillar A: Algorithmic Market Abuse Correlation',
      category: 'NEURAL',
      latency: '64 ms',
      latencyMs: 64,
      protocol: 'Graph Neural Network Matrix Multiplication',
      techStack: 'PyTorch Geometric GCN + FinBERT Classifier',
      compliance: 'SEBI (PFUTP) 2003 / SEC Rule 10b-5 Proof',
      description: 'Correlates multi-modal threat indicators with L1/L2 order books to detect manipulative front-running, layering, spoofing, and pump-and-dump syndicates.',
      samplePayload: `{
  "clusterId": "swarm_telegram_9482",
  "coordinatedAccountNodes": 142,
  "l2OrderBookCorrelation": 0.88,
  "sentimentAnomalyDelta": "+6.4_SIGMA",
  "marketAbuseClassification": "SYNCHRONIZED_PUMP_AND_DUMP"
}`
    },
    node_neural_r: {
      id: 'node_neural_r',
      name: 'Pillar R: Pre-Trade Interception Engine',
      category: 'CONTAINMENT',
      latency: '< 16 ms',
      latencyMs: 16,
      protocol: 'FIX 4.4 Engine / Tag 35=D Quarantine Hook',
      techStack: 'C++ / Go Microservice on Google Cloud Run v2',
      compliance: 'Pre-Trade Risk Management / SEBI Risk Rules',
      description: 'Injects instant pre-trade circuit breaker orders into Order Management Systems (OMS), rejecting spoofed orders via FIX Tag 35=D within 16 milliseconds.',
      samplePayload: `8=FIX.4.4|9=192|35=8|49=NSE_SURVEILLANCE|56=INST_BROKER_IN|34=1093|52=20260909-07:44:12.380|11=ORD_982104|39=8|150=8|58=PRE_TRADE_HALT: VEMAR VOICE CLONE DETECTED (CONF=98.6%)|10=044|`
    },
    node_db_pgvector: {
      id: 'node_db_pgvector',
      name: 'Google Cloud SQL (pgvector)',
      category: 'PERSISTENCE',
      latency: '< 4 ms Search',
      latencyMs: 4,
      protocol: 'PostgreSQL 16 Wire Protocol / SSL',
      techStack: 'Cloud SQL HA Enterprise + pgvector Extension',
      compliance: 'DPDP Act 2023 / SEBI CSCRF Sovereign DB',
      description: 'Stores 512-dimensional voice acoustic embeddings for known corporate executives, broker authorized dealers, and flagged voice threat actors.',
      samplePayload: `SELECT voice_id, speaker_name, corporate_entity, 
       1 - (acoustic_embedding <=> $1) AS cosine_similarity 
FROM corporate_executive_embeddings 
WHERE jurisdiction = 'IN' 
ORDER BY acoustic_embedding <=> $1 LIMIT 5;`
    },
    node_db_bigquery: {
      id: 'node_db_bigquery',
      name: 'Google BigQuery Lakehouse',
      category: 'PERSISTENCE',
      latency: '< 800 ms Query',
      latencyMs: 800,
      protocol: 'BigQuery Storage API (Arrow / Parquet)',
      techStack: 'Google BigQuery Multi-Region Enterprise',
      compliance: 'Petabyte-Scale Historical Regulatory Audit',
      description: 'Aggregates historical trading ticks, social pump alerts, and voice biometric hashes for longitudinal market abuse pattern mining and exchange cross-matching.',
      samplePayload: `SELECT ticker, count(distinct syndicate_id) as syndicates, 
       sum(diverted_notional_inr) as total_averted_losses 
FROM \`vemar-surveillance-prod.market_abuse.interceptions\` 
WHERE trade_date >= CURRENT_DATE() - 30 
GROUP BY ticker ORDER BY total_averted_losses DESC;`
    },
    node_db_worm: {
      id: 'node_db_worm',
      name: 'Google Cloud Storage (7-Yr WORM)',
      category: 'PERSISTENCE',
      latency: '< 60 ms Write',
      latencyMs: 60,
      protocol: 'Object Retention Lock (Compliant WORM)',
      techStack: 'Cloud Storage Dual-Region with Retention Rule',
      compliance: 'SEC Rule 17a-4(f) WORM / SEBI 7-Year Mandate',
      description: 'Guarantees unalterable, tamper-proof evidentiary storage with cryptographic SHA-256 integrity proofs admissible in statutory court proceedings.',
      samplePayload: `{
  "bucket": "vemar-court-admissible-dossiers-worm",
  "retentionPeriodYears": 7,
  "retentionMode": "COMPLIANCE",
  "sha256Hash": "9f82c401e7b9932a4e2e3164f09d81373e20257c2a71d87f5d470559a60e0a12",
  "tamperProofLock": "IMMUTABLE"
}`
    },
    node_egress_reg: {
      id: 'node_egress_reg',
      name: 'Regulatory API Dispatcher (SEBI / SEC)',
      category: 'CONTAINMENT',
      latency: '< 85 ms',
      latencyMs: 85,
      protocol: 'mTLS 1.3 / REST / SOAP / XML',
      techStack: 'Cloud Run v2 Auto-Filing Gateway',
      compliance: 'SEBI SCORES 2.0 / SEC Form TCR Whistleblower',
      description: `Automatically compiles court-admissible forensic dossiers and dispatches encrypted packets directly to statutory regulatory gateways (${isIndia ? 'SEBI SCORES 2.0 & NSE/BSE Surveillance' : 'SEC Office of the Whistleblower Form TCR'}).`,
      samplePayload: `<?xml version="1.0" encoding="UTF-8"?>
<RegulatoryDossier filingId="VEMAR-2026-09-904" jurisdiction="${isIndia ? 'SEBI_IN' : 'SEC_US'}">
  <StatutoryAct>${isIndia ? 'SEBI Act 1992 Section 11B & PFUTP Reg 2003' : 'Securities Exchange Act of 1934 Section 10(b)'}</StatutoryAct>
  <IncidentType>SYNTHETIC_VOICE_ORDER_SPOOFING</IncidentType>
  <QuarantinedNotional>${isIndia ? '₹14,50,00,000' : '$1,750,000'}</QuarantinedNotional>
  <Status>CONTAINED_PRE_EXECUTION</Status>
</RegulatoryDossier>`
    },
    node_egress_siem: {
      id: 'node_egress_siem',
      name: 'Enterprise SIEM & SOC Syslog Stream',
      category: 'CONTAINMENT',
      latency: '< 10 ms',
      latencyMs: 10,
      protocol: 'RFC 5424 / CEF / LEEF over TLS',
      techStack: 'Cloud Pub/Sub Push to Splunk / Microsoft Sentinel',
      compliance: 'ISO 27001 / SOC2 Type II / NIST CSF 2.0',
      description: 'Streams standardized Common Event Format (CEF) security alerts to institutional Security Operations Centers (SOC) in real-time.',
      samplePayload: `CEF:0|VEMAR AI|MarketSurveillance|3.0.0|PRE_TRADE_HALT|Synthetic Voice Trade Intercepted|10|src=10.24.18.2 dst=10.12.0.4 msg=FIX Tag 35=D quarantined cs1Label=Ticker cs1=${isIndia ? 'RELIANCE' : 'AAPL'} cs2Label=Confidence cs2=98.6%`
    }
  };

  const activeNode = nodeDetails[activeNodeId] || nodeDetails['node_neural_v'];

  const handleSimulatePipeline = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(1);

    const steps = [
      { step: 1, node: 'node_ingress_audio', delay: 400 },
      { step: 2, node: 'node_pubsub', delay: 800 },
      { step: 3, node: 'node_neural_v', delay: 1300 },
      { step: 4, node: 'node_neural_a', delay: 1800 },
      { step: 5, node: 'node_neural_r', delay: 2300 },
      { step: 6, node: 'node_egress_reg', delay: 2800 }
    ];

    steps.forEach(({ step, node, delay }) => {
      setTimeout(() => {
        setSimulationStep(step);
        setActiveNodeId(node);
      }, delay);
    });

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationStep(0);
    }, 3400);
  };

  const handleCopyMermaid = () => {
    const mermaidCode = `\`\`\`mermaid
flowchart TB
    %% VEMAR AI Enterprise Technical Architecture
    subgraph INGRESS ["1. MULTI-MODAL INGESTION LAYER"]
        direction LR
        I1["🎙️ SIP VoIP & Audio (16kHz PCM)"]
        I2["⚡ Exchange FIX 4.4 & Ticks (NSE/NYSE)"]
        I3["📜 Corporate Filings (SEBI/SEC EDGAR)"]
        I4["📡 Social Syndicates (Telegram/X)"]
    end

    subgraph STREAMING ["2. STREAMING & TEMPORAL BUS (GOOGLE CLOUD)"]
        direction TB
        P1["☁️ Google Cloud Pub/Sub (<12ms ACK, 250k msgs/s)"]
        P2["🌊 Google Cloud Dataflow (Sliding 30s Windows)"]
        P1 --> P2
    end

    subgraph NEURAL ["3. 5-PILLAR VEMAR NEURAL MATRIX (VERTEX AI)"]
        direction TB
        subgraph V_PILLAR ["V - Voice Biometrics (42ms)"]
            V1["RawNet3 + WavLM"]
            V2["Vocoder Phase Incoherence"]
        end
        subgraph E_PILLAR ["E - Entity Provenance (18ms)"]
            E1["C2PA Manifest v1.3"]
            E2["FIPS 140-3 Cloud KMS HSM"]
        end
        subgraph M_PILLAR ["M - Media Forensics (115ms)"]
            M1["Spatial-Temporal Video Transformer"]
            M2["Viseme-Phoneme Sync Lag"]
        end
        subgraph A_PILLAR ["A - Abuse Correlation (64ms)"]
            A1["Graph Convolutional Network (GCN)"]
            A2["FinBERT Sentiment Anomaly"]
        end
    end

    subgraph PERSISTENCE ["4. SOVEREIGN PERSISTENCE & VECTOR LAKEHOUSE"]
        direction LR
        DB1[("🗄️ Cloud SQL pgvector (<4ms)")]
        DB2[("📊 Google BigQuery Lakehouse")]
        DB3[("🔒 7-Yr WORM Storage (SEC 17a-4)")]
    end

    subgraph CONTAINMENT ["5. PRE-TRADE INTERCEPTION & CONTAINMENT"]
        direction TB
        R1["🛑 FIX 4.4 Pre-Trade Halt (Tag 35=D <16ms)"]
        R2["🏛️ Regulatory Dispatcher (${isIndia ? 'SEBI SCORES 2.0' : 'SEC Form TCR'})"]
        R3["🛡️ Enterprise SIEM Syslog (RFC 5424/CEF)"]
    end

    INGRESS --> STREAMING
    STREAMING --> NEURAL
    NEURAL --> PERSISTENCE
    NEURAL --> CONTAINMENT
\`\`\``;

    navigator.clipboard.writeText(mermaidCode);
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2500);
  };

  return (
    <div id="technical-architecture-diagram" className="space-y-6">
      {/* Top Banner / Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Full-Stack Enterprise Technical Architecture Specification</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>VEMAR Multi-Tier Neural & Pre-Trade Architecture</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                SLA &lt; 380ms
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Interactive architectural schematic illustrating real-time multi-modal ingest, Google Cloud streaming backbone, 5-Pillar neural forensic scoring, and sub-18ms FIX 4.4 pre-trade order quarantine.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto">
            {/* Jurisdiction Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => onSelectJurisdiction?.('IN')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isIndia
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇮🇳</span>
                <span>SEBI / NSE</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectJurisdiction?.('GLOBAL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  !isIndia
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇺🇸</span>
                <span>SEC / NYSE</span>
              </button>
            </div>

            {/* Simulation Trigger Button */}
            <button
              type="button"
              disabled={isSimulating}
              onClick={handleSimulatePipeline}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-2 transition-all shadow-md ${
                isSimulating
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/20 active:scale-95'
              }`}
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                  <span>Tracing Signal ({simulationStep}/6)...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Animate Signal Trace</span>
                </>
              )}
            </button>

            {/* Copy Mermaid Code */}
            <button
              type="button"
              onClick={handleCopyMermaid}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Copy GitHub Mermaid diagram markdown"
            >
              {copiedMermaid ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Mermaid Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Mermaid</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-800 pt-3 text-xs">
          <button
            type="button"
            onClick={() => setActiveView('diagram')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'diagram'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Node Topology</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('latency')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'latency'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Latency SLA Waterfall (267ms vs 380ms)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('matrix')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'matrix'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Protocol & Security Matrix</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. VIEW: INTERACTIVE NODE TOPOLOGY                                   */}
      {/* ==================================================================== */}
      {activeView === 'diagram' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Diagram Area (Left 8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Tier 1: Ingestion */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                    Tier 1: Multi-Modal Ingestion & Edge Gateways
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Sub-15ms Ingress
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'node_ingress_audio', label: '🎙️ Telephony VoIP', sub: '16kHz Audio Chunks' },
                  { id: 'node_ingress_market', label: '⚡ Exchange Ticks', sub: 'FIX Drop-Copy 35=D' },
                  { id: 'node_ingress_filings', label: '📜 Disclosures', sub: isIndia ? 'SEBI / BSE RSS' : 'SEC EDGAR 8-K' },
                  { id: 'node_ingress_social', label: '📡 Social Syndicates', sub: '1,200+ Channels' }
                ].map((item) => {
                  const isSelected = activeNodeId === item.id;
                  const isCurrentSim = isSimulating && simulationStep === 1 && item.id === 'node_ingress_audio';
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNodeId(item.id)}
                      className={`p-3 rounded-xl text-left border transition-all relative ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                      } ${isCurrentSim ? 'ring-2 ring-amber-400 bg-amber-500/20' : ''}`}
                    >
                      <div className="text-xs font-bold text-white truncate">{item.label}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">{item.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Connecting Flow Indicator */}
            <div className="flex justify-center items-center gap-2 py-1 text-slate-500 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <ArrowRight className="w-3.5 h-3.5 rotate-90 text-cyan-400 animate-pulse" />
              <span className="text-[10px] text-cyan-400 font-bold">Partitioned Streaming Queue (&lt; 12ms ACK)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>

            {/* Tier 2: Streaming & Temporal Backbone */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                    Tier 2: Event Streaming Backbone (Google Cloud Core)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  250,000+ msgs/sec
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'node_pubsub', label: '☁️ Google Cloud Pub/Sub', sub: 'High-Throughput Partitioned Bus (<12ms)' },
                  { id: 'node_dataflow', label: '🌊 Google Cloud Dataflow', sub: 'Apache Beam 30s Tumbling Windows' }
                ].map((item) => {
                  const isSelected = activeNodeId === item.id;
                  const isCurrentSim = isSimulating && simulationStep === 2 && item.id === 'node_pubsub';
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveNodeId(item.id)}
                      className={`p-3.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-blue-500/15 border-blue-400 shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                      } ${isCurrentSim ? 'ring-2 ring-amber-400 bg-amber-500/20' : ''}`}
                    >
                      <div className="text-xs font-bold text-white truncate">{item.label}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">{item.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Connecting Flow Indicator */}
            <div className="flex justify-center items-center gap-2 py-1 text-slate-500 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <ArrowRight className="w-3.5 h-3.5 rotate-90 text-purple-400 animate-pulse" />
              <span className="text-[10px] text-purple-400 font-bold">Vertex AI Dedicated NVIDIA L4 Model Endpoints</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>

            {/* Tier 3: 5-Pillar VEMAR Neural Processing Matrix */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 border border-purple-900/40 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-200">
                    Tier 3: The 5-Pillar VEMAR Neural Matrix (Vertex AI)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                  99.4% Precision
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'node_neural_v', letter: 'V', label: 'Voice Biometrics', time: '42ms', model: 'RawNet3 + WavLM' },
                  { id: 'node_neural_e', letter: 'E', label: 'Entity Provenance', time: '18ms', model: 'C2PA + PKI HSM' },
                  { id: 'node_neural_m', letter: 'M', label: 'Media Forensics', time: '115ms', model: 'ResNet STT Transformer' },
                  { id: 'node_neural_a', letter: 'A', label: 'Abuse Radar', time: '64ms', model: 'GCN + FinBERT' },
                  { id: 'node_neural_r', letter: 'R', label: 'Pre-Trade Halt', time: '16ms', model: 'FIX 4.4 Engine' }
                ].map((p) => {
                  const isSelected = activeNodeId === p.id;
                  const isCurrentSim =
                    isSimulating &&
                    ((simulationStep === 3 && p.id === 'node_neural_v') ||
                      (simulationStep === 4 && p.id === 'node_neural_a') ||
                      (simulationStep === 5 && p.id === 'node_neural_r'));
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveNodeId(p.id)}
                      className={`p-3 rounded-xl text-left border transition-all relative ${
                        isSelected
                          ? 'bg-purple-500/20 border-purple-400 shadow-md shadow-purple-500/20 ring-1 ring-purple-400'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      } ${isCurrentSim ? 'ring-2 ring-amber-400 bg-amber-500/20' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="w-5 h-5 rounded bg-purple-500/20 text-purple-300 font-mono font-black text-xs flex items-center justify-center">
                          {p.letter}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold">{p.time}</span>
                      </div>
                      <div className="text-xs font-bold text-white leading-tight">{p.label}</div>
                      <div className="text-[9px] font-mono text-slate-400 mt-1 truncate">{p.model}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Connecting Flow Indicator */}
            <div className="flex justify-center items-center gap-2 py-1 text-slate-500 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <ArrowRight className="w-3.5 h-3.5 rotate-90 text-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold">Parallel Persistence & Pre-Trade Interception</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>

            {/* Tier 4 & 5: Persistence & Containment (Split Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tier 4: Sovereign Persistence */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Tier 4: Storage & Vectors</span>
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">7-Yr WORM</span>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'node_db_pgvector', label: '🗄️ Cloud SQL (pgvector)', desc: 'Sub-4ms vector search' },
                    { id: 'node_db_bigquery', label: '📊 BigQuery Lakehouse', desc: 'Petabyte audit mining' },
                    { id: 'node_db_worm', label: '🔒 Cloud Storage WORM', desc: 'Immutable SEC/SEBI legal proof' }
                  ].map((db) => {
                    const isSelected = activeNodeId === db.id;
                    return (
                      <button
                        key={db.id}
                        type="button"
                        onClick={() => setActiveNodeId(db.id)}
                        className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 shadow ring-1 ring-cyan-400'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{db.label}</div>
                        <div className="text-[10px] font-mono text-slate-400">{db.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tier 5: Containment & Regulatory Dispatch */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tier 5: Pre-Trade Interception</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">&lt; 18ms Halt</span>
                </div>

                <div className="space-y-2">
                  {[
                    { id: 'node_neural_r', label: '🛑 FIX 4.4 Order Halt', desc: 'Tag 35=D quarantine' },
                    { id: 'node_egress_reg', label: isIndia ? '🏛️ SEBI SCORES 2.0' : '🏛️ SEC Form TCR XML', desc: 'Automated statutory dossier' },
                    { id: 'node_egress_siem', label: '🛡️ Enterprise SIEM Syslog', desc: 'RFC 5424 CEF to Splunk' }
                  ].map((c) => {
                    const isSelected = activeNodeId === c.id;
                    const isCurrentSim = isSimulating && simulationStep === 6 && c.id === 'node_egress_reg';
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveNodeId(c.id)}
                        className={`w-full p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-400 shadow ring-1 ring-emerald-400'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        } ${isCurrentSim ? 'ring-2 ring-amber-400 bg-amber-500/20' : ''}`}
                      >
                        <div className="text-xs font-bold text-white">{c.label}</div>
                        <div className="text-[10px] font-mono text-slate-400">{c.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Inspector Drawer (Right 4 Cols) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Terminal className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-400">Component Inspector</div>
                    <div className="text-sm font-bold text-white leading-tight">{activeNode.name}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {activeNode.category}
                </span>
              </div>

              {/* Metric Chips */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Processing Latency</div>
                  <div className="text-sm font-black text-cyan-400 font-mono mt-0.5">{activeNode.latency}</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Protocol / Wire</div>
                  <div className="text-xs font-bold text-emerald-400 truncate mt-0.5">{activeNode.protocol}</div>
                </div>
              </div>

              {/* Tech Stack & Compliance */}
              <div className="space-y-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono block">Infrastructure Stack</span>
                  <span className="font-semibold text-slate-200">{activeNode.techStack}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-mono block">Regulatory Compliance Standard</span>
                  <span className="font-semibold text-amber-300">{activeNode.compliance}</span>
                </div>
              </div>

              {/* Functional Description */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 font-mono block">Operational Role & Function</span>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {activeNode.description}
                </p>
              </div>

              {/* Sample Wire Payload */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Live Wire Payload Sample</span>
                  <span className="text-cyan-400">JSON / FIX / Proto</span>
                </div>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-44 scrollbar-thin">
                  {activeNode.samplePayload}
                </pre>
              </div>
            </div>

            <div className="pt-2 text-[10px] font-mono text-slate-500 text-center border-t border-slate-800">
              Click any node across Tiers 1–5 to inspect live engineering telemetry
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. VIEW: LATENCY SLA WATERFALL                                       */}
      {/* ==================================================================== */}
      {activeView === 'latency' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Deterministic Latency Budget Allocation
              </span>
              <h4 className="text-lg font-bold text-white mt-1">Pre-Trade Execution Interception Budget: 380 ms SLA</h4>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-bold">
                Actual Total: 267 ms
              </span>
              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-xl font-bold">
                Headroom Margin: 113 ms (29.7%)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { stage: 'Ingestion & Queue ACK (Pub/Sub)', budget: 30, actual: 12, pct: 3.1, color: 'bg-cyan-400' },
              { stage: 'Pillar V: Acoustic Anti-Spoofing (RawNet3)', budget: 60, actual: 42, pct: 11.0, color: 'bg-blue-400' },
              { stage: 'Pillar E: Registry & C2PA Verifier', budget: 30, actual: 18, pct: 4.7, color: 'bg-teal-400' },
              { stage: 'Pillar M: Video STT & Viseme Flow', budget: 140, actual: 115, pct: 30.2, color: 'bg-purple-400' },
              { stage: 'Pillar A: Social Swarm & GCN Radar', budget: 90, actual: 64, pct: 16.8, color: 'bg-indigo-400' },
              { stage: 'Pillar R: FIX 4.4 Tag 35=D Order Halt', budget: 30, actual: 16, pct: 4.2, color: 'bg-emerald-400' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200">{item.stage}</span>
                  <div className="font-mono text-[11px] space-x-3">
                    <span className="text-slate-400">Budget: {item.budget}ms</span>
                    <span className="text-emerald-400 font-bold">Actual: {item.actual}ms</span>
                  </div>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 flex">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${(item.actual / 380) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Why the Sub-380ms Latency SLA is the Definitive Capital Markets Moat</span>
            </div>
            <p className="leading-relaxed">
              Standard post-trade regulatory reporting (T+1 or T+2) allows spoofed algorithmic orders and synthetic voice clone instructions to match, clear, and settle, causing irrecoverable capital losses. VEMAR AI operates directly inside the pre-execution order lifecycle, quarantining orders via FIX Tag 35=D before the exchange matching engine commits the transaction.
            </p>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. VIEW: PROTOCOL & SECURITY SPECIFICATION MATRIX                    */}
      {/* ==================================================================== */}
      {activeView === 'matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Comprehensive Wire Protocol & Security Specification
            </h4>
            <span className="text-xs font-mono text-slate-400">RFC / FIPS / ISO 27001 Certified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Pipeline Tier</th>
                  <th className="py-3 px-4">Wire Protocol</th>
                  <th className="py-3 px-4">Encryption & Handshake</th>
                  <th className="py-3 px-4">Throughput Capacity</th>
                  <th className="py-3 px-4">Statutory Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white font-sans">Voice / Audio Telephony</td>
                  <td className="py-3 px-4 text-cyan-400">SIP / RTP / WebRTC (Opus)</td>
                  <td className="py-3 px-4">SRTP + TLS 1.3</td>
                  <td className="py-3 px-4">10,000 concurrent calls</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">SEBI CSCRF 2024 / FINRA 4511</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white font-sans">Exchange Order Ingress</td>
                  <td className="py-3 px-4 text-emerald-400">FIX Protocol 4.4 / FAST</td>
                  <td className="py-3 px-4">Direct Colocation Cross-Connect</td>
                  <td className="py-3 px-4">150,000 orders/sec</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">NSE / BSE / NYSE FIX Specs</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white font-sans">Google Cloud Pub/Sub</td>
                  <td className="py-3 px-4 text-blue-400">gRPC over HTTP/2</td>
                  <td className="py-3 px-4">mTLS 1.3 + CMEK</td>
                  <td className="py-3 px-4">250,000+ msgs/sec</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">SOC2 Type II / MeitY Empanelled</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white font-sans">Cryptographic HSM Signing</td>
                  <td className="py-3 px-4 text-purple-400">C2PA v1.3 / PKCS#11</td>
                  <td className="py-3 px-4">FIPS 140-3 Level 3 HSM</td>
                  <td className="py-3 px-4">5,000 signatures/sec</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">W3C Media Provenance Standard</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white font-sans">Pre-Trade FIX Order Halt</td>
                  <td className="py-3 px-4 text-emerald-400">FIX 4.4 Tag 35=D / 39=8</td>
                  <td className="py-3 px-4">Sub-millisecond direct socket</td>
                  <td className="py-3 px-4">&lt; 16 ms execution</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">SEC Rule 15c3-5 Market Access</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white font-sans">Regulatory Dossier Filing</td>
                  <td className="py-3 px-4 text-amber-400">REST JSON / SOAP XML</td>
                  <td className="py-3 px-4">mTLS 1.3 Certificate Bound</td>
                  <td className="py-3 px-4">Instant Batch & Real-time</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">SEBI SCORES 2.0 / SEC Form TCR</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
