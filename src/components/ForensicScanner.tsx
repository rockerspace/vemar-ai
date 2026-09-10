import React, { useState } from 'react';
import {
  Upload,
  Mic,
  MicOff,
  FileText,
  Video,
  PhoneCall,
  Mail,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Sliders,
  Scale,
  Activity,
  Layers,
  FileDown
} from 'lucide-react';
import { BENCHMARK_CASES } from '../data/benchmarkCases';
import { BenchmarkCase, ForensicAnalysisResult, ThreatChannel, UserRole, Jurisdiction } from '../types';
import { analyzeSyntheticContent } from '../services/api';
import { AudioBiometricVisualizer } from './AudioBiometricVisualizer';
import { VisualArtifactInspector } from './VisualArtifactInspector';
import { IncidentDossierModal } from './IncidentDossierModal';
import { downloadForensicAuditReport } from '../utils/pdfExport';
import { useAuth } from '../context/AuthContext';

interface ForensicScannerProps {
  currentRole: UserRole;
  jurisdiction?: Jurisdiction;
}

export const ForensicScanner: React.FC<ForensicScannerProps> = ({
  currentRole,
  jurisdiction = 'IN' as Jurisdiction
}) => {
  const { user } = useAuth();
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  // Active selected channel
  const [selectedChannel, setSelectedChannel] = useState<ThreatChannel>('video_frame');
  
  // Filter benchmark cases by jurisdiction
  const relevantBenchmarks = React.useMemo(() => {
    return BENCHMARK_CASES.filter((b) => b.jurisdiction === jurisdiction || jurisdiction === 'GLOBAL');
  }, [jurisdiction]);

  // Selected benchmark or custom input
  const [activeBenchmark, setActiveBenchmark] = useState<BenchmarkCase | null>(
    relevantBenchmarks[0] || BENCHMARK_CASES[0]
  );
  const [inputText, setInputText] = useState((relevantBenchmarks[0] || BENCHMARK_CASES[0]).sampleContent);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedAudio, setUploadedAudio] = useState<string | null>(null);

  // Update active benchmark when jurisdiction changes
  React.useEffect(() => {
    const firstMatch = BENCHMARK_CASES.find((b) => b.jurisdiction === jurisdiction && b.channel === selectedChannel)
      || BENCHMARK_CASES.find((b) => b.jurisdiction === jurisdiction)
      || BENCHMARK_CASES[0];

    if (firstMatch) {
      setActiveBenchmark(firstMatch);
      setSelectedChannel(firstMatch.channel);
      setInputText(firstMatch.sampleContent);
      setUploadedImage(null);
      setUploadedAudio(null);
      setAnalysisResult(null);
    }
  }, [jurisdiction]);

  // Microphone recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);

  // Analysis result state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ForensicAnalysisResult | null>(null);
  const [analysisEngineSource, setAnalysisEngineSource] = useState<string>('');
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Handle Benchmark Selection
  const handleSelectBenchmark = (caseItem: BenchmarkCase) => {
    setActiveBenchmark(caseItem);
    setSelectedChannel(caseItem.channel);
    setInputText(caseItem.sampleContent);
    setUploadedImage(null);
    setUploadedAudio(null);
    setAnalysisResult(null);
  };

  // Handle File Upload (Image)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setActiveBenchmark(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle File Upload (Audio)
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedAudio(reader.result as string);
      setActiveBenchmark(null);
    };
    reader.readAsDataURL(file);
  };

  // Live Microphone Toggle
  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = () => {
            setUploadedAudio(reader.result as string);
          };
          reader.readAsDataURL(audioBlob);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        setActiveBenchmark(null);
      } catch (err) {
        console.error('Microphone access denied:', err);
      }
    }
  };

  // Execute Neural Forensic Analysis
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await analyzeSyntheticContent({
        channel: selectedChannel,
        targetUserRole: currentRole,
        textContent: inputText,
        imageBase64: uploadedImage || undefined,
        audioBase64: uploadedAudio || undefined,
        jurisdiction: jurisdiction as Jurisdiction,
        contextData: {
          benchmarkId: activeBenchmark?.id,
          targetEntity: activeBenchmark?.targetEntity
        }
      });

      setAnalysisResult(res.analysis);
      setAnalysisEngineSource(res.source);
    } catch (err: any) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const channelIcons: Record<ThreatChannel, any> = {
    video_frame: Video,
    audio_call: PhoneCall,
    email: Mail,
    social_post: MessageSquare,
    circular: FileText
  };

  return (
    <div id="forensic-scanner-container" className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Multi-Modal Forensic Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Synthetic Media & Securities Phishing Forensic Laboratory
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Detect hyper-personalized phishing, synthetic voice calls impersonating market regulators, deepfake CEO videos, and coordinated bot manipulation with explainable acoustic, visual, and linguistic evidence.
          </p>
        </div>

        {/* Channel Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 border-b border-slate-800 pb-2">
          {[
            { id: 'video_frame', label: 'Deepfake Video Broadcast', icon: Video },
            { id: 'audio_call', label: 'AI Voice Clone (Vishing)', icon: PhoneCall },
            { id: 'email', label: 'LLM Spear Phishing Email', icon: Mail },
            { id: 'social_post', label: 'Telegram / WhatsApp Syndicate', icon: MessageSquare },
            { id: 'circular', label: 'Regulatory Circular / Notice', icon: FileText }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedChannel === item.id;
            return (
              <button
                key={item.id}
                id={`channel-${item.id}-btn`}
                type="button"
                onClick={() => {
                  setSelectedChannel(item.id as ThreatChannel);
                  // Find first matching benchmark
                  const match = BENCHMARK_CASES.find((b) => b.channel === item.id);
                  if (match) handleSelectBenchmark(match);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Laboratory (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preloaded Securities Threat Benchmarks */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Benchmark Threat Cases:
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Select to Test</span>
            </div>

            <div className="space-y-2">
              {relevantBenchmarks.map((bCase) => {
                const Icon = channelIcons[bCase.channel] || FileText;
                const isSelected = activeBenchmark?.id === bCase.id;
                return (
                  <div
                    key={bCase.id}
                    id={`benchmark-${bCase.id}`}
                    onClick={() => handleSelectBenchmark(bCase)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                        : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                        <Icon className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="mr-0.5">{bCase.jurisdiction === 'US' ? '🇺🇸' : '🇮🇳'}</span>
                        {bCase.channelName}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          bCase.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : bCase.severity === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {bCase.severity}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{bCase.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{bCase.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Media & Input Studio */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Content & Multimodal Payload
            </h3>

            {/* Custom file uploaders depending on channel */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Image upload */}
              {(selectedChannel === 'video_frame' || selectedChannel === 'circular') && (
                <label className="flex-1 min-w-[140px] px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-center gap-2 text-xs text-slate-300 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="truncate">{uploadedImage ? 'Change Image' : 'Upload Frame'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}

              {/* Audio upload / recording */}
              {selectedChannel === 'audio_call' && (
                <>
                  <label className="flex-1 min-w-[130px] px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer flex items-center justify-center gap-2 text-xs text-slate-300 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">{uploadedAudio ? 'Audio Attached' : 'Upload Audio'}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    id="mic-record-btn"
                    type="button"
                    onClick={toggleRecording}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isRecording
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-red-400" />}
                    <span>{isRecording ? 'Stop Recording' : 'Record Mic'}</span>
                  </button>
                </>
              )}
            </div>

            {/* Textarea for transcript, email body or circular */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Transcript / Email Headers / Communication Text:
              </label>
              <textarea
                rows={6}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setActiveBenchmark(null);
                }}
                placeholder="Paste suspicious financial communication, email header, or call transcript..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed resize-y"
              />
            </div>

            {/* Run Forensic Analysis Button */}
            <button
              id="run-forensic-analysis-btn"
              type="button"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Neural Multi-Modal Audit in Progress...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Execute Deep Forensic Audit
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Forensic Results & Evidence (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Modality Inspector Preview */}
          {selectedChannel === 'video_frame' && (
            <VisualArtifactInspector
              imageSrc={uploadedImage || undefined}
              title={activeBenchmark?.title || 'Executive Video Analysis'}
              isSynthetic={activeBenchmark?.isSynthetic ?? true}
            />
          )}

          {selectedChannel === 'audio_call' && (
            <AudioBiometricVisualizer
              sampleName={activeBenchmark?.title || 'Vishing Call #8821'}
              isSynthetic={activeBenchmark?.isSynthetic ?? true}
              frequencies={activeBenchmark?.mockAudioFrequencies}
            />
          )}

          {/* Analysis Report or Empty State */}
          {analysisResult ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              {/* Report Header: Risk Gauge */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Forensic Verdict:
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      Engine: {analysisEngineSource}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {analysisResult.primaryVerdict}
                  </h3>
                  {analysisResult.executiveOrEntityImpersonated && analysisResult.executiveOrEntityImpersonated !== 'None' && (
                    <p className="text-xs text-amber-400 mt-0.5 font-medium">
                      Target Impersonation: <strong>{analysisResult.executiveOrEntityImpersonated}</strong>
                    </p>
                  )}
                </div>

                {/* Threat Level Badge & Risk Gauge */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Synthetic Probability
                    </span>
                    <span
                      className={`text-2xl font-black font-mono ${
                        analysisResult.syntheticRiskScore > 75
                          ? 'text-red-400'
                          : analysisResult.syntheticRiskScore > 40
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {analysisResult.syntheticRiskScore}%
                    </span>
                  </div>

                  <div
                    className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold border flex items-center gap-1.5 ${
                      analysisResult.threatLevel === 'CRITICAL'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : analysisResult.threatLevel === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : analysisResult.threatLevel === 'AUTHENTIC'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    }`}
                  >
                    {analysisResult.threatLevel === 'CRITICAL' || analysisResult.threatLevel === 'HIGH' ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    {analysisResult.threatLevel}
                  </div>
                </div>
              </div>

              {/* Forensic Markers Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Multimodal Forensic Artifacts & Evidence
                </h4>

                <div className="grid grid-cols-1 gap-2.5">
                  {analysisResult.forensicMarkers.map((marker, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{marker.indicator}</span>
                          <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {marker.category}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            marker.severity === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : marker.severity === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          Conf: {marker.confidence}%
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{marker.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Securities Regulations Violated */}
              {analysisResult.securitiesRegulationsViolated && analysisResult.securitiesRegulationsViolated.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400" />
                    Statutory Securities Regulations Violated
                  </h4>

                  <div className="space-y-1.5">
                    {analysisResult.securitiesRegulationsViolated.map((v, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs">
                        <span className="font-bold text-amber-300 font-mono block">{v.code}</span>
                        <span className="text-slate-300 text-[11px] mt-0.5 block">{v.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Playbook for Target User */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Recommended Immediate Mitigations ({currentRole.replace('_', ' ').toUpperCase()})
                </h4>

                <div className="space-y-1.5">
                  {analysisResult.actionablePlaybook.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Export Report & Generate Incident Dossier */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  {jurisdiction === 'US'
                    ? 'Audit report formatted for SEC Rule 17a-4 WORM & FINRA 2010 surveillance logs.'
                    : 'Audit report formatted for SEBI CSCRF 2024 & Section 65B court admissibility.'}
                </span>

                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Primary Export Report Button (PDF with jsPDF) */}
                  <button
                    id="export-pdf-report-btn"
                    type="button"
                    onClick={() => {
                      if (!analysisResult) return;
                      setIsExportingPDF(true);
                      try {
                        downloadForensicAuditReport(analysisResult, {
                          caseTitle: activeBenchmark?.title || 'Forensic-Incident',
                          jurisdiction: jurisdiction || 'IN',
                          auditorRole: currentRole,
                          auditorEmail: user?.email || 'compliance@vemar.internal',
                          engineSource: analysisEngineSource || 'VEMAR Vertex AI Neural Forensics'
                        });
                      } catch (err) {
                        console.error('Failed to generate PDF audit report', err);
                      } finally {
                        setTimeout(() => setIsExportingPDF(false), 2200);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
                    title="Generate and download formatted PDF summary of current forensic analysis using jsPDF"
                  >
                    {isExportingPDF ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
                        <span>Audit PDF Downloaded!</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4" />
                        <span>Export Report (PDF)</span>
                      </>
                    )}
                  </button>

                  <button
                    id="open-dossier-modal-btn"
                    type="button"
                    onClick={() => setIsDossierOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>{jurisdiction === 'US' ? 'SEC TCR Dossier' : 'SEBI Dossier'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 space-y-3">
              <Activity className="w-12 h-12 text-slate-700 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">Awaiting Forensic Execution</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Select a benchmark threat scenario on the left or upload your custom media, then click <strong>"Execute Deep Forensic Audit"</strong> to generate a multi-modal evidence breakdown.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Incident Dossier Modal */}
      <IncidentDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        analysis={analysisResult}
        sampleTitle={activeBenchmark?.title}
        jurisdiction={jurisdiction}
      />
    </div>
  );
};
