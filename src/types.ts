export type UserRole = 'retail_investor' | 'broker_compliance' | 'mii_regulator' | 'csuite_ir' | 'secops_auditor';

export type Jurisdiction = 'IN' | 'US' | 'GLOBAL';

export type ThreatChannel = 'video_frame' | 'audio_call' | 'email' | 'social_post' | 'circular';

export type ThreatLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'AUTHENTIC';

export interface ForensicMarker {
  category: 'Visual Artifacts' | 'Acoustic / Biometric' | 'Linguistic / Social Engineering' | 'Metadata / Network Domain' | 'Cryptographic & Regulatory';
  indicator: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'BENIGN';
  description: string;
  confidence: number;
}

export interface SecuritiesRegulationViolation {
  code: string;
  description: string;
  jurisdiction: Jurisdiction;
}

export interface MarketImpactAssessment {
  estimatedRiskType: string;
  severityRating: 'EXTREME' | 'SEVERE' | 'ELEVATED' | 'MINIMAL';
  potentialVictims: string;
  actionUrgency: 'IMMEDIATE_INTERVENTION' | 'HIGH_PRIORITY_REVIEW' | 'ROUTINE_MONITORING' | 'SAFE';
}

export interface ForensicAnalysisResult {
  syntheticRiskScore: number;
  threatLevel: ThreatLevel;
  primaryVerdict: string;
  executiveOrEntityImpersonated: string;
  channelAnalyzed: ThreatChannel;
  jurisdiction?: Jurisdiction;
  forensicMarkers: ForensicMarker[];
  securitiesRegulationsViolated: SecuritiesRegulationViolation[];
  marketImpactAssessment: MarketImpactAssessment;
  actionablePlaybook: string[];
  dossierSummary: string;
}

export interface BenchmarkCase {
  id: string;
  title: string;
  channel: ThreatChannel;
  channelName: string;
  jurisdiction: Jurisdiction;
  targetEntity: string;
  severity: ThreatLevel;
  summary: string;
  sampleContent: string;
  hasMedia: 'image' | 'audio' | 'none';
  mediaPlaceholderTitle?: string;
  mediaDescription?: string;
  visualHeatmapUrl?: string;
  mockAudioFrequencies?: number[];
  isSynthetic: boolean;
  provenanceHash?: string;
}

// Indian Market Official Records
export interface OfficialCircularRecord {
  id: string;
  circularNumber: string;
  issuer: 'SEBI' | 'NSE' | 'BSE' | 'MCX' | 'RBI';
  title: string;
  publishDate: string;
  sha256Hash: string;
  category: string;
  officialUrl: string;
  summary: string;
  verifiedKeyFingerprint: string;
}

export interface RegisteredIntermediaryRecord {
  registrationNumber: string;
  entityName: string;
  category: 'Stock Broker' | 'Research Analyst' | 'Investment Adviser' | 'Depository Participant' | 'Merchant Banker' | 'Portfolio Manager';
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'CANCELLED';
  validTill: string;
  officialDomain: string;
  officialContact: string;
  complianceOfficer: string;
}

// US Market Official Records
export interface SECEDGARRecord {
  id: string;
  accessionNumber: string;
  cik: string;
  companyName: string;
  formType: '8-K' | '10-K' | '10-Q' | 'Form 4' | 'SC 13D';
  filingDate: string;
  sha256Hash: string;
  secDocumentUrl: string;
  verifiedFilerDigest: string;
  summary: string;
}

export interface FINRABrokerRecord {
  crdNumber: string;
  firmName: string;
  category: 'Broker-Dealer (BD)' | 'Registered Investment Adviser (RIA)' | 'Dual Registrant';
  status: 'ACTIVE' | 'BARRED' | 'SUSPENDED' | 'REVOKED';
  secNumber: string;
  officialDomain: string;
  officialEmail: string;
  mainBranchState: string;
  disclosureEventsCount: number;
}

// Cryptographic Provenance
export interface ProvenanceSeal {
  c2paStandardVersion: string;
  provenanceSealId: string;
  issuerName: string;
  issuingCategory: string;
  documentTitle: string;
  sha256Digest: string;
  issuedTimestamp: string;
  jurisdiction: Jurisdiction;
  verifiedRegistryRoot: string;
  publicVerificationUrl: string;
  tamperResistantStatus: string;
  qrPayload: string;
}

// Market Surveillance Telemetry
export interface ThreatTelemetry {
  statistics: {
    totalAttacksAnalyzedToday: number;
    syntheticMediaDetected: number;
    phishingAttacksPrevented: number;
    authenticCommunicationsValidated: number;
    averageDetectionLatencyMs: number;
    activeSurveillanceAlerts: number;
    marketValueProtectedINR: string;
    marketValueProtectedUSD: string;
  };
  vectorsBreakdown: {
    name: string;
    percentage: number;
    risk: string;
  }[];
  recentIncidents: {
    id: string;
    timestamp: string;
    channel: string;
    channelLabel: string;
    jurisdiction: Jurisdiction;
    targetAsset: string;
    threatType: string;
    riskScore: number;
    threatLevel: ThreatLevel;
    detectionMethod: string;
    flaggedBy: string;
    status: string;
    impactPrevented: string;
  }[];
}

// Enterprise SIEM & Audit Trail
export interface EnterpriseAuditLog {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorId: string;
  jurisdiction: Jurisdiction;
  action: 'FORENSIC_SCAN' | 'REGISTRY_QUERY' | 'PROVENANCE_ISSUED' | 'DOSSIER_EXPORT' | 'API_KEY_CREATED' | 'SIEM_DISPATCH';
  targetAsset: string;
  channel: ThreatChannel;
  riskScore: number;
  threatLevel: ThreatLevel;
  statutoryRegime: string;
  ipAddress: string;
  userAgent: string;
  siemForwarded: boolean;
}

// Enterprise API Keys
export interface EnterpriseAPIKey {
  keyId: string;
  name: string;
  maskedKey: string;
  tier: 'Developer Sandbox' | 'Institutional Brokerage' | 'MII / Exchange Surveillance';
  rateLimitPerMin: number;
  requestsToday: number;
  createdDate: string;
  status: 'ACTIVE' | 'REVOKED';
}

// Model Benchmark Scorecard
export interface BenchmarkAccuracyMetric {
  datasetName: string;
  modality: 'Video Deepfakes' | 'Voice Synthesis (ASV)' | 'Spear Phishing & Spoofing' | 'Bot Syndicate Manipulation';
  sampleCount: number;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  latencyP99Ms: number;
}
