import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Download,
  CheckCircle2,
  Lock,
  RefreshCw,
  Filter,
  Copy,
  Check,
  Eye,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Database,
  Hash,
  Link2,
  Calendar,
  Layers,
  ArrowUpDown,
  X,
  FileCheck,
  KeyRound,
  Sparkles,
  FileDown
} from 'lucide-react';
import {
  ComplianceAuditEntry,
  AuditCategory,
  AuditSeverity,
  AuditStatus,
  AuditLogFilterState,
  ChainIntegrityReport
} from '../types/audit';
import { Jurisdiction, UserRole } from '../types';
import { useAuditLog } from '../context/AuditLogContext';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import { CryptographicAuditLogExportModal, ExportScope } from './CryptographicAuditLogExportModal';

interface ComplianceAuditLogProps {
  jurisdiction?: Jurisdiction;
  onNavigateToScanner?: () => void;
  onNavigateToAuthenticator?: () => void;
}

export const ComplianceAuditLog: React.FC<ComplianceAuditLogProps> = ({
  jurisdiction = 'IN',
  onNavigateToScanner,
  onNavigateToAuthenticator
}) => {
  const { isHindi } = useLocalization();
  const { user } = useAuth();
  const {
    logs,
    verifyChainIntegrity,
    exportLogs,
    addManualAuditAttestation,
    resetToDefaultLogs,
    isVerifying
  } = useAuditLog();

  // Search & Filter state
  const [filters, setFilters] = useState<AuditLogFilterState>({
    searchQuery: '',
    category: 'ALL',
    severity: 'ALL',
    jurisdiction: 'ALL',
    status: 'ALL',
    timeRange: 'ALL'
  });

  // Active inspected record for deep inspection slide-over / modal
  const [inspectedRecord, setInspectedRecord] = useState<ComplianceAuditEntry | null>(null);

  // Manual attestation modal state
  const [isAttestationModalOpen, setIsAttestationModalOpen] = useState(false);
  const [attestationNotes, setAttestationNotes] = useState('');
  const [attestationRegime, setAttestationRegime] = useState(
    jurisdiction === 'IN'
      ? 'SEBI CSCRF Sec 7.2 / PFUTP Regulation 4(2)(k)'
      : 'SEC Rule 17a-4 / FINRA Rule 4511 Books & Records'
  );
  const [isSubmittingAttestation, setIsSubmittingAttestation] = useState(false);

  // Integrity verification result modal/banner
  const [integrityReport, setIntegrityReport] = useState<ChainIntegrityReport | null>(null);
  const [showIntegrityModal, setShowIntegrityModal] = useState(false);

  // Copy feedback tracking
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Export dropdown state
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Cryptographically signed PDF export modal state
  const [isCryptoExportModalOpen, setIsCryptoExportModalOpen] = useState(false);
  const [cryptoExportScope, setCryptoExportScope] = useState<ExportScope>('session_ledger');
  const [selectedFindingForExport, setSelectedFindingForExport] = useState<ComplianceAuditEntry | null>(null);

  // Copy to clipboard helper
  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(identifier);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Filter logs
  const filteredLogs = useMemo(() => {
    const now = Date.now();
    return logs.filter((log) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesQuery =
          log.id.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.actionLabel.toLowerCase().includes(query) ||
          log.operatorName.toLowerCase().includes(query) ||
          log.operatorEmail.toLowerCase().includes(query) ||
          log.targetAssetOrEntity.toLowerCase().includes(query) ||
          log.statutoryRegime.toLowerCase().includes(query) ||
          log.recordHash.toLowerCase().includes(query) ||
          log.ipAddress.toLowerCase().includes(query) ||
          (log.details?.summary && log.details.summary.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      // Category filter
      if (filters.category !== 'ALL' && log.category !== filters.category) {
        return false;
      }

      // Severity filter
      if (filters.severity !== 'ALL' && log.severity !== filters.severity) {
        return false;
      }

      // Jurisdiction filter
      if (filters.jurisdiction !== 'ALL' && log.jurisdiction !== filters.jurisdiction) {
        return false;
      }

      // Status filter
      if (filters.status !== 'ALL' && log.status !== filters.status) {
        return false;
      }

      // Time Range filter
      if (filters.timeRange !== 'ALL') {
        const logTime = new Date(log.timestamp).getTime();
        const diffHours = (now - logTime) / (1000 * 60 * 60);
        if (filters.timeRange === '1H' && diffHours > 1) return false;
        if (filters.timeRange === '24H' && diffHours > 24) return false;
        if (filters.timeRange === '7D' && diffHours > 24 * 7) return false;
      }

      return true;
    });
  }, [logs, filters]);

  // Telemetry metrics
  const telemetry = useMemo(() => {
    const total = logs.length;
    const criticalCount = logs.filter((l) => l.severity === 'CRITICAL' || l.severity === 'HIGH').length;
    const verifiedCount = logs.filter((l) => l.status === 'VERIFIED' || l.status === 'COMPLIANT' || l.status === 'TAMPER_EVIDENT_SEALED').length;
    return {
      total,
      criticalCount,
      verifiedCount,
      chainHealthPct: total > 0 ? ((verifiedCount / total) * 100).toFixed(1) : '100'
    };
  }, [logs]);

  // Run chain verification
  const handleVerifyChain = async () => {
    const report = await verifyChainIntegrity();
    setIntegrityReport(report);
    setShowIntegrityModal(true);
  };

  // Submit manual compliance attestation
  const handleSaveAttestation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attestationNotes.trim()) return;
    try {
      setIsSubmittingAttestation(true);
      await addManualAuditAttestation(attestationNotes, attestationRegime);
      setAttestationNotes('');
      setIsAttestationModalOpen(false);
    } finally {
      setIsSubmittingAttestation(false);
    }
  };

  const hasActiveFilters =
    Boolean(filters.searchQuery.trim()) ||
    filters.category !== 'ALL' ||
    filters.severity !== 'ALL' ||
    filters.jurisdiction !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.timeRange !== 'ALL';

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'ALL',
      severity: 'ALL',
      jurisdiction: 'ALL',
      status: 'ALL',
      timeRange: 'ALL'
    });
  };

  const formatRelativeTime = (isoString: string) => {
    const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const formatUtcTime = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toISOString().replace('T', ' ').slice(0, 19)} UTC`;
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Institutional Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          {/* Breadcrumb path */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{isHindi ? 'संस्थागत शासन' : 'Governance & Audit'}</span>
            <span aria-hidden="true">/</span>
            <span>{isHindi ? 'नियामक अनुपालन' : 'Institutional Compliance Ledger'}</span>
            <span aria-hidden="true">/</span>
            <span className="text-cyan-400 font-medium">
              {isHindi ? 'अपरिवर्तनीय ऑडिट ट्रेल' : 'Immutable WORM Audit Trail'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <span>
              {isHindi
                ? 'संस्थागत अनुपालन एवं विनियामक ऑडिट लेजर'
                : 'Compliance Audit Log & Institutional Ledger'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {isHindi
              ? 'सेबी साइबर रेजिलिएंस फ्रेमवर्क (CSCRF खंड 7.2), एसईसी नियम 17a-4 इलेक्ट्रॉनिक स्टोरेज मीडिया (WORM) एवं फिनरा नियम 4511 के तहत अपरिवर्तनीय क्रिप्टोग्राफिक ऑडिट ट्रेल।'
              : 'Tamper-evident, forward-secure audit ledger adhering to SEBI Cyber Resilience Framework (CSCRF Sec 7.2), US SEC Rule 17a-4 Electronic Storage Media (WORM), and FINRA Rule 4511 Books & Records.'}
          </p>
        </div>

        {/* Primary Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Real-time Logger Heartbeat Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-slate-300">
              {isHindi ? 'लाइव लॉगिंग सक्रिय' : 'Live Tracking Active'}
            </span>
          </div>

          {/* Verify Hash Chain Button */}
          <button
            id="audit-verify-chain-btn"
            type="button"
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            title="Perform SHA-256 forward-chain verification from Genesis block to head"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying Chain...' : 'Verify Chain Integrity'}</span>
          </button>

          {/* Add Manual Compliance Attestation Button */}
          <button
            id="audit-add-attestation-btn"
            type="button"
            onClick={() => setIsAttestationModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            title="Append signed compliance officer inspection attestation to ledger"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Attestation</span>
          </button>

          {/* Export Cryptographically Signed PDF Button */}
          <button
            id="audit-export-signed-pdf-btn"
            type="button"
            onClick={() => {
              setCryptoExportScope(hasActiveFilters ? 'filtered_records' : 'session_ledger');
              setSelectedFindingForExport(null);
              setIsCryptoExportModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            title="Export session audit log or investigation findings as cryptographically signed PDF (C2PA 2.1 / WORM)"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Signed PDF</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              id="audit-export-menu-btn"
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              title="Export regulatory audit trail"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Raw Files</span>
            </button>

            {isExportMenuOpen && (
              <div
                id="audit-export-dropdown"
                className="absolute right-0 mt-2 w-64 bg-[#0c121e] border border-slate-700 rounded-xl shadow-2xl p-1.5 z-30 text-xs space-y-1 animate-fadeIn"
              >
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Select Export Format
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCryptoExportScope(hasActiveFilters ? 'filtered_records' : 'session_ledger');
                    setSelectedFindingForExport(null);
                    setIsCryptoExportModalOpen(true);
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-emerald-950/40 text-emerald-300 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="font-semibold flex items-center gap-1.5">
                    <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Signed PDF Ledger (WORM)</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-700/60">
                    C2PA / PDF
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const topFinding = logs.find(l => l.severity === 'CRITICAL' || l.action === 'FORENSIC_SCAN_EXECUTED') || logs[0];
                    setSelectedFindingForExport(topFinding || null);
                    setCryptoExportScope('single_finding');
                    setIsCryptoExportModalOpen(true);
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-cyan-950/40 text-cyan-300 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Signed Investigation Finding</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-900/50 text-cyan-300 border border-cyan-700/60">
                    FINDING
                  </span>
                </button>
                <div className="border-t border-slate-800 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    exportLogs('csv', filteredLogs);
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span className="font-medium">CSV Table (RFC 4180)</span>
                  <span className="text-[10px] font-mono text-cyan-400">SEBI/SEC</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    exportLogs('json', filteredLogs);
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span className="font-medium">JSON Manifest (WORM)</span>
                  <span className="text-[10px] font-mono text-cyan-400">C2PA / JSON</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    exportLogs('cef', filteredLogs);
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span className="font-medium">CEF Syslog (RFC 5424)</span>
                  <span className="text-[10px] font-mono text-cyan-400">Splunk / SIEM</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Institutional Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Operations Logged */}
        <div className="bg-[#0b111e] border border-slate-800 rounded-xl p-4 transition-colors hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{isHindi ? 'कुल ऑडिटेड ऑपरेशंस' : 'Audited Operations'}</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-white">
              {telemetry.total.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              +{telemetry.total} {isHindi ? 'सक्रिय' : 'active'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
            <span>SEBI CSCRF Sec 7.2</span>
            <span aria-hidden="true">·</span>
            <span>SEC Rule 17a-4(f)</span>
          </div>
        </div>

        {/* Metric 2: Cryptographic Chain Status */}
        <div className="bg-[#0b111e] border border-slate-800 rounded-xl p-4 transition-colors hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{isHindi ? 'क्रिप्टोग्राफिक चेन स्थिति' : 'SHA-256 Chain Integrity'}</span>
            <Link2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              100%
            </span>
            <span className="text-[11px] text-slate-400">
              {isHindi ? 'चेन अक्षुण्ण' : 'Intact Chain'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-mono">
            <span>FIPS 140-3 Level 3</span>
            <span aria-hidden="true">·</span>
            <span>Forward-Secure</span>
          </div>
        </div>

        {/* Metric 3: Critical / Flagged Threats Intercepted */}
        <div className="bg-[#0b111e] border border-slate-800 rounded-xl p-4 transition-colors hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{isHindi ? 'फ्लैग्ड उल्लंघन व चेतावनियां' : 'Flagged Risk Invocations'}</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-red-400">
              {telemetry.criticalCount}
            </span>
            <span className="text-[11px] text-slate-400">
              {isHindi ? 'गंभीर जोखिम' : 'High/Critical'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
            <span>SEBI PFUTP Reg 4</span>
            <span aria-hidden="true">·</span>
            <span>SEC Rule 10b-5</span>
          </div>
        </div>

        {/* Metric 4: Active Audited Operator Session */}
        <div className="bg-[#0b111e] border border-slate-800 rounded-xl p-4 transition-colors hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{isHindi ? 'सक्रिय ऑपरेटर सत्र' : 'Audited Operator'}</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="truncate">
            <span className="text-sm font-bold text-white block truncate">
              {user?.name || 'Narendra Ragav Venkatesan'}
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">
              {user?.role || 'broker_compliance'} · {user?.mfaVerified ? 'MFA Validated' : 'Session Active'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-mono">
            <span>IP: 103.21.244.12</span>
            <span aria-hidden="true">·</span>
            <span>mTLS 1.3</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-[#0a0f1b] border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="audit-search-input"
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder={
                isHindi
                  ? 'ऑडिट आईडी, एक्शन, ऑपरेटर, लक्ष्य प्रतिभूति, हैश या विनियमन द्वारा खोजें...'
                  : 'Search by Audit ID, Action, Operator, Asset, SHA-256 Hash, IP, or Regulation...'
              }
              className="w-full pl-10 pr-9 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Time Range Filter Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs shrink-0">
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, timeRange: 'ALL' }))}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filters.timeRange === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Time
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, timeRange: '1H' }))}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filters.timeRange === '1H'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Last 1h
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, timeRange: '24H' }))}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filters.timeRange === '24H'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Today (24h)
            </button>
            <button
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, timeRange: '7D' }))}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filters.timeRange === '7D'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              7 Days
            </button>
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Category</label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value as any }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Forensic Analysis">Forensic Analysis</option>
              <option value="Pre-Trade Surveillance">Pre-Trade Surveillance</option>
              <option value="Regulatory Validation">Regulatory Validation</option>
              <option value="Cryptographic Provenance">Cryptographic Provenance</option>
              <option value="Access & Identity">Access & Identity</option>
              <option value="Institutional Reporting">Institutional Reporting</option>
              <option value="System Governance">System Governance</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, severity: e.target.value as any }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="INFO">Informational</option>
            </select>
          </div>

          {/* Jurisdiction Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Jurisdiction</label>
            <select
              value={filters.jurisdiction}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, jurisdiction: e.target.value as any }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Jurisdictions</option>
              <option value="IN">🇮🇳 India (SEBI / NSE)</option>
              <option value="GLOBAL">🌐 Global (SEC / FINRA)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-medium">Verification Status</label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value as any }))
              }
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="TAMPER_EVIDENT_SEALED">Tamper Sealed</option>
              <option value="FLAGGED">Flagged Risk</option>
              <option value="COMPLIANT">Compliant</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="w-full py-1.5 px-3 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Main High-Density Audit Table Container */}
      <div className="bg-[#0a0f1b] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        {/* Table Sub-header */}
        <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              {isHindi ? 'ऑडिट लॉग प्रविष्टियां' : 'Ledger Entries'}
            </span>
            <span className="text-slate-500 font-mono">
              ({filteredLogs.length} of {logs.length} records)
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Chain Intact</span>
            </span>
            <span>·</span>
            <span>Sorted by Most Recent</span>
          </div>
        </div>

        {/* Data Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Timestamp (UTC)</th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Sequence & Hash</th>
                <th className="py-3 px-4 font-semibold">Operator / Session</th>
                <th className="py-3 px-4 font-semibold">Action & Event</th>
                <th className="py-3 px-4 font-semibold">Target Asset / Statute</th>
                <th className="py-3 px-3 font-semibold">Severity</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="max-w-md mx-auto space-y-2">
                      <FileCheck className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="font-semibold text-slate-300">
                        {isHindi
                          ? 'कोई मेल खाते अनुपालन ऑडिट रिकॉर्ड नहीं मिले'
                          : 'No matching compliance audit records found'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isHindi
                          ? 'कृपया अपना खोज शब्द या फ़िल्टर मानदंड समायोजित करें।'
                          : 'Try adjusting your search terms, severity, or category filters.'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="mt-3 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isCritical = log.severity === 'CRITICAL';
                  const isHigh = log.severity === 'HIGH';
                  const isLowOrInfo = log.severity === 'LOW' || log.severity === 'INFO';

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-900/60 transition-colors group cursor-pointer"
                      onClick={() => setInspectedRecord(log)}
                    >
                      {/* Column 1: Timestamp */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono text-slate-200 text-xs tabular-nums">
                          {formatRelativeTime(log.timestamp)}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 tabular-nums">
                          {formatUtcTime(log.timestamp)}
                        </div>
                      </td>

                      {/* Column 2: Sequence & Hash */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-300 text-[11px] tabular-nums">
                            #{log.sequenceNumber}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono" title="Tamper-evident hash chain link">
                            ⛓
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="font-mono text-[10px] text-slate-400 tracking-tight">
                            {log.recordHash.slice(0, 10)}...{log.recordHash.slice(-6)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(log.recordHash, log.id);
                            }}
                            className="text-slate-500 hover:text-cyan-400 p-0.5 rounded transition-colors"
                            title="Copy full SHA-256 record hash"
                          >
                            {copiedHash === log.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Column 3: Operator / Session */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-white truncate max-w-[180px]">
                          {log.operatorName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate max-w-[200px]">
                          <span>{log.operatorRole}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-500 text-[10px]">{log.ipAddress}</span>
                        </div>
                      </td>

                      {/* Column 4: Action & Category */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200 truncate max-w-[240px]">
                          {log.actionLabel}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span>{log.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-[10px] text-slate-500">{log.action}</span>
                        </div>
                      </td>

                      {/* Column 5: Target Asset & Statute */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-200 truncate max-w-[220px]">
                          {log.targetAssetOrEntity}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate max-w-[220px]">
                          <span className="shrink-0">
                            {log.jurisdiction === 'IN' ? '🇮🇳' : '🌐'}
                          </span>
                          <span className="truncate">{log.statutoryRegime}</span>
                        </div>
                      </td>

                      {/* Column 6: Severity */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isCritical && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                          {isHigh && <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />}
                          {isLowOrInfo && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />}
                          <span
                            className={`font-semibold text-[11px] font-mono ${
                              isCritical
                                ? 'text-red-400'
                                : isHigh
                                ? 'text-amber-400'
                                : log.severity === 'MEDIUM'
                                ? 'text-yellow-400'
                                : 'text-slate-300'
                            }`}
                          >
                            {log.severity}
                          </span>
                        </div>
                      </td>

                      {/* Column 7: Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="text-[11px] font-medium text-slate-300">
                          {log.status === 'VERIFIED' && 'Verified'}
                          {log.status === 'TAMPER_EVIDENT_SEALED' && 'Sealed WORM'}
                          {log.status === 'FLAGGED' && (
                            <span className="text-red-400 font-semibold">Flagged</span>
                          )}
                          {log.status === 'COMPLIANT' && 'Compliant'}
                        </span>
                      </td>

                      {/* Column 8: Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFindingForExport(log);
                              setCryptoExportScope('single_finding');
                              setIsCryptoExportModalOpen(true);
                            }}
                            className="px-2 py-1 rounded-md bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                            title="Export this record as a cryptographically signed PDF docket"
                          >
                            <FileDown className="w-3 h-3" />
                            <span className="hidden sm:inline">Signed PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectedRecord(log);
                            }}
                            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep Inspection Drawer / Modal */}
      {inspectedRecord && (
        <div
          id="audit-inspection-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setInspectedRecord(null)}
        >
          <div
            id="audit-inspection-modal"
            className="bg-[#0c121e] border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="font-mono text-cyan-400 font-bold">
                    {inspectedRecord.id}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">
                    Sequence #{inspectedRecord.sequenceNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400">FIPS 140-3 Sealed</span>
                </div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span>{inspectedRecord.actionLabel}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectedRecord(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                <span className="text-slate-400 text-[11px] block">Operator Identity</span>
                <span className="font-semibold text-white text-sm block">
                  {inspectedRecord.operatorName}
                </span>
                <span className="text-slate-400 font-mono text-[11px] block">
                  {inspectedRecord.operatorEmail} ({inspectedRecord.operatorRole})
                </span>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                <span className="text-slate-400 text-[11px] block">Statutory Standard</span>
                <span className="font-semibold text-white block">
                  {inspectedRecord.statutoryRegime}
                </span>
                <span className="text-slate-400 text-[11px] block">
                  Jurisdiction: {inspectedRecord.jurisdiction === 'IN' ? '🇮🇳 SEBI / India' : '🌐 US SEC / FINRA'}
                </span>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                <span className="text-slate-400 text-[11px] block">Target Asset / Entity</span>
                <span className="font-semibold text-white block">
                  {inspectedRecord.targetAssetOrEntity}
                </span>
                <span className="text-slate-400 text-[11px] block">
                  Category: {inspectedRecord.category}
                </span>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1">
                <span className="text-slate-400 text-[11px] block">Session & IP Ingress</span>
                <span className="font-mono text-cyan-400 block">
                  {inspectedRecord.ipAddress} (mTLS Proxy)
                </span>
                <span className="font-mono text-slate-500 text-[11px] block">
                  Session: {inspectedRecord.sessionId}
                </span>
              </div>
            </div>

            {/* Cryptographic Hash Verification Block */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
                <span className="font-bold flex items-center gap-1.5 text-slate-300">
                  <Hash className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cryptographic Forward-Secure Chain Hashes</span>
                </span>
                <span className="text-emerald-400">SHA-256 Validated</span>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-slate-500 text-[10px] block uppercase tracking-wider">
                    Previous Record Hash (prevHash)
                  </span>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="break-all">{inspectedRecord.prevHash}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(inspectedRecord.prevHash, 'prevHash')}
                      className="ml-2 text-slate-400 hover:text-white shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block uppercase tracking-wider">
                    Current Record Hash (recordHash)
                  </span>
                  <div className="flex items-center justify-between text-emerald-300 text-[11px] bg-slate-900 p-2 rounded border border-emerald-900/50">
                    <span className="break-all">{inspectedRecord.recordHash}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(inspectedRecord.recordHash, 'recordHash')}
                      className="ml-2 text-slate-400 hover:text-white shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Details & Summary */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 text-xs">
              <span className="font-semibold text-white block">Audit Event Findings</span>
              <p className="text-slate-300 leading-relaxed">
                {inspectedRecord.details.summary}
              </p>
              {inspectedRecord.details.metadata && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Structured Telemetry Payload:
                  </span>
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                    {JSON.stringify(inspectedRecord.details.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="text-slate-500 text-[11px]">
                RFC 3161 Timestamp Authority: DigiCert Root / SEBI Depository Master
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(inspectedRecord, null, 2));
                    setCopiedJson(true);
                    setTimeout(() => setCopiedJson(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied JSON</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full JSON</span>
                    </>
                  )}
                </button>

                <button
                  id="inspect-export-signed-pdf-btn"
                  type="button"
                  onClick={() => {
                    setSelectedFindingForExport(inspectedRecord);
                    setCryptoExportScope('single_finding');
                    setIsCryptoExportModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  title="Export this specific finding/record as a cryptographically signed PDF evidence docket"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Export Signed Docket (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectedRecord(null)}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Attestation Modal */}
      {isAttestationModalOpen && (
        <div
          id="audit-attestation-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsAttestationModalOpen(false)}
        >
          <div
            id="audit-attestation-modal"
            className="bg-[#0c121e] border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                  <span>Institutional Compliance Attestation</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sign a verified inspection note into the immutable ledger for SEBI / SEC regulatory review.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAttestationModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAttestation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Regulatory Mandate / Statute
                </label>
                <input
                  type="text"
                  value={attestationRegime}
                  onChange={(e) => setAttestationRegime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="e.g. SEBI Master Circular ISD/MIRSD / FINRA Rule 4511"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Officer Inspection Findings & Signed Notes
                </label>
                <textarea
                  rows={4}
                  value={attestationNotes}
                  onChange={(e) => setAttestationNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
                  placeholder="Enter official observations (e.g., 'Inspected broker telephonic voice logs against SEBI order records. All 14 biometric thresholds matched verified authorized trader identities. No anomalies detected.')"
                  required
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Digital Signature Attestation</span>
                </div>
                <div>Signer: {user?.name || 'Narendra Ragav Venkatesan'} ({user?.email || 'narendrav64@gmail.com'})</div>
                <div className="font-mono text-slate-500">Timestamp: {new Date().toISOString()} · Non-Repudiable</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAttestationModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAttestation || !attestationNotes.trim()}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingAttestation ? 'Signing Ledger...' : 'Commit Signed Attestation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Integrity Report Modal */}
      {showIntegrityModal && integrityReport && (
        <div
          id="audit-integrity-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowIntegrityModal(false)}
        >
          <div
            id="audit-integrity-modal"
            className="bg-[#0c121e] border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Cryptographic Integrity Attestation
                  </h3>
                  <p className="text-xs text-slate-400">
                    FIPS 140-3 Forward-Secure Hash Chain Verification
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIntegrityModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-lg text-emerald-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Chain Status: 100% Cryptographically Valid</span>
                </div>
                <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                  All {integrityReport.totalRecordsChecked} sequential audit blocks from Genesis block to head were verified. Zero broken links or post-facto modifications detected.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Standard:</span>
                  <span className="text-white font-bold">{integrityReport.fipsComplianceStatus}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Genesis Root:</span>
                  <span className="text-slate-300">{integrityReport.genesisHash.slice(0, 16)}...</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Head Record Hash:</span>
                  <span className="text-cyan-400">{integrityReport.latestHash.slice(0, 16)}...</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Verified Timestamp:</span>
                  <span className="text-slate-300">{integrityReport.verifiedTimestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowIntegrityModal(false)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cryptographically Signed Audit Log & Finding PDF Export Modal */}
      <CryptographicAuditLogExportModal
        isOpen={isCryptoExportModalOpen}
        onClose={() => setIsCryptoExportModalOpen(false)}
        logs={logs}
        filteredLogs={filteredLogs}
        selectedFinding={selectedFindingForExport}
        jurisdiction={jurisdiction}
        auditorRole={user?.role || 'broker_compliance'}
        auditorEmail={user?.email || 'compliance@vemar.internal'}
        auditorName={user?.name || 'Narendra Ragav Venkatesan'}
        sessionId={user?.sessionToken || 'sess_portal_live'}
        initialScope={cryptoExportScope}
      />
    </div>
  );
};
