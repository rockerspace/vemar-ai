import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Building2,
  ExternalLink,
  Hash,
  ArrowRight,
  FileX,
  Globe2
} from 'lucide-react';
import { verifyCommunication, VerifyCommunicationResponse } from '../services/api';
import { Jurisdiction } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface OfficialAuthenticatorProps {
  jurisdiction?: Jurisdiction;
}

export const OfficialAuthenticator: React.FC<OfficialAuthenticatorProps> = ({ jurisdiction = 'IN' as Jurisdiction }) => {
  const { isHindi } = useLocalization();
  const isUS = jurisdiction === 'US' || jurisdiction === 'GLOBAL';
  const [activeTab, setActiveTab] = useState<'circulars' | 'intermediaries'>('circulars');
  
  // Search query states
  const [circularQuery, setCircularQuery] = useState(
    isUS ? '0000789019-24-000045' : 'SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/89'
  );
  const [circularResult, setCircularResult] = useState<VerifyCommunicationResponse | null>(null);
  const [circularLoading, setCircularLoading] = useState(false);

  const [intermediaryQuery, setIntermediaryQuery] = useState(
    isUS ? '116797' : 'INZ000031633'
  );
  const [intermediaryResult, setIntermediaryResult] = useState<VerifyCommunicationResponse | null>(null);
  const [intermediaryLoading, setIntermediaryLoading] = useState(false);

  // Update default query when jurisdiction changes
  useEffect(() => {
    if (isUS) {
      setCircularQuery('0000789019-24-000045');
      setIntermediaryQuery('116797');
    } else {
      setCircularQuery('SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/89');
      setIntermediaryQuery('INZ000031633');
    }
    setCircularResult(null);
    setIntermediaryResult(null);
  }, [jurisdiction, isUS]);

  // Verify Filing / Circular Handler
  const handleVerifyCircular = async (queryText?: string) => {
    const query = queryText || circularQuery;
    if (!query.trim()) return;
    setCircularLoading(true);
    try {
      const res = await verifyCommunication({
        queryType: isUS ? 'sec_edgar' : 'circular',
        identifier: query,
        jurisdiction: jurisdiction as Jurisdiction
      });
      setCircularResult(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setCircularLoading(false);
    }
  };

  // Verify Intermediary / FINRA Handler
  const handleVerifyIntermediary = async (queryText?: string) => {
    const query = queryText || intermediaryQuery;
    if (!query.trim()) return;
    setIntermediaryLoading(true);
    try {
      const res = await verifyCommunication({
        queryType: isUS ? 'finra' : 'intermediary',
        identifier: query,
        jurisdiction: jurisdiction as Jurisdiction
      });
      setIntermediaryResult(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIntermediaryLoading(false);
    }
  };

  return (
    <div id="official-authenticator-section" className="space-y-6">
      {/* Section Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Parallel Market Integrity Framework
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            {isUS ? 'US SEC EDGAR & FINRA Master Registry Verifier' : 'SEBI & Exchange Official Registry Authenticator'}
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {isUS
              ? 'Real-time cryptographic validation of SEC EDGAR Accession Numbers, Form 8-K / 10-K material event filings, and FINRA BrokerCheck CRD licensing status to eliminate market-manipulating fake corporate disclosures.'
              : 'Direct verification against SEBI master circular gazettes, exchange notification hashes (NSE/BSE), and authorized intermediary registration numbers (Stock Brokers, Research Analysts, Investment Advisers).'}
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex flex-wrap items-center gap-2 mt-6 border-t border-slate-800 pt-4">
          <button
            id="tab-circulars-btn"
            type="button"
            onClick={() => setActiveTab('circulars')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'circulars'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            {isUS ? 'SEC EDGAR Filings (8-K / 10-K / Form 4)' : 'SEBI & Exchange Circulars / Orders'}
          </button>

          <button
            id="tab-intermediaries-btn"
            type="button"
            onClick={() => setActiveTab('intermediaries')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'intermediaries'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            {isUS ? 'FINRA BrokerCheck & RIA Licensing (CRD)' : 'SEBI Registered Intermediaries (Brokers / RAs)'}
          </button>
        </div>
      </div>

      {/* Tab 1: Circulars / SEC EDGAR Validator */}
      {activeTab === 'circulars' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Query Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              {isUS ? 'Verify SEC EDGAR Filing Accession' : 'Verify Circular or Regulatory Order'}
            </h3>
            <p className="text-xs text-slate-400">
              {isUS
                ? 'Enter SEC Accession Number (e.g. 0000789019-24-000045), CIK, ticker (MSFT, AAPL, TSLA), or SHA-256 digest:'
                : 'Enter the exact circular reference number, document title keywords, or SHA-256 digital digest:'}
            </p>

            {/* Quick Test Benchmarks */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Quick Test Records:
              </span>
              <div className="flex flex-col gap-1.5">
                {isUS ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setCircularQuery('0000789019-24-000045');
                        handleVerifyCircular('0000789019-24-000045');
                      }}
                      className="text-left px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">Microsoft Corp Form 8-K (Accession #0000789019)</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold ml-2">GENUINE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCircularQuery('0001899214-26-000412');
                        handleVerifyCircular('0001899214-26-000412');
                      }}
                      className="text-left px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">Spoofed CloudMatrix $120 Tender Offer</span>
                      <span className="text-[10px] text-red-400 font-mono font-semibold ml-2">COUNTERFEIT</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setCircularQuery('SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/89');
                        handleVerifyCircular('SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/89');
                      }}
                      className="text-left px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">Official SEBI Deepfake Measures Circular (2024)</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold ml-2">GENUINE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCircularQuery('ORDER WTM/AB/EFD/992/2024-25');
                        handleVerifyCircular('ORDER WTM/AB/EFD/992/2024-25');
                      }}
                      className="text-left px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">Counterfeit Trading Suspension WhatsApp Order</span>
                      <span className="text-[10px] text-red-400 font-mono font-semibold ml-2">FORGERY</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Input & Submit */}
            <div className="space-y-2">
              <input
                id="circular-input-query"
                type="text"
                value={circularQuery}
                onChange={(e) => setCircularQuery(e.target.value)}
                placeholder={isUS ? 'Enter SEC Accession # or Ticker...' : 'Enter Circular # (e.g. SEBI/HO/...)'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 font-mono focus:outline-none focus:border-cyan-500"
              />

              <button
                id="submit-verify-circular-btn"
                type="button"
                onClick={() => handleVerifyCircular()}
                disabled={circularLoading || !circularQuery.trim()}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
              >
                {circularLoading ? 'Querying Repository...' : 'Authenticate Against Registry'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Authentication Verdict & Gazette Audit</span>
              {circularResult && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  circularResult.verified
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {circularResult.status}
                </span>
              )}
            </h3>

            {!circularResult && !circularLoading && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl">
                <FileCheck className="w-10 h-10 text-slate-600 mb-2" />
                <p className="text-xs text-slate-400 font-medium">
                  {isUS
                    ? 'No SEC EDGAR filing queried yet. Run an Accession validation on the left.'
                    : 'No circular queried yet. Choose a benchmark or type a reference number.'}
                </p>
              </div>
            )}

            {circularResult && (
              <div className="space-y-4">
                {/* Status Box */}
                <div className={`p-4 rounded-xl border ${
                  circularResult.verified
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                    : 'bg-red-950/30 border-red-800/50 text-red-300'
                }`}>
                  <div className="flex items-start gap-3">
                    {circularResult.verified ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {circularResult.verified
                          ? (isUS ? 'Verified Authentic SEC EDGAR Filing' : 'Verified Authentic Regulatory Circular')
                          : (isUS ? 'Suspected Counterfeit SEC Filing (Rule 10b-5 Breach)' : 'Unverified or Counterfeit Regulatory Order')}
                      </h4>
                      <p className="text-xs mt-1 text-slate-300 leading-relaxed">
                        {circularResult.warning ||
                          (isUS
                            ? 'Cryptographic integrity matches the SEC EDGAR master depository. All electronic signatures confirmed.'
                            : 'This document is officially registered in the SEBI/Exchange gazette with valid public key signatures.')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Integrity Checklist */}
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Cryptographic & Depository Audit Checklist:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(circularResult.verificationChecks).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 text-[11px] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-mono text-cyan-300 text-[11px] font-semibold">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matched Details */}
                {circularResult.details && (
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Repository Record Metadata:
                    </span>
                    <div className="space-y-1 text-slate-300">
                      <div><strong className="text-white">Title:</strong> {(circularResult.details as any).title || (circularResult.details as any).companyName}</div>
                      <div><strong className="text-white">Reference ID:</strong> {(circularResult.details as any).circularNumber || (circularResult.details as any).accessionNumber}</div>
                      <div><strong className="text-white">Summary:</strong> {(circularResult.details as any).summary}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Registered Intermediaries / FINRA Validator */}
      {activeTab === 'intermediaries' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Query Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              {isUS ? 'FINRA BrokerCheck & Firm Registry' : 'Verify Registered Broker or Advisor'}
            </h3>
            <p className="text-xs text-slate-400">
              {isUS
                ? 'Enter FINRA Central Registration Depository (CRD) number or registered firm name (Citadel, Robinhood, Morgan Stanley):'
                : 'Enter SEBI Registration Number (format: INZ..., INH..., INA...) or entity name:'}
            </p>

            {/* Quick Test Benchmarks */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Quick Test Licenses:
              </span>
              <div className="flex flex-col gap-1.5">
                {isUS ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIntermediaryQuery('116797');
                        handleVerifyIntermediary('116797');
                      }}
                      className="text-left px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">Citadel Securities LLC (CRD #116797)</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold ml-2">ACTIVE BD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIntermediaryQuery('999999');
                        handleVerifyIntermediary('999999');
                      }}
                      className="text-left px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">Apex Prime Capital (CRD #999999)</span>
                      <span className="text-[10px] text-red-400 font-mono font-semibold ml-2">BARRED</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIntermediaryQuery('INZ000031633');
                        handleVerifyIntermediary('INZ000031633');
                      }}
                      className="text-left px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">Zerodha Broking Limited (INZ000031633)</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold ml-2">ACTIVE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIntermediaryQuery('INZ000999999');
                        handleVerifyIntermediary('INZ000999999');
                      }}
                      className="text-left px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate">Apex Capital Int. (Defunct/Cancelled)</span>
                      <span className="text-[10px] text-red-400 font-mono font-semibold ml-2">CANCELLED</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Input & Submit */}
            <div className="space-y-2">
              <input
                id="intermediary-input-query"
                type="text"
                value={intermediaryQuery}
                onChange={(e) => setIntermediaryQuery(e.target.value)}
                placeholder={isUS ? 'Enter CRD # (e.g. 116797)...' : 'Enter SEBI Reg # (e.g. INZ000031633)...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 font-mono focus:outline-none focus:border-cyan-500"
              />

              <button
                id="submit-verify-intermediary-btn"
                type="button"
                onClick={() => handleVerifyIntermediary()}
                disabled={intermediaryLoading || !intermediaryQuery.trim()}
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
              >
                {intermediaryLoading ? 'Querying License Base...' : 'Validate Registration License'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>License Status & Entity Record</span>
              {intermediaryResult && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  intermediaryResult.verified
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {intermediaryResult.status}
                </span>
              )}
            </h3>

            {!intermediaryResult && !intermediaryLoading && (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl">
                <Building2 className="w-10 h-10 text-slate-600 mb-2" />
                <p className="text-xs text-slate-400 font-medium">
                  {isUS
                    ? 'No FINRA firm queried yet. Select Citadel or Apex above to test.'
                    : 'No intermediary queried yet. Enter a SEBI registration number to verify.'}
                </p>
              </div>
            )}

            {intermediaryResult && (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${
                  intermediaryResult.verified
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                    : 'bg-red-950/30 border-red-800/50 text-red-300'
                }`}>
                  <div className="flex items-start gap-3">
                    {intermediaryResult.verified ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {intermediaryResult.verified
                          ? (isUS ? 'Active FINRA & SEC Registered Firm' : 'Active SEBI Registered Intermediary')
                          : (isUS ? 'Barred / Unregistered Entity (FINRA Rule 2010 Violation)' : 'Unregistered or Barred Intermediary')}
                      </h4>
                      <p className="text-xs mt-1 text-slate-300 leading-relaxed">
                        {intermediaryResult.warning ||
                          (isUS
                            ? 'Entity holds an active Broker-Dealer or Investment Adviser registration. Authorized to execute client orders.'
                            : 'This intermediary is in full compliance with SEBI licensing standards and authorized to provide services.')}
                      </p>
                    </div>
                  </div>
                </div>

                {intermediaryResult.details && (
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Entity Register Credentials:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                      <div><strong className="text-white">Entity Name:</strong> {(intermediaryResult.details as any).entityName || (intermediaryResult.details as any).firmName}</div>
                      <div><strong className="text-white">License / CRD:</strong> {(intermediaryResult.details as any).registrationNumber || (intermediaryResult.details as any).crdNumber}</div>
                      <div><strong className="text-white">Category:</strong> {(intermediaryResult.details as any).category}</div>
                      <div><strong className="text-white">Authorized Domain:</strong> {(intermediaryResult.details as any).officialDomain}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
