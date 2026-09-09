import {
  ForensicAnalysisResult,
  ThreatChannel,
  ThreatTelemetry,
  ProvenanceSeal,
  OfficialCircularRecord,
  RegisteredIntermediaryRecord,
  SECEDGARRecord,
  FINRABrokerRecord,
  Jurisdiction,
  EnterpriseAuditLog,
  EnterpriseAPIKey,
  BenchmarkAccuracyMetric
} from '../types';

export async function checkSystemHealth(): Promise<{ status: string; hasGeminiKey: boolean; version?: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'offline', hasGeminiKey: false };
  }
}

export async function fetchThreatTelemetry(): Promise<ThreatTelemetry> {
  const res = await fetch('/api/threat-intelligence');
  if (!res.ok) throw new Error('Failed to fetch threat intelligence feed');
  return await res.json();
}

export interface AnalyzePayload {
  channel: ThreatChannel;
  targetUserRole: string;
  jurisdiction?: Jurisdiction;
  textContent?: string;
  imageBase64?: string;
  audioBase64?: string;
  mimeType?: string;
  fileName?: string;
  contextData?: Record<string, any>;
}

export async function analyzeSyntheticContent(payload: AnalyzePayload): Promise<{
  success: boolean;
  source: string;
  analysis: ForensicAnalysisResult;
}> {
  const res = await fetch('/api/analyze-synthetic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Forensic analysis request failed');
  }

  return await res.json();
}

export interface VerifyCommunicationPayload {
  queryType: 'circular' | 'intermediary' | 'sec_edgar' | 'finra';
  identifier?: string;
  contentText?: string;
  hashProvided?: string;
  jurisdiction?: Jurisdiction;
}

export interface VerifyCommunicationResponse {
  verified: boolean;
  status: string;
  confidence: number;
  details: OfficialCircularRecord | RegisteredIntermediaryRecord | SECEDGARRecord | FINRABrokerRecord | null;
  verificationChecks: Record<string, any>;
  warning: string | null;
}

export async function verifyCommunication(payload: VerifyCommunicationPayload): Promise<VerifyCommunicationResponse> {
  const res = await fetch('/api/verify-communication', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Verification query failed');
  }

  return await res.json();
}

export interface SignDisclosurePayload {
  issuerName: string;
  documentTitle: string;
  disclosureText: string;
  issuingCategory: string;
  jurisdiction?: Jurisdiction;
}

export async function signCorporateDisclosure(payload: SignDisclosurePayload): Promise<{
  success: boolean;
  provenanceSeal: ProvenanceSeal;
}> {
  const res = await fetch('/api/sign-disclosure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to issue provenance seal');
  }

  return await res.json();
}

// Enterprise Audit Logs
export async function fetchEnterpriseAuditLogs(): Promise<{
  success: boolean;
  complianceCertifications: string[];
  totalAuditedEvents: number;
  logs: EnterpriseAuditLog[];
}> {
  const res = await fetch('/api/enterprise/audit-logs');
  if (!res.ok) throw new Error('Failed to fetch enterprise audit logs');
  return await res.json();
}

// Enterprise API Keys
export async function fetchEnterpriseAPIKeys(): Promise<{
  success: boolean;
  keys: EnterpriseAPIKey[];
}> {
  const res = await fetch('/api/enterprise/api-keys');
  if (!res.ok) throw new Error('Failed to fetch API keys');
  return await res.json();
}

export async function createEnterpriseAPIKey(name: string, tier: string): Promise<{
  success: boolean;
  key: EnterpriseAPIKey;
}> {
  const res = await fetch('/api/enterprise/api-keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, tier }),
  });
  if (!res.ok) throw new Error('Failed to create enterprise API key');
  return await res.json();
}

// Model Accuracy Benchmarks
export async function fetchBenchmarkMetrics(): Promise<{
  success: boolean;
  overallF1Score: number;
  overallFalsePositiveRate: number;
  benchmarks: BenchmarkAccuracyMetric[];
}> {
  const res = await fetch('/api/enterprise/benchmarks');
  if (!res.ok) throw new Error('Failed to fetch benchmark metrics');
  return await res.json();
}
