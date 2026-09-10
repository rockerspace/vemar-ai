import React, { useState, useEffect } from 'react';
import { Award, Lock, CheckCircle2, AlertTriangle, ShieldCheck, QrCode, Copy, Check, RefreshCw, KeyRound, FileText, Globe2 } from 'lucide-react';
import { signCorporateDisclosure } from '../services/api';
import { ProvenanceSeal, Jurisdiction } from '../types';

interface DigitalProvenanceStudioProps {
  jurisdiction?: Jurisdiction;
}

export const DigitalProvenanceStudio: React.FC<DigitalProvenanceStudioProps> = ({ jurisdiction = 'IN' }) => {
  const isUS = jurisdiction === 'US';

  const [issuerName, setIssuerName] = useState(isUS ? 'NVIDIA Corporation' : 'Tata Motors Limited');
  const [documentTitle, setDocumentTitle] = useState(
    isUS ? 'SEC Form 8-K: Item 8.01 Material Event Clarification' : 'Official Q3 Audited Financial Results & Board Declarations'
  );
  const [issuingCategory, setIssuingCategory] = useState(
    isUS ? 'SEC Form 8-K Material Event Disclosure' : 'SEBI LODR Regulation 30 Material Disclosure'
  );
  const [disclosureText, setDisclosureText] = useState(
    isUS
      ? 'NVIDIA Corporation hereby clarifies that all current CEO forward guidance regarding data center chip shipments and hyperscaler allocations remains completely accurate. Unverified audio recordings circulating on Discord alleging sudden GPU supply halts are fraudulent deepfakes.'
      : 'The Board of Directors has today approved the financial results for Q3 with revenue growth of 18.2% YoY. Reports of executive resignation or accounting discrepancies circulated on social media are entirely fabricated and fraudulent.'
  );

  const [loading, setLoading] = useState(false);
  const [activeSeal, setActiveSeal] = useState<ProvenanceSeal | null>(null);
  const [copied, setCopied] = useState(false);

  // Tamper test state
  const [tamperedText, setTamperedText] = useState('');
  const [isTamperTested, setIsTamperTested] = useState(false);

  useEffect(() => {
    if (jurisdiction === 'US') {
      setIssuerName('NVIDIA Corporation');
      setDocumentTitle('SEC Form 8-K: Item 8.01 Material Event Clarification');
      setIssuingCategory('SEC Form 8-K Material Event Disclosure');
      setDisclosureText(
        'NVIDIA Corporation hereby clarifies that all current CEO forward guidance regarding data center chip shipments and hyperscaler allocations remains completely accurate. Unverified audio recordings circulating on Discord alleging sudden GPU supply halts are fraudulent deepfakes.'
      );
    } else {
      setIssuerName('Tata Motors Limited');
      setDocumentTitle('Official Q3 Audited Financial Results & Board Declarations');
      setIssuingCategory('SEBI LODR Regulation 30 Material Disclosure');
      setDisclosureText(
        'The Board of Directors has today approved the financial results for Q3 with revenue growth of 18.2% YoY. Reports of executive resignation or accounting discrepancies circulated on social media are entirely fabricated and fraudulent.'
      );
    }
    setActiveSeal(null);
    setIsTamperTested(false);
  }, [jurisdiction]);

  const handleIssueSeal = async () => {
    setLoading(true);
    try {
      const res = await signCorporateDisclosure({
        issuerName,
        documentTitle,
        disclosureText,
        issuingCategory
      });
      setActiveSeal(res.provenanceSeal);
      setTamperedText(disclosureText);
      setIsTamperTested(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyHash = () => {
    if (activeSeal) {
      navigator.clipboard.writeText(activeSeal.sha256Digest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Check if modified text matches original hash
  const isHashMatching = tamperedText === disclosureText;

  return (
    <div id="digital-provenance-studio" className="space-y-6">
      {/* Studio Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5" />
            C2PA Digital Provenance & PKI Standards
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Corporate & Regulatory Cryptographic Provenance Studio
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Eliminating the corporate authentication vacuum: empowering listed entities, merchant bankers, and exchanges to issue tamper-proof C2PA digital provenance seals with immutable SHA-256 fingerprints before press releases hit newsfeeds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Signing Form */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Sign & Issue Verifiable Disclosure Seal ({isUS ? 'US SEC EDGAR Ready' : 'India SEBI LODR Ready'})
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Issuing Listed Entity / Institution:
              </label>
              <input
                id="provenance-issuer-name"
                type="text"
                value={issuerName}
                onChange={(e) => setIssuerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Regulatory Category:
                </label>
                <select
                  id="provenance-category-select"
                  value={issuingCategory}
                  onChange={(e) => setIssuingCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {isUS ? (
                    <>
                      <option value="SEC Form 8-K Material Event Disclosure">SEC Form 8-K (Material Event)</option>
                      <option value="SEC Form 10-Q Financial Commentary">SEC Form 10-Q (Quarterly)</option>
                      <option value="NYSE / Nasdaq Issuer Alert">NYSE / Nasdaq Issuer Alert</option>
                      <option value="Form 4 Insider Transaction Seal">Form 4 Insider Transaction</option>
                    </>
                  ) : (
                    <>
                      <option value="SEBI LODR Regulation 30 Material Disclosure">SEBI LODR Reg 30 (Material Event)</option>
                      <option value="Audited Financial Results & Commentary">Audited Financial Results</option>
                      <option value="Official Exchange Public Circular">Exchange Public Circular</option>
                      <option value="Corporate Governance & Board Notice">Board Resignation / Notice</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Document Title:
                </label>
                <input
                  id="provenance-doc-title"
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Official Statement Content (Subject to Cryptographic Digest):
              </label>
              <textarea
                id="provenance-statement-text"
                rows={4}
                value={disclosureText}
                onChange={(e) => setDisclosureText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
              />
            </div>

            <button
              id="generate-provenance-seal-btn"
              type="button"
              onClick={handleIssueSeal}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating C2PA Seal...
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  Sign & Register Cryptographic Provenance Seal
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right column: Generated Seal & Interactive Tamper Validator */}
        <div className="lg:col-span-6 space-y-4">
          {activeSeal ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verified C2PA Provenance Certificate
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeSeal.provenanceSealId}
                </span>
              </div>

              {/* Seal Certificate Box */}
              <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">
                      {activeSeal.issuingCategory}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{issuerName}</h4>
                    <p className="text-xs text-slate-400">{documentTitle}</p>
                  </div>
                  <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-400">
                    <QrCode className="w-8 h-8" />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Issued At:</span>
                    <span className="text-slate-200">{new Date(activeSeal.issuedTimestamp).toUTCString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Certificate Authority:</span>
                    <span className="text-cyan-400 font-semibold">{activeSeal.verifiedRegistryRoot}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Signature Standard:</span>
                    <span className="text-emerald-400">C2PA Manifest v1.3 (ECDSA-SHA256)</span>
                  </div>
                </div>

                {/* SHA-256 Digest */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">SHA-256 Content Digest:</span>
                    <button
                      type="button"
                      onClick={handleCopyHash}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy Digest'}
                    </button>
                  </div>
                  <p className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300 break-all select-all">
                    {activeSeal.sha256Digest}
                  </p>
                </div>
              </div>

              {/* Interactive Tamper Proof Sandbox */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Interactive Tamper Resilience Test
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Live Validation</span>
                </div>
                <p className="text-xs text-slate-400">
                  Modify a single letter below to simulate an attacker altering numbers or words before social dissemination:
                </p>

                <textarea
                  rows={3}
                  value={tamperedText}
                  onChange={(e) => {
                    setTamperedText(e.target.value);
                    setIsTamperTested(true);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />

                <div className={`p-3 rounded-lg border text-xs flex items-center gap-2.5 ${
                  isHashMatching
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                    : 'bg-red-950/30 border-red-800/50 text-red-300'
                }`}>
                  {isHashMatching ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>INTEGRITY VALID:</strong> Text exactly matches the registered cryptographic seal.</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                      <span><strong>TAMPER DETECTED:</strong> Digest mismatch! Content was altered post-signing.</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 space-y-3">
              <KeyRound className="w-12 h-12 text-slate-700 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">Awaiting Provenance Generation</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Fill in the corporate disclosure details on the left and click <strong>"Sign & Register Cryptographic Provenance Seal"</strong> to generate a C2PA-compliant verifiable manifest.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
