import React from 'react';
import {
  ShieldCheck,
  Briefcase,
  Landmark,
  Zap,
  Cpu,
  TrendingUp,
  Activity,
  FileCheck,
  Search,
  Lock,
  ArrowUpRight,
  Server,
  AlertTriangle,
  Play
} from 'lucide-react';
import { UserRole, Jurisdiction } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface CustomerMissionControlProps {
  currentRole: UserRole;
  jurisdiction: Jurisdiction;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onLaunchQuickScenario?: (scenarioType: string) => void;
}

export const CustomerMissionControl: React.FC<CustomerMissionControlProps> = ({
  currentRole,
  jurisdiction,
  activeTab,
  onNavigateTab,
  onLaunchQuickScenario
}) => {
  const { isHindi } = useLocalization();
  const isIndia = jurisdiction === 'IN';

  // Persona configurations
  const personaData = {
    retail_investor: {
      title: isHindi ? 'खुदरा निवेशक सुरक्षा कवच' : 'Retail Investor Protective Shield',
      badge: isHindi ? 'सुरक्षा मोड' : 'RETAIL DEFENSE ACTIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: ShieldCheck,
      desc: isHindi
        ? 'फर्जी व्हाट्सएप/टेलीग्राम पंप ग्रुप्स, नकली सेबी नोटिस और डीपफेक वॉयस कॉल्स की तुरंत पहचान करें।'
        : 'Continuous multi-modal protection against lookalike broker apps, fake SEBI circulars, and AI voice cloned trading calls.',
      actions: [
        {
          label: isHindi ? 'वॉयस क्लोन (विशिंग) स्कैन' : 'Test Voice Clone Attack',
          icon: Zap,
          tab: 'scanner',
          scenario: 'audio_call'
        },
        {
          label: isHindi ? 'सेबी मध्यस्थ पंजीकरण जांच' : 'Verify Broker Registration',
          icon: Search,
          tab: 'authenticator',
          scenario: 'sebi_reg'
        },
        {
          label: isHindi ? 'निवेशक धोखाधड़ी रोकथाम मार्गदर्शिका' : 'Protection Checklist',
          icon: FileCheck,
          tab: 'guide',
          scenario: 'checklist'
        }
      ]
    },
    broker_compliance: {
      title: isHindi ? 'ब्रोकर सर्विलांस एवं प्री-ट्रेड कम्प्लायंस' : 'Broker Surveillance & Trade Compliance Station',
      badge: isHindi ? 'ब्रोकर डेस्क' : 'FIX & VOICE GATEWAY',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      icon: Briefcase,
      desc: isHindi
        ? 'टेलीफोनिक ऑर्डर रिकॉर्डिंग वॉयस सत्यापन, <380ms एफआईएक्स 4.4 प्री-ट्रेड क्वारंटाइन एवं सेबी सीएसआरएफ ऑडिट ट्रेल्स।'
        : 'In-line telephonic order verification, sub-380ms FIX 4.4 pre-trade quarantine, and SEBI CSCRF / SEC Rule 17a-4 statutory compliance logging.',
      actions: [
        {
          label: isHindi ? 'एफआईएक्स 4.4 प्री-ट्रेड हॉल्ट टेस्ट' : 'Test FIX 4.4 Pre-Trade Halt',
          icon: Play,
          tab: 'vemar_arch',
          scenario: 'fix_halt'
        },
        {
          label: isHindi ? 'उद्योग कमियां (8 Gaps) विश्लेषण' : 'Review 8 Industry Gaps',
          icon: AlertTriangle,
          tab: 'vemar_gaps',
          scenario: 'gaps'
        },
        {
          label: isHindi ? 'एसआईईएम एवं सिस्लॉग इंटीग्रेशन' : 'SIEM & OMS Configuration',
          icon: Server,
          tab: 'enterprise',
          scenario: 'siem'
        }
      ]
    },
    mii_regulator: {
      title: isHindi ? 'एक्सचेंज एवं रेगुलेटर सर्विलांस कंट्रोल' : 'Market Infrastructure & Exchange Surveillance',
      badge: isHindi ? 'एमआईआई / नियामक' : 'MII REAL-TIME RADAR',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: Landmark,
      desc: isHindi
        ? 'क्रॉस-ब्रोकर एआई सिंडिकेट डिटेक्शन, एल्गोरिद्मिक एब्यूज रडार एवं प्रत्यक्ष सेबी स्कोर्स 2.0 / एसईसी टीसीआर फाइलिंग।'
        : 'Cross-broker syndicated market abuse detection, algorithmic spoofing correlation, and automated statutory complaint filing.',
      actions: [
        {
          label: isHindi ? 'लाइव सर्विलांस रडार' : 'Open Surveillance Radar',
          icon: Activity,
          tab: 'radar',
          scenario: 'radar'
        },
        {
          label: isHindi ? 'सी2पीए क्रिप्टोग्राफिक सिद्धता' : 'Verify C2PA Provenance',
          icon: Lock,
          tab: 'provenance',
          scenario: 'c2pa'
        },
        {
          label: isHindi ? 'द्वैध संस्थागत पिच एवं तकनीकी मूट' : 'Institutional Thesis & Moats',
          icon: TrendingUp,
          tab: 'investor_pitch',
          scenario: 'pitch'
        }
      ]
    }
  };

  const currentPersona = personaData[currentRole] || personaData.retail_investor;
  const PersonaIcon = currentPersona.icon;

  return (
    <div
      id="customer-mission-control-bar"
      className="bg-slate-900/80 backdrop-blur-xl border-y border-slate-800/80 px-4 sm:px-6 py-2.5 shadow-lg relative z-10"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Persona Focus & Dynamic Overview */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0 text-cyan-400">
            <PersonaIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-white tracking-tight">
                {currentPersona.title}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${currentPersona.badgeColor}`}
              >
                {currentPersona.badge}
              </span>
              <span className="text-[10px] font-mono text-slate-400 hidden lg:inline">
                • {isIndia ? '🇮🇳 Google Cloud India (Mumbai)' : '🇺🇸 Google Cloud US Sovereign'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-xl mt-0.5 hidden sm:block">
              {currentPersona.desc}
            </p>
          </div>
        </div>

        {/* Right: Contextual Quick-Action Launchers */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-start md:justify-end">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold hidden xl:inline">
            {isHindi ? 'त्वरित कार्य:' : 'Quick Actions:'}
          </span>

          {currentPersona.actions.map((act) => {
            const ActionIcon = act.icon;
            const isCurrentActiveTab = activeTab === act.tab;
            return (
              <button
                key={act.label}
                type="button"
                onClick={() => {
                  onNavigateTab(act.tab);
                  if (onLaunchQuickScenario) {
                    onLaunchQuickScenario(act.scenario);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                  isCurrentActiveTab
                    ? 'bg-cyan-600 text-white shadow-cyan-600/25 ring-1 ring-cyan-400'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80'
                }`}
              >
                <ActionIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate">{act.label}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-60" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
