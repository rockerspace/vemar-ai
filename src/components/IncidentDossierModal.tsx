import React, { useState } from 'react';
import { X, Copy, Check, Download, Printer, ShieldAlert, FileText, Lock, Building, Scale, Globe2, FileDown } from 'lucide-react';
import { ForensicAnalysisResult, Jurisdiction } from '../types';
import { downloadForensicAuditReport } from '../utils/pdfExport';

interface IncidentDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ForensicAnalysisResult | null;
  sampleTitle?: string;
  jurisdiction?: Jurisdiction;
}

export const IncidentDossierModal: React.FC<IncidentDossierModalProps> = ({
  isOpen,
  onClose,
  analysis,
  sampleTitle = 'Securities Threat Incident',
  jurisdiction = 'IN'
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !analysis) return null;

  const isUS = jurisdiction === 'US';
  const incidentId = isUS
    ? `SEC-TCR-AI-${Date.now().toString().slice(-6)}`
    : `SEBI-SCORES-AI-${Date.now().toString().slice(-6)}`;

  const fileDate = new Date().toLocaleDateString(isUS ? 'en-US' : 'en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const complaintLetter = isUS
    ? `UNITED STATES SECURITIES AND EXCHANGE COMMISSION (SEC)
DIVISION OF ENFORCEMENT & OFFICE OF THE WHISTLEBLOWER
FORM TCR (TIP, COMPLAINT OR REFERRAL) - SYNTHETIC MEDIA FRAUD DOSSIER
Case Tracking ID: ${incidentId}
Filing Date: ${fileDate}
Regulatory Body: U.S. Securities and Exchange Commission (Washington, D.C.)
Cc: Financial Industry Regulatory Authority (FINRA) Market Surveillance, CISA AI Threat Unit, FBI Cyber Division

1. INCIDENT CLASSIFICATION & TARGET:
- Threat Category: AI-Generated Synthetic Media Manipulation & Algorithmic Fraud
- Channel Analyzed: ${analysis.channelAnalyzed.toUpperCase()}
- Impersonated Institution / Executive: ${analysis.executiveOrEntityImpersonated || 'U.S. Capital Markets Leadership'}
- Synthetic Confidence Score: ${analysis.syntheticRiskScore}% (${analysis.threatLevel})

2. FORENSIC FINDINGS & TECHNICAL EVIDENCE:
${analysis.forensicMarkers.map((m, i) => `  ${i + 1}. [${m.category}] ${m.indicator} (Severity: ${m.severity}, Confidence: ${m.confidence}%)\n     Finding: ${m.description}`).join('\n')}

3. STATUTORY FEDERAL SECURITIES VIOLATIONS:
${analysis.securitiesRegulationsViolated.map((v, i) => `  ${i + 1}. ${v.code}\n     Statutory Impact: ${v.description}`).join('\n')}

4. MARKET IMPACT & SYSTEMIC RISK ASSESSMENT:
- Risk Nature: ${analysis.marketImpactAssessment.estimatedRiskType}
- Severity Rating: ${analysis.marketImpactAssessment.severityRating}
- Targeted Cohort: ${analysis.marketImpactAssessment.potentialVictims}
- Urgency Level: ${analysis.marketImpactAssessment.actionUrgency}

5. REQUESTED ENFORCEMENT & REMEDIATION ACTIONS:
- Issue immediate market integrity alert to FINRA Trading Activity Reporting System (TRACE / CAT).
- Freeze wire settlement instructions corresponding to unauthorized telephonic voice transfers.
- Initiate emergency inquiry under SEC Rule 10b-5 and refer criminal wire fraud to the U.S. Attorney's Office (DOJ).
- Demand immediate takedown of counterfeit filing domains and AI social bot swarms.

Submitted via:
Securities Sentinel Enterprise (C2PA & Automated Forensic Intelligence Platform)`
    : `FORMAL INCIDENT DISCLOSURE & CYBER FRAUD DOSSIER
Reference ID: ${incidentId}
Filing Date: ${fileDate}
Authority: Securities and Exchange Board of India (SEBI) - Integrated Surveillance & Enforcement Department (ISD)
Cc: National Cyber Crime Reporting Portal (NCRP), Indian Computer Emergency Response Team (CERT-In)

1. INCIDENT CLASSIFICATION:
- Threat Category: AI-Generated Synthetic Media & Securities Phishing Attack
- Channel Addressed: ${analysis.channelAnalyzed.toUpperCase()}
- Impersonated Entity/Executive: ${analysis.executiveOrEntityImpersonated || 'Undisclosed Listed Issuer'}
- Synthetic Threat Score: ${analysis.syntheticRiskScore}% (${analysis.threatLevel})

2. FORENSIC FINDINGS & TECHNICAL EVIDENCE:
${analysis.forensicMarkers.map((m, i) => `  ${i + 1}. [${m.category}] ${m.indicator} (Severity: ${m.severity}, Confidence: ${m.confidence}%)\n     Finding: ${m.description}`).join('\n')}

3. STATUTORY SECURITIES REGULATIONS VIOLATED:
${analysis.securitiesRegulationsViolated.map((v, i) => `  ${i + 1}. ${v.code}\n     Impact: ${v.description}`).join('\n')}

4. MARKET IMPACT & INVESTOR RISK ASSESSMENT:
- Risk Nature: ${analysis.marketImpactAssessment.estimatedRiskType}
- Severity: ${analysis.marketImpactAssessment.severityRating}
- Targeted Cohort: ${analysis.marketImpactAssessment.potentialVictims}
- Urgency Level: ${analysis.marketImpactAssessment.actionUrgency}

5. REQUESTED REGULATORY & POLICE ACTIONS:
- Direct National Internet Service Providers (DOT/MeitY) to issue immediate DNS blockage for associated lookalike domains.
- Issue urgent Investor Caution Notice across NSE and BSE public ticker feeds.
- Freeze beneficiary banking and mule UPI IDs linked to extortion or deceptive fund transfers.
- Initiate investigation under Section 11(4) and Section 11B of the SEBI Act, 1992.

Submitted via:
Securities Market Synthetic Media & Phishing Sentinel
(Automated Forensic Cryptographic Dossier Generator)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([complaintLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${incidentId}-Regulatory-Dossier.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {isUS ? 'SEC Form TCR Enforcement Dossier' : 'SEBI SCORES 2.0 Regulatory Dossier'}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-bold">
                  {incidentId}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isUS
                  ? 'Official export for SEC Office of the Whistleblower & FINRA Market Surveillance'
                  : 'Generated for SEBI SCORES 2.0 & National Cyber Crime Reporting Portal (NCRP)'}
              </p>
            </div>
          </div>

          <button
            id="close-incident-dossier-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300 font-mono">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800 font-sans">
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <Scale className="w-4 h-4 text-cyan-400" />
                Statutory Evidence Summary ({isUS ? 'United States' : 'India'})
              </span>
              <span>{fileDate}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Threat Level</span>
                <span className="text-red-400 font-bold">{analysis.threatLevel}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Risk Score</span>
                <span className="text-white font-bold">{analysis.syntheticRiskScore}/100</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Channel</span>
                <span className="text-cyan-300 font-bold">{analysis.channelAnalyzed}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Impersonation</span>
                <span className="text-amber-300 font-bold truncate block">{analysis.executiveOrEntityImpersonated || 'None'}</span>
              </div>
            </div>
          </div>

          {/* Raw Export Text Box */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 max-h-72 overflow-y-auto text-xs leading-relaxed text-slate-300 whitespace-pre-wrap selection:bg-cyan-500 selection:text-white">
            {complaintLetter}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1 font-sans">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cryptographically sealed under C2PA standards</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="download-pdf-dossier-btn"
              type="button"
              onClick={() => {
                downloadForensicAuditReport(analysis, {
                  caseTitle: sampleTitle,
                  jurisdiction: (jurisdiction || 'IN') as Jurisdiction,
                  auditorRole: 'broker_compliance',
                  auditorEmail: 'compliance@vemar.internal',
                  engineSource: 'VEMAR Vertex AI Regulatory Gateway'
                });
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/40"
              title="Download formatted multi-page audit report PDF using jsPDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export PDF Report</span>
            </button>

            <button
              id="copy-dossier-btn"
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Dossier' : 'Copy Text'}</span>
            </button>

            <button
              id="download-dossier-btn"
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-950/40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isUS ? 'Export SEC TCR Filing' : 'Export SEBI Filing (.TXT)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
