import React, { useState } from 'react';
import {
  Shield,
  AlertOctagon,
  HelpCircle,
  CheckCircle,
  ExternalLink,
  Lightbulb,
  UserCheck,
  PhoneCall,
  Mail,
  Video,
  MessageSquare,
  Scale,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { RegulatoryFaqSection } from './RegulatoryFaqSection';

interface InvestorProtectionGuideProps {
  jurisdiction?: 'IN' | 'US' | 'GLOBAL';
}

export const InvestorProtectionGuide: React.FC<InvestorProtectionGuideProps> = ({
  jurisdiction = 'GLOBAL'
}) => {
  const [activeGuideView, setActiveGuideView] = useState<'all' | 'faq' | 'checklist'>('all');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checklist = [
    {
      id: 'c1',
      title: 'Never act on video announcements without verifying on official exchange disclosure feeds',
      desc: 'If a CEO appears in a video announcing resignation, sudden loss, or dividend cancellation, always cross-check at www.nseindia.com / www.bseindia.com (India) or www.sec.gov EDGAR (US) under Corporate Filings. Material events must be filed first under SEBI LODR Reg 30 or SEC Form 8-K.'
    },
    {
      id: 'c2',
      title: 'SEBI, SEC, and Exchanges NEVER call demanding urgent escrow deposits or funds transfer',
      desc: 'Any telephone call or WhatsApp voice call claiming to be a "SEBI Enforcement Officer", "SEC Examiner", or "Police Cyber Cell" threatening Demat / brokerage account freeze unless you transfer money to a "safe escrow" is 100% an AI voice clone scam. Hang up immediately.'
    },
    {
      id: 'c3',
      title: 'Verify the statutory Registration Number of anyone recommending securities',
      desc: 'All legitimate stock advisers and research analysts must hold an active registration number (SEBI INH.../INA... in India, or CRD number on FINRA BrokerCheck in the US). Never pay for stock tips on Telegram or WhatsApp groups.'
    },
    {
      id: 'c4',
      title: 'Inspect Email Domains and Never Click "Settle Margin Shortfall" Links',
      desc: 'Exchanges and clearing corporations send emails strictly from authenticated domains (e.g. @nse.co.in, @bseindia.com, or @finra.org). Scammers register fake lookalike domains like @nseindia-settlement.cc or @sec-edgar-filing.biz to harvest broker credentials.'
    },
    {
      id: 'c5',
      title: 'Guaranteed or Assured Returns are strictly ILLEGAL under Securities Laws',
      desc: 'Any message promising "100% guaranteed profit", "zero risk", or "insider institutional bot allocation" violates SEBI PFUTP regulations and SEC Rule 10b-5 and is the definitive hallmark of a synthetic pump-and-dump scheme.'
    }
  ];

  return (
    <div id="investor-protection-guide" className="space-y-6">
      {/* Guide Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              Retail & Institutional Investor Defense Playbook
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Google Search Grounding Enabled
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Safeguarding Capital Against Generative AI & Synthetic Media Market Fraud
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Market participants on social networks and telephonic trading lines face sophisticated AI voice clones and CEO deepfakes.
            Use this interactive guide, real-time Google Search grounded regulatory FAQ, and statutory grievance directory to safeguard your holdings.
          </p>

          {/* Guide Quick-Navigation Tabs */}
          <div className="mt-5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setActiveGuideView('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeGuideView === 'all'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              Full Investor Playbook
            </button>

            <button
              type="button"
              onClick={() => setActiveGuideView('faq')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeGuideView === 'faq'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                  : 'bg-slate-950 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Regulatory FAQ (SEBI & SEC Search Grounded)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveGuideView('checklist')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeGuideView === 'checklist'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                  : 'bg-slate-950 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verification Checklist ({Object.values(checkedItems).filter(Boolean).length}/5)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conditionally Rendered Attack Modalities (Visible in 'all' view) */}
      {activeGuideView === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-3">
                <Video className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">CEO Deepfakes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI videos of executive leadership announcing sudden losses or false mergers to induce artificial stock dumps.
              </p>
            </div>
            <span className="text-[11px] font-mono text-red-400 mt-3 block">Defense: Verify Exchange Filings</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Voice Clone Vishing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated calls cloning SEBI or Broker voices demanding immediate escrow deposits for bogus "illegal KYC" flags.
              </p>
            </div>
            <span className="text-[11px] font-mono text-amber-400 mt-3 block">Defense: Hang Up & Call Broker Directly</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Spear Phishing Portals</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Emails mimicking NSE/BSE Clearing Corps or SEC EDGAR claiming margin shortfalls with urgency links to steal credentials.
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 mt-3 block">Defense: Check Domain Zone TLD</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Telegram Bot Syndicates</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Synthesized swarm tips claiming guaranteed multibagger returns in penny stocks before orchestrating a pump-and-dump.
              </p>
            </div>
            <span className="text-[11px] font-mono text-purple-400 mt-3 block">Defense: Search SEBI/FINRA Registers</span>
          </div>
        </div>
      )}

      {/* Interactive Regulatory FAQ Section (Rendered in 'all' and 'faq' view) */}
      {(activeGuideView === 'all' || activeGuideView === 'faq') && (
        <RegulatoryFaqSection jurisdiction={jurisdiction} />
      )}

      {/* Interactive Verification Checklist (Rendered in 'all' and 'checklist' view) */}
      {(activeGuideView === 'all' || activeGuideView === 'checklist') && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              The "Verify Before You Act" Interactive Investor Checklist
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md">
              {Object.values(checkedItems).filter(Boolean).length} of {checklist.length} Verified
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Before entering an order, making an escrow deposit, or acting on sudden market news, verify these statutory checks:
          </p>

          <div className="space-y-3 pt-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  checkedItems[item.id]
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                    checkedItems[item.id]
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  {checkedItems[item.id] && <CheckCircle className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="space-y-1">
                  <h4 className={`text-xs font-bold ${checkedItems[item.id] ? 'text-white' : 'text-slate-300'}`}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Official Directory & Redressal Links (Rendered in 'all' view) */}
      {activeGuideView === 'all' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            Official Statutory Reporting & Grievance Directory
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <a
              href="https://scores.sebi.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all group"
            >
              <span className="text-xs font-bold text-white block group-hover:text-cyan-400 transition-colors">
                SEBI SCORES 2.0 Portal
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Official grievance redressal for securities fraud and unauthorized stock tip entities.
              </span>
            </a>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all group"
            >
              <span className="text-xs font-bold text-white block group-hover:text-cyan-400 transition-colors">
                National Cyber Crime Portal (1930)
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                File immediate reports for fraudulent voice clone bank withdrawals and wire diversions.
              </span>
            </a>

            <a
              href="https://www.sec.gov/tcr"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all group"
            >
              <span className="text-xs font-bold text-white block group-hover:text-cyan-400 transition-colors">
                SEC Form TCR Portal
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Submit Tips, Complaints and Referrals for US securities fraud and deceptive AI statements.
              </span>
            </a>

            <a
              href="https://brokercheck.finra.org"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all group"
            >
              <span className="text-xs font-bold text-white block group-hover:text-cyan-400 transition-colors">
                FINRA BrokerCheck
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Verify registration, licensing, and disciplinary history of US broker-dealers and advisers.
              </span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
