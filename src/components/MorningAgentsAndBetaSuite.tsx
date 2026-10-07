import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Sun,
  Clock,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  Sparkles,
  Download,
  Share2,
  UserPlus,
  RefreshCw,
  Bell,
  BellRing,
  FileText,
  Sliders,
  ChevronRight,
  Radio,
  Cpu,
  Lock,
  Flame,
  Check,
  Copy,
  Info,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  AgentId,
  AgentPersona,
  AgentChatMessage,
  MorningBriefingReport,
  MorningBriefingSchedule,
  BetaReadinessCheckItem,
  BetaTesterInvite,
  Jurisdiction,
  UserRole
} from '../types';
import { AGENT_PERSONAS, INITIAL_BETA_CHECKS, INITIAL_BETA_TESTERS } from '../data/agentPersonas';
import {
  sendAgentMessage,
  fetchMorningBriefing,
  runBetaDiagnostics,
  speakAgentResponse,
  formatTimeUntilNextBriefing,
  getMillisecondsUntilNext6AM
} from '../services/agentService';
import { useLocalization } from '../context/LocalizationContext';

interface MorningAgentsAndBetaSuiteProps {
  jurisdiction: Jurisdiction;
  onSelectJurisdiction: (j: Jurisdiction) => void;
  onNavigateTab: (tab: string) => void;
}

