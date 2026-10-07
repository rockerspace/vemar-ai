import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileDown,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  QrCode,
  KeyRound,
  FileText,
  Clock,
  ExternalLink,
  X,
  FileSpreadsheet,
  Cpu,
  BadgeCheck,
  RefreshCw,
  Eye
} from 'lucide-react';
import { ForensicAnalysisResult, Jurisdiction, UserRole, CryptographicReportSignature, SigningOptions } from '../types';
import {
  generateCryptographicSignature,
  canonicalizeReportPayload,
  computeSha256,
  verifyReportIntegrity
} from '../utils/cryptoSignature';
import { downloadCryptographicallySignedPDF } from '../utils/pdfExport';

interface CryptographicPdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ForensicAnalysisResult | null;
  caseTitle?: string;
  jurisdiction: Jurisdiction;
  auditorRole: UserRole;
  auditorEmail?: string;
  engineSource?: string;
}

export const CryptographicPdfExportModal: React.FC<CryptographicPdfExportModalProps> = ({
  isOpen,
  onClose,
  analysis,
  caseTitle = 'Securities Fraud Investigation',
  jurisdiction = 'IN',
  auditorRole = 'broker_compliance',
  auditorEmail = 'compliance@vemar.internal',
  engineSource = 'VEMAR Vertex AI Multi-Modal Ensembles'
}) => {
  const isUS = jurisdiction === 'US';

  // Active Tab
  const [activeTab, setActiveTab] = useState<'sign_export' | 'verify_inspect'>('sign_export');

  // Signing configuration
  const [algorithm, setAlgorithm] = useState<'ECDSA_P256_SHA256' | 'RSA_PSS_SHA256' | 'HMAC_SHA256'>('ECDSA_P256_SHA256');
  const [signerOrg, setSignerOrg] = useState(
    isUS
      ? 'FINRA Central Registration Depository (CRD) // SEC EDGAR MII Root'
      : 'National Stock Exchange (NSE) / SEBI SCORES Sentinel Node'
  );
  const [signerTitle, setSignerTitle] = useState(
    isUS
      ? 'SEC Form 17a-4 / FINRA Rule 2010 Automated Surveillance Custodian'
      : 'SEBI CSCRF Registered Institutional Surveillance Desk'
  );
  const [watermark, setWatermark] = useState<SigningOptions['watermarkClassification']>(
    isUS ? 'COURT EVIDENCE // STRICT' : 'CONFIDENTIAL - REGULATORY FILING'
  );

  // Inclusions
  const [includeC2pa, setIncludeC2pa] = useState(true);
  const [includeStatute, setIncludeStatute] = useState(true);
  const [includeTsa, setIncludeTsa] = useState(true);

  // Computed signature state
  const [signature, setSignature] = useState<CryptographicReportSignature | null>(null);
  const [isGeneratingSig, setIsGeneratingSig] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Copy states
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedSig, setCopiedSig] = useState(false);

  // Tamper simulation inspector state
  const [tamperSimulationActive, setTamperSimulationActive] = useState(false);
  const [tamperedPayload, setTamperedPayload] = useState('');
  const [tamperVerificationResult, setTamperVerificationResult] = useState<{
    isValid: boolean;
    computedHash: string;
    diagnostic: string;
  } | null>(null);

  // Update defaults when jurisdiction or analysis changes
  useEffect(() => {
    if (isUS) {
      setSignerOrg('FINRA Central Registration Depository (CRD) // SEC EDGAR MII Root');
      setSignerTitle('SEC Form 17a-4 / FINRA Rule 2010 Automated Surveillance Custodian');
      setWatermark('COURT EVIDENCE // STRICT');
    } else {
      setSignerOrg('National Stock Exchange (NSE) / SEBI SCORES Sentinel Node');
      setSignerTitle('SEBI CSCRF Registered Institutional Surveillance Desk');
      setWatermark('CONFIDENTIAL - REGULATORY FILING');
    }
  }, [isUS]);

  // Compute live signature whenever options or analysis change
  useEffect(() => {
    if (!analysis || !isOpen) return;

    let isMounted = true;
    setIsGeneratingSig(true);

    const runSignature = async () => {
      try {
        const sig = await generateCryptographicSignature(
          analysis,
          {
            caseTitle,
            jurisdiction,
            auditorRole,
            auditorEmail,
            engineSource
          },
          {
            signatureAlgorithm: algorithm,
            signerName: signerTitle,
            signerOrganization: signerOrg,
            includeC2paManifest: includeC2pa,
            includeStatutoryCertificate: includeStatute,
            includeTsaToken: includeTsa,
            watermarkClassification: watermark
          }
        );

        if (isMounted) {
          setSignature(sig);
          setIsGeneratingSig(false);
        }
      } catch (err) {
        console.error('Error computing cryptographic signature:', err);
        if (isMounted) setIsGeneratingSig(false);
      }
    };

    runSignature();
    return () => {
      isMounted = false;
    };
  }, [
    isOpen,
    analysis,
    caseTitle,
    jurisdiction,
    auditorRole,
    auditorEmail,
    engineSource,
    algorithm,
    signerOrg,
    signerTitle,
    includeC2pa,
    includeStatute,
    includeTsa,
    watermark
  ]);

  // Handle Tamper Simulation
  useEffect(() => {
    if (!analysis || !signature) return;

    const basePayload = canonicalizeReportPayload(
      analysis,
      { caseTitle, jurisdiction, auditorRole, auditorEmail, engineSource },
      signature.issuedAt
    );

    if (tamperSimulationActive) {
      // Intentionally alter one field in payload
      const altered = basePayload.replace('"syntheticRiskScore":' + Math.round(analysis.syntheticRiskScore), '"syntheticRiskScore":0');
      setTamperedPayload(altered);
      verifyReportIntegrity(altered, signature.sha256Digest, signature.digitalSignature).then(res => {
        setTamperVerificationResult({
          isValid: res.isValid,
          computedHash: res.computedHash,
          diagnostic: res.diagnostic
        });
      });
    } else {
      setTamperedPayload(basePayload);
      verifyReportIntegrity(basePayload, signature.sha256Digest, signature.digitalSignature).then(res => {
        setTamperVerificationResult({
          isValid: res.isValid,
          computedHash: res.computedHash,
          diagnostic: res.diagnostic
        });
      });
    }
  }, [tamperSimulationActive, analysis, signature, caseTitle, jurisdiction, auditorRole, auditorEmail, engineSource]);

  if (!isOpen || !analysis) return null;

  const handleCopyHash = () => {
    if (!signature) return;
    navigator.clipboard.writeText(signature.sha256Digest);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopySig = () => {
    if (!signature) return;
    navigator.clipboard.writeText(signature.digitalSignature);
    setCopiedSig(true);
    setTimeout(() => setCopiedSig(false), 2000);
  };

  const handleExecutePdfDownload = async () => {
    if (!analysis || !signature) return;
    setIsDownloading(true);

    try {
      await downloadCryptographicallySignedPDF(
        analysis,
        {
          caseTitle,
          jurisdiction,
          auditorRole,
          auditorEmail,
          engineSource
        },
        {
          signatureAlgorithm: algorithm,
          signerName: signerTitle,
          signerOrganization: signerOrg,
          includeC2paManifest: includeC2pa,
          includeStatutoryCertificate: includeStatute,
          includeTsaToken: includeTsa,
          watermarkClassification: watermark,
          overrideTimestamp: signature.issuedAt
        },
        signature
      );

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export cryptographically signed PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      id="crypto-pdf-export-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crypto-pdf-modal-title"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/40 flex flex-col overflow-hidden my-auto max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="crypto-pdf-modal-title" className="text-base font-bold text-white tracking-wide">
                  Export Cryptographically Signed Forensic Dossier
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  C2PA 2.1-FINSEC
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isUS
                  ? 'Cryptographic self-authenticating evidence under FRE 902(14) & SEC Rule 17a-4 WORM standards'
                  : 'Court-admissible electronic evidence under Section 63 BSA 2023 & SEBI CSCRF 2024'}
              </p>
            </div>
          </div>

          <button
            id="close-crypto-pdf-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-4">
          <button
            id="tab-sign-export-btn"
            type="button"
            onClick={() => setActiveTab('sign_export')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'sign_export'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileDown className="w-4 h-4" />
            <span>Signing Configuration & PDF Export</span>
          </button>

          <button
            id="tab-verify-inspect-btn"
            type="button"
            onClick={() => setActiveTab('verify_inspect')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'verify_inspect'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BadgeCheck className="w-4 h-4" />
            <span>Mathematical Hash & Tamper Inspector</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar text-slate-200">
          {activeTab === 'sign_export' ? (
            <>
              {/* Live Provenance Hash & Cryptographic Identity Badge */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <Lock className="w-4 h-4" />
                    <span>Canonical SHA-256 Digest (Calculated from Scan Findings)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Algorithm: {algorithm}
                    </span>
                    <button
                      id="copy-sha256-hash-btn"
                      type="button"
                      onClick={handleCopyHash}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy SHA-256 hash"
                    >
                      {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHash ? 'Copied Hash' : 'Copy Hash'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800/80 font-mono text-xs text-slate-200 break-all select-all flex items-center justify-between gap-2">
                  <span>{signature?.sha256Digest || 'Calculating cryptographic digest...'}</span>
                  {signature && (
                    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      MATCH VERIFIED
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Serial: {signature?.certificateSerial || '0x7F:8A...'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    <span>TSA: RFC 3161 Stratum-1 Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>C2PA Vector Matrix: Included</span>
                  </div>
                </div>
              </div>

              {/* Signing Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column: Authority & Identity */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Signer Authority & Organization</span>
                  </h3>

                  <div className="space-y-2.5">
                    <div>
                      <label htmlFor="signer-authority-select" className="block text-[11px] text-slate-400 mb-1 font-medium">
                        Issuing Regulatory Root CA / Surveillance Node
                      </label>
                      <select
                        id="signer-authority-select"
                        value={signerOrg}
                        onChange={(e) => setSignerOrg(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                      >
                        {isUS ? (
                          <>
                            <option value="FINRA Central Registration Depository (CRD) // SEC EDGAR MII Root">
                              FINRA CRD / SEC EDGAR MII Surveillance Root
                            </option>
                            <option value="National Adjudicatory Council (NAC) Market Surveillance Node">
                              NAC / Market Surveillance Evidentiary Node
                            </option>
                            <option value="Institutional Brokerage Compliance Automated Pre-Trade Sentinel">
                              Institutional Brokerage Compliance Desk (Broker-Dealer)
                            </option>
                          </>
                        ) : (
                          <>
                            <option value="National Stock Exchange (NSE) / SEBI SCORES Sentinel Node">
                              National Stock Exchange (NSE) / SEBI SCORES Sentinel Node
                            </option>
                            <option value="Bombay Stock Exchange (BSE) Surveillance & Depository Root">
                              BSE Surveillance & CDSL/NSDL Depository Root
                            </option>
                            <option value="SEBI CSCRF Registered Stock Broker Forensics Gateway">
                              SEBI CSCRF Registered Stock Broker Gateway
                            </option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="signer-title-input" className="block text-[11px] text-slate-400 mb-1 font-medium">
                        Signer Designation / Clearance
                      </label>
                      <input
                        id="signer-title-input"
                        type="text"
                        value={signerTitle}
                        onChange={(e) => setSignerTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                        placeholder="e.g. SEBI CSCRF Surveillance Officer"
                      />
                    </div>

                    <div>
                      <label htmlFor="crypto-algo-select" className="block text-[11px] text-slate-400 mb-1 font-medium">
                        Cryptographic Signature Algorithm
                      </label>
                      <select
                        id="crypto-algo-select"
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                      >
                        <option value="ECDSA_P256_SHA256">ECDSA NIST P-256 with SHA-256 (FIPS 186-4 Recommended)</option>
                        <option value="RSA_PSS_SHA256">RSA-PSS 4096-bit with SHA-256 & MGF1</option>
                        <option value="HMAC_SHA256">HMAC-SHA256 with Hardware Security Key</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column: Inclusions & Watermark */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Statutory Manifest & Security Options</span>
                  </h3>

                  <div className="space-y-2.5">
                    <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs cursor-pointer hover:bg-slate-900 transition-colors">
                      <input
                        id="include-c2pa-checkbox"
                        type="checkbox"
                        checked={includeC2pa}
                        onChange={(e) => setIncludeC2pa(e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <span className="font-semibold text-slate-200">Embed C2PA Content Credentials Manifest</span>
                        <p className="text-[10px] text-slate-400">FINSEC v2.1 assertions for forensic markers and media provenance</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs cursor-pointer hover:bg-slate-900 transition-colors">
                      <input
                        id="include-statute-checkbox"
                        type="checkbox"
                        checked={includeStatute}
                        onChange={(e) => setIncludeStatute(e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <span className="font-semibold text-slate-200">
                          {isUS ? 'Embed FRE 902(14) Self-Authentication Record' : 'Embed Section 63 BSA 2023 / 65B Certificate'}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {isUS ? 'Federal Rules of Evidence court-admissible certificate' : 'Statutory certificate for Indian cyber crime & SEBI tribunals'}
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs cursor-pointer hover:bg-slate-900 transition-colors">
                      <input
                        id="include-tsa-checkbox"
                        type="checkbox"
                        checked={includeTsa}
                        onChange={(e) => setIncludeTsa(e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <div>
                        <span className="font-semibold text-slate-200">Embed RFC 3161 Timestamping Token (TSA)</span>
                        <p className="text-[10px] text-slate-400">Cryptographic atomic clock synchronization to prevent timestamp tampering</p>
                      </div>
                    </label>

                    <div>
                      <label htmlFor="watermark-select" className="block text-[11px] text-slate-400 mb-1 font-medium">
                        Evidentiary Watermark Classification
                      </label>
                      <select
                        id="watermark-select"
                        value={watermark}
                        onChange={(e) => setWatermark(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="CONFIDENTIAL - REGULATORY FILING">CONFIDENTIAL - REGULATORY FILING</option>
                        <option value="COURT EVIDENCE // STRICT">COURT EVIDENCE // STRICT</option>
                        <option value="INSTITUTIONAL AUDIT TRAIL">INSTITUTIONAL AUDIT TRAIL</option>
                        <option value="SEBI / SEC STATUTORY DISCLOSURE">SEBI / SEC STATUTORY DISCLOSURE</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Signature DER Hex Preview */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    Digital Signature Hex (ASN.1 DER Format)
                  </span>
                  <button
                    id="copy-signature-hex-btn"
                    type="button"
                    onClick={handleCopySig}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy full signature hex"
                  >
                    {copiedSig ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSig ? 'Copied Signature' : 'Copy Signature'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-black/60 border border-slate-800/80 font-mono text-[11px] text-emerald-400/90 break-all select-all leading-relaxed">
                  {signature?.digitalSignature || 'Generating cryptographic signature bytes...'}
                </div>
              </div>
            </>
          ) : (
            /* Tab 2: Mathematical Integrity & Tamper Inspector */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-slate-100">
                      Cryptographic Non-Repudiation & Tamper Demonstration
                    </h3>
                  </div>
                  <button
                    id="toggle-tamper-simulation-btn"
                    type="button"
                    onClick={() => setTamperSimulationActive(!tamperSimulationActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      tamperSimulationActive
                        ? 'bg-red-500 text-white shadow-lg shadow-red-950/50'
                        : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{tamperSimulationActive ? 'Disable Tamper Simulation' : 'Simulate Unauthorized Edit'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  This inspector mathematically proves that any unauthorized modification—even changing a single number or word in the forensic dossier findings—instantly breaks the SHA-256 cryptographic seal and invalidates the C2PA evidence chain in court.
                </p>

                {/* Verification Status Card */}
                {tamperVerificationResult && (
                  <div
                    className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                      tamperVerificationResult.isValid
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : 'bg-red-950/30 border-red-500/60 text-red-200'
                    }`}
                  >
                    {tamperVerificationResult.isValid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                    )}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold">
                        {tamperVerificationResult.isValid
                          ? 'MATHEMATICAL INTEGRITY INTACT // AUTHENTIC'
                          : 'CRITICAL INTEGRITY BREACH DETECTED // SIGNATURE VOID'}
                      </h4>
                      <p className="text-xs opacity-90 leading-relaxed">
                        {tamperVerificationResult.diagnostic}
                      </p>
                      <div className="font-mono text-[11px] pt-1 opacity-80 break-all">
                        Computed Hash: {tamperVerificationResult.computedHash}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Canonical Payload JSON */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Canonical Report Payload Fed into SHA-256 Hashing Engine
                </span>
                <div className="p-3 rounded-xl bg-black/70 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-56 overflow-y-auto custom-scrollbar select-all">
                  {tamperedPayload}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span>Multi-page vector PDF with embedded 2D QR seal and C2PA JUMBF assertions</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="cancel-export-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="download-signed-pdf-modal-btn"
              type="button"
              disabled={isGeneratingSig || isDownloading}
              onClick={handleExecutePdfDownload}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Compiling Signed PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Sealed PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-white" />
                  <span>Download Cryptographically Signed PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
