import React, { useState } from 'react';
import { Shield, AlertOctagon, HelpCircle, CheckCircle, ExternalLink, Lightbulb, UserCheck, PhoneCall, Mail, Video, MessageSquare } from 'lucide-react';

export const InvestorProtectionGuide: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checklist = [
    {
      id: 'c1',
      title: 'Never act on video announcements without verifying on exchange disclosure feeds',
      desc: 'If a CEO appears in a video announcing resignation, sudden loss, or dividend cancellation, always cross-check at www.nseindia.com or www.bseindia.com under Corporate Announcements. Genuine material events must be filed with exchanges first under SEBI LODR Regulation 30.'
    },
    {
      id: 'c2',
      title: 'SEBI and Exchanges NEVER call demanding urgent escrow deposits or funds transfer',
      desc: 'Any telephone call or WhatsApp voice call claiming to be a "SEBI Enforcement Officer" or "Police Cyber Cell" threatening Demat account freeze unless you transfer money to a "safe escrow" is 100% an AI voice clone scam. Hang up immediately.'
    },
    {
      id: 'c3',
      title: 'Verify the SEBI Registration Number of anyone recommending stocks',
      desc: 'All legitimate stock advisers and research analysts must hold an active SEBI registration number (starting with INH... or INA...). Never pay for stock tips on Telegram or WhatsApp groups.'
    },
    {
      id: 'c4',
      title: 'Inspect Email Domains and Never Click "Settle Margin Shortfall" Links',
      desc: 'Exchanges send emails strictly from authenticated domains (e.g. @nse.co.in or @bseindia.com). Scammers register fake domains like @nseindia-settlement.cc or @nse-clearing.online to harvest broker credentials.'
    },
    {
      id: 'c5',
      title: 'Guaranteed or Assured Returns are ILLEGAL under Indian Securities Law',
      desc: 'Any message promising "100% guaranteed profit", "zero risk", or "insider whale group" is in direct violation of SEBI PFUTP regulations and indicates a pump-and-dump scheme.'
    }
  ];

  return (
    <div id="investor-protection-guide" className="space-y-6">
      {/* Guide Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            Retail & First-Generation Investor Defense Playbook
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Safeguarding Wealth in the Era of Generative AI Market Scams
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            First-time investors on social platforms are the primary targets of synthetic voice calls and deepfakes. Use this interactive verification checklist and emergency directory before executing any trade or fund transfer.
          </p>
        </div>
      </div>

      {/* Attack Modalities Visual Grid */}
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
              Emails mimicking NSE/BSE Clearing Corps claiming margin shortfalls with urgency links to steal credentials.
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
              Synthesized swarm tips claiming guaranteed multibagger returns in penny stocks before orchestrating a dump.
            </p>
          </div>
          <span className="text-[11px] font-mono text-purple-400 mt-3 block">Defense: Search SEBI RA Register</span>
        </div>
      </div>

      {/* Interactive Verification Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          The "Verify Before You Act" Interactive Investor Checklist
        </h3>
        <p className="text-xs text-slate-400">
          Before entering an order, making an escrow deposit, or acting on sudden market news, verify these checks:
        </p>

        <div className="space-y-3 pt-2">
          {checklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                checkedItems[item.id]
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
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

      {/* Official Directory */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ExternalLink className="w-4 h-4 text-cyan-400" />
          Official Statutory Reporting & Grievance Directory
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
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
              Official online complaint redressal for securities fraud and unauthorized intermediaries.
            </span>
          </a>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all group"
          >
            <span className="text-xs font-bold text-white block group-hover:text-cyan-400 transition-colors">
              National Cyber Crime Portal
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              File cyber financial fraud reports (Dial 1930 for immediate fraudulent bank transfer freezing).
            </span>
          </a>

          <a
            href="https://sachet.rbi.org.in"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all group"
          >
            <span className="text-xs font-bold text-white block group-hover:text-cyan-400 transition-colors">
              RBI Sachet Portal
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Verify unregistered deposit-taking schemes and fraudulent lending entities.
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
