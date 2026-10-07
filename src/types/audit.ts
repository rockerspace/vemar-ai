import { UserRole, Jurisdiction, ThreatLevel, ThreatChannel } from '../types';

export type AuditActionType =
  | 'FORENSIC_SCAN_EXECUTED'
  | 'REGULATORY_VERIFICATION_QUERY'
  | 'C2PA_PROVENANCE_GENERATED'
  | 'DOSSIER_REPORT_EXPORTED'
  | 'SURVEILLANCE_RADAR_INSPECTED'
  | 'MARKET_MODE_SWITCHED'
  | 'USER_ROLE_CHANGED'
  | 'AUTHENTICATION_LOGIN'
  | 'AUTHENTICATION_LOGOUT'
  | 'MFA_VERIFICATION'
  | 'SECURITY_TOKEN_GENERATED'
  | 'DAILY_AGENT_DISPATCHED'
  | 'MANUAL_AUDIT_ATTESTATION'
  | 'SEBI_GLOSSARY_ACCESSED'
  | 'SYS_CONFIG_MODIFIED'
  | 'PRE_TRADE_ORDER_HALTED'
  | 'REGULATORY_ALERT_DOCUMENTED'
  | 'HIGH_RISK_TRADE_INTERCEPTED';

export type AuditCategory =
  | 'Forensic Analysis'
  | 'Regulatory Validation'
  | 'Cryptographic Provenance'
  | 'Access & Identity'
  | 'Surveillance Radar'
  | 'Institutional Reporting'
  | 'System Governance'
  | 'Pre-Trade Surveillance'
  | 'Regulatory Alert';

export type AuditSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type AuditStatus = 'VERIFIED' | 'TAMPER_EVIDENT_SEALED' | 'FLAGGED' | 'COMPLIANT';

export interface AuditRecordDetails {
  summary: string;
  targetEntity?: string;
  channel?: ThreatChannel;
  riskScore?: number;
  threatLevel?: ThreatLevel;
  provenanceSealId?: string;
  statutoryCode?: string;
  exportedFormat?: string;
  verifiedAuthority?: string;
  inspectionNotes?: string;
  metadata?: Record<string, any>;
}

export interface ComplianceAuditEntry {
  id: string; // e.g. "AUDIT-2026-10492"
  timestamp: string; // ISO 8601 UTC timestamp
  sequenceNumber: number; // Monotonically increasing sequence number
  prevHash: string; // SHA-256 hash of previous audit record for tamper-evident chaining
  recordHash: string; // SHA-256 hash of this record
  operatorName: string; // User's name or active session operator
  operatorEmail: string; // User email or terminal identifier
  operatorRole: UserRole; // Current role
  action: AuditActionType;
  actionLabel: string; // Human-readable description
  category: AuditCategory;
  jurisdiction: Jurisdiction; // 'IN' | 'US' | 'GLOBAL'
  statutoryRegime: string; // Legal requirement, e.g., "SEBI CSCRF Sec 7.2" or "SEC Rule 17a-4"
  targetAssetOrEntity: string; // Target security or communication
  severity: AuditSeverity;
  status: AuditStatus;
  ipAddress: string;
  sessionId: string;
  userAgent: string;
  details: AuditRecordDetails;
}

export interface AuditLogFilterState {
  searchQuery: string;
  category: 'ALL' | AuditCategory;
  severity: 'ALL' | AuditSeverity;
  jurisdiction: 'ALL' | Jurisdiction;
  status: 'ALL' | AuditStatus;
  timeRange: 'ALL' | '1H' | '24H' | '7D';
}

export interface ChainIntegrityReport {
  isValid: boolean;
  totalRecordsChecked: number;
  genesisHash: string;
  latestHash: string;
  brokenAtSequence?: number;
  verifiedTimestamp: string;
  fipsComplianceStatus: string;
}
