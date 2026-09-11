import React, { useState, useEffect } from 'react';
import { UserRole, Jurisdiction } from './types';
import { checkSystemHealth } from './services/api';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { ForensicScanner } from './components/ForensicScanner';
import { OfficialAuthenticator } from './components/OfficialAuthenticator';
import { DigitalProvenanceStudio } from './components/DigitalProvenanceStudio';
import { SurveillanceRadar } from './components/SurveillanceRadar';
import { InvestorProtectionGuide } from './components/InvestorProtectionGuide';
import { EnterpriseGateway } from './components/EnterpriseGateway';
import { InvestorPitchDeck } from './components/InvestorPitchDeck';
import { VemarArchitectureStudio } from './components/VemarArchitectureStudio';
import { VemarGapAnalysis } from './components/VemarGapAnalysis';
import { LocalizationProvider, useLocalization } from './context/LocalizationContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationToastProvider } from './context/NotificationToastContext';
import { NotificationToastContainer } from './components/NotificationToastContainer';
import { SebiGlossaryModal } from './components/SebiGlossaryModal';
import { ClientAuthModal } from './components/ClientAuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DynamicBackground, BackgroundTheme } from './components/DynamicBackground';
import { CustomerMissionControl } from './components/CustomerMissionControl';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  TrendingUp,
  Globe2,
  Server,
  ArrowRight,
  Award,
  FileCheck,
  Cpu,
  AlertOctagon
} from 'lucide-react';

function MainApp() {
  const [currentRole, setCurrentRole] = useState<UserRole>('retail_investor');
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [hasGeminiKey, setHasGeminiKey] = useState(true);

  // Dynamic Ambience & Theme state with localStorage persistence
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>(() => {
    return (localStorage.getItem('vemar_bg_theme') as BackgroundTheme) || 'cyber_command';
  });
  const [animationEnabled, setAnimationEnabled] = useState<boolean>(() => {
    return localStorage.getItem('vemar_bg_anim') !== 'false';
  });

  const { market, setMarket, isHindi, t } = useLocalization();
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>(market);

  // Keep local jurisdiction and provider market in sync
  useEffect(() => {
    if (market !== jurisdiction) {
      setJurisdiction(market);
    }
  }, [market]);

  useEffect(() => {
    checkSystemHealth()
      .then((health) => {
        setHasGeminiKey(health.hasGeminiKey);
      })
      .catch(() => {
        setHasGeminiKey(false);
      });
  }, []);

  const handleSelectJurisdiction = (j: Jurisdiction) => {
    setJurisdiction(j);
    setMarket(j === 'IN' ? 'IN' : 'GLOBAL');
  };

  // When activeTab is 'landing', render the dedicated high-impact Landing Page
  if (activeTab === 'landing') {
    return (
      <LandingPage
        jurisdiction={jurisdiction}
        onSelectJurisdiction={handleSelectJurisdiction}
        onEnterPlatform={(targetTab) => setActiveTab(targetTab || 'scanner')}
        currentTheme={bgTheme}
        onSelectTheme={setBgTheme}
        animationEnabled={animationEnabled}
        onToggleAnimation={setAnimationEnabled}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#080d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white font-sans overflow-x-hidden">
      {/* Dynamic Interactive Ambient Canvas Background */}
      <DynamicBackground theme={bgTheme} animationEnabled={animationEnabled} />

      {/* Top Application Header & Navigation with India/Global Switcher */}
      <Header
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        jurisdiction={jurisdiction}
        onSelectJurisdiction={handleSelectJurisdiction}
        hasGeminiKey={hasGeminiKey}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTheme={bgTheme}
        onSelectTheme={setBgTheme}
        animationEnabled={animationEnabled}
        onToggleAnimation={setAnimationEnabled}
      />

      {/* Customer Mission Control & Persona Telemetry Station */}
      <CustomerMissionControl
        currentRole={currentRole}
        jurisdiction={jurisdiction}
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
      />

      {/* Main Body Content */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Active Tab View Rendering */}
        {activeTab === 'scanner' && (
          <ForensicScanner currentRole={currentRole} jurisdiction={jurisdiction} />
        )}
        {activeTab === 'vemar_arch' && (
          <VemarArchitectureStudio jurisdiction={jurisdiction} />
        )}
        {activeTab === 'vemar_gaps' && (
          <VemarGapAnalysis
            jurisdiction={jurisdiction}
            onNavigateToScanner={() => setActiveTab('scanner')}
            onNavigateToArchitecture={() => setActiveTab('vemar_arch')}
          />
        )}
        {activeTab === 'authenticator' && (
          <OfficialAuthenticator jurisdiction={jurisdiction} />
        )}
        {activeTab === 'provenance' && (
          <DigitalProvenanceStudio jurisdiction={jurisdiction} />
        )}
        {activeTab === 'radar' && (
          <SurveillanceRadar jurisdiction={jurisdiction} />
        )}
        {activeTab === 'enterprise' && (
          <EnterpriseGateway jurisdiction={jurisdiction} />
        )}
        {activeTab === 'investor_pitch' && (
          <InvestorPitchDeck
            initialJurisdiction={jurisdiction}
            onSelectJurisdiction={handleSelectJurisdiction}
            onNavigateToScanner={() => setActiveTab('scanner')}
            onNavigateToArchitecture={() => setActiveTab('vemar_arch')}
          />
        )}
        {activeTab === 'guide' && <InvestorProtectionGuide />}
      </main>

      {/* Enterprise Institutional Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b13] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>
                  {isHindi
                    ? 'वेमार एआई • एंटरप्राइज वॉइस, एंटिटी एवं मीडिया ऑथेंटिकेशन और रिस्क इंटेलिजेंस'
                    : 'VEMAR AI • Enterprise Voice, Entity & Media Authentication and Risk Architecture'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isHindi
                  ? 'भारतीय प्रतिभूति एवं विनिमय बोर्ड (SEBI) मास्टर परिपत्र (ISD/MIRSD) एवं अमेरिकी SEC / FINRA बाजार विनियमों (Rule 10b-5 / Form TCR) के तहत संस्थागत तैनाती के लिए निर्मित।'
                  : 'Architected for dual-jurisdiction institutional deployment under SEBI Master Circulars (ISD/MIRSD) & US SEC / FINRA Market Abuse Regulations (Rule 10b-5 / Form TCR).'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                {isHindi ? 'C2PA डिजिटल साक्ष्य मानक' : 'C2PA Coalition for Content Provenance'}
              </span>
              <span>•</span>
              <span className="text-slate-400">SOC 2 Type II / ISO 27001 Ready</span>
              <span>•</span>
              <span className="text-slate-400">&lt;380ms REST & FIX APIs</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-600 font-mono">
            <div>
              <span>{isHindi ? 'सिंक्रनाइज़्ड डेटाबेस: ' : 'Registries Synchronized: '}</span>
              <span className="text-slate-400">
                SEBI Intermediary Registry v2.4 • SEC EDGAR Accession Depository • FINRA BrokerCheck CRD
              </span>
            </div>
            <div>
              <span>Latency SLA: 99.99% Availability • Multi-Region Cloud Ingress</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LocalizationProvider>
        <AuthProvider>
          <NotificationToastProvider>
            <MainApp />
            <NotificationToastContainer />
            <SebiGlossaryModal />
            <ClientAuthModal />
          </NotificationToastProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ErrorBoundary>
  );
}
