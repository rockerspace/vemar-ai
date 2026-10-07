import React, { useState } from 'react';
import {
  ShieldCheck,
  Building,
  Scale,
  Copy,
  Check,
  Briefcase,
  Target,
  Sparkles,
  Zap,
  ArrowRight,
  Cpu,
  Lock,
  Server,
  FileCheck,
  Layers,
  Network,
  Milestone,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { VemarLogo } from './VemarLogo';
import { Jurisdiction } from '../types';
import { TechnicalArchitectureDiagram } from './TechnicalArchitectureDiagram';

interface InvestorPitchDeckProps {
  initialJurisdiction?: Jurisdiction;
  onSelectJurisdiction?: (j: Jurisdiction) => void;
  onNavigateToScanner?: () => void;
  onNavigateToArchitecture?: () => void;
}

type PitchDeckView = 'IN' | 'US' | 'COMPARISON';
type SectionTab =
  | 'executive'
  | 'market_crisis'
  | 'four_moats'
  | 'architecture'
  | 'competitive_matrix'
  | 'regulatory_mandates'
  | 'target_market'
  | 'business_model'
  | 'the_ask';

export const InvestorPitchDeck: React.FC<InvestorPitchDeckProps> = ({
  initialJurisdiction = 'IN',
  onSelectJurisdiction,
  onNavigateToScanner,
  onNavigateToArchitecture
}) => {
  const [deckView, setDeckView] = useState<PitchDeckView>(
    initialJurisdiction === 'US' || initialJurisdiction === 'GLOBAL' ? 'US' : 'IN'
  );
  const [activeSection, setActiveSection] = useState<SectionTab>('executive');
  const [copiedMemo, setCopiedMemo] = useState<boolean>(false);

  // Sync jurisdiction changes
  const handleDeckSwitch = (view: PitchDeckView) => {
    setDeckView(view);
    if (view === 'IN') {
      onSelectJurisdiction?.('IN');
    } else if (view === 'US') {
      onSelectJurisdiction?.('GLOBAL');
    }
  };

  const isIndia = deckView === 'IN';

  const handleCopyDealMemo = () => {
    const memo = `=====================================================
VEMAR AI — INSTITUTIONAL VENTURE CAPITAL DEAL MEMO
JURISDICTION FOCUS: ${isIndia ? 'INDIA CAPITAL MARKETS (SEBI / NSE / BSE)' : 'US & GLOBAL CAPITAL MARKETS (SEC / FINRA / NYSE)'}
=====================================================
COMPANY: VEMAR AI (Voice, Entity & Media Authentication and Risk AI)
CATEGORY: Financial Market Integrity & Pre-Trade Defense Infrastructure
ROUND: Institutional Seed / Series A

THE THESIS:
Generative AI has democratized weaponized capital market manipulation. Synthetic CEO voice cloning, deepfake earnings disclosures, and automated messaging swarms trigger catastrophic market losses. Incumbent RegTech operates post-trade (T+1/T+2)—by the time alerts fire, trades have settled and capital is unrecoverable. VEMAR AI is the first sovereign, low-latency defense infrastructure (<380ms SLA) that intercepts deceptive orders in the pre-trade path (FIX 4.4 Tag 35=D / Tag 39=8).

CORE DEFENSIBLE MOATS:
1. Pre-Trade Execution Interception (<380ms SLA vs. T+1 Post-Trade Incumbents)
2. Cryptographic Entity Provenance (C2PA v1.3 + FIPS 140-3 Hardware Security Modules)
3. Dual-Sovereign Architecture (DPDP India on-soil data residency & US sovereign clouds)
4. Court-Admissible Statutory Evidentiary Chain (7-Year Immutable WORM storage)

REGULATORY NON-DISCRETIONARY CATALYST:
- India: SEBI Cybersecurity and Cyber Resilience Framework (CSCRF) 2024, Mandatory Telephonic Order Recording, SEBI PFUTP Regulations 2003, SCORES 2.0 API.
- US & Global: SEC Rule 10b-5 (Market Manipulation), SEC Rule 17a-4(f) (Broker-Dealer WORM Books & Records), FINRA Rule 3110 (Supervisory Systems), SEC Form TCR.

TARGET CUSTOMER PROFILE (ICP):
- Stock Exchanges & Market Infrastructure Institutions (NSE, BSE, MCX / NYSE, Nasdaq, CME)
- Institutional & Retail Broker-Dealers (Top 450+ members in India; 3,400+ FINRA registered firms)
- Asset Management Companies & Sovereign Wealth Funds
- Public Listed Corporations (IR desks securing market-moving announcements)

CAPITAL DEPLOYMENT PRIORITIES:
- 45% Low-Latency Engineering (C++, CUDA, TensorRT, Exchange FIX Gateways, Colocation at BKC & Mahwah)
- 30% Institutional Enterprise Distribution & Direct Broker Onboarding
- 15% Regulatory Certifications, Hardware Security Audits, and Evidentiary Compliance
- 10% Sovereign Cloud Operations & Working Capital

CONTACT: ir@vemar.ai | Platform: https://vemar-ai.vercel.app
=====================================================`;

    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 3000);
  };

  return (
    <div id="investor-pitch-deck-container" className="space-y-8">
      {/* Top Deck Switcher Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Institutional Venture Capital Dossier • Grounded Market Due Diligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <VemarLogo size="md" showGlow={false} />
              <span>VEMAR AI • Institutional Investor Pitch Deck</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Evaluating the pre-trade defense infrastructure protecting financial market integrity against weaponized generative AI. Inspect market-specific playbooks for <strong className="text-emerald-300">India (SEBI / NSE)</strong> and <strong className="text-cyan-300">US & Global (SEC / FINRA)</strong>, or examine the cross-border strategic moat.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-stretch sm:self-auto">
            <button
              id="deck-switch-in-btn"
              type="button"
              onClick={() => handleDeckSwitch('IN')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                deckView === 'IN'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/30 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-base">🇮🇳</span>
              <span>India Market (SEBI)</span>
            </button>

            <button
              id="deck-switch-us-btn"
              type="button"
              onClick={() => handleDeckSwitch('US')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                deckView === 'US'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-900/30 ring-1 ring-cyan-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-base">🇺🇸</span>
              <span>US & Global (SEC)</span>
            </button>

            <button
              id="deck-switch-comp-btn"
              type="button"
              onClick={() => handleDeckSwitch('COMPARISON')}
              className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                deckView === 'COMPARISON'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-900/30 ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Cross-Border Arbitrage</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        {deckView !== 'COMPARISON' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            {[
              { id: 'executive', label: 'Executive Thesis', icon: Briefcase },
              { id: 'market_crisis', label: 'The AI Threat', icon: Target },
              { id: 'four_moats', label: 'The 4 Defensible Moats', icon: ShieldCheck },
              { id: 'architecture', label: 'Technical Architecture', icon: Cpu },
              { id: 'competitive_matrix', label: 'Competitive Moat Matrix', icon: Layers },
              { id: 'regulatory_mandates', label: 'Regulatory Mandates', icon: FileCheck },
              { id: 'target_market', label: 'Target Customers (ICP)', icon: Building },
              { id: 'business_model', label: 'Enterprise Commercials', icon: Server },
              { id: 'the_ask', label: 'VC Allocation & Milestones', icon: Milestone }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id as SectionTab)}
                  className={`px-3.5 py-2 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    isActive
                      ? isIndia
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Quick Deal Memo Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Target: <strong>Institutional Seed / Series A Round</strong></span>
            <span className="text-slate-600">•</span>
            <span>Focus: <strong>Capital Markets Infrastructure & Pre-Trade Risk</strong></span>
          </div>

          <button
            type="button"
            onClick={handleCopyDealMemo}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copiedMemo ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Deal Memo Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Institutional Deal Memo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. DECK VIEW: CROSS-BORDER STRATEGIC ARBITRAGE                       */}
      {/* ==================================================================== */}
      {deckView === 'COMPARISON' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold">
                <Network className="w-3.5 h-3.5" />
                <span>Strategic Venture Thesis: Dual-Jurisdiction Market Expansion</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Why Engineering for India and the US Simultaneously Creates an Unbeatable Moat
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                Most cybersecurity startups fail in financial services because they build generic tools for US enterprises that cannot navigate foreign sovereign regulations, or build localized tools in India that cannot scale to Wall Street execution speeds. VEMAR AI captures structural cross-border arbitrage: training on India's dense retail attack surface while extracting tier-1 institutional contract values from US prime brokerages.
              </p>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Market Pillar</th>
                    <th className="py-3 px-4 text-emerald-400">🇮🇳 Indian Capital Market (SEBI / NSE)</th>
                    <th className="py-3 px-4 text-cyan-400">🇺🇸 US & Global Capital Market (SEC / NYSE)</th>
                    <th className="py-3 px-4 text-purple-300 font-bold">VEMAR Strategic Venture Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-sans">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Market Liquidity & Scale</td>
                    <td className="py-3 px-4">165M+ Demat accounts; NSE ranks #1 globally in derivative contract volume.</td>
                    <td className="py-3 px-4">$54T+ public equity market capitalization; 72%+ algorithmic trade volume.</td>
                    <td className="py-3 px-4 text-purple-300 font-medium">World's highest volume tested against world's highest dollar value.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Primary Threat Surface</td>
                    <td className="py-3 px-4">Telegram pump-and-dump syndicates, forged SEBI circulars, vernacular voice vishing.</td>
                    <td className="py-3 px-4">Executive earnings call voice clones, spoofed SEC EDGAR 8-K filings, algorithmic flash crashes.</td>
                    <td className="py-3 px-4 text-purple-300 font-medium">Shared neural weights shield both retail order flow and institutional block trading.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Statutory Enforcement Mandate</td>
                    <td className="py-3 px-4">SEBI CSCRF 2024, Mandatory Telephonic Order Recording, PFUTP 2003, SCORES 2.0.</td>
                    <td className="py-3 px-4">SEC Rule 10b-5, FINRA Rule 3110 (Supervision), SEC Rule 17a-4(f) WORM, Form TCR.</td>
                    <td className="py-3 px-4 text-purple-300 font-medium">Automated jurisdiction-switching filing dispatcher delivers instant regulatory compliance.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Deployment & Latency Need</td>
                    <td className="py-3 px-4">NSE BKC colocation & sovereign GCP Mumbai/Delhi zones (DPDP Act).</td>
                    <td className="py-3 px-4">Equinix NY4 / Mahwah colocation & sovereign GCP Virginia/Frankfurt zones.</td>
                    <td className="py-3 px-4 text-purple-300 font-medium">Standardized low-latency C++ FIX gateway deployed across major global financial hubs.</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Commercial Expansion Path</td>
                    <td className="py-3 px-4">Rapid regulatory empanelment across top 450+ brokers and 44 AMCs.</td>
                    <td className="py-3 px-4">High-ACV prime brokerage and clearing corporation enterprise contracts.</td>
                    <td className="py-3 px-4 text-purple-300 font-medium">Diversified revenue profile insulated from single-country regulatory or macro shocks.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. SECTION: EXECUTIVE SUMMARY & CORE THESIS                          */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'executive' && (
        <div className="space-y-6">
          {/* Core Investment Thesis Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="max-w-4xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                The Venture Capital Thesis
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                Generative AI is Weaponizing Capital Markets. Incumbent RegTech is Blind in Real-Time.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Over the past 24 months, generative AI tools have made voice cloning, video deepfakes, and automated social swarm manipulation virtually cost-free to execute. In financial markets, where billions of dollars move on telephonic dealer orders, executive earnings calls, and regulatory announcements, synthetic deception is a catastrophic threat.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Incumbent surveillance systems (such as NICE Actimize, Nasdaq SMARTS, and post-trade batch tools) operate on <strong className="text-white">T+1 or T+2 post-trade logs</strong>. By the time an overnight audit flags an anomalous trade, the execution is complete, margins are depleted, and investor capital has vanished.
              </p>
            </div>

            {/* 3 Core Pillars of the Investment Thesis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIndia ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">1. Pre-Trade Execution Interception</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  VEMAR AI intercepts orders in the active transaction path via <strong className="text-slate-200">FIX 4.4 Tag 35=D</strong> in under 380 milliseconds. Orders linked to synthetic voice authorization or forged disclosures are quarantined before hitting the exchange matching engine.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIndia ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">2. Cryptographic Entity Provenance</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pure statistical AI models suffer from hallucinations and false positives. VEMAR anchors multi-modal forensics in <strong className="text-slate-200">C2PA digital manifests</strong> and <strong className="text-slate-200">FIPS 140-3 Cloud KMS HSM</strong> roots of trust, providing mathematically verifiable authenticity.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIndia ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">3. Non-Discretionary Regulatory Spend</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Surveillance is not optional software for financial institutions. Mandates like <strong className="text-slate-200">{isIndia ? 'SEBI CSCRF 2024 & Order Recording Rules' : 'SEC Rule 10b-5 & FINRA Rule 3110'}</strong> impose strict liability on brokers and exchanges to prevent and record manipulative activity.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. SECTION: THE MARKET CRISIS & THREAT LANDSCAPE                     */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'market_crisis' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              {isIndia ? 'Indian Capital Markets Threat Surface' : 'US & Global Capital Markets Threat Surface'}
            </span>
            <h3 className="text-xl font-bold text-white">
              {isIndia
                ? 'The Generative AI Epidemic Targeting Indian Retail & Broker Desks'
                : 'Algorithmic Vulnerability & Voice Cloning on Institutional Trading Desks'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isIndia
                ? 'India has experienced the fastest retail investment expansion in financial history, with Demat accounts expanding to over 165 Million. However, this vast retail liquidity is directly exposed to organized syndicates using generative AI to deceive investors, impersonate registered intermediaries, and bypass dealer security.'
                : 'In US equity markets, where over 72% of daily volume is algorithmic and high-frequency, trading algorithms ingest breaking audio and news feeds in microseconds. A single synthetic audio leak or forged SEC 8-K disclosure can trigger cascading automated flash crashes before compliance officers can react.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-400" />
                <span>{isIndia ? 'Vernacular Voice Vishing & Relationship Manager Spoofing' : 'Institutional Telephonic Wire & Dealer Authorization Spoofing'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {isIndia
                  ? 'Attackers harvest publicly available audio of stock brokers, branch managers, and SEBI-registered analysts to clone their voices in Hindi, Gujarati, Marathi, and Tamil. They call high-net-worth clients and dealing desks, issuing fraudulent buy orders or directing funds to mule accounts.'
                  : 'Sophisticated syndicates clone voices of hedge fund managing partners and authorized corporate treasurers, calling prime broker settlement desks to approve margin releases or high-value Fedwire transfers under urgent pre-market conditions.'}
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[11px]">
                {isIndia ? 'Vulnerability: SEBI mandatory telephonic order recording requires proof of genuine voice authorization.' : 'Vulnerability: FINRA Rule 3110 mandates supervisory procedures to prevent unauthorized trading.'}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-400" />
                <span>{isIndia ? 'Telegram & WhatsApp Syndicate Pump-and-Dump Swarms' : 'Synthetic Press Releases & Algorithmic Flash Crashes'}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {isIndia
                  ? 'Syndicates create hundreds of automated messaging groups dispensing fake tips, fabricated SEBI registration certificates, and AI-generated video deepfakes of prominent fund managers. They coordinate retail buying into illiquid penny stocks to trigger upper circuits before dumping.'
                  : 'Attackers generate forged SEC EDGAR Form 8-K filings and deepfake CEO commentary regarding fictitious acquisitions or sudden FDA rejections. Algorithmic news scrapers immediately trade on these falsified signals, causing multi-billion dollar price swings.'}
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[11px]">
                {isIndia ? 'Vulnerability: SEBI PFUTP regulations hold intermediaries accountable for facilitating deceptive trade volume.' : 'Vulnerability: SEC Rule 10b-5 strictly prohibits deceptive devices and material misstatements affecting share prices.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. SECTION: THE 4 DEFENSIBLE MOATS (WHY VEMAR WINS)                  */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'four_moats' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Defensible Competitive Moats
            </span>
            <h3 className="text-xl font-bold text-white">
              The 4 Architectural Barriers That Make VEMAR AI Indispensable
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Venture capital investors evaluate sustainable competitive advantages. VEMAR is not another generic LLM wrapper or consumer deepfake checker. We have engineered four structural barriers that prevent displacement by incumbents or commoditization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Moat 1 */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                  01
                </span>
                <h4 className="font-bold text-white text-sm">Pre-Trade Execution Interception (&lt;380ms SLA)</h4>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Incumbent surveillance tools analyze trades overnight on T+1. VEMAR hooks directly into the institutional order pipeline via <strong>FIX Protocol 4.4</strong>. When an unauthorized voice or deceptive news trigger is detected, VEMAR issues a <strong>Tag 35=D quarantine</strong> or <strong>Tag 39=8 rejection</strong> before the exchange matching engine executes the transaction.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                Moat Factor: High integration switching cost; embedded in broker OMS / EMS gateways.
              </div>
            </div>

            {/* Moat 2 */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                  02
                </span>
                <h4 className="font-bold text-white text-sm">Cryptographic Entity Provenance (C2PA + Cloud KMS HSM)</h4>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Generic AI detectors rely purely on probability, resulting in false alarms that halt legitimate business. VEMAR anchors identity in deterministic <strong>C2PA Manifest v1.3</strong> standards signed via <strong>FIPS 140-3 Level 3 Hardware Security Modules</strong>. Registered corporate issuers and authorized traders possess unforgeable digital signatures.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                Moat Factor: Network effect — as more issuers and brokers enroll keys, registry value compounds.
              </div>
            </div>

            {/* Moat 3 */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                  03
                </span>
                <h4 className="font-bold text-white text-sm">Dual-Sovereign Infrastructure (Data Localization)</h4>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Financial regulators strictly forbid sending domestic trading audio and order books to offshore cloud endpoints. VEMAR operates sovereign infrastructure: Indian telephonic audio and broker orders remain on-soil in <strong>GCP Mumbai/Delhi</strong> (complying with the DPDP Act 2023), while US/global operations execute in US sovereign zones.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                Moat Factor: Foreign AI vendors cannot legally handle domestic banking/brokerage audio without sovereign infrastructure.
              </div>
            </div>

            {/* Moat 4 */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                  04
                </span>
                <h4 className="font-bold text-white text-sm">Court-Admissible Statutory Evidentiary Chain</h4>
              </div>
              <p className="text-slate-300 leading-relaxed">
                When an order is halted or an incident is reported, compliance teams require legally valid evidence. VEMAR packages audio spectrograms, network packet captures, and hash trees onto <strong>7-year immutable WORM storage</strong>, formatted to meet Section 65B of the Indian Evidence Act / BSA 2023 and US Federal Rules of Evidence 902(11)/(14).
              </p>
              <div className="text-[11px] text-emerald-400 font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                Moat Factor: Direct integration into regulatory reporting portals (SEBI SCORES 2.0 & SEC Form TCR).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. SECTION: TECHNICAL ARCHITECTURE                                   */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'architecture' && (
        <div className="space-y-6">
          <TechnicalArchitectureDiagram
            jurisdiction={isIndia ? 'IN' : 'GLOBAL'}
            onSelectJurisdiction={onSelectJurisdiction}
          />
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. SECTION: COMPETITIVE MOAT MATRIX (VEMAR VS. INCUMBENTS)           */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'competitive_matrix' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Landscape & Differentiation
            </span>
            <h3 className="text-xl font-bold text-white">
              Why Incumbents Cannot Solve This Problem
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Financial institutions already pay millions for compliance software, yet they remain completely exposed to generative AI manipulation. Here is how VEMAR AI stands fundamentally apart from legacy vendors.
            </p>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Evaluation Dimension</th>
                  <th className="py-3 px-4 text-cyan-400 font-bold">VEMAR AI (Pre-Trade Defense)</th>
                  <th className="py-3 px-4 text-slate-400">Legacy RegTech (NICE, SMARTS)</th>
                  <th className="py-3 px-4 text-slate-400">Generic Deepfake Checkers</th>
                  <th className="py-3 px-4 text-slate-400">In-House Broker Scripts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">Execution Timing</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">In-Line Pre-Trade (&lt;380ms SLA)</td>
                  <td className="py-3 px-4 text-rose-400">Post-Trade Batch (T+1 or T+2)</td>
                  <td className="py-3 px-4 text-rose-400">Offline Manual Upload (Minutes)</td>
                  <td className="py-3 px-4 text-slate-400">Post-Execution Logging</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">Financial Protocol Integration</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">Native FIX 4.4 Tag 35=D & SIP VoIP</td>
                  <td className="py-3 px-4 text-slate-300">Database SQL connectors only</td>
                  <td className="py-3 px-4 text-rose-400">No trading protocol support</td>
                  <td className="py-3 px-4 text-slate-400">Custom brittle point-to-point scripts</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">Voice Clone & Biometric Defense</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">RawNet3 + WavLM Vocoder Jitter</td>
                  <td className="py-3 px-4 text-rose-400">Basic keyword search only</td>
                  <td className="py-3 px-4 text-slate-300">Consumer audio model only</td>
                  <td className="py-3 px-4 text-rose-400">None (Caller ID based only)</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">Cryptographic Provenance</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">C2PA v1.3 + FIPS 140-3 Cloud KMS HSM</td>
                  <td className="py-3 px-4 text-rose-400">None</td>
                  <td className="py-3 px-4 text-rose-400">None (Probabilistic only)</td>
                  <td className="py-3 px-4 text-rose-400">None</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">Regulatory Evidentiary Output</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">SEBI SCORES 2.0 & SEC Form TCR</td>
                  <td className="py-3 px-4 text-slate-300">Internal PDF compliance summaries</td>
                  <td className="py-3 px-4 text-rose-400">Generic JSON confidence score</td>
                  <td className="py-3 px-4 text-rose-400">Raw server logs</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-white">Data Sovereignty & On-Soil Laws</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">GCP India (DPDP Act) & US Sovereign</td>
                  <td className="py-3 px-4 text-slate-300">Legacy on-prem or US multi-tenant</td>
                  <td className="py-3 px-4 text-rose-400">Public cloud multi-tenant (Non-compliant)</td>
                  <td className="py-3 px-4 text-slate-300">Local datacenter</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 7. SECTION: REGULATORY MANDATES & COMPLIANCE DRIVERS                 */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'regulatory_mandates' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              The Non-Negotiable Regulatory Catalyst
            </span>
            <h3 className="text-xl font-bold text-white">
              {isIndia
                ? 'SEBI Mandates Driving Compulsory Adoption Across Indian Intermediaries'
                : 'SEC & FINRA Supervisory Rules Requiring Institutional Deception Controls'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isIndia
                ? 'In India, SEBI has enacted strict statutory frameworks establishing personal and organizational liability for stock brokers and market infrastructure institutions that fail to implement resilient cyber defenses and prevent deceptive trading practices.'
                : 'In the United States, federal securities statutes require broker-dealers and registered investment advisers to maintain robust supervisory control systems capable of preventing deceptive devices and preserving immutable trading records.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            {isIndia ? (
              <>
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    SEBI CSCRF (2024–2025)
                  </div>
                  <h4 className="font-bold text-white">Cybersecurity & Cyber Resilience Framework</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Mandates that Qualified Intermediaries (QIs) and Market Infrastructure Institutions (MIIs) maintain real-time telemetry, automated incident triage, and API surveillance against emerging AI-driven cyber threats.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    Applicable to: All active stock brokers, depositories, and exchanges.
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    SEBI Mandatory Order Recording
                  </div>
                  <h4 className="font-bold text-white">Telephonic Order Verification Mandate</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Brokers are legally required to record and authenticate all telephonic client trading instructions. VEMAR provides the biometric verification layer ensuring the voice on the recorded call is authentic.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    Prevents: Relationship manager fraud and voice-vishing account diversion.
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    SEBI PFUTP Regulations (2003)
                  </div>
                  <h4 className="font-bold text-white">Prohibition of Fraudulent Trade Practices</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Prohibits the dissemination of manipulative information designed to artificially inflate or depress stock prices. VEMAR monitors social syndicates and automatically packages evidence for SEBI SCORES 2.0.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    Integration: Direct REST dispatch to SEBI enforcement portals.
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="font-mono font-bold text-cyan-400 text-sm">
                    SEC Rule 10b-5
                  </div>
                  <h4 className="font-bold text-white">Employment of Manipulative & Deceptive Devices</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Prohibits making untrue statements of material fact or using deceptive devices in connection with the purchase or sale of any security. VEMAR intercepts synthetic CEO commentary and fake press releases.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    Applicable to: Public issuers, hedge funds, and algorithmic trading desks.
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="font-mono font-bold text-cyan-400 text-sm">
                    FINRA Rule 3110 (Supervision)
                  </div>
                  <h4 className="font-bold text-white">Supervisory Systems & Account Takeover Prevention</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Requires broker-dealers to establish and maintain a supervisory system reasonably designed to achieve compliance. VEMAR prevents synthetic voice authorization of wire transfers and unauthorized trades.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    Applicable to: All 3,400+ FINRA registered broker-dealers.
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="font-mono font-bold text-cyan-400 text-sm">
                    SEC Rule 17a-4(f) (WORM)
                  </div>
                  <h4 className="font-bold text-white">Electronic Broker-Dealer Books & Records</h4>
                  <p className="text-slate-300 leading-relaxed">
                    Mandates write-once-read-many (WORM) storage for electronic trading records and communications. VEMAR anchors all forensic incident dossiers in tamper-proof Google Cloud Storage with 7-year retention locks.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    Compliance: Legally certified digital chain of custody.
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 8. SECTION: TARGET MARKET & IDEAL CUSTOMER PROFILE (ICP)             */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'target_market' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Target Customer Profiles (ICP)
            </span>
            <h3 className="text-xl font-bold text-white">
              Institutional Buyers with Immediate Budget Authority
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We focus exclusively on institutional buyers where security breaches cause immediate financial settlement liability, regulatory enforcement actions, or catastrophic reputational damage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Buyer 1 */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Tier 1 & Tier 2 Institutional Stock Brokers</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {isIndia
                  ? 'Active trading members (e.g., Zerodha, Groww, ICICI Securities, AngelOne, Kotak Securities) processing hundreds of thousands of retail and institutional orders daily, facing strict SEBI compliance.'
                  : 'Prime brokerages and clearing firms (e.g., Morgan Stanley, Goldman Sachs, Interactive Brokers, Apex Clearing) executing high-volume dealer transactions and managing margin accounts.'}
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-slate-400">
                <div><strong>Primary Pain Point:</strong> Telephonic order fraud, account takeovers, and SEBI/FINRA supervisory audits.</div>
                <div><strong>Deployment:</strong> FIX Drop-Copy Engine + SIP VoIP Call Interceptor.</div>
              </div>
            </div>

            {/* Buyer 2 */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Stock Exchanges & Clearing Corporations (MIIs)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {isIndia
                  ? 'National Stock Exchange (NSE), BSE, and Multi Commodity Exchange (MCX) responsible for national market surveillance, circuit breakers, and price band integrity.'
                  : 'New York Stock Exchange (NYSE), Nasdaq, and Chicago Mercantile Exchange (CME) running real-time market surveillance to identify cross-market spoofing and manipulative swarms.'}
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-slate-400">
                <div><strong>Primary Pain Point:</strong> Synthetic news-induced flash crashes and uncontainable order book imbalances.</div>
                <div><strong>Deployment:</strong> Exchange Colocation Gateway + Distributed Social Sentiment Stream.</div>
              </div>
            </div>

            {/* Buyer 3 */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Asset Management Companies (AMCs) & Sovereign Funds</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {isIndia
                  ? 'Mutual fund houses (managing ₹65+ Lakh Crores in AUM) and portfolio management services (PMS) guarding institutional fund manager voices and high-value block orders.'
                  : 'Institutional asset managers, sovereign wealth funds, and private hedge funds executing multi-million dollar block trades requiring uncompromised execution confidentiality.'}
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-slate-400">
                <div><strong>Primary Pain Point:</strong> Front-running via synthesized fund manager communications.</div>
                <div><strong>Deployment:</strong> Executive Voice Provenance + Private Dealing Desk Gateway.</div>
              </div>
            </div>

            {/* Buyer 4 */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Public Listed Corporations & Investor Relations (IR)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {isIndia
                  ? 'Top 1,000 NSE/BSE listed companies seeking to protect their market capitalization by cryptographically signing all official press releases and quarterly earnings commentary.'
                  : 'Over 4,000 SEC-reporting public issuers seeking to prevent forged Form 8-K filings and deepfake CEO announcements from wiping out billions in shareholder equity.'}
              </p>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-slate-400">
                <div><strong>Primary Pain Point:</strong> Short-seller deepfakes and forged merger announcements.</div>
                <div><strong>Deployment:</strong> C2PA Cryptographic Provenance Studio + Verified Ledger Badge.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 9. SECTION: ENTERPRISE COMMERCIAL MODEL & DEPLOYMENT ARCHITECTURE   */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'business_model' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Enterprise Go-To-Market & Commercial Structure
            </span>
            <h3 className="text-xl font-bold text-white">
              SaaS Subscription + In-Line Throughput Licensing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              VEMAR AI monetizes through an institutional enterprise model combining an annual base platform license with capacity-based throughput pricing aligned with transaction volumes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-mono font-bold text-white text-sm">Tier 1: Corporate IR Provenance Seal</div>
              <p className="text-slate-300 leading-relaxed">
                Designed for public listed issuers to cryptographically sign earnings calls, press releases, and executive announcements with C2PA digital credentials and public verification QR ledgers.
              </p>
              <div className="pt-2 border-t border-slate-800 text-slate-400 font-mono text-[11px]">
                Annual Base Platform License • Includes Google Cloud KMS HSM Key Ring & Tamper-Proof Public Verification Portal.
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-mono font-bold text-cyan-300 text-sm">Tier 2: Broker Telephonic & FIX Firewall</div>
              <p className="text-slate-300 leading-relaxed">
                Designed for retail and institutional brokers. In-line inspection of SIP telephonic order lines, trader acoustic biometrics, and pre-trade order book correlation.
              </p>
              <div className="pt-2 border-t border-slate-800 text-slate-400 font-mono text-[11px]">
                Base Platform License + Inbound Audio Channel Metering • Includes FIX 4.4 Tag 35=D quarantine gateway.
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-mono font-bold text-emerald-300 text-sm">Tier 3: Exchange & MII Surveillance Grid</div>
              <p className="text-slate-300 leading-relaxed">
                Designed for stock exchanges, clearing corporations, and national regulators. Full-market crawler, multi-channel syndicate radar, and automated regulatory reporting dispatch.
              </p>
              <div className="pt-2 border-t border-slate-800 text-slate-400 font-mono text-[11px]">
                Enterprise Multi-Market License • Includes Colocation Ingress, dedicated GPU inference pool, and SEBI/SEC direct filing.
              </div>
            </div>
          </div>

          {/* Deployment Topologies */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>Institutional Deployment Topologies</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block font-mono text-[11px]">Sovereign Cloud Deployment (SaaS)</strong>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Dedicated tenant VPC hosted on sovereign Google Cloud zones (Mumbai/Delhi for India; Virginia for US). Full data isolation, MeitY empanelment, and SOC 2 Type II compliance.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <strong className="text-white block font-mono text-[11px]">Exchange Colocation Deployment (On-Prem / Edge)</strong>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Direct cross-connect appliances deployed at exchange colocation facilities (NSE BKC Mumbai, Equinix NY4 Secaucus). Sub-millisecond FIX packet inspection for high-frequency trading desks.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 10. SECTION: VENTURE CAPITAL ALLOCATION & 18-MONTH MILESTONES        */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'the_ask' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Institutional Capital Allocation & Roadmap
            </span>
            <h3 className="text-xl font-bold text-white">
              Venture Capital Deployment & 18-Month Execution Milestones
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We are raising institutional venture capital to scale low-latency infrastructure, complete regulatory empanelments, and expand enterprise distribution across institutional brokerages and exchanges.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Capital Allocation Breakdown */}
            <div className="lg:col-span-6 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase font-mono tracking-wider text-xs">
                Strategic Use of Capital
              </h4>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>45% — Low-Latency Core Engineering & Colocation</span>
                  <span className="text-cyan-400 font-mono">Infrastructure</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Deployment of dedicated NVIDIA L4/H100 GPU clusters, C++ TensorRT low-latency optimization, and physical cross-connect colocation at NSE BKC (Mumbai) and Equinix NY4 (Secaucus).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>30% — Institutional Enterprise Sales & Distribution</span>
                  <span className="text-emerald-400 font-mono">GTM Expansion</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Dedicated capital markets enterprise sales directors across Mumbai, GIFT City, New York, and London, driving pilot integrations with top-tier stock brokers and clearing corporations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>15% — Regulatory Empanelment & Compliance Certifications</span>
                  <span className="text-indigo-400 font-mono">Audits & Legal</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Completing SEBI CSCRF institutional security audits, SOC 2 Type II attestation, ISO 27001, and legal certification of evidentiary WORM chain-of-custody validity.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>10% — Sovereign Cloud Operations & Working Capital</span>
                  <span className="text-slate-300 font-mono">Operations</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Multi-region sovereign cloud operations, high-availability disaster recovery testing, and general corporate working capital.
                </p>
              </div>
            </div>

            {/* 18-Month Execution Milestones */}
            <div className="lg:col-span-6 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase font-mono tracking-wider text-xs">
                18-Month Institutional Execution Roadmap
              </h4>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 font-mono">Phase 1: Months 1 – 6</span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Core Deployment</span>
                  </div>
                  <strong className="text-white block">Exchange Colocation & Top Broker Pilots</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Complete physical colocation integration at NSE BKC; deploy pilot pre-trade FIX gateways with 5 leading institutional brokers; finalize C2PA Cloud KMS HSM signing pipeline.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400 font-mono">Phase 2: Months 7 – 12</span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Regulatory Scale</span>
                  </div>
                  <strong className="text-white block">SEBI Empanelment & Vernacular Voice Matrix</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Complete formal SEBI CSCRF framework certification; expand vernacular acoustic anti-spoofing coverage to Hindi, Gujarati, Tamil, and Bengali; integrate SEBI SCORES 2.0 direct API.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-400 font-mono">Phase 3: Months 13 – 18</span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Global Rollout</span>
                  </div>
                  <strong className="text-white block">US Prime Brokerage & SEC Form TCR Automation</strong>
                  <p className="text-slate-400 leading-relaxed">
                    Deploy Equinix NY4 colocation node in Secaucus; onboard first wave of US FINRA broker-dealers; activate automated SEC Form TCR whistleblower evidence dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
