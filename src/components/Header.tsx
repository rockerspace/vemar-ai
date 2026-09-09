import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Briefcase,
  Landmark,
  Activity,
  Sparkles,
  AlertCircle,
  Globe2,
  Server,
  TrendingUp,
  Award,
  Home,
  Cpu,
  AlertOctagon
} from 'lucide-react';
import { UserRole, Jurisdiction } from '../types';
import { VemarLogo } from './VemarLogo';

interface HeaderProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  jurisdiction: Jurisdiction;
  onSelectJurisdiction: (j: Jurisdiction) => void;
  hasGeminiKey: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  jurisdiction,
  onSelectJurisdiction,
  hasGeminiKey,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#0c121e]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Live Market Surveillance Alert Ribbon */}
      <div className="bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border-b border-red-900/40 px-4 py-1.5 text-xs text-red-300 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-bold text-[10px] tracking-wider uppercase bg-red-900/60 px-1.5 py-0.5 rounded text-white shrink-0 font-mono">
            {jurisdiction === 'US' ? 'SEC / FINRA ALERT' : jurisdiction === 'IN' ? 'SEBI SURVEILLANCE' : 'GLOBAL MARKET ALERT'}
          </span>
          <span className="truncate text-slate-300 text-[11px]">
            {jurisdiction === 'US'
              ? 'Automated radar active: Intercepted spoofed SEC EDGAR 8-K filings and AI voice clone attacks targeting prime broker wire authorizations.'
              : 'Automated crawler active: 42 lookalike broker domains & Telegram AI pump bot syndicates targeting retail investors flagged today.'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 shrink-0 hidden md:inline">
          {jurisdiction === 'US' ? 'Statute: SEC Rule 10b-5 / 18 U.S.C. § 1343' : 'Statute: SEBI PFUTP Reg 4(2)(k) / IT Act 66D'}
        </span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Logo (Clickable to direct to Landing Page) */}
        <button
          id="header-brand-logo-btn"
          type="button"
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 text-left group transition-all focus:outline-none focus:ring-1 focus:ring-cyan-500/50 rounded-xl p-1 -m-1"
          title="Click to view VEMAR AI Overview & Landing Page"
        >
          <VemarLogo size="md" showGlow={true} animated={activeTab === 'landing'} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                VEMAR AI
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                ENTERPRISE v3.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-normal font-medium flex items-center gap-2">
              <span>Voice, Entity & Media Authentication & Risk</span>
              <span className="text-slate-600 hidden md:inline">•</span>
              <span className="text-cyan-400/90 group-hover:text-cyan-300 font-semibold text-[10px] hidden md:inline">
                {activeTab === 'landing' ? '● Overview Active' : '← Overview'}
              </span>
            </p>
          </div>
        </button>

        {/* Multi-Jurisdiction Switcher & User Role Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Global Market Mode Switcher */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <div className="px-2 py-1 text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline">Market:</span>
            </div>
            <button
              id="jurisdiction-in-btn"
              type="button"
              onClick={() => onSelectJurisdiction('IN')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                jurisdiction === 'IN'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇮🇳</span>
              <span>India (SEBI)</span>
            </button>

            <button
              id="jurisdiction-us-btn"
              type="button"
              onClick={() => onSelectJurisdiction('US')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
                jurisdiction === 'US'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🇺🇸</span>
              <span>US (SEC/FINRA)</span>
            </button>
          </div>

          {/* Persona selector */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              id="role-retail-btn"
              type="button"
              onClick={() => onSelectRole('retail_investor')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                currentRole === 'retail_investor'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Retail</span> Investor
            </button>

            <button
              id="role-broker-btn"
              type="button"
              onClick={() => onSelectRole('broker_compliance')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                currentRole === 'broker_compliance'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Broker</span> Desk
            </button>

            <button
              id="role-mii-btn"
              type="button"
              onClick={() => onSelectRole('mii_regulator')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                currentRole === 'mii_regulator'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              MII / Exchange
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1 border-t border-slate-800/80 text-xs">
        <button
          id="nav-landing-btn"
          type="button"
          onClick={() => setActiveTab('landing')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'landing'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          id="nav-scanner-btn"
          type="button"
          onClick={() => setActiveTab('scanner')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'scanner'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Threat Scanner</span>
        </button>

        <button
          id="nav-vemar-arch-btn"
          type="button"
          onClick={() => setActiveTab('vemar_arch')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'vemar_arch'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold'
              : 'border-transparent text-cyan-400/90 hover:text-cyan-300 hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>VEMAR Architecture</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Pipeline
          </span>
        </button>

        <button
          id="nav-vemar-gaps-btn"
          type="button"
          onClick={() => setActiveTab('vemar_gaps')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'vemar_gaps'
              ? 'border-indigo-400 text-indigo-400 bg-indigo-950/20 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-indigo-400" />
          <span>Gap Analysis</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            8 Gaps
          </span>
        </button>

        <button
          id="nav-authenticator-btn"
          type="button"
          onClick={() => setActiveTab('authenticator')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'authenticator'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{jurisdiction === 'US' ? 'SEC EDGAR Validator' : 'SEBI Registry & Circulars'}</span>
        </button>

        <button
          id="nav-provenance-btn"
          type="button"
          onClick={() => setActiveTab('provenance')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'provenance'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>C2PA Provenance</span>
        </button>

        <button
          id="nav-radar-btn"
          type="button"
          onClick={() => setActiveTab('radar')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'radar'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Surveillance Radar</span>
        </button>

        <button
          id="nav-enterprise-btn"
          type="button"
          onClick={() => setActiveTab('enterprise')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'enterprise'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Enterprise Gateway</span>
        </button>

        <button
          id="nav-investor-pitch-btn"
          type="button"
          onClick={() => setActiveTab('investor_pitch')}
          className={`px-3.5 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'investor_pitch'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/30 font-bold'
              : 'border-transparent text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-950/20'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Dual Investor Pitch</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            🇮🇳 India & 🇺🇸 US
          </span>
        </button>

        <button
          id="nav-guide-btn"
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'guide'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Defense Guide</span>
        </button>
      </div>
    </header>
  );
};
