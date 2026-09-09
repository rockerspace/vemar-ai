import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  ArrowRight,
  TrendingUp,
  Server,
  Lock,
  Globe2,
  Cpu,
  FileCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  ChevronRight,
  AlertOctagon,
  Languages,
  BookOpen
} from 'lucide-react';
import { VemarLogo } from './VemarLogo';
import { Jurisdiction } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import { RegulatoryGatewayIndicator } from './RegulatoryGatewayIndicator';

interface LandingPageProps {
  jurisdiction: Jurisdiction;
  onSelectJurisdiction: (j: Jurisdiction) => void;
  onEnterPlatform: (targetTab?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  jurisdiction,
  onSelectJurisdiction,
  onEnterPlatform
}) => {
  const { language, setLanguage, isHindi, setMarket, openGlossary, t } = useLocalization();
  const isUS = jurisdiction === 'US' || jurisdiction === 'GLOBAL';
  const [activeIncidentIndex, setActiveIncidentIndex] = useState(0);

  const liveThreatBenchmarks = isUS
    ? [
        {
          id: 'us_benchmark_audio_fed',
          title: 'Federal Reserve Emergency Rate Cut Deepfake Audio',
          entity: 'Federal Open Market Committee',
          risk: 97,
          type: 'AI Voice Cloning & Market Manipulation',
          channel: 'Executive Vishing',
          statute: 'SEC Rule 10b-5 / 18 U.S.C. § 1343',
          impact: 'Prevented $240M algorithmic index futures mispricing',
          details: 'Synthesized voice clone mimicking Jerome Powell announcing an unannounced 50bps discount window rate cut circulated to high-frequency trading desks via fake Discord leak.'
        },
        {
          id: 'us_benchmark_text_8k',
          title: 'Spoofed SEC EDGAR Form 8-K Buyout Disclosure',
          entity: 'NVIDIA Corporation ($NVDA)',
          risk: 94,
          type: 'SEC EDGAR Header Spoofing',
          channel: 'Regulatory Document',
          statute: 'Securities Exchange Act Section 10(b)',
          impact: 'Quarantined before retail algorithmic order fills',
          details: 'Fabricated Form 8-K filing claiming a cash tender offer of $120.00 per share with fake CIK:0001045810 and forged accession hashes.'
        },
        {
          id: 'us_benchmark_video_ceo',
          title: 'Deepfake CEO Forward Guidance Interview',
          entity: 'Tesla Inc ($TSLA)',
          risk: 91,
          type: 'Synthetic Lip-Sync Video Deepfake',
          channel: 'Social Video Stream',
          statute: 'FINRA Rule 2010 (Standards of Commercial Honor)',
          impact: 'Flagged 14 minutes prior to NYSE market open',
          details: 'Wav2Lip generative video depicting an unscheduled factory shutdown and sudden executive departure uploaded to YouTube FinTwit channel.'
        }
      ]
    : [
        {
          id: 'in_benchmark_audio_md',
          title: 'Deepfake Voice Clone Margin Call Attack',
          entity: 'HDFC Securities Trading Desk',
          risk: 96,
          type: 'Acoustic Biometric Forgery',
          channel: 'Executive Voice Clone',
          statute: 'SEBI PFUTP Reg 4(2)(k) / IT Act 66D',
          impact: 'Prevented ₹48.5 Cr unauthorized client wire transfer',
          details: 'Synthesized audio impersonating managing director demanding immediate liquidation of high-beta equity collateral into offshore mule account.'
        },
        {
          id: 'in_benchmark_text_circular',
          title: 'Counterfeit SEBI T+0 Settlement Directive Circular',
          entity: 'Securities and Exchange Board of India',
          risk: 93,
          type: 'Phishing Circular & Forged Seal',
          channel: 'Regulatory Phishing',
          statute: 'SEBI Intermediary Regulations & Master Circular',
          impact: 'Quarantined across 28 institutional brokerage portals',
          details: 'PDF circulating on Telegram claiming immediate suspension of demat accounts without deposit of 5% emergency stability levy.'
        },
        {
          id: 'in_benchmark_video_finfluencer',
          title: 'Synthetic Finfluencer 12,000% Options Return Syndicate',
          entity: 'NSE NIFTY 50 Weekly Options',
          risk: 89,
          type: 'Deepfake Video & Syndicate Swarm',
          channel: 'Social Syndicate Pump',
          statute: 'SEBI Research Analyst Regulations 2014',
          impact: 'Blocked 8,400 retail account authorizations',
          details: 'Cloned likeness of certified market analyst endorsing fraudulent unregistered automated algo bot promising guaranteed daily returns.'
        }
      ];

  const currentIncident = liveThreatBenchmarks[activeIncidentIndex];

  return (
    <div id="vemar-landing-page" className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Floating Announcement Bar */}
      <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/90 border-b border-cyan-500/20 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              VEMAR AI v3.0
            </span>
            <span className="text-slate-300 text-xs">
              Production-grade multi-modal defense across <strong className="text-emerald-400">SEBI (India)</strong> & <strong className="text-cyan-400">SEC / FINRA (United States)</strong>.
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Market Toggle in Top Bar (India & Global) */}
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setMarket('IN');
                  onSelectJurisdiction('IN');
                }}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                  jurisdiction === 'IN' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="India (SEBI)"
              >
                <span>🇮🇳</span>
                <span>{isHindi ? 'भारत' : 'India'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMarket('GLOBAL');
                  onSelectJurisdiction('GLOBAL');
                }}
                className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                  jurisdiction === 'GLOBAL' || jurisdiction === 'US' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Global (SEC/FINRA)"
              >
                <span>🌐</span>
                <span>{isHindi ? 'वैश्विक' : 'Global'}</span>
              </button>
            </div>

            {/* Real-time Regulatory Gateway Connectivity Indicator */}
            <RegulatoryGatewayIndicator
              jurisdiction={jurisdiction}
              onOpenAuthenticator={() => onEnterPlatform('authenticator')}
              compact={true}
            />

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded font-semibold transition-all ${
                  language === 'en' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-1.5 py-0.5 rounded font-semibold transition-all ${
                  language === 'hi' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="हिन्दी"
              >
                हिन्दी
              </button>
            </div>

            {/* SEBI Glossary launcher */}
            <button
              type="button"
              onClick={openGlossary}
              className="px-2 py-0.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
              title={isHindi ? 'सेबी वित्तीय शब्दावली देखें' : 'View SEBI Capital Markets Hindi/English Glossary'}
            >
              <BookOpen className="w-3 h-3 text-emerald-400" />
              <span>{isHindi ? 'सेबी शब्दावली' : 'SEBI Glossary'}</span>
            </button>

            <button
              id="landing-quick-enter-btn"
              type="button"
              onClick={() => onEnterPlatform('scanner')}
              className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1 transition-all shadow-md shadow-cyan-600/20"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Navigation Bar with Prominent Top-Left Logo */}
      <header className="border-b border-slate-800/80 bg-[#090e18]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Top Left Logo and Brand Identity */}
          <div
            id="landing-logo-brand"
            onClick={() => onEnterPlatform('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <VemarLogo size="md" showGlow={true} animated={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  VEMAR AI
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  v3.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Voice, Entity & Media Authentication and Risk Intelligence
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-300">
            <button
              type="button"
              onClick={() => onEnterPlatform('vemar_arch')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>VEMAR Pipeline</span>
            </button>
            <button
              type="button"
              onClick={() => onEnterPlatform('vemar_gaps')}
              className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Gap Analysis</span>
            </button>
            <button
              type="button"
              onClick={() => onEnterPlatform('scanner')}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Threat Scanner</span>
            </button>
            <button
              type="button"
              onClick={() => onEnterPlatform('authenticator')}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isUS ? 'SEC EDGAR' : 'SEBI Registry'}</span>
            </button>
            <button
              type="button"
              onClick={() => onEnterPlatform('investor_pitch')}
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Dual Pitch Decks</span>
            </button>
          </div>

          {/* Right Action: Direct to Main Page Button & Live Gateway Indicator */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <RegulatoryGatewayIndicator
                jurisdiction={jurisdiction}
                onOpenAuthenticator={() => onEnterPlatform('authenticator')}
              />
            </div>

            <button
              id="landing-enter-main-page-header-btn"
              type="button"
              onClick={() => onEnterPlatform('scanner')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs tracking-wide transition-all shadow-lg shadow-cyan-600/30 flex items-center gap-2 group"
            >
              <span>Launch VEMAR Platform</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Large Animated Visuals */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-800/80">
        {/* Subtle Background Radial Grid & Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-indigo-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-inner">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Capital Markets Infrastructure & RegTech Defense</span>
              <span className="w-1 h-1 rounded-full bg-cyan-400" />
              <span className="text-slate-300 font-mono">
                {isUS ? 'SEC EDGAR & FINRA Ready' : 'SEBI Master Circulars Ready'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Eliminate Synthetic Market Abuse Before{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">
                Capital Disappears
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              VEMAR AI gives institutional brokers, clearing corporations, exchanges, and regulators sub-380ms multi-modal neural forensic detection to intercept executive voice clones, forged regulatory filings, and coordinated social disinformation swarms.
            </p>

            {/* Call to Actions (Clicking directs to Main Page) */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                id="hero-enter-platform-btn"
                type="button"
                onClick={() => onEnterPlatform('scanner')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Enter Live Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-vemar-arch-btn"
                type="button"
                onClick={() => onEnterPlatform('vemar_arch')}
                className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-700/50 font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>VEMAR Architecture</span>
              </button>

              <button
                id="hero-gap-analysis-btn"
                type="button"
                onClick={() => onEnterPlatform('vemar_gaps')}
                className="px-6 py-3.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <AlertOctagon className="w-4 h-4 text-indigo-400" />
                <span>8 Industry Gaps</span>
              </button>

              <button
                id="hero-investor-deck-btn"
                type="button"
                onClick={() => onEnterPlatform('investor_pitch')}
                className="px-6 py-3.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/40 font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Dual Investor Decks</span>
              </button>
            </div>

            {/* Trust and Latency Badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-3xl mx-auto">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Inference Speed</span>
                <span className="text-xl font-bold text-cyan-400 font-mono">&lt; 380 ms</span>
                <span className="text-[11px] text-slate-400 block">Pre-trade order halt SLA</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Biometric ROC-AUC</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">99.4%</span>
                <span className="text-[11px] text-slate-400 block">Acoustic anti-spoofing</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Capital Shielded</span>
                <span className="text-xl font-bold text-white font-mono">{isUS ? '$1.1B+' : '₹8,400 Cr+'}</span>
                <span className="text-[11px] text-slate-400 block">Fraudulent fills averted</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Compliance Grade</span>
                <span className="text-xl font-bold text-blue-400 font-mono">SEBI & SEC</span>
                <span className="text-[11px] text-slate-400 block">Automated Form TCR / SCORES</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Threat Interception Terminal (Click to Inspect on Main Page) */}
      <section className="py-12 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 mb-1">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
                REAL-TIME THREAT INTERCEPTION BENCHMARKS
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Live Attack Intercept Simulator
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Select a benchmark attack below to see real-world neural forensic breakdowns, then launch it directly in the live platform.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Select Attack:</span>
              <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                {liveThreatBenchmarks.map((b, idx) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setActiveIncidentIndex(idx)}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                      activeIncidentIndex === idx
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Scenario {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Benchmark Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    RISK SCORE: {currentIncident.risk}% (CRITICAL)
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-slate-800 text-cyan-300 border border-slate-700">
                    {currentIncident.channel}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    Target: {currentIncident.entity}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {currentIncident.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {currentIncident.details}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Statutory Violation</span>
                    <span className="font-semibold text-amber-300 font-mono">{currentIncident.statute}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Financial Impact Mitigated</span>
                    <span className="font-semibold text-emerald-400 font-mono">{currentIncident.impact}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Action Trigger */}
              <div className="lg:col-span-4 bg-slate-950/80 border border-cyan-500/30 rounded-xl p-5 space-y-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                  <Activity className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Inspect Incident in Forensic Console</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Load spectral voice frequency graphs, lip-sync landmark analysis, and automated whistleblowing dossier.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onEnterPlatform('scanner')}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Launch in Forensic Scanner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Platform Pillars (Each Clickable to direct to that page) */}
      <section className="py-16 bg-[#080d16] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Full-Stack Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Everything Needed to Protect Modern Capital Markets
            </h2>
            <p className="text-sm text-slate-400">
              Click any module below to immediately explore its live functionality on the main console.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Forensic Scanner */}
            <div
              id="pillar-scanner-card"
              onClick={() => onEnterPlatform('scanner')}
              className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>Multi-Modal Forensic Scanner</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time neural inference for visual deepfakes, executive audio voice clones, and LLM-crafted phishing campaigns targeting market participants.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>Sub-400ms Neural Engine</span>
                <span className="font-sans font-bold flex items-center gap-1 group-hover:underline">
                  Launch Scanner &rarr;
                </span>
              </div>
            </div>

            {/* Card 2: Official Registries */}
            <div
              id="pillar-authenticator-card"
              onClick={() => onEnterPlatform('authenticator')}
              className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>Regulatory Registry Authenticator</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Instant cross-referencing against SEC EDGAR Accession numbers, FINRA CRD BrokerCheck, and SEBI registered intermediary databases.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-emerald-400">
                <span>Direct Authority Feeds</span>
                <span className="font-sans font-bold flex items-center gap-1 group-hover:underline">
                  Verify Filings &rarr;
                </span>
              </div>
            </div>

            {/* Card 3: C2PA Provenance Studio */}
            <div
              id="pillar-provenance-card"
              onClick={() => onEnterPlatform('provenance')}
              className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                  <span>C2PA Digital Provenance Studio</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enables listed corporations, merchant bankers, and exchanges to cryptographically sign disclosures with immutable SHA-256 fingerprints before press distribution.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-blue-400">
                <span>PKI & C2PA Standard</span>
                <span className="font-sans font-bold flex items-center gap-1 group-hover:underline">
                  Issue Seals &rarr;
                </span>
              </div>
            </div>

            {/* Card 4: Threat Radar */}
            <div
              id="pillar-radar-card"
              onClick={() => onEnterPlatform('radar')}
              className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
                  <span>Disinformation Swarm Radar</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time network graph tracking synchronized bot syndicates across Telegram, WhatsApp, Discord, X, and WallStreetBets targeting liquid equities.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-amber-400">
                <span>Autonomous Sensor Grid</span>
                <span className="font-sans font-bold flex items-center gap-1 group-hover:underline">
                  View Radar &rarr;
                </span>
              </div>
            </div>

            {/* Card 5: Enterprise Gateway */}
            <div
              id="pillar-enterprise-card"
              onClick={() => onEnterPlatform('enterprise')}
              className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors flex items-center justify-between">
                  <span>Enterprise SIEM & OMS Gateway</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pre-trade order execution halt hooks via FIX 4.4 protocol, high-throughput REST APIs, and structured CEF / LEEF SIEM log feeds for SOC teams.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-purple-400">
                <span>FIX 4.4 & REST SDKs</span>
                <span className="font-sans font-bold flex items-center gap-1 group-hover:underline">
                  Integrate API &rarr;
                </span>
              </div>
            </div>

            {/* Card 6: Investor Pitch & ROI */}
            <div
              id="pillar-pitch-card"
              onClick={() => onEnterPlatform('investor_pitch')}
              className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                  <span>Investor Pitch & ROI Deck</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full institutional pitch deck, unit economics breakdown, $14.8B TAM model, and interactive enterprise ROI calculator for brokers and exchanges.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-emerald-400">
                <span>4.2x - 8.6x ROI Model</span>
                <span className="font-sans font-bold flex items-center gap-1 group-hover:underline">
                  View Pitch Deck &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Execution Pipeline */}
      <section className="py-16 bg-[#090e18] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Automated Protection Workflow
            </span>
            <h2 className="text-2xl font-bold text-white">
              End-to-End Synthetic Media Containment Flow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="text-sm font-bold text-white">Multi-Channel Ingest</h4>
              <p className="text-xs text-slate-400">
                Webhooks monitor investor relations livestreams, broker call centers, and social channels 24/7.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h4 className="text-sm font-bold text-white">Neural Forensic Audit</h4>
              <p className="text-xs text-slate-400">
                Spectrogram voice biometrics, facial motion vector continuity, and LLM manipulation heuristics execute in &lt;380ms.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h4 className="text-sm font-bold text-white">Registry Cross-Check</h4>
              <p className="text-xs text-slate-400">
                Verifies cryptographic C2PA seals, SEC EDGAR accession hashes, and SEBI / FINRA licensing credentials.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 font-mono text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h4 className="text-sm font-bold text-white">Pre-Trade Containment</h4>
              <p className="text-xs text-slate-400">
                Instantly injects FIX execution limits, quarantines suspicious accounts, and alerts compliance teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-[#070b13] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-xl shadow-cyan-500/20">
            <VemarLogo size="lg" showGlow={false} />
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Experience the Live VEMAR AI Platform?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Test live audio voice clone models, inspect spoofed regulatory filings, review the 8 critical industry gaps solved, simulate pre-trade execution halts, or explore the dual Indian and US investor pitch decks right now.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              id="landing-cta-enter-platform-btn"
              type="button"
              onClick={() => onEnterPlatform('scanner')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-2xl shadow-cyan-600/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <span>Launch Live Forensic Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="landing-cta-pitch-btn"
              type="button"
              onClick={() => onEnterPlatform('investor_pitch')}
              className="px-8 py-4 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/50 font-bold text-sm tracking-wide shadow-xl flex items-center gap-2.5 transition-all"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Explore Dual Pitch Decks</span>
            </button>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="border-t border-slate-900 bg-[#05080e] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <VemarLogo size="sm" showGlow={false} />
            <span className="font-semibold text-slate-300">VEMAR AI Enterprise</span>
            <span>•</span>
            <span>Voice, Entity & Media Authentication and Risk Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
            <span>SEBI ISD/MIRSD RegTech</span>
            <span>•</span>
            <span>SEC Rule 10b-5 / FINRA</span>
            <span>•</span>
            <span>C2PA Manifest v1.3</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
