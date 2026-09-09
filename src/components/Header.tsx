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
  AlertOctagon,
  Languages,
  BookOpen
} from 'lucide-react';
import { UserRole, Jurisdiction } from '../types';
import { VemarLogo } from './VemarLogo';
import { useLocalization } from '../context/LocalizationContext';
import { RegulatoryGatewayIndicator } from './RegulatoryGatewayIndicator';

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
  const { language, setLanguage, isHindi, market, setMarket, t, openGlossary } = useLocalization();

  const handleSelectMarket = (m: 'IN' | 'GLOBAL') => {
    setMarket(m);
    onSelectJurisdiction(m);
  };

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
            {jurisdiction === 'IN'
              ? (isHindi ? 'सेबी निगरानी अलर्ट' : 'SEBI SURVEILLANCE')
              : (isHindi ? 'वैश्विक बाजार निगरानी अलर्ट' : 'GLOBAL MARKET ALERT (SEC/FINRA)')}
          </span>
          <span className="truncate text-slate-300 text-[11px]">
            {jurisdiction === 'IN'
              ? (isHindi
                  ? 'स्वचालित सर्विलांस सक्रिय: आज खुदरा निवेशकों को निशाना बनाने वाले 42 फर्जी ब्रोकर डोमेन एवं टेलीग्राम एआई पंप बॉट सिंडिकेट चिन्हित।'
                  : 'Automated crawler active: 42 lookalike broker domains & Telegram AI pump bot syndicates targeting retail investors flagged today.')
              : (isHindi
                  ? 'स्वचालित रडार सक्रिय: फर्जी एसईसी एडगर 8-K फाइलिंग एवं संस्थागत वायर ट्रांसफर को निशाना बनाने वाले डीपफेक वॉयस हमलों की रोकथाम।'
                  : 'Automated radar active: Intercepted spoofed SEC EDGAR 8-K filings and AI voice clone attacks targeting prime broker wire authorizations.')}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 shrink-0 hidden md:inline">
          {jurisdiction === 'IN'
            ? (isHindi ? 'प्रावधान: सेबी पीएफयूटीपी विनियम 4(2)(k) / आईटी अधिनियम 66डी' : 'Statute: SEBI PFUTP Reg 4(2)(k) / IT Act 66D')
            : (isHindi ? 'प्रावधान: एसईसी नियम 10b-5 / 18 U.S.C. § 1343' : 'Statute: SEC Rule 10b-5 / 18 U.S.C. § 1343')}
        </span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Top-Left: Brand Logo & Market Switcher (India / Global) */}
        <div className="flex items-center gap-4 flex-wrap">
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
                  {t('brand.edition', 'ENTERPRISE v3.0')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-normal font-medium flex items-center gap-2">
                <span>{isHindi ? 'ध्वनि, मध्यस्थ व मीडिया सुरक्षा' : 'Voice, Entity & Media Authentication & Risk'}</span>
                <span className="text-slate-600 hidden md:inline">•</span>
                <span className="text-cyan-400/90 group-hover:text-cyan-300 font-semibold text-[10px] hidden md:inline">
                  {activeTab === 'landing' ? (isHindi ? '● अवलोकन सक्रिय' : '● Overview Active') : (isHindi ? '← अवलोकन' : '← Overview')}
                </span>
              </p>
            </div>
          </button>

          {/* Top-Left Global Market Mode Switcher: India vs Global */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center text-xs shadow-inner">
            <div className="px-2 py-1 text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-slate-400 text-[10px] uppercase hidden sm:inline">
                {isHindi ? 'बाजार:' : 'Market:'}
              </span>
            </div>

            <button
              id="jurisdiction-in-btn"
              type="button"
              onClick={() => handleSelectMarket('IN')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                jurisdiction === 'IN'
                  ? 'bg-emerald-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="India Capital Markets (SEBI / NSE / BSE)"
            >
              <span>🇮🇳</span>
              <span>{isHindi ? 'भारत (India)' : 'India'}</span>
              <span className="hidden md:inline px-1 py-0.2 rounded text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                SEBI
              </span>
            </button>

            <button
              id="jurisdiction-global-btn"
              type="button"
              onClick={() => handleSelectMarket('GLOBAL')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                jurisdiction === 'GLOBAL' || jurisdiction === 'US'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Global Capital Markets (SEC / FINRA / International)"
            >
              <span>🌐</span>
              <span>{isHindi ? 'वैश्विक (Global)' : 'Global'}</span>
              <span className="hidden md:inline px-1 py-0.2 rounded text-[9px] font-mono bg-blue-950/80 text-blue-300 border border-blue-700/60">
                SEC/FINRA
              </span>
            </button>
          </div>

          {/* Real-Time Regulatory Gateway Connectivity Indicator (SEBI & SEC) */}
          <RegulatoryGatewayIndicator
            jurisdiction={jurisdiction}
            onOpenAuthenticator={() => setActiveTab('authenticator')}
          />
        </div>

        {/* Top-Right: Language Switcher, SEBI Glossary Button, & Persona Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language Switcher (English / हिन्दी) */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center text-xs shadow-inner">
            <div className="px-1.5 py-1 text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <button
              id="lang-en-btn"
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'en'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch interface language to English"
            >
              <span>EN</span>
            </button>
            <button
              id="lang-hi-btn"
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'hi'
                  ? 'bg-amber-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="इंटरफेस भाषा को हिन्दी में बदलें (Switch to Hindi)"
            >
              <span>हिन्दी</span>
            </button>
          </div>

          {/* SEBI Financial Glossary Button */}
          <button
            id="header-sebi-glossary-btn"
            type="button"
            onClick={openGlossary}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 hover:text-emerald-200 border border-emerald-800/60 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            title={isHindi ? 'सेबी वित्तीय शब्दावली एवं वैधानिक मार्गदर्शिका देखें' : 'View SEBI Capital Markets Terminology & Regulatory Glossary'}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t('glossary.btn', 'SEBI Glossary')}</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-mono bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
              {isHindi ? 'शब्दावली' : 'Glossary'}
            </span>
          </button>

          {/* Persona selector */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center text-xs shadow-inner">
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
              <span>{t('role.retail', 'Retail Investor')}</span>
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
              <span>{t('role.broker', 'Broker Desk')}</span>
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
              <span>{t('role.mii', 'MII / Exchange')}</span>
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
          <span>{t('nav.overview', 'Overview')}</span>
        </button>

        <button
          id="nav-scanner-btn"
          type="button"
          onClick={() => setActiveTab('scanner')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'scanner'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t('nav.scanner', 'Threat Scanner')}</span>
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
          <span>{t('nav.vemar_arch', 'VEMAR Architecture')}</span>
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
          <span>{t('nav.vemar_gaps', 'Gap Analysis')}</span>
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
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>
            {jurisdiction === 'GLOBAL' || jurisdiction === 'US'
              ? t('nav.authenticator_global', 'SEC EDGAR Validator')
              : t('nav.authenticator', 'SEBI Registry & Circulars')}
          </span>
        </button>

        <button
          id="nav-provenance-btn"
          type="button"
          onClick={() => setActiveTab('provenance')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'provenance'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t('nav.provenance', 'C2PA Provenance')}</span>
        </button>

        <button
          id="nav-radar-btn"
          type="button"
          onClick={() => setActiveTab('radar')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'radar'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{t('nav.radar', 'Surveillance Radar')}</span>
        </button>

        <button
          id="nav-enterprise-btn"
          type="button"
          onClick={() => setActiveTab('enterprise')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'enterprise'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>{t('nav.enterprise', 'Enterprise Gateway')}</span>
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
          <span>{t('nav.investor_pitch', 'Dual Investor Pitch')}</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            🇮🇳 {isHindi ? 'भारत' : 'India'} & 🌐 {isHindi ? 'वैश्विक' : 'Global'}
          </span>
        </button>

        <button
          id="nav-guide-btn"
          type="button"
          onClick={() => setActiveTab('guide')}
          className={`px-3 py-2 font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'guide'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>{t('nav.guide', 'Defense Guide')}</span>
        </button>
      </div>
    </header>
  );
};
