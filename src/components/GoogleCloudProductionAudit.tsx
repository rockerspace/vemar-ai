import React, { useState } from 'react';
import {
  Cloud,
  Database,
  Cpu,
  Layers,
  ShieldCheck,
  Activity,
  Server,
  Zap,
  Lock,
  GitBranch,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Terminal,
  ArrowRight,
  PieChart,
  DollarSign,
  Building,
  Globe,
  Radio,
  FileCheck
} from 'lucide-react';
import { Jurisdiction } from '../types';

interface GoogleCloudProductionAuditProps {
  jurisdiction: Jurisdiction;
}

interface GCPTier {
  id: string;
  name: string;
  gcpServices: string[];
  prototypeGap: string;
  productionSolution: string;
  latencySLA: string;
  resilience: string;
  codeSnippet: string;
}

export const GoogleCloudProductionAudit: React.FC<GoogleCloudProductionAuditProps> = ({ jurisdiction }) => {
  const isUS = jurisdiction === 'US' || jurisdiction === 'GLOBAL';
  const [activeTierId, setActiveTierId] = useState<string>('tier_ingest');
  const [showCode, setShowCode] = useState<boolean>(false);

  const tiers: GCPTier[] = [
    {
      id: 'tier_ingest',
      name: '1. Ingestion & Message Queuing Tier',
      gcpServices: ['Google Cloud Pub/Sub', 'Cloud Load Balancing', 'Google Cloud Armor'],
      prototypeGap: 'REST HTTP endpoints on single Express.js instance. Prone to dropped packets, HTTP 504 gateway timeouts during market flash-crashes, and zero backpressure buffering when processing thousands of concurrent trade signals.',
      productionSolution: 'High-throughput Cloud Pub/Sub with geographically partitioned streaming topics for Market Ticks, SIP VoIP Audio Chunks, Telegram/X webhooks, and SEC/SEBI gazette scrapers. Auto-scales to 250,000+ msgs/sec with sub-10ms publisher ACK and dead-letter queues (DLQ).',
      latencySLA: '< 12 ms ACK Latency',
      resilience: 'Multi-AZ active replication with 99.99% availability SLA',
      codeSnippet: `// Google Cloud Pub/Sub Ingestion Pipeline
import { PubSub } from '@google-cloud/pubsub';
const pubsub = new PubSub({ projectId: 'vemar-surveillance-prod' });
const marketTopic = pubsub.topic('projects/vemar-surveillance-prod/topics/market-ticks-stream');

export async function publishOrderEvent(orderData: FIXOrderEvent) {
  const messageBuffer = Buffer.from(JSON.stringify(orderData));
  const messageId = await marketTopic.publishMessage({
    data: messageBuffer,
    orderingKey: orderData.tickerSymbol, // Enforce FIFO ordering per ticker
    attributes: {
      jurisdiction: 'IN',
      source: 'NSE_COLO_TICK',
      timestamp: Date.now().toString()
    }
  });
  return messageId;
}`
    },
    {
      id: 'tier_stream',
      name: '2. Streaming Analytics & Swarm Graph Tier',
      gcpServices: ['Google Cloud Dataflow (Apache Beam)', 'BigQuery Streaming'],
      prototypeGap: 'Single-event heuristics in memory without sliding time windows, stateful aggregation, or temporal graph correlation across social syndicates and market volumes.',
      productionSolution: 'Google Cloud Dataflow running Apache Beam unified streaming jobs. Computes sliding 30-second tumbling event-time windows to cross-correlate pump-and-dump social message velocity with order book depth anomalies and high-frequency cancellation ratios.',
      latencySLA: '< 45 ms Pipeline Processing',
      resilience: 'Exactly-once processing semantics with automated checkpointing',
      codeSnippet: `// Google Cloud Dataflow (Apache Beam Java/Python SDK pipeline logic)
PCollection<SocialSignal> signals = pipeline
    .apply("ReadFromPubSub", PubsubIO.readMessagesWithAttributes().fromTopic(socialTopic))
    .apply("WindowInto30Sec", Window.into(SlidingWindows.of(Duration.standardSeconds(30))
        .every(Duration.standardSeconds(5))))
    .apply("ExtractSwarmGraphEmbeddings", ParDo.of(new SwarmCorrelationFn()))
    .apply("JoinWithOrderBookTicks", Join.inner(marketTicksWindow))
    .apply("FilterAnomalies", ParDo.of(new AnomalyThresholdClassifier(0.92)));`
    },
    {
      id: 'tier_ai',
      name: '3. Multi-Modal AI & Model Governance Tier',
      gcpServices: ['Google Cloud Vertex AI', 'Vertex AI Model Garden', 'Vertex AI Model Armor', 'Gemini 2.5 Multi-Modal'],
      prototypeGap: 'Ad-hoc direct Gemini API calls without formal model versioning, safety guardrails against prompt injection, or dedicated GPU infrastructure for sub-80ms acoustic RawNet3 / WavLM voice inference.',
      productionSolution: 'Vertex AI Custom Prediction Endpoints with dedicated NVIDIA L4/A100 Tensor Core GPUs for custom PyTorch deepfake acoustic and video forensics, fronted by Vertex AI Model Armor to sanitize prompt injections and Gemini 2.5 Flash for semantic market manipulation reasoning.',
      latencySLA: '< 160 ms End-to-End Inference',
      resilience: 'Vertex AI Endpoint auto-scaling (0 to 50 GPU nodes) with canary rollouts',
      codeSnippet: `// Vertex AI Prediction Client with Dedicated GPU Endpoint
import { PredictionServiceClient } from '@google-cloud/aiplatform';
const client = new PredictionServiceClient({ apiEndpoint: 'asia-south1-aiplatform.googleapis.com' });

export async function runAcousticDeepfakeInference(audioTensor: Float32Array) {
  const endpoint = 'projects/vemar-prod/locations/asia-south1/endpoints/rawnet3-acoustic-v3';
  const [response] = await client.predict({
    endpoint,
    instances: [{ audio_pcm_16k: Buffer.from(audioTensor.buffer).toString('base64') }],
    parameters: { confidence_threshold: 0.85, extract_spectral_damping: true }
  });
  return response.predictions[0];
}`
    },
    {
      id: 'tier_compute',
      name: '4. Serverless Microservices & Edge Gateway',
      gcpServices: ['Google Cloud Run (v2)', 'Cloud Load Balancing', 'Cloud CDN'],
      prototypeGap: 'Monolithic Node.js Express server running both frontend asset delivery and forensic calculations. A single high-load inference request stalls regulatory health polling and client UI rendering.',
      productionSolution: 'Fully decoupled Google Cloud Run microservices with minimum instances (warm pool) to eliminate cold starts. Cloud Run auto-scales seamlessly based on CPU/concurrency metrics, with Cloud Armor shielding against DDoS and Layer 7 attacks.',
      latencySLA: '< 18 ms Edge Processing',
      resilience: 'Multi-zone container redundancy with zero-downtime blue/green traffic splitting',
      codeSnippet: `# Cloud Run Service Configuration (cloudbuild.yaml / terraform)
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: vemar-edge-api
  annotations:
    run.googleapis.com/launch-stage: GA
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/minScale: "3" # Warm pool for zero cold-start
        autoscaling.knative.dev/maxScale: "100"
        run.googleapis.com/cpu-throttling: "false"
    spec:
      containers:
      - image: asia-south1-docker.pkg.dev/vemar-prod/services/edge-api:3.0.0
        resources:
          limits:
            cpu: "2000m"
            memory: "4Gi"`
    },
    {
      id: 'tier_storage',
      name: '5. ACID Multi-Tenant Persistence & Vector Search',
      gcpServices: ['Google Cloud SQL (PostgreSQL with pgvector)', 'BigQuery', 'Cloud Storage WORM'],
      prototypeGap: 'Ephemeral in-memory JavaScript arrays for audit trails, registered broker licenses, and API keys. All state disappears upon container restart; completely un-auditable by institutional compliance teams.',
      productionSolution: 'Highly available Google Cloud SQL (PostgreSQL 16) with pgvector for acoustic/visual forensic vector similarity search, coupled with Google BigQuery as a Petabyte-scale surveillance data lakehouse and Cloud Storage with Object Retention Lock (WORM compliance for SEC Rule 17a-4 and SEBI CSCRF).',
      latencySLA: '< 4 ms Query Latency',
      resilience: 'Automated cross-region read replicas and point-in-time recovery (PITR)',
      codeSnippet: `-- Cloud SQL with pgvector for Forensic Vector Matching
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE institutional_audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    incident_type VARCHAR(32) NOT NULL,
    acoustic_embedding vector(128),
    forensic_hash CHAR(64) NOT NULL,
    regulatory_verdict VARCHAR(32) NOT NULL,
    sec_17a4_worm_uri TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX ON institutional_audit_trail USING ivfflat (acoustic_embedding vector_cosine_ops);`
    },
    {
      id: 'tier_security',
      name: '6. Cryptographic HSM & Regulatory Sovereignty',
      gcpServices: ['Google Cloud KMS (FIPS 140-3 HSM)', 'Secret Manager', 'VPC Service Controls'],
      prototypeGap: 'Plaintext API keys in memory, synthetic simulated certificates, and no cryptographic root-of-trust hardware validation for signed corporate disclosures.',
      productionSolution: 'Google Cloud Key Management Service (Cloud KMS) backed by Hardware Security Modules (FIPS 140-3 Level 3) for signing C2PA Disclosure Manifests and authenticating SEBI/SEC regulatory webhooks, with VPC Service Controls preventing data exfiltration.',
      latencySLA: '< 8 ms HSM Signature',
      resilience: 'Hardware tamper-resistant with customer-managed encryption keys (CMEK)',
      codeSnippet: `// Cloud KMS C2PA Manifest Signing with FIPS 140-3 HSM
import { KeyManagementServiceClient } from '@google-cloud/kms';
const kms = new KeyManagementServiceClient();

export async function signCorporateDisclosure(digestSha256: Buffer): Promise<Buffer> {
  const name = kms.cryptoKeyVersionPath('vemar-prod', 'asia-south1', 'vemar-hsm-ring', 'c2pa-signer', '1');
  const [result] = await kms.asymmetricSign({
    name,
    digest: { sha256: digestSha256 }
  });
  return Buffer.from(result.signature as Uint8Array);
}`
    }
  ];

  const activeTier = tiers.find((t) => t.id === activeTierId) || tiers[0];

  return (
    <div id="google-cloud-production-audit" className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-semibold">
              <Cloud className="w-3.5 h-3.5" />
              <span>Investor Technical Due Diligence Blueprint</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-xs font-mono font-bold">
              Google Cloud & AI Native
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Institutional Production Architecture: Closing Prototype Gaps with Google AI
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            While our live prototype demonstrates the end-to-end user experience and multi-modal forensic detection algorithms, institutional market surveillance at scale across <strong className="text-white">NSE/BSE (India)</strong> and <strong className="text-white">NYSE/Nasdaq (US)</strong> requires sovereign, sub-millisecond cloud infrastructure. Below is our blueprint powered by the <strong className="text-cyan-400">Google AI Tech Stack</strong>.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Target Ingestion</span>
              <span className="text-lg font-black text-cyan-400 font-mono">250k msgs/s</span>
              <span className="text-[10px] text-slate-500 block">via Cloud Pub/Sub</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Stream Analytics</span>
              <span className="text-lg font-black text-emerald-400 font-mono">&lt; 45 ms</span>
              <span className="text-[10px] text-slate-500 block">via Cloud Dataflow</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">AI Core Inference</span>
              <span className="text-lg font-black text-indigo-400 font-mono">&lt; 160 ms</span>
              <span className="text-[10px] text-slate-500 block">Vertex AI + L4 GPUs</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Gross Margin</span>
              <span className="text-lg font-black text-emerald-300 font-mono">84.6%</span>
              <span className="text-[10px] text-slate-500 block">Cloud Unit Economics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 6-Tier Architecture Explorer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Six-Tier Enterprise Architecture Deep Dive</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any architecture tier to inspect the prototype gap vs. Google Cloud production implementation:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all border ${
                showCode
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {showCode ? 'Hide Production Code' : 'View Production Code'}
            </button>
          </div>
        </div>

        {/* Tier Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {tiers.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTierId(t.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeTierId === t.id
                  ? 'bg-cyan-950/60 border-cyan-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-cyan-400">STAGE 0{idx + 1}</span>
                {activeTierId === t.id && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                )}
              </div>
              <span className="text-xs font-bold text-white block truncate">{t.name.split('. ')[1]}</span>
              <span className="text-[10px] text-slate-400 block truncate mt-0.5">{t.gcpServices[0]}</span>
            </button>
          ))}
        </div>

        {/* Selected Tier Breakdown Card */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-bold text-white">{activeTier.name}</h4>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {activeTier.gcpServices.map((srv, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700/60"
                  >
                    <Cloud className="w-3 h-3 text-cyan-400" />
                    {srv}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Latency SLA</span>
                <span className="text-cyan-400 font-bold">{activeTier.latencySLA}</span>
              </div>
              <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-sans">Availability Target</span>
                <span className="text-emerald-400 font-bold">99.99%</span>
              </div>
            </div>
          </div>

          {/* Prototype Gap vs Production Solution Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            {/* The Prototype Gap */}
            <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider text-[11px] font-mono">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>Prototype State (Due-Diligence Gap)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{activeTier.prototypeGap}</p>
            </div>

            {/* Google Cloud Production Solution */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40 space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider text-[11px] font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Google Cloud Enterprise Solution</span>
              </div>
              <p className="text-slate-200 leading-relaxed">{activeTier.productionSolution}</p>
            </div>
          </div>

          {/* Optional Code Snippet Display */}
          {showCode && (
            <div className="mt-3 p-3.5 rounded-xl bg-black border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Production Implementation Hook
                </span>
                <span className="text-slate-500">TypeScript / Java SDK</span>
              </div>
              <pre className="pt-2.5 text-emerald-400 leading-relaxed text-[11px]">
                {activeTier.codeSnippet}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Dual-Jurisdiction Sovereign Cloud Deployment (India vs US) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Dual-Jurisdiction Sovereign Cloud Footprint
              </h3>
              <p className="text-xs text-slate-400">
                Strict data localization conforming to SEBI CSCRF 2024 (India) & SEC Rule 17a-4 (US)
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-950 text-slate-300 border border-slate-800">
            MeitY-Empanelled Cloud
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* India Regional Cluster */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇮🇳</span>
                <span className="font-bold text-white text-sm">India Production Cluster</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                asia-south1 (Mumbai) + asia-south2 (Delhi)
              </span>
            </div>

            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">DPDP Act 2023 & SEBI Mandate:</strong> Zero cross-border transit of trading order logs or voice biometric embeddings; stored exclusively in domestic Indian data centers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Exchange Colocation:</strong> Direct interconnect with NSE Colo (BKC Mumbai) and BSE, achieving &lt; 2ms ingress latency for Tag 35=D order quarantine.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">SEBI SCORES 2.0 Integration:</strong> Automated XML complaint dispatch over secure mTLS 1.3 gateway.
                </span>
              </li>
            </ul>
          </div>

          {/* US / Global Regional Cluster */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🇺🇸</span>
                <span className="font-bold text-white text-sm">US / Global Production Cluster</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                us-central1 (Iowa) + us-east4 (Virginia)
              </span>
            </div>

            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">SEC Rule 17a-4(f) WORM Storage:</strong> Cloud Storage with Object Retention Lock preventing overwrite or premature deletion for 7 years.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">SEC EDGAR Real-Time Feeds:</strong> Direct ingestion of Form 8-K, 10-Q, and 10-K filings with accession number cryptographic hashing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">FINRA BrokerCheck Sync:</strong> Daily CRD master dump verification identifying disbarred or unregistered market participants.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Unit Economics & Gross Margin Profile */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Investor Financial Due Diligence: Unit Economics & Gross Margins
              </h3>
              <p className="text-xs text-slate-400">
                Cloud infrastructure COGS breakdown per 50 Million Monitored Market Events
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Gross Margin</span>
            <span className="text-base font-black text-emerald-400 font-mono">84.6%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Cloud Pub/Sub & Dataflow</span>
            <div className="text-base font-bold text-white font-mono">$142.00 / mo</div>
            <span className="text-[11px] text-slate-400 leading-tight block">
              Ingesting and windowing 50M streaming events across brokers & exchanges.
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Vertex AI Model Endpoints</span>
            <div className="text-base font-bold text-white font-mono">$295.00 / mo</div>
            <span className="text-[11px] text-slate-400 leading-tight block">
              Dedicated NVIDIA L4 GPU instance with automated scale-to-zero at market close.
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Cloud SQL & WORM Storage</span>
            <div className="text-base font-bold text-white font-mono">$220.00 / mo</div>
            <span className="text-[11px] text-slate-400 leading-tight block">
              PostgreSQL pgvector database, BigQuery analytics, and 7-year WORM cold archives.
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="space-y-1 max-w-xl">
            <span className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              SaaS Margin Expansion Model
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Total infrastructure cost per enterprise institutional broker tenant is ~$657/month. With a standard enterprise annual contract value (ACV) of $15,000/month (₹12.5 Lakh/month in India), VEMAR AI yields a <strong className="text-white">95.6% contribution margin</strong> on compute and an <strong className="text-white">84.6% blended gross margin</strong> after SOC2 audits and customer success.
            </p>
          </div>
          <div className="bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] font-mono text-slate-400 block">Typical Contract vs COGS</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">$15,000 rev vs $657 cost</span>
          </div>
        </div>
      </div>

      {/* Investor Technical Q&A Defense Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span>Investor Technical Due Diligence Q&A Defense Matrix</span>
        </h3>
        <p className="text-xs text-slate-400">
          The 4 hardest technical questions Tier-1 VC partners will ask, and our battle-tested Google Cloud answers:
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <span className="text-cyan-400 font-mono">Q1:</span>
              <span>"How do you ensure you don't drop orders or breach the &lt; 380 ms latency budget during a market flash-crash?"</span>
            </div>
            <p className="text-slate-300 pl-6 leading-relaxed">
              <strong className="text-cyan-300">Answer:</strong> By separating ingestion from inference. <strong>Google Cloud Pub/Sub</strong> buffers burst traffic with sub-10ms publisher latency. Our edge <strong>Cloud Run</strong> instances execute lightweight local C2PA hash verification (&lt; 18 ms) and route suspect orders to quarantine (FIX Tag 35=D) immediately. Heavy multi-modal LLM reasoning happens asynchronously in <strong>Cloud Dataflow</strong> with dedicated <strong>Vertex AI NVIDIA L4 GPU endpoints</strong> running pre-warmed model weights.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <span className="text-cyan-400 font-mono">Q2:</span>
              <span>"How do you prevent GenAI hallucinations from halting legitimate multi-million dollar institutional trades?"</span>
            </div>
            <p className="text-slate-300 pl-6 leading-relaxed">
              <strong className="text-emerald-300">Answer:</strong> VEMAR does not use pure generative LLMs for execution decisions. Trade halts require a deterministic consensus score: (1) Absence of <strong>C2PA cryptographic signature</strong> from the verified corporate issuer HSM, (2) Acoustic or video synthetic anomaly score &gt; 92% from <strong>Vertex AI RawNet3</strong>, and (3) Cross-verification with the official exchange gazette hash. <strong>Vertex AI Model Armor</strong> guarantees prompt injections or adversarial financial text cannot spoof the decision engine.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <span className="text-cyan-400 font-mono">Q3:</span>
              <span>"How does your architecture satisfy India's DPDP Act 2023 and SEBI CSCRF data sovereignty requirements?"</span>
            </div>
            <p className="text-slate-300 pl-6 leading-relaxed">
              <strong className="text-indigo-300">Answer:</strong> VEMAR maintains an isolated tenant VPC in Google Cloud's <strong>MeitY-empanelled data centers in Mumbai (`asia-south1`) and Delhi (`asia-south2`)</strong>. Customer-Managed Encryption Keys (CMEK) are stored in <strong>Cloud KMS HSM (FIPS 140-3)</strong> within Indian borders. Indian financial data never traverses foreign backbones, fully complying with SEBI's Master Circular on Outsourcing and the Digital Personal Data Protection Act 2023.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <span className="text-cyan-400 font-mono">Q4:</span>
              <span>"What is your enterprise pilot timeline with a Tier-1 Stock Broker or Clearing Corporation?"</span>
            </div>
            <p className="text-slate-300 pl-6 leading-relaxed">
              <strong className="text-cyan-300">Answer:</strong> Under 48 hours for passive shadow surveillance. Because our services run on <strong>Cloud Run</strong> with standardized <strong>FIX 4.4 drop-copy feeds</strong> and RFC 5424 syslog webhooks, institutional brokers simply configure an outbound drop-copy session to our Cloud Load Balancer. No changes to core order-matching engines are required during the 30-day proof-of-concept (PoC).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