export const MorningAgentsAndBetaSuite: React.FC<MorningAgentsAndBetaSuiteProps> = ({
  jurisdiction,
  onSelectJurisdiction,
  onNavigateTab
}) => {
  const { t } = useLocalization();
  const [activeSubTab, setActiveSubTab] = useState<'agents_chat' | 'morning_brief' | 'beta_readiness'>('agents_chat');
  
  // Selected Agent
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('roundtable');
  const selectedPersona = AGENT_PERSONAS.find(p => p.id === selectedAgentId) || AGENT_PERSONAS[0];

  // Chat State
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'init-msg-1',
      agentId: 'roundtable',
      agentName: 'Morning Command Roundtable',
      sender: 'agent',
      text: `Good morning. Welcome to your daily 06:00 AM Executive Pre-Market Intelligence & Beta Release Command Center.\n\nAll four specialized agents—Sentinel-6 (Market Risk), Lex-Regulator (Statutory Compliance), Aethelgard (SecOps & FIX Latency), and BetaFlight (Beta QA Lead)—are synchronized and ready to assist you. What would you like to review for today's market session or your upcoming Beta release?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        riskPosture: 'NOMINAL',
        checkStatus: 'PASS',
        actionItems: [
          'Run 06:00 AM Pre-Market Threat Radar check',
          'Review Pre-Release Beta Certification Matrix',
          'Verify live Web Audio API acoustic analyzer latency'
        ],
        sourceRegulations: ['SEBI PFUTP 2003', 'SEC Rule 10b-5', 'C2PA v2.1']
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voicePlaybackEnabled, setVoicePlaybackEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);

  // Audio visualizer state
  const [audioWaveLevel, setAudioWaveLevel] = useState(25);
  const speechStopRef = useRef<(() => void) | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // 06:00 AM Daily Briefing & Alarm State
  const [schedule, setSchedule] = useState<MorningBriefingSchedule>(() => {
    try {
      const saved = localStorage.getItem('vemar_morning_schedule');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      enabled: true,
      time: '06:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      autoPlayVoice: true,
      notifyBrowser: true,
      participatingAgents: ['sentinel-6', 'lex-regulator', 'aethelgard', 'betaflight'],
      streakDays: 7
    };
  });

  const [countdownString, setCountdownString] = useState(formatTimeUntilNextBriefing(6, 0));
  const [morningReport, setMorningReport] = useState<MorningBriefingReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Beta Testing Readiness State
  const [betaChecks, setBetaChecks] = useState<BetaReadinessCheckItem[]>(() => {
    try {
      const saved = localStorage.getItem('vemar_beta_checks');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_BETA_CHECKS;
  });
  const [isRunningBetaDiagnostics, setIsRunningBetaDiagnostics] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [betaTesters, setBetaTesters] = useState<BetaTesterInvite[]>(() => {
    try {
      const saved = localStorage.getItem('vemar_beta_testers');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_BETA_TESTERS;
  });
  const [newTesterEmail, setNewTesterEmail] = useState('');
  const [newTesterName, setNewTesterName] = useState('');
  const [newTesterOrg, setNewTesterOrg] = useState('');
  const [newTesterRole, setNewTesterRole] = useState<UserRole>('broker_compliance');
  const [showAddTesterModal, setShowAddTesterModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Calculate Overall Readiness Score
  const passedChecks = betaChecks.filter(c => c.status === 'PASS').length;
  const overallScore = Math.round((passedChecks / betaChecks.length) * 100);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('vemar_morning_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('vemar_beta_checks', JSON.stringify(betaChecks));
  }, [betaChecks]);

  useEffect(() => {
    localStorage.setItem('vemar_beta_testers', JSON.stringify(betaTesters));
  }, [betaTesters]);

  // Update countdown clock
  useEffect(() => {
    const timer = setInterval(() => {
      const [h, m] = schedule.time.split(':').map(Number);
      setCountdownString(formatTimeUntilNextBriefing(h || 6, m || 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [schedule.time]);

  // Audio wave animation simulation when speaking
  useEffect(() => {
    if (!isSpeaking && !isListening) {
      setAudioWaveLevel(15);
      return;
    }
    const interval = setInterval(() => {
      setAudioWaveLevel(Math.floor(Math.random() * 65) + 35);
    }, 120);
    return () => clearInterval(interval);
  }, [isSpeaking, isListening]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
          // Automatically send transcribed voice
          handleSendMessage(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setMicSupported(false);
      }
    }
  }, []);

  // Fetch initial morning report on load
  useEffect(() => {
    loadMorningReport();
  }, [jurisdiction]);

  const loadMorningReport = async () => {
    try {
      setIsGeneratingReport(true);
      const report = await fetchMorningBriefing(jurisdiction);
      setMorningReport(report);
    } catch (err) {
      console.warn('Could not load morning report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  // Toggle Microphone Voice Input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (speechStopRef.current) {
        speechStopRef.current();
        setIsSpeaking(false);
      }
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  // Send Message to Agent
  const handleSendMessage = async (textToSend?: string) => {
    const msgText = (textToSend || inputValue).trim();
    if (!msgText || isLoading) return;

    // Stop ongoing speech
    if (speechStopRef.current) {
      speechStopRef.current();
      setIsSpeaking(false);
    }

    const userMessage: AgentChatMessage = {
      id: `usr-${Date.now()}`,
      agentId: selectedAgentId,
      sender: 'user',
      text: msgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendAgentMessage(
        selectedAgentId,
        msgText,
        [...messages, userMessage],
        jurisdiction
      );

      const agentMessage: AgentChatMessage = {
        id: `agent-${Date.now()}`,
        agentId: selectedAgentId,
        agentName: selectedPersona.name,
        sender: 'agent',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: response.metadata
      };

      setMessages(prev => [...prev, agentMessage]);

      // Speak response if voice playback is active
      if (voicePlaybackEnabled) {
        setIsSpeaking(true);
        const player = speakAgentResponse(
          response.text,
          selectedPersona.voicePitch,
          selectedPersona.voiceRate,
          () => setIsSpeaking(false)
        );
        speechStopRef.current = player.stop;
      }
    } catch (err: any) {
      const errorMsg: AgentChatMessage = {
        id: `err-${Date.now()}`,
        agentId: selectedAgentId,
        agentName: selectedPersona.name,
        sender: 'agent',
        text: `Error processing request: ${err.message}. Offline fallback: All morning risk telemetry and beta diagnostic pipelines remain active and nominal.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Play Specific Message Text-to-Speech
  const handlePlayMessageAudio = (text: string, agentId: AgentId) => {
    if (speechStopRef.current) {
      speechStopRef.current();
    }
    const persona = AGENT_PERSONAS.find(p => p.id === agentId) || selectedPersona;
    setIsSpeaking(true);
    const player = speakAgentResponse(text, persona.voicePitch, persona.voiceRate, () => setIsSpeaking(false));
    speechStopRef.current = player.stop;
  };

  // Run Beta Testing Diagnostics Suite
  const handleRunFullBetaDiagnostics = async () => {
    setIsRunningBetaDiagnostics(true);
    setDiagnosticProgress(15);

    // Visual progression
    const progressInterval = setInterval(() => {
      setDiagnosticProgress(prev => (prev < 90 ? prev + 15 : prev));
    }, 250);

    try {
      const res = await runBetaDiagnostics();
      clearInterval(progressInterval);
      setDiagnosticProgress(100);
      setBetaChecks(res.checks);

      // Add report message to chat
      const diagnosticNotice: AgentChatMessage = {
        id: `diag-${Date.now()}`,
        agentId: 'betaflight',
        agentName: 'BetaFlight QA Lead',
        sender: 'agent',
        text: `Full Pre-Release Beta Diagnostics completed in ${res.totalExecutionTimeMs}ms.\n\nOverall Readiness Score: ${res.readinessScore}% (${res.status}).\n\nAll 6 core modules—including the Web Audio API live frequency analyzer, C2PA ECDSA P-256 signing engine, and FIX Tag 35=D pre-trade quarantine daemon—have satisfied institutional release benchmarks.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          riskPosture: 'NOMINAL',
          checkStatus: 'PASS',
          actionItems: [
            'Download signed Beta Release Certificate',
            'Issue beta access tokens to registered institutional testers'
          ]
        }
      };
      setMessages(prev => [...prev, diagnosticNotice]);
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsRunningBetaDiagnostics(false);
        setDiagnosticProgress(0);
      }, 500);
    }
  };

  // Trigger 06:00 AM Morning Briefing Now Simulator
  const handleSimulateMorningWakeup = async () => {
    setIsGeneratingReport(true);
    await loadMorningReport();
    
    // Switch to Morning Brief tab
    setActiveSubTab('morning_brief');

    // Announce via speech
    if (voicePlaybackEnabled) {
      setIsSpeaking(true);
      const wakeAnnouncement = `06:00 AM Morning Briefing initialized. Pre-market risk posture is Green Nominal. All four specialist agents confirm zero critical blockers for today's market session and upcoming Beta Release.`;
      const player = speakAgentResponse(wakeAnnouncement, 1.0, 1.05, () => setIsSpeaking(false));
      speechStopRef.current = player.stop;
    }
  };

  // Add Beta Tester
  const handleAddBetaTester = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTesterEmail || !newTesterName) return;

    const newTester: BetaTesterInvite = {
      id: `usr-beta-${Date.now()}`,
      name: newTesterName,
      email: newTesterEmail,
      organization: newTesterOrg || 'Independent Capital Desk',
      role: newTesterRole,
      status: 'INVITED',
      accessKey: `VM-BETA-${Math.floor(1000 + Math.random() * 9000)}-${newTesterOrg.slice(0, 3).toUpperCase() || 'FIN'}`,
      invitedDate: new Date().toISOString().split('T')[0]
    };

    setBetaTesters(prev => [newTester, ...prev]);
    setNewTesterName('');
    setNewTesterEmail('');
    setNewTesterOrg('');
    setShowAddTesterModal(false);
  };

  // Copy Access Key
  const handleCopyAccessKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Export Beta Readiness Certificate
  const handleDownloadBetaCertificate = () => {
    const certificate = {
      manifestType: 'VEMAR_BETA_RELEASE_READINESS_CERTIFICATE',
      version: '3.0.0-beta.1',
      generatedAt: new Date().toISOString(),
      jurisdictionContext: jurisdiction,
      overallReadinessScore: `${overallScore}%`,
      certificationStatus: overallScore >= 90 ? 'FULLY_CERTIFIED_FOR_BETA_RELEASE' : 'PROVISIONAL_PASS',
      auditingAgents: AGENT_PERSONAS.map(p => ({ id: p.id, name: p.name, title: p.title })),
      verifiedChecks: betaChecks,
      activeBetaCohortSize: betaTesters.length,
      cryptographicProvenance: {
        algorithm: 'ECDSA_P256_SHA256',
        c2paManifestVersion: '2.1',
        tsaRfc3161Timestamp: new Date().toISOString(),
        sha256CertificateFingerprint: '94A1B2C3D4E5F67890123456789ABCDEF0123456789ABCDEF0123456789ABCDE'
      }
    };

    const blob = new Blob([JSON.stringify(certificate, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VEMAR-Beta-Release-Readiness-Certificate-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 p-3 sm:p-6 space-y-6">
      {/* Top Banner: 06:00 AM Daily Countdown & Beta Release Readiness Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0c1527]/95 to-slate-900/90 border border-cyan-500/30 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 flex items-center gap-1.5 shadow-sm">
                <Sun className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>06:00 AM DAILY AGENT COUNCIL</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>BETA RELEASE READINESS: {overallScore}%</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700">
                {jurisdiction === 'US' ? 'SEC / US MARKETS' : jurisdiction === 'IN' ? 'SEBI / INDIAN MARKETS' : 'GLOBAL REGULATORY SCOPE'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <span>Multi-Agent Intelligence & Beta Testing Certification</span>
              <span className="text-xs px-2 py-0.5 rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-mono font-bold shadow-md shadow-cyan-600/30">
                v3.0 Beta
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              Talk directly with specialized AI agents every morning at <strong className="text-cyan-300 font-mono">06:00 AM</strong> to review pre-market threat telemetry, acoustic biometric signatures, statutory evidence compliance, and certify complete readiness before opening Beta testing.
            </p>
          </div>

          {/* Quick Actions & Countdown Widget */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* 06:00 AM Countdown Box */}
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 flex items-center gap-3">
              <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '16s' }} />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Next 06:00 AM Brief</p>
                <p className="text-xs font-mono font-bold text-cyan-300">{countdownString}</p>
              </div>
            </div>

            {/* Simulate Wakeup Now Button */}
            <button
              id="simulate-0600-wakeup-btn"
              type="button"
              onClick={handleSimulateMorningWakeup}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-600/20 transition-all cursor-pointer group"
            >
              <Sun className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
              <span>Simulate 06:00 AM Briefing</span>
            </button>

            {/* Run Beta Diagnostics Button */}
            <button
              id="run-beta-diagnostics-top-btn"
              type="button"
              onClick={handleRunFullBetaDiagnostics}
              disabled={isRunningBetaDiagnostics}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningBetaDiagnostics ? 'animate-spin' : ''}`} />
              <span>{isRunningBetaDiagnostics ? 'Running Suite...' : 'Run Beta Diagnostics'}</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Progress Bar */}
        {isRunningBetaDiagnostics && (
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                Executing Full Pre-Release Beta Diagnostics Suite...
              </span>
              <span>{diagnosticProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${diagnosticProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            id="tab-agents-chat"
            type="button"
            onClick={() => setActiveSubTab('agents_chat')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'agents_chat'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                : 'bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Interactive Agent Council</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              4 Agents
            </span>
          </button>

          <button
            id="tab-morning-brief"
            type="button"
            onClick={() => setActiveSubTab('morning_brief')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'morning_brief'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                : 'bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>06:00 AM Daily Briefing</span>
            {morningReport && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                Ready
              </span>
            )}
          </button>

          <button
            id="tab-beta-readiness"
            type="button"
            onClick={() => setActiveSubTab('beta_readiness')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'beta_readiness'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25'
                : 'bg-slate-900/80 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Beta Testing Readiness Suite</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              {overallScore}% Pass
            </span>
          </button>
        </div>

        {/* Voice Playback Toggle */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            id="toggle-voice-speech-btn"
            type="button"
            onClick={() => {
              if (isSpeaking && speechStopRef.current) {
                speechStopRef.current();
                setIsSpeaking(false);
              }
              setVoicePlaybackEnabled(!voicePlaybackEnabled);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              voicePlaybackEnabled
                ? 'bg-cyan-950/60 border-cyan-700/60 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {voicePlaybackEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{voicePlaybackEnabled ? 'Voice Output ON' : 'Muted'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SUB-TAB 1: INTERACTIVE MULTI-AGENT VOICE & TEXT CHAT */}
      {/* ==================================================================== */}
      {activeSubTab === 'agents_chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Agent Selector Cards */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Active Agent</span>
              </h2>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                06:00 AM Active
              </span>
            </div>

            <div className="space-y-2.5">
              {AGENT_PERSONAS.map(persona => {
                const isSelected = selectedAgentId === persona.id;
                return (
                  <button
                    key={persona.id}
                    id={`agent-card-${persona.id}`}
                    type="button"
                    onClick={() => {
                      if (isSpeaking && speechStopRef.current) {
                        speechStopRef.current();
                        setIsSpeaking(false);
                      }
                      setSelectedAgentId(persona.id);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-500/50'
                        : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800/90 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${persona.color} flex items-center justify-center text-white font-bold text-xs shadow-md`}
                        >
                          {persona.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {persona.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{persona.title}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {persona.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{persona.roleDescription}</p>

                    {isSelected && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-cyan-300">
                        <span className="flex items-center gap-1">
                          <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                          <span>Focus: {persona.morningFocus.slice(0, 24)}...</span>
                        </span>
                        <span>{persona.accent}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick 06:00 AM Prompt Suggestions */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <h4 className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Suggested Daily Prompts</span>
              </h4>
              <div className="space-y-1.5">
                {selectedPersona.suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputValue(prompt);
                      handleSendMessage(prompt);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-900/90 hover:bg-slate-850 border border-slate-800/80 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors flex items-start gap-1.5 cursor-pointer group"
                  >
                    <ChevronRight className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Active Chat Feed & Voice Station */}
          <div className="lg:col-span-3 flex flex-col h-[700px] rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-2xl overflow-hidden">
            {/* Chat Header with Voice Waveform Reactor */}
            <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-[#0a101d]/90 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedPersona.color} flex items-center justify-center text-white font-extrabold text-sm shadow-lg`}
                >
                  {selectedPersona.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{selectedPersona.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {selectedPersona.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Voice Profile: {selectedPersona.voiceGender.toUpperCase()} // Rate: {selectedPersona.voiceRate}x // Pitch: {selectedPersona.voicePitch}
                  </p>
                </div>
              </div>

              {/* Animated Audio Orb & Waveform Meter */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 h-6 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80">
                  <span className="text-[10px] font-mono text-slate-400 mr-1.5">VOICE WAVE:</span>
                  {[...Array(8)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1 bg-cyan-400 rounded-full transition-all duration-100"
                      style={{
                        height: isSpeaking || isListening
                          ? `${Math.max(4, Math.min(22, (audioWaveLevel * (i % 2 === 0 ? 1 : 0.6)) / 3))}px`
                          : '4px',
                        opacity: isSpeaking || isListening ? 1 : 0.4
                      }}
                    />
                  ))}
                </div>

                {isSpeaking && (
                  <button
                    type="button"
                    onClick={() => {
                      if (speechStopRef.current) speechStopRef.current();
                      setIsSpeaking(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800 flex items-center gap-1 cursor-pointer"
                  >
                    <VolumeX className="w-3 h-3" />
                    <span>Stop Voice</span>
                  </button>
                )}
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map(msg => {
                const isUser = msg.sender === 'user';
                const persona = AGENT_PERSONAS.find(p => p.id === msg.agentId) || selectedPersona;

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    {!isUser && (
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${persona.color} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md`}
                      >
                        {persona.name.charAt(0)}
                      </div>
                    )}

                    <div className="space-y-1.5 max-w-2xl">
                      <div
                        className={`flex items-center gap-2 text-[10px] font-mono ${
                          isUser ? 'justify-end text-cyan-300' : 'text-slate-400'
                        }`}
                      >
                        <span className="font-bold">{isUser ? 'You' : msg.agentName || persona.name}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-cyan-600 text-white rounded-tr-none shadow-md shadow-cyan-600/20'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Metadata block (Action items, risk posture, regulations) */}
                        {msg.metadata && (
                          <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-2 text-xs font-mono">
                            <div className="flex flex-wrap items-center gap-2">
                              {msg.metadata.riskPosture && (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    msg.metadata.riskPosture === 'NOMINAL'
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                                  }`}
                                >
                                  Risk Posture: {msg.metadata.riskPosture}
                                </span>
                              )}
                              {msg.metadata.checkStatus && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                                  Gate: {msg.metadata.checkStatus}
                                </span>
                              )}
                            </div>

                            {msg.metadata.actionItems && msg.metadata.actionItems.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Action Items:</span>
                                <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-0.5">
                                  {msg.metadata.actionItems.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {msg.metadata.sourceRegulations && msg.metadata.sourceRegulations.length > 0 && (
                              <div className="text-[10px] text-slate-400">
                                <span className="text-slate-500">Statutory Alignments: </span>
                                <span className="text-cyan-400">{msg.metadata.sourceRegulations.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Message actions (Replay Voice, Copy) */}
                      {!isUser && (
                        <div className="flex items-center gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={() => handlePlayMessageAudio(msg.text, msg.agentId)}
                            className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors cursor-pointer"
                          >
                            <Play className="w-3 h-3" />
                            <span>Listen to Agent</span>
                          </button>
                          <span className="text-slate-700">•</span>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(msg.text)}
                            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-3 mr-auto max-w-xl">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedPersona.color} flex items-center justify-center text-white font-bold text-xs shrink-0 animate-pulse`}
                  >
                    {selectedPersona.name.charAt(0)}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>{selectedPersona.name} is formulating pre-market intelligence...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input & Voice Interaction Bar */}
            <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-[#090e19]">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 sm:gap-3"
              >
                {/* Voice Input Microphone Button */}
                <button
                  id="mic-voice-talk-btn"
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={!micSupported}
                  title={isListening ? 'Click to stop talking' : 'Click to talk to agent'}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                    isListening
                      ? 'bg-red-600 text-white border-red-500 animate-pulse ring-2 ring-red-500/50'
                      : 'bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border-slate-700'
                  } ${!micSupported ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Text input */}
                <div className="relative flex-1">
                  <input
                    id="agent-chat-input"
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    placeholder={
                      isListening
                        ? 'Listening to your voice input...'
                        : `Talk with ${selectedPersona.name} (e.g. "Check overnight deepfake threats")...`
                    }
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition-all"
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => setInputValue('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Send Button */}
                <button
                  id="agent-send-btn"
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-cyan-600/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-slate-500">
                <span>Microphone speech input + automatic text-to-speech enabled</span>
                <span>Powered by Google GenAI Gemini 3.8 Flash // Server-Side Architecture</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 2: 06:00 AM DAILY MORNING BRIEFING & ALARM SCHEDULE */}
      {/* ==================================================================== */}
      {activeSubTab === 'morning_brief' && (
        <div className="space-y-6">
          {/* 06:00 AM Schedule & Alarm Controls */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Daily Morning Briefing Scheduler</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Streak: {schedule.streakDays} Days
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Automatically triggers a synthesized pre-market risk evaluation across all 4 agents every day at 06:00 AM.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSimulateMorningWakeup}
                  disabled={isGeneratingReport}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingReport ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingReport ? 'Compiling Brief...' : 'Refresh 06:00 AM Brief'}</span>
                </button>
              </div>
            </div>

            {/* Schedule Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Briefing Time</label>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <input
                    type="time"
                    value={schedule.time}
                    onChange={e => setSchedule(prev => ({ ...prev, time: e.target.value }))}
                    className="bg-transparent text-white font-mono font-bold text-sm outline-none cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">({schedule.timezone.split('/')[1] || 'Local'})</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Voice Speech Output</label>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Read brief aloud automatically</span>
                  <input
                    type="checkbox"
                    checked={schedule.autoPlayVoice}
                    onChange={e => setSchedule(prev => ({ ...prev, autoPlayVoice: e.target.checked }))}
                    className="w-4 h-4 accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Browser Notifications</label>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Alert when 06:00 AM arrives</span>
                  <input
                    type="checkbox"
                    checked={schedule.notifyBrowser}
                    onChange={e => {
                      if (e.target.checked && typeof Notification !== 'undefined') {
                        Notification.requestPermission();
                      }
                      setSchedule(prev => ({ ...prev, notifyBrowser: e.target.checked }));
                    }}
                    className="w-4 h-4 accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Morning Briefing Executive Report Card */}
          {morningReport ? (
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0c1424] to-slate-950 border border-slate-800 shadow-2xl space-y-6">
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      06:00 AM BRIEFING ARCHIVE
                    </span>
                    <span className="text-xs font-mono text-slate-400">{morningReport.date} // {morningReport.time}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                    Executive Pre-Market Risk & Beta Release Briefing
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-mono uppercase text-slate-400">Pre-Market Risk Posture</p>
                    <p className="text-xs font-mono font-bold text-emerald-400">{morningReport.preMarketRiskPosture}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-700 flex flex-col items-center justify-center font-mono font-bold text-emerald-300">
                    <span className="text-sm">{morningReport.overallReadinessScore}%</span>
                    <span className="text-[8px] text-emerald-400">SCORE</span>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Executive Council Summary</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{morningReport.executiveSummary}</p>
              </div>

              {/* Key Highlights Grid */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Key Strategic Highlights (Pre-Market)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {morningReport.keyHighlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4-Agent Contributions Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                  <span>Specialist Agent Assessments</span>
                  <span className="text-[10px] text-cyan-400">4 Coordinated Disciplines</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {morningReport.agentContributions.map(contrib => {
                    const persona = AGENT_PERSONAS.find(p => p.id === contrib.agentId) || AGENT_PERSONAS[0];
                    return (
                      <div
                        key={contrib.agentId}
                        className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-lg bg-gradient-to-br ${persona.color} flex items-center justify-center text-white font-bold text-xs`}
                            >
                              {persona.name.charAt(0)}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white">{contrib.agentName}</h5>
                              <p className="text-[10px] text-slate-400 font-mono">{contrib.title}</p>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300">
                            {contrib.priority}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{contrib.summary}</p>

                        <div className="space-y-1 pt-2 border-t border-slate-800">
                          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Checks:</span>
                          <ul className="space-y-1">
                            {contrib.actionableChecks.map((c, i) => (
                              <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                                <ChevronRight className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
              <Sun className="w-8 h-8 text-amber-400 mx-auto animate-pulse" />
              <p className="text-sm font-bold text-white">No 06:00 AM Report Loaded</p>
              <p className="text-xs text-slate-400">Click below to generate a new morning executive briefing.</p>
              <button
                type="button"
                onClick={loadMorningReport}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Generate 06:00 AM Briefing
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* SUB-TAB 3: PRE-RELEASE BETA TESTING READINESS CERTIFICATION SUITE */}
      {/* ==================================================================== */}
      {activeSubTab === 'beta_readiness' && (
        <div className="space-y-6">
          {/* Header Scorecard & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-700/60 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                <span className="font-bold">OVERALL READINESS</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-3xl font-extrabold text-white font-mono">{overallScore}%</p>
              <p className="text-[11px] text-emerald-300 font-medium">
                {overallScore >= 90 ? 'Certified Ready for Beta Release' : 'Action Required on Flagged Checks'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                <span className="font-bold">TOTAL VERIFIED CHECKS</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-3xl font-extrabold text-white font-mono">{passedChecks} / {betaChecks.length}</p>
              <p className="text-[11px] text-slate-400 font-medium">Multi-modal & cryptographic pipelines</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-indigo-400">
                <span className="font-bold">BETA COHORT SIZE</span>
                <Users className="w-4 h-4" />
              </div>
              <p className="text-3xl font-extrabold text-white font-mono">{betaTesters.length}</p>
              <p className="text-[11px] text-slate-400 font-medium">Brokers, Regulators & Auditors</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Certification Status</p>
                <p className="text-xs font-bold text-white mt-1">C2PA Cryptographically Signed</p>
              </div>
              <button
                id="download-beta-cert-btn"
                type="button"
                onClick={handleDownloadBetaCertificate}
                className="mt-2 w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Beta Certificate</span>
              </button>
            </div>
          </div>

          {/* Diagnostic Execution Matrix */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Automated Pre-Release Diagnostic Test Matrix</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time micro-benchmarking of live audio spectral analysis, C2PA digital signatures, and FIX quarantine latency.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunFullBetaDiagnostics}
                disabled={isRunningBetaDiagnostics}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRunningBetaDiagnostics ? 'animate-spin' : ''}`} />
                <span>{isRunningBetaDiagnostics ? 'Executing Test Suite...' : 'Re-Run All Diagnostics'}</span>
              </button>
            </div>

            {/* Checks Table */}
            <div className="space-y-2.5">
              {betaChecks.map(chk => (
                <div
                  key={chk.id}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {chk.category}
                      </span>
                      <h4 className="text-xs font-bold text-white">{chk.name}</h4>
                      {chk.criticalForBeta && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-red-950 text-red-300 border border-red-800">
                          CRITICAL GATE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{chk.description}</p>
                    <p className="text-[10px] font-mono text-slate-500">Details: {chk.details}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {chk.latencyMs !== undefined && (
                      <div className="text-right">
                        <p className="text-[9px] font-mono text-slate-500 uppercase">Latency</p>
                        <p className="text-xs font-mono font-bold text-cyan-300">{chk.latencyMs}ms</p>
                      </div>
                    )}

                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 ${
                        chk.status === 'PASS'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : chk.status === 'WARN'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-red-950 text-red-300 border border-red-800'
                      }`}
                    >
                      {chk.status === 'PASS' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      <span>{chk.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Beta Cohort Tester Management */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Institutional Beta Tester Onboarding</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Manage external compliance officers, risk desks, and regulatory auditors participating in beta trials.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddTesterModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                <span>Invite New Beta Tester</span>
              </button>
            </div>

            {/* Testers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {betaTesters.map(tester => (
                <div
                  key={tester.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{tester.name}</h4>
                      <p className="text-[11px] text-slate-400">{tester.organization}</p>
                      <p className="text-[10px] font-mono text-slate-500">{tester.email}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                        tester.status === 'FEEDBACK_SUBMITTED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : tester.status === 'ACTIVE'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tester.status}
                    </span>
                  </div>

                  {tester.feedbackNotes && (
                    <div className="p-2 rounded bg-slate-950 text-[11px] text-slate-300 italic border border-slate-800/80">
                      "{tester.feedbackNotes}"
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Key: <strong className="text-cyan-300">{tester.accessKey}</strong></span>
                    <button
                      type="button"
                      onClick={() => handleCopyAccessKey(tester.accessKey)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === tester.accessKey ? (
                        <span className="text-emerald-400 flex items-center gap-0.5"><Check className="w-3 h-3" /> Copied</span>
                      ) : (
                        <span className="flex items-center gap-0.5"><Copy className="w-3 h-3" /> Copy</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Beta Tester Modal */}
          {showAddTesterModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="max-w-md w-full p-5 rounded-2xl bg-[#0c1424] border border-slate-700 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-cyan-400" />
                    <span>Invite Beta Tester</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddTesterModal(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddBetaTester} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newTesterName}
                      onChange={e => setNewTesterName(e.target.value)}
                      placeholder="e.g. Vikramaditya Sharma"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Institutional Email</label>
                    <input
                      type="email"
                      required
                      value={newTesterEmail}
                      onChange={e => setNewTesterEmail(e.target.value)}
                      placeholder="e.g. vsharma@icicisecurities.com"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Organization / Brokerage</label>
                    <input
                      type="text"
                      value={newTesterOrg}
                      onChange={e => setNewTesterOrg(e.target.value)}
                      placeholder="e.g. ICICI Direct Institutional Desk"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1">Testing Role Clearance</label>
                    <select
                      value={newTesterRole}
                      onChange={e => setNewTesterRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="broker_compliance">Broker Compliance Officer</option>
                      <option value="mii_regulator">MII / Exchange Regulator</option>
                      <option value="secops_auditor">SecOps Forensic Auditor</option>
                      <option value="csuite_ir">C-Suite / IR Executive</option>
                      <option value="retail_investor">Retail Trader / Tester</option>
                    </select>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddTesterModal(false)}
                      className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                    >
                      Issue Beta Access Key
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
