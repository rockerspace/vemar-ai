import React, { useState } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Shield,
  Layers,
  Zap,
  TrendingUp,
  Cpu,
  FileCheck,
  Building,
  DollarSign,
  Scale,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
  Cloud
} from 'lucide-react';
import { Jurisdiction } from '../types';
import { GoogleCloudProductionAudit } from './GoogleCloudProductionAudit';

interface VemarGapAnalysisProps {
  jurisdiction: Jurisdiction;
  onNavigateToPitch?: () => void;
  onNavigateToArchitecture?: () => void;
  onNavigateToScanner?: () => void;
}

interface GapItem {
  id: string;
  gapTitle: string;
  category: 'Latency' | 'Modality' | 'Cryptographic' | 'Execution' | 'Regulatory' | 'Audit';
  legacyApproach: string;
  vemarProductionSolution: string;
  impactScore: string;
  affectedParties: string;
  jurisdictionRelevance: 'BOTH' | 'IN' | 'US';
  productionStatus: 'SOLVED_PRODUCTION_GRADE' | 'ACTIVE_STANDARD';
}

export const VemarGapAnalysis: React.FC<VemarGapAnalysisProps> = ({
  jurisdiction,
  onNavigateToPitch,
  onNavigateToArchitecture
}) => {
  const [activeAnalysisMode, setActiveAnalysisMode] = useState<'GOOGLE_AI_STACK' | 'INDUSTRY_GAPS'>('GOOGLE_AI_STACK');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CRITICAL' | 'REGULATORY'>('ALL');

  const gaps: GapItem[] = [
    {
      id: 'gap_latency',
      gapTitle: 'Pre-Trade Sub-Second Interception vs. T+1 Post-Trade Alerting',
      category: 'Latency',
      legacyApproach: 'Traditional trade surveillance (e.g. SMARTS, NICE Actimize) ingests trade logs in end-of-day batches or T+1 reconciliations. By the time an alert triggers, fraudulent synthetic media has already triggered flash-crashes and funds are drained.',
      vemarProductionSolution: 'VEMAR AI operates directly in-line with an end-to-end p99 latency SLA under 380 ms, intercepting spoofed corporate press releases, audio calls, and deepfakes BEFORE order matching occurs.',
      impactScore: '99.4% Loss Mitigation',
      affectedParties: 'Institutional Prime Brokers, High-Frequency Trading Desks, Retail Depositories',
      jurisdictionRelevance: 'BOTH',
      productionStatus: 'SOLVED_PRODUCTION_GRADE'
    },
    {
      id: 'gap_voice_biometrics',
      gapTitle: 'Acoustic Voice Clone & Telephonic Vishing Blindspot',
      category: 'Modality',
      legacyApproach: 'Legacy surveillance monitors only structured trade tickets and plain-text emails. Call center recordings are archived in passive WORM stores with zero real-time biometric synthetic detection.',
      vemarProductionSolution: 'VEMAR Voice Engine (RawNet3 + WavLM) extracts 128-dimensional acoustic embeddings in real-time over SIP VoIP streams, detecting vocoder spectral artifacts, absence of vocal-tract damping, and prosodic flatness.',
      impactScore: 'Prevents Wire Diversion',
      affectedParties: 'Trading Desk Voice Brokers, Wealth Advisory Call Centers, Custodial Banks',
      jurisdictionRelevance: 'BOTH',
      productionStatus: 'SOLVED_PRODUCTION_GRADE'
    },
    {
      id: 'gap_cryptographic_provenance',
      gapTitle: 'Absence of Mathematical Source Verifiability for Disclosures',
      category: 'Cryptographic',
      legacyApproach: 'Press releases, circulars, and executive remarks circulate as plain PDFs or social posts without origin signatures, allowing forged announcements to mimic legitimate SEBI circulars or SEC 8-K filings.',
      vemarProductionSolution: 'Hardware-backed C2PA Manifest v1.3 cryptographic signing and real-time SHA-256 cross-referencing against verified exchange public key registries, creating an immutable cryptographic chain of custody.',
      impactScore: 'Zero False Positives',
      affectedParties: 'NSE/BSE Listed Corporate IR Desks, Stock Exchanges, SEC EDGAR Filers',
      jurisdictionRelevance: 'BOTH',
      productionStatus: 'SOLVED_PRODUCTION_GRADE'
    },
    {
      id: 'gap_fix_execution_halt',
      gapTitle: 'Passive Email Alerts vs. In-Line FIX Order Quarantine',
      category: 'Execution',
      legacyApproach: 'When an anomaly is flagged, legacy systems generate a ticket on a compliance officer dashboard. Human review takes 20 to 180 minutes while algorithmic bots execute hundreds of thousands of trades.',
      vemarProductionSolution: 'VEMAR Response Gateway hooks directly into institutional Order Management Systems (OMS) via FIX 4.4 protocol, dynamically routing suspected ticker orders (Tag 35=D) to quarantine in milliseconds.',
      impactScore: 'Sub-Millisecond Circuit Breaker',
      affectedParties: 'Exchange Clearing Corporations, Broker Risk Management Systems (RMS)',
      jurisdictionRelevance: 'BOTH',
      productionStatus: 'SOLVED_PRODUCTION_GRADE'
    },
    {
      id: 'gap_social_swarm_radar',
      gapTitle: 'Siloed Keyword Matching vs. Coordinated Swarm Detection',
      category: 'Modality',
      legacyApproach: 'Static dictionary keyword lists (e.g. "guaranteed", "profit") that are easily evaded by threat actors using obfuscated lingo, emojis, voice notes, and image-based charts.',
      vemarProductionSolution: 'Graph Convolutional Networks (GCN) that track cross-platform bot syndicates across Telegram, WhatsApp, and Discord, analyzing message velocity, network propagation graphs, and synthetic screenshot generators.',
      impactScore: 'Detects 89% More Syndicates',
      affectedParties: 'Retail Investors, SEBI Market Surveillance, FINRA Fraud Detection Operations',
      jurisdictionRelevance: 'BOTH',
      productionStatus: 'SOLVED_PRODUCTION_GRADE'
    },
    {
      id: 'gap_statutory_crossborder',
      gapTitle: 'Geographic Regulatory Silos vs. Dual-Jurisdiction Compliance',
      category: 'Regulatory',
      legacyApproach: 'Compliance tools are tailored exclusively to either US (SEC) or Indian (SEBI) regimes, leaving cross-listed securities, ADRs/GDRs, and global custodians vulnerable to regulatory arbitrage.',
      vemarProductionSolution: 'Unified dual-engine compliance mapping simultaneously checking SEBI PFUTP 2003 / Master Circulars and SEC Rule 10b-5 / FINRA Rule 2010, auto-generating localized regulatory filings (SCORES 2.0 / Form TCR).',
      impactScore: 'Dual-Market Cross Border',
      affectedParties: 'Global Custodians, Foreign Portfolio Investors (FPIs), Institutional Brokers',
      jurisdictionRelevance: 'BOTH',
      productionStatus: 'SOLVED_PRODUCTION_GRADE'
    },
    {
      id: 'gap_worm_audit_chain',
      gapTitle: 'Mutable Database Logs vs. WORM SEC 17a-4 / ISO 27001 Cryptographic Proof',
      category: 'Audit',
      legacyApproach: 'Audit trails are saved in mutable relational tables prone to administrative alteration or data leakage during internal insider trading investigations.',
      vemarProductionSolution: 'Cryptographic hash-linked immutable ledger strictly conforming to SEC Rule 17a-4(f) and SEBI Cybersecurity Framework, ensuring evidentiary chain of custody admissible in civil and criminal courts.',
      impactScore: 'Court-Admissible Evidence',
      affectedParties: 'Legal Counsel, Internal Audit Teams, Enforcement Regulators',
      jurisdictionRelevance: 'BOTH',
      productionStatus: 'SOLVED_PRODUCTION_GRADE'
    },
    {
      id: 'gap_enterprise_siem_extensibility',
      gapTitle: 'Closed Proprietary Black Boxes vs. Enterprise SIEM API Integration',
      category: 'Execution',
      legacyApproach: 'Monolithic legacy systems requiring multi-month custom consulting engagements and unable to stream structured alerts to modern SOCs (Splunk, Datadog, Sentinel).',
      vemarProductionSolution: 'Production-ready REST and WebSocket APIs with RFC 5424 CEF/LEEF syslog streaming, scoped API key tiering, and ready-to-deploy Python/TypeScript SDKs.',
      impactScore: 'Deploy in Under 48 Hours',
      affectedParties: 'Chief Information Security Officers (CISOs), Enterprise SOC Analysts',
      jurisdictionRelevance: 'BOTH',
      productionStatus: 'SOLVED_PRODUCTION_GRADE'
    }
  ];

  const filteredGaps = gaps.filter((g) => {
    if (selectedFilter === 'CRITICAL') {
      return g.category === 'Latency' || g.category === 'Execution' || g.category === 'Modality';
    }
    if (selectedFilter === 'REGULATORY') {
      return g.category === 'Regulatory' || g.category === 'Cryptographic' || g.category === 'Audit';
    }
    return true;
  });

  return (
    <div id="vemar-gap-analysis" className="space-y-8">
      {/* Top Level Audit Perspective Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 px-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Audit Perspective:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="audit-perspective-google-stack-btn"
            type="button"
            onClick={() => setActiveAnalysisMode('GOOGLE_AI_STACK')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeAnalysisMode === 'GOOGLE_AI_STACK'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Cloud className="w-4 h-4 text-cyan-300" />
            <span>Google Cloud AI Production Blueprint (Pub/Sub, Dataflow, Vertex AI, Cloud Run, Cloud SQL)</span>
          </button>
          <button
            id="audit-perspective-industry-gaps-btn"
            type="button"
            onClick={() => setActiveAnalysisMode('INDUSTRY_GAPS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeAnalysisMode === 'INDUSTRY_GAPS'
                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span>Market Surveillance Industry Gaps (8 Flaws)</span>
          </button>
        </div>
      </div>

      {activeAnalysisMode === 'GOOGLE_AI_STACK' ? (
        <GoogleCloudProductionAudit jurisdiction={jurisdiction} />
      ) : (
        <>
          {/* Overview Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Market Surveillance Gap Analysis & Production Readiness</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                The 8 Critical Industry Gaps Solved by VEMAR AI
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Legacy financial market surveillance was architected for a world of human brokers and slow paper disclosures. With generative AI weaponizing capital markets, legacy architectures exhibit fatal gaps. VEMAR AI closes every one with production-grade engineering.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onNavigateToArchitecture}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-sans flex items-center gap-2 transition-all shadow-md"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Inspect Neural Architecture</span>
                </button>

                <button
                  type="button"
                  onClick={onNavigateToPitch}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-sans flex items-center gap-2 border border-slate-700 transition-all"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Review Dual-Market Investor Pitch Decks</span>
                </button>
              </div>
            </div>
          </div>

      {/* Production Readiness Scorecard Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Latency Benchmark</span>
          <div className="text-2xl font-black text-cyan-400 font-mono flex items-center gap-2">
            &lt; 380 ms
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              p99 SLA
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            Compared to T+1 (24 hours) in legacy market surveillance.
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Precision / ROC-AUC</span>
          <div className="text-2xl font-black text-emerald-400 font-mono flex items-center gap-2">
            99.4%
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Gold Standard
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            FPR &lt; 0.06% prevents operational alert fatigue for trading desks.
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Compliance Certification</span>
          <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
            SEC & SEBI
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              Dual Regime
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            Conforms to SEC 17a-4, FINRA 4511, and SEBI MII Cyber Framework.
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase block">Execution Quarantine</span>
          <div className="text-2xl font-black text-cyan-300 font-mono flex items-center gap-2">
            FIX 4.4
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Pre-Trade
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block">
            Tag 35=D drop-copy order routing halt prevents flash-crash execution.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Filter Gap Matrices:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {(['ALL', 'CRITICAL', 'REGULATORY'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSelectedFilter(mode)}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                selectedFilter === mode
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'ALL' ? 'All 8 Gaps' : mode === 'CRITICAL' ? 'Critical Latency & Modality' : 'Regulatory & Audit'}
            </button>
          ))}
        </div>
      </div>

      {/* Gaps List */}
      <div className="space-y-4">
        {filteredGaps.map((gap, idx) => (
          <div
            key={gap.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    Category: {gap.category}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {gap.productionStatus === 'SOLVED_PRODUCTION_GRADE' ? 'PRODUCTION GRADE' : 'ACTIVE'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{gap.gapTitle}</h3>
              </div>

              <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-right">
                <span className="text-[10px] font-mono text-slate-400 block">VEMAR Advantage</span>
                <span className="text-xs font-bold text-cyan-400 font-mono block">{gap.impactScore}</span>
              </div>
            </div>

            {/* Side-by-Side Comparison Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Legacy Approach */}
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/30 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-wider text-[10px] font-mono">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>The Legacy Industry Gap</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{gap.legacyApproach}</p>
              </div>

              {/* VEMAR Production Grade Solution */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-[10px] font-mono">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>VEMAR Production Architecture Solution</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{gap.vemarProductionSolution}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-slate-500">Affected Institutional Stakeholders: </span>
                <span className="text-slate-300 font-medium">{gap.affectedParties}</span>
              </div>
              <div className="font-mono text-cyan-300">
                Jurisdiction: {gap.jurisdictionRelevance === 'BOTH' ? 'Global (US SEC + India SEBI)' : gap.jurisdictionRelevance}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</div>
);
};
