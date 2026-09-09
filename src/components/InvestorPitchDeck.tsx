import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Building,
  DollarSign,
  Scale,
  PieChart,
  Calculator,
  Award,
  Download,
  Copy,
  FileText,
  Check,
  Globe2,
  Users,
  ArrowUpRight,
  BarChart3,
  Layers,
  Lock,
  Briefcase,
  Target,
  Sparkles,
  Zap,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { VemarLogo } from './VemarLogo';
import { Jurisdiction } from '../types';

interface InvestorPitchDeckProps {
  initialJurisdiction?: Jurisdiction;
  onSelectJurisdiction?: (j: Jurisdiction) => void;
  onNavigateToScanner?: () => void;
  onNavigateToArchitecture?: () => void;
}

type PitchDeckView = 'IN' | 'US' | 'COMPARISON';
type SectionTab = 'executive' | 'problem' | 'solution' | 'tam' | 'business_model' | 'regulatory_moat' | 'financials' | 'the_ask' | 'roi_calculator';

export const InvestorPitchDeck: React.FC<InvestorPitchDeckProps> = ({
  initialJurisdiction = 'IN',
  onSelectJurisdiction,
  onNavigateToScanner,
  onNavigateToArchitecture
}) => {
  const [deckView, setDeckView] = useState<PitchDeckView>(initialJurisdiction === 'US' ? 'US' : 'IN');
  const [activeSection, setActiveSection] = useState<SectionTab>('executive');
  const [copiedMemo, setCopiedMemo] = useState<boolean>(false);

  // Dynamic ROI Calculator state
  const [aumValue, setAumValue] = useState<number>(2500); // in millions
  const [monthlyVolume, setMonthlyVolume] = useState<number>(100000);
  const [entityType, setEntityType] = useState<'broker' | 'hedgefund' | 'issuer' | 'exchange'>('broker');

  // Sync jurisdiction changes
  const handleDeckSwitch = (view: PitchDeckView) => {
    setDeckView(view);
    if (view === 'IN' || view === 'US') {
      onSelectJurisdiction?.(view);
    }
  };

  // Unit calculations
  const isIndia = deckView === 'IN';
  const currencySymbol = isIndia ? '₹' : '$';

  // Loss mitigation calculations
  const fraudLossAverted = isIndia
    ? Math.round(aumValue * 0.0018 * 83.5 * 10) * 100000 // In INR
    : Math.round(aumValue * 0.0022 * 1000000); // In USD

  const regulatoryFineAvoidance = isIndia
    ? Math.round(fraudLossAverted * 0.45)
    : Math.round(fraudLossAverted * 0.65);

  const softwareSubscriptionCost = isIndia
    ? (entityType === 'broker' ? 6500000 : entityType === 'exchange' ? 32000000 : 1800000)
    : (entityType === 'broker' ? 180000 : entityType === 'exchange' ? 750000 : 48000);

  const totalBenefit = fraudLossAverted + regulatoryFineAvoidance;
  const estimatedRoiMultiple = (totalBenefit / (softwareSubscriptionCost || 1)).toFixed(1);

  const formatCurrency = (val: number) => {
    if (isIndia) {
      const cr = val / 10000000;
      if (cr >= 1) return `₹${cr.toFixed(1)} Crores`;
      const lakhs = val / 100000;
      return `₹${lakhs.toFixed(1)} Lakhs`;
    }
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  const handleCopyDealMemo = () => {
    const memo = `=====================================================
VEMAR AI — CONFIDENTIAL INVESTOR DEAL MEMO (${isIndia ? 'INDIA CAPITAL MARKETS' : 'US & GLOBAL CAPITAL MARKETS'})
=====================================================
Company: VEMAR AI (Voice, Entity & Media Authentication & Risk AI)
Stage: Series A Institutional Round
Target Raise: ${isIndia ? '₹65 Crores ($7.8M USD) for 15% Equity (Valuation: ₹433 Cr Post-Money)' : '$10.0M USD for 15% Equity (Valuation: $66.7M Post-Money)'}
Lead Regulatory Regime: ${isIndia ? 'SEBI (PFUTP Regulations 2003, SCORES 2.0, MII Cyber Framework)' : 'SEC (Rule 10b-5, Securities Exchange Act 10(b), FINRA Rule 2010)'}
Key Metrics: 99.4% Multi-Modal Detection Precision | <380ms Latency SLA | 84% Gross Margin | 138% Net Dollar Retention

EXECUTIVE SUMMARY:
VEMAR AI delivers the first unified, real-time defense infrastructure shielding securities markets from weaponized generative AI attacks: voice-cloned trading instructions, synthetic executive deepfakes inducing flash-crashes, and coordinated social bot swarms.

FINANCIAL TRAJECTORY (5-YEAR ARR):
${isIndia
  ? 'Y1: ₹8.4 Cr | Y2: ₹26.5 Cr | Y3: ₹68.0 Cr | Y4: ₹132.0 Cr | Y5: ₹210.0 Cr'
  : 'Y1: $3.4M | Y2: $11.2M | Y3: $28.5M | Y4: $49.0M | Y5: $68.5M'}

USE OF FUNDS:
- 42% Core R&D & Low-Latency Neural Forensics (RawNet3, WavLM, FIX Gateway)
- 30% Institutional Enterprise Distribution & Broker Integrations
- 18% Regulatory Certifications, Legal, and Compliance
- 10% Working Capital & Operations

Contact: ir@vemar.ai | Cryptographic Verification Hash: 9f82c401e7b9932a
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
              <span>VEMAR AI Institutional Series A Investment Presentation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <VemarLogo size="md" showGlow={false} />
              <span>Dual-Market Investor Pitch Deck</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Select between our tailored institutional presentations: the high-growth <strong className="text-emerald-300">Indian Capital Markets Deck</strong> (SEBI / NSE) and the massive scale <strong className="text-cyan-300">US & Global Wall Street Deck</strong> (SEC / FINRA), or inspect strategic comparative synergies.
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
              <span>India Market Deck</span>
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
              <span>US & Global Deck</span>
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
              <span>Comparative Synergy</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs (When on IN or US Deck) */}
        {deckView !== 'COMPARISON' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            {[
              { id: 'executive', label: 'Executive Summary', icon: Briefcase },
              { id: 'problem', label: 'Market Crisis & Gaps', icon: Target },
              { id: 'solution', label: 'VEMAR Technology', icon: Layers },
              { id: 'tam', label: 'Market Sizing (TAM)', icon: PieChart },
              { id: 'business_model', label: 'Unit Economics & Tiers', icon: DollarSign },
              { id: 'regulatory_moat', label: 'Regulatory Moat', icon: ShieldCheck },
              { id: 'financials', label: '5-Year Financials', icon: BarChart3 },
              { id: 'the_ask', label: 'Series A Capital Ask', icon: Building },
              { id: 'roi_calculator', label: 'Interactive ROI Tool', icon: Calculator }
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
            <span>Target Round: <strong>{isIndia ? '₹65 Cr ($7.8M) Series A' : '$10.0M Series A'}</strong></span>
            <span className="text-slate-600">•</span>
            <span>Target VCs: <strong>{isIndia ? 'Peak XV, Elevation, Matrix India' : 'a16z, Bessemer, Founders Fund'}</strong></span>
          </div>

          <button
            type="button"
            onClick={handleCopyDealMemo}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copiedMemo ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Deal Memo Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Investor Deal Memo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. DECK VIEW: COMPARATIVE SYNERGY MATRIX                             */}
      {/* ==================================================================== */}
      {deckView === 'COMPARISON' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              <span>Cross-Border Market Arbitrage & Strategic Multiplier</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              By engineering VEMAR AI to natively support both Indian (SEBI) and US (SEC/FINRA) statutory regimes from Day 1, we capture unprecedented economies of scale: training neural models on India's dense retail attack surface while harvesting ultra-high ACVs from Wall Street prime brokerages.
            </p>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Strategic Dimension</th>
                    <th className="py-3 px-4 text-emerald-400">🇮🇳 Indian Capital Market (SEBI)</th>
                    <th className="py-3 px-4 text-cyan-400">🇺🇸 US & Global Capital Market (SEC)</th>
                    <th className="py-3 px-4 text-purple-300">VEMAR Cross-Border Synergy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-sans">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Market Size & Liquidity</td>
                    <td className="py-3 px-4">165M+ Demat accounts, NSE #1 in global derivatives volume</td>
                    <td className="py-3 px-4">$54 Trillion public equity market cap, 72% algorithmic volume</td>
                    <td className="py-3 px-4 text-purple-300 font-medium">World's highest volume + world's highest dollar value</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Primary Threat Vector</td>
                    <td className="py-3 px-4">Telegram pump-and-dump syndicates, vernacular voice vishing</td>
                    <td className="py-3 px-4">Executive audio deepfakes, spoofed EDGAR 8-K flash crashes</td>
                    <td className="py-3 px-4 text-purple-300 font-medium">Unified multi-modal neural weights cover both vectors</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Regulatory Mandate</td>
                    <td className="py-3 px-4">SEBI Master Circular 2024, PFUTP 2003, SCORES 2.0 API</td>
                    <td className="py-3 px-4">SEC Rule 10b-5, FINRA Rule 2010/3110, Whistleblower Form TCR</td>
                    <td className="py-3 px-4 text-purple-300 font-medium">Automated jurisdiction-switching filing dispatcher</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Target TAM</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">₹14,200 Cr ($1.7B USD)</td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">$38.4 Billion USD</td>
                    <td className="py-3 px-4 text-purple-300 font-medium">Total Addressable Market exceeds $40 Billion</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Typical ACV (Annual Contract)</td>
                    <td className="py-3 px-4 font-mono">₹18 Lakhs to ₹3.2 Crores</td>
                    <td className="py-3 px-4 font-mono">$48,000 to $750,000</td>
                    <td className="py-3 px-4 text-purple-300 font-medium">Blended 84% gross margin across both markets</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-white">Exit Opportunities</td>
                    <td className="py-3 px-4">Mainboard IPO on NSE / BSE, strategic buyout by Indian FinTech</td>
                    <td className="py-3 px-4">Nasdaq Tech IPO, acquisition by Nasdaq, ICE, or CrowdStrike</td>
                    <td className="py-3 px-4 text-purple-300 font-medium">Option for Dual-Listing or high-multiple strategic acquisition</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. SECTION: EXECUTIVE SUMMARY                                        */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'executive' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIndia ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {isIndia ? 'The ₹80,000 Cr Retail Crisis' : 'The $42B Annual Threat'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isIndia
                  ? 'With 165M+ Demat accounts, generative AI enables syndicated Telegram & WhatsApp operators to mass-clone advisor voices, generate fake SEBI approvals, and wipe out retail savings in coordinated pump-and-dump runs.'
                  : 'Weaponized Generative AI has penetrated institutional capital markets: synthetic voice calls hijack high-value Fedwire transfers, deepfake CEO commentary induces flash-crashes, and LLMs automate bot market swarms.'}
              </p>
              <div className="text-[11px] font-mono text-cyan-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                {isIndia ? '+340% YoY in Indian Finfluencer Scams (SEBI Report)' : '+310% YoY in Wall Street Deepfake Incidents (CISA/SEC)'}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIndia ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">The VEMAR Neural Moat</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlike passive spam filters, VEMAR AI unites <strong>sub-second multi-modal neural forensics</strong> (Acoustic RawNet3, WavLM, ResNet STT) with an <strong>immutable C2PA cryptographic provenance registry</strong> and FIX 4.4 pre-trade circuit-breakers.
              </p>
              <div className="text-[11px] font-mono text-emerald-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                99.4% Precision | &lt;0.06% False Positive Rate | &lt;380ms Latency
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isIndia ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {isIndia ? 'Series A Target: ₹65 Crores' : 'Series A Target: $10.0 Million'}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isIndia
                  ? 'Seeking ₹65 Crores ($7.8M) to capture 450+ SEBI registered brokers, integrate with top 5 MIIs (NSE/BSE), and onboard 400 listed corporate IR desks across India.'
                  : 'Seeking $10.0 Million to capture Tier 1 Wall Street prime brokerages, deploy NYSE/Nasdaq FIX gateways, and expand sales across 4,000 SEC reporting issuers.'}
              </p>
              <div className="text-[11px] font-mono text-indigo-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                15% Equity Dilution | Post-Money: {isIndia ? '₹433 Cr' : '$66.7M'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. SECTION: MARKET CRISIS & GAPS                                     */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'problem' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              {isIndia ? 'Indian Regulatory & Market Landscape' : 'US Capital Markets & Threat Landscape'}
            </span>
            <h3 className="text-xl font-bold text-white">
              {isIndia
                ? 'Why Indian Capital Markets Face an Existential Deepfake Threat'
                : 'Why Wall Street Trading Desks Are Defenseless Against Real-Time AI Exploits'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isIndia
                ? 'India has witnessed the fastest retail investment expansion in financial history. Over 165 Million Demat accounts exist today. But this rapid democratization is colliding directly with generative AI fraud.'
                : 'High-frequency algorithmic trading represents 72% of US equity turnover. Algorithms ingest news and audio in milliseconds. A synthetic audio clip or forged SEC 8-K can trigger automatic billions in panic liquidation before humans even notice.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-red-400" />
                <span>{isIndia ? 'Vernacular Call Center Voice Vishing' : 'Prime Broker Wire & ACH Diversion'}</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {isIndia
                  ? 'Attackers clone the voices of relationship managers in Hindi, Gujarati, and Tamil to call high-net-worth clients and authorized dealers, redirecting margin funds to offshore mule accounts.'
                  : 'Sophisticated audio cloning duplicates senior hedge fund managers calling prime brokerage settlement desks to divert multi-million dollar cash transfers under the guise of margin requirements.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-red-400" />
                <span>{isIndia ? 'Telegram / WhatsApp Syndicate Swarms' : 'Flash-Crash Deepfakes & Bot Swarms'}</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                {isIndia
                  ? 'Coordinated bot swarms flood social channels with fake SEBI registration certificates and fabricated stock recommendations, creating artificial upper-circuit price movements.'
                  : 'Autonomous LLM swarms deploy synthetic screenshots, fake insider whistleblowing memos, and deepfake video clips to orchestrate gamma squeezes and panic sell-offs.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. SECTION: VEMAR TECHNOLOGY & NEURAL PIPELINE                       */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'solution' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Proprietary Technological Architecture
              </span>
              <h3 className="text-xl font-bold text-white mt-1">The VEMAR 5-Stage Neural Defense Matrix</h3>
            </div>
            <button
              type="button"
              onClick={onNavigateToArchitecture}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-sans flex items-center gap-1.5 transition-all shadow-md"
            >
              <span>Launch Full Interactive Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { letter: 'V', title: 'Voice Biometrics', tech: 'RawNet3 + WavLM', stat: '42ms SLA' },
              { letter: 'E', title: 'Entity Provenance', tech: 'C2PA + SHA-256 PKI', stat: '100% Deterministic' },
              { letter: 'M', title: 'Media Forensics', tech: 'ResNet STT + Viseme Flow', stat: '99.4% F1-Score' },
              { letter: 'A', title: 'Algorithmic Radar', tech: 'Graph Neural Networks', stat: '1,200+ Channels' },
              { letter: 'R', title: 'Response & Halts', tech: 'FIX 4.4 Tag 35=D Gateways', stat: '<16ms Execution' }
            ].map((node) => (
              <div key={node.letter} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-center sm:text-left">
                <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-black text-base flex items-center justify-center mx-auto sm:mx-0">
                  {node.letter}
                </span>
                <div className="font-bold text-white text-xs">{node.title}</div>
                <div className="text-[11px] text-slate-400 font-mono">{node.tech}</div>
                <div className="text-[10px] text-emerald-400 font-mono pt-1 font-semibold">{node.stat}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 5. SECTION: MARKET SIZING (TAM / SAM / SOM)                          */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'tam' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  Addressable Market Opportunity
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {isIndia ? 'Indian Capital Markets TAM / SAM / SOM' : 'US & Global Capital Markets TAM / SAM / SOM'}
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                BCG / Gartner / SEBI Sizing Models (2024–2028)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* TAM */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 block uppercase font-mono">Total Addressable (TAM)</span>
                <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                  {isIndia ? '₹14,200 Cr' : '$38.4 Billion'}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isIndia
                    ? 'Total Indian BFSI cybersecurity, automated market surveillance, and AI deepfake defense spending by 2028.'
                    : 'Global capital markets cyber defense, deepfake fraud prevention, and regulatory automated surveillance spending projected by 2028.'}
                </p>
              </div>

              {/* SAM */}
              <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
                <span className="text-xs font-bold text-slate-400 block uppercase font-mono">Serviceable Addressable (SAM)</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  {isIndia ? '₹4,800 Cr' : '$9.2 Billion'}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isIndia
                    ? 'Direct spend across 450+ SEBI registered brokers, 5 MIIs, 44 AMCs, and 1,800+ NSE/BSE listed corporate IR desks.'
                    : '3,400+ FINRA registered broker-dealers, clearing corporations, asset managers, and recognized US exchanges.'}
                </p>
              </div>

              {/* SOM */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-950 border border-cyan-500/50 space-y-2">
                <span className="text-xs font-bold text-white block uppercase font-mono">Serviceable Obtainable (SOM)</span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {isIndia ? '₹520 Cr' : '$740 Million'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isIndia
                    ? 'Capturing 35% of institutional brokerages, top 3 exchanges, and 400 listed corporate IR desks within 36 months.'
                    : 'Capturing 450 institutional brokerages, top 5 MIIs, and 1,200 listed corporate investor relations desks in 36 months.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 6. SECTION: BUSINESS MODEL & UNIT ECONOMICS                          */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'business_model' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                B2B Enterprise SaaS Architecture
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Monetization Tiers & Unit Economics</h3>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800">
              {isIndia ? '82% Gross Margin' : '86% Gross Margin'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-slate-400 text-xs">Net Dollar Retention</span>
              <span className="text-2xl font-bold text-white font-mono block">{isIndia ? '134%' : '142%'}</span>
              <span className="text-[10px] text-slate-500">Contract Expansion</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-slate-400 text-xs">CAC Payback Period</span>
              <span className="text-2xl font-bold text-white font-mono block">{isIndia ? '6.8 Months' : '5.2 Months'}</span>
              <span className="text-[10px] text-slate-500">Direct Institutional Sales</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
              <span className="text-slate-400 text-xs">LTV / CAC Ratio</span>
              <span className="text-2xl font-bold text-emerald-400 font-mono block">{isIndia ? '5.4x' : '6.2x'}</span>
              <span className="text-[10px] text-slate-500">Top-Decile Enterprise</span>
            </div>
          </div>

          {/* Pricing Tiers Table */}
          <div className="space-y-3 pt-2 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white text-sm block">Tier 1: Listed Issuer IR Provenance Seal</span>
                <span className="text-slate-400">Cryptographic press release signing, tamper badge & public QR ledger</span>
              </div>
              <div className="font-mono font-bold text-cyan-300 text-sm">
                {isIndia ? '₹18 Lakhs / year ($22k USD)' : '$48,000 / year'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white text-sm block">Tier 2: Institutional Broker Voice & Phishing Firewall</span>
                <span className="text-slate-400">Sub-second telephonic biometric call check + inbound email proxy</span>
              </div>
              <div className="font-mono font-bold text-cyan-300 text-sm">
                {isIndia ? '₹65 Lakhs / yr + ₹0.15 / call' : '$180,000 / yr + $0.02 / call'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white text-sm block">Tier 3: Exchange & MII Real-Time Surveillance Grid</span>
                <span className="text-slate-400">Full market crawlers, social botnet radar, and automated SCORES/SEC filing</span>
              </div>
              <div className="font-mono font-bold text-cyan-300 text-sm">
                {isIndia ? '₹3.2 Crores / year ($385k USD)' : '$750,000 / year'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 7. SECTION: REGULATORY MOAT & COMPLIANCE                             */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'regulatory_moat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Unfair Regulatory Advantage
            </span>
            <h3 className="text-xl font-bold text-white">
              {isIndia ? 'Statutory Alignment with SEBI & MII Mandates' : 'Statutory Alignment with SEC & FINRA Rules'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isIndia
                ? 'VEMAR AI is designed to integrate directly with Indian regulatory workflows, transforming compliance obligations into automated, recurring SaaS contracts.'
                : 'US federal securities statutes impose strict supervisory duties on broker-dealers. VEMAR AI automates statutory compliance, mitigating multi-million dollar regulatory penalties.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {isIndia ? (
              <>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 font-mono">SEBI PFUTP Reg 4(2)(k)</div>
                  <p className="text-slate-300 leading-relaxed">
                    Automates detection of deceptive synthetic dissemination influencing securities pricing, fulfilling mandatory intermediary surveillance obligations.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 font-mono">SEBI Master Circular (June 2024)</div>
                  <p className="text-slate-300 leading-relaxed">
                    Enforces strict verification preventing brokers from associating with unregistered Finfluencer entities dispensing stock advice.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 font-mono">SCORES 2.0 API Direct Gateway</div>
                  <p className="text-slate-300 leading-relaxed">
                    Auto-packages forensic evidence into certified electronic dossiers ready for immediate dispatch to SEBI enforcement portals.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-cyan-400 font-mono">SEC Rule 10b-5</div>
                  <p className="text-slate-300 leading-relaxed">
                    Sub-second detection of manipulative devices, fraudulent press releases, and deceptive tender offers in interstate commerce.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-cyan-400 font-mono">FINRA Rule 3110 (Supervision)</div>
                  <p className="text-slate-300 leading-relaxed">
                    Establishes supervisory procedures to detect synthetic telephonic trading instructions before execution, preventing customer account takeovers.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-cyan-400 font-mono">SEC Form TCR Whistleblower</div>
                  <p className="text-slate-300 leading-relaxed">
                    Automates electronic generation of certified Tips, Complaints, and Referrals (TCR) with cryptographic hash chains.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 8. SECTION: 5-YEAR FINANCIAL PROJECTIONS                             */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'financials' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Financial Trajectory
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                5-Year Annual Recurring Revenue (ARR) & Margin Plan
              </h3>
            </div>
            <div className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800">
              EBITDA Positive by Month 18
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Metric</th>
                  <th className="py-3 px-3 text-right">Year 1</th>
                  <th className="py-3 px-3 text-right">Year 2</th>
                  <th className="py-3 px-3 text-right">Year 3</th>
                  <th className="py-3 px-3 text-right">Year 4</th>
                  <th className="py-3 px-3 text-right text-emerald-400">Year 5</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-white font-sans">Ending ARR</td>
                  <td className="py-3 px-3 text-right font-bold text-white">
                    {isIndia ? '₹8.4 Cr' : '$3.4M'}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-white">
                    {isIndia ? '₹26.5 Cr' : '$11.2M'}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-white">
                    {isIndia ? '₹68.0 Cr' : '$28.5M'}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-white">
                    {isIndia ? '₹132.0 Cr' : '$49.0M'}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-emerald-400 text-sm">
                    {isIndia ? '₹210.0 Cr' : '$68.5M'}
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 text-slate-400 font-sans">Enterprise Accounts</td>
                  <td className="py-3 px-3 text-right">18</td>
                  <td className="py-3 px-3 text-right">64</td>
                  <td className="py-3 px-3 text-right">145</td>
                  <td className="py-3 px-3 text-right">290</td>
                  <td className="py-3 px-3 text-right text-white font-bold">480</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 text-slate-400 font-sans">Gross Margin %</td>
                  <td className="py-3 px-3 text-right">78%</td>
                  <td className="py-3 px-3 text-right">82%</td>
                  <td className="py-3 px-3 text-right">84%</td>
                  <td className="py-3 px-3 text-right">85%</td>
                  <td className="py-3 px-3 text-right text-cyan-300 font-bold">86%</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-3 px-3 text-slate-400 font-sans">EBITDA %</td>
                  <td className="py-3 px-3 text-right text-red-400">-32%</td>
                  <td className="py-3 px-3 text-right text-emerald-400">+8%</td>
                  <td className="py-3 px-3 text-right text-emerald-400">+22%</td>
                  <td className="py-3 px-3 text-right text-emerald-400">+31%</td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">+38%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 9. SECTION: SERIES A CAPITAL ASK & CAP TABLE                         */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'the_ask' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Financing Plan
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {isIndia ? 'Series A Offering: ₹65 Crores ($7.8M USD)' : 'Series A Offering: $10.0 Million USD'}
              </h3>
            </div>
            <div className="text-xs font-mono text-cyan-300 bg-cyan-950 px-3 py-1 rounded-lg border border-cyan-800">
              15% Target Equity Dilution
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">
                Cap Table Post-Money Structure
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-white">Founders & Management</span>
                  <span className="font-mono text-cyan-300 font-bold">65.0%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-white">Series A Lead Investors</span>
                  <span className="font-mono text-emerald-400 font-bold">15.0%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-white">Seed Investors & Angels</span>
                  <span className="font-mono text-slate-300 font-bold">10.0%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-semibold text-white">Employee Stock Option Pool (ESOP)</span>
                  <span className="font-mono text-slate-300 font-bold">10.0%</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">
                Strategic Use of Funds
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between font-semibold text-white">
                    <span>42% — Core Neural Forensics & FIX Engineering</span>
                    <span className="font-mono text-cyan-400">{isIndia ? '₹27.3 Cr' : '$4.2M'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Low-latency acoustic models, TensorRT optimization, and exchange FIX gateways.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between font-semibold text-white">
                    <span>30% — Institutional Enterprise Sales & Distribution</span>
                    <span className="font-mono text-emerald-400">{isIndia ? '₹19.5 Cr' : '$3.0M'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Direct sales to top-tier brokerages, prime custodians, and corporate IR desks.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between font-semibold text-white">
                    <span>18% — Regulatory Certification & Legal Defense</span>
                    <span className="font-mono text-indigo-300">{isIndia ? '₹11.7 Cr' : '$1.8M'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">SOC2 Type II, ISO 27001, FINRA WORM compliance, and regulatory lobbying.</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex justify-between font-semibold text-white">
                    <span>10% — Working Capital & Infrastructure</span>
                    <span className="font-mono text-slate-300">{isIndia ? '₹6.5 Cr' : '$1.0M'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Multi-region cloud infrastructure (Mumbai & Virginia) and reserve buffer.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 10. SECTION: INTERACTIVE ROI CALCULATOR                              */}
      {/* ==================================================================== */}
      {deckView !== 'COMPARISON' && activeSection === 'roi_calculator' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Institutional Loss Mitigation Model
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                Interactive Institutional ROI Calculator
              </h3>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {(['broker', 'hedgefund', 'issuer', 'exchange'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEntityType(type)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                    entityType === type ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type === 'broker' ? 'Stock Broker' : type === 'hedgefund' ? 'Hedge Fund' : type === 'issuer' ? 'Listed Issuer' : 'Exchange MII'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">
                    Assets Under Management / Turnover:
                  </span>
                  <span className="font-mono text-cyan-300 font-bold text-sm">
                    {isIndia ? `₹${((aumValue * 83.5) / 10).toFixed(0)} Cr` : `$${aumValue.toLocaleString()}M`}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={20000}
                  step={100}
                  value={aumValue}
                  onChange={(e) => setAumValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">
                    Monthly Inbound Call / Trade Inquiries:
                  </span>
                  <span className="font-mono text-cyan-300 font-bold text-sm">
                    {monthlyVolume.toLocaleString()} calls / orders
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={500000}
                  step={10000}
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            {/* Output Matrix */}
            <div className="lg:col-span-6 bg-slate-950 rounded-2xl p-6 border border-slate-800 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 block">Annual Fraud Losses Prevented</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  {formatCurrency(fraudLossAverted)}
                </span>
                <span className="text-[10px] text-slate-500 block">Voice vishing & wire diversion defense</span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 block">Regulatory Penalty Avoidance</span>
                <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
                  {formatCurrency(regulatoryFineAvoidance)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {isIndia ? 'SEBI Failure to Supervise Penalty' : 'SEC Failure to Supervise Penalty'}
                </span>
              </div>

              <div className="space-y-1 pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block">Annual VEMAR Subscription</span>
                <span className="text-lg font-bold text-slate-300 font-mono">
                  {formatCurrency(softwareSubscriptionCost)}
                </span>
                <span className="text-[10px] text-slate-500 block">24/7 SIEM SLA & FIX In-line Gateway</span>
              </div>

              <div className="space-y-1 pt-3 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block">Projected Institutional ROI</span>
                <span className="text-2xl font-black text-white font-mono flex items-center gap-1">
                  {estimatedRoiMultiple}x
                  <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                </span>
                <span className="text-[10px] text-emerald-400 block font-semibold">Net Payback &lt; 45 Days</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
