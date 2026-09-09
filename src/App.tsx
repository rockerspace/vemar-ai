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

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('retail_investor');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('IN');
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [hasGeminiKey, setHasGeminiKey] = useState(true);

  useEffect(() => {
    checkSystemHealth()
      .then((health) => {
        setHasGeminiKey(health.hasGeminiKey);
      })
      .catch(() => {
        setHasGeminiKey(false);
      });
  }, []);

  // When activeTab is 'landing', render the dedicated high-impact Landing Page
  if (activeTab === 'landing') {
    return (
      <LandingPage
        jurisdiction={jurisdiction}
        onSelectJurisdiction={setJurisdiction}
        onEnterPlatform={(targetTab) => setActiveTab(targetTab || 'scanner')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080d16] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white font-sans">
      {/* Top Application Header & Navigation */}
      <Header
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        jurisdiction={jurisdiction}
        onSelectJurisdiction={setJurisdiction}
        hasGeminiKey={hasGeminiKey}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Investor & Enterprise Quick Navigation Ribbon */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              VEMAR AI ENTERPRISE
            </span>
            <span className="text-slate-300">
              Production-grade architecture & investor pitch across{' '}
              <strong className="text-emerald-400">SEBI (India)</strong> & <strong className="text-blue-400">SEC / FINRA (United States)</strong>.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="quick-vemar-arch-btn"
              type="button"
              onClick={() => setActiveTab('vemar_arch')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'vemar_arch'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 border border-cyan-800/40'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>VEMAR Pipeline</span>
            </button>

            <button
              id="quick-vemar-gaps-btn"
              type="button"
              onClick={() => setActiveTab('vemar_gaps')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'vemar_gaps'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-950/40 text-indigo-300 hover:bg-indigo-900/50 border border-indigo-800/40'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>8 Industry Gaps</span>
            </button>

            <button
              id="quick-pitch-deck-btn"
              type="button"
              onClick={() => setActiveTab('investor_pitch')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'investor_pitch'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-800/40'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Dual Pitch Decks</span>
            </button>

            <button
              id="quick-enterprise-hub-btn"
              type="button"
              onClick={() => setActiveTab('enterprise')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'enterprise'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>SIEM & OMS Gateway</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
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
            jurisdiction={jurisdiction}
            onNavigateToScanner={() => setActiveTab('scanner')}
            onNavigateToEnterprise={() => setActiveTab('enterprise')}
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
                <span>VEMAR AI • Enterprise Voice, Entity & Media Authentication and Risk Architecture</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Architected for dual-jurisdiction institutional deployment under SEBI Master Circulars (ISD/MIRSD) & US SEC / FINRA Market Abuse Regulations (Rule 10b-5 / Form TCR).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                C2PA Coalition for Content Provenance
              </span>
              <span>•</span>
              <span className="text-slate-400">SOC 2 Type II / ISO 27001 Ready</span>
              <span>•</span>
              <span className="text-slate-400">Sub-380ms REST & FIX APIs</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-600 font-mono">
            <div>
              <span>Registries Synchronized: </span>
              <span className="text-slate-400">SEBI Intermediary Registry v2.4 • SEC EDGAR Accession Depository • FINRA BrokerCheck CRD</span>
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
