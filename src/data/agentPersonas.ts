import { AgentPersona } from '../types';

export const AGENT_PERSONAS: AgentPersona[] = [
  {
    id: 'roundtable',
    name: 'Morning Command Roundtable',
    title: 'Coordinated Multi-Agent Executive Council',
    avatar: 'Council',
    roleDescription: 'Synthesizes coordinated morning intelligence and release checks across all 4 specialist agents simultaneously.',
    voiceGender: 'male',
    voicePitch: 1.0,
    voiceRate: 1.05,
    accent: 'Executive Precision',
    badge: '4-Agent Council',
    color: 'from-cyan-500 to-indigo-600',
    glowColor: 'cyan',
    specialties: [
      'Multi-Perspective Pre-Market Risk',
      'Unified Beta Release Certification',
      'Executive 06:00 AM Daily Briefing',
      'Cross-Domain Incident Escalation'
    ],
    suggestedPrompts: [
      'Good morning. Give me the complete 06:00 AM executive pre-market briefing.',
      'Are we 100% ready to launch the Beta testing phase today?',
      'Check all overnight deepfake threats and confirm zero critical blockers.',
      'Summarize top 3 action items before market open.'
    ],
    morningFocus: 'Global Pre-Market Synthesis & Beta Gate Certification'
  },
  {
    id: 'sentinel-6',
    name: 'Sentinel-6',
    title: 'Morning Risk & Pre-Market Surveillance Briefer',
    avatar: 'Radar',
    roleDescription: 'Monitors overnight global synthetic media attacks, detects deepfake market manipulation, and formulates morning risk posture.',
    voiceGender: 'male',
    voicePitch: 0.95,
    voiceRate: 1.02,
    accent: 'Tactical Radar',
    badge: 'Market Risk AI',
    color: 'from-amber-500 to-red-600',
    glowColor: 'amber',
    specialties: [
      'Overnight Global Deepfake Telemetry',
      'Pre-Market Earnings Call Biometrics',
      'Executive Impersonation Radar',
      'Market Manipulation Early Warning'
    ],
    suggestedPrompts: [
      'What deepfake or synthetic audio incidents occurred overnight?',
      'Are there any executive impersonation threats targeting today\'s market open?',
      'What is our current pre-market synthetic risk score?',
      'Review high-risk watchlist tickers for potential spoofing.'
    ],
    morningFocus: 'Pre-Market Synthetic Threat Radar & Volatility Risk'
  },
  {
    id: 'lex-regulator',
    name: 'Lex-Regulator',
    title: 'Statutory Compliance & Evidence Auditor',
    avatar: 'Gavel',
    roleDescription: 'Ensures forensic markers, speech biometrics, and C2PA manifests meet strict SEBI, SEC, and statutory evidentiary standards.',
    voiceGender: 'female',
    voicePitch: 1.1,
    voiceRate: 0.98,
    accent: 'Statutory Jurist',
    badge: 'SEBI / SEC Legal',
    color: 'from-purple-500 to-pink-600',
    glowColor: 'purple',
    specialties: [
      'SEBI PFUTP & SEC Rule 10b-5 Compliance',
      'Section 65B BSA 2023 Evidentiary Admissibility',
      'Federal Rule of Evidence 902(14) Certifications',
      'Regulatory Filing Dossier Generation'
    ],
    suggestedPrompts: [
      'Verify our forensic reports comply with BSA 2023 Section 65B.',
      'Check if our C2PA manifest signatures are legally admissible in SEC filings.',
      'What statutory disclosures are required for our Beta test cohort?',
      'Audit the latest SEBI / SEC regulatory circular alignments.'
    ],
    morningFocus: 'Evidentiary Admissibility & Regulatory Compliance'
  },
  {
    id: 'aethelgard',
    name: 'Aethelgard SecOps',
    title: 'SecOps & Pre-Trade Incident Commander',
    avatar: 'Shield',
    roleDescription: 'Tracks sub-200ms acoustic detection pipelines, FIX Protocol order quarantine buffers (Tag 35=D), and FIPS 140-3 security.',
    voiceGender: 'male',
    voicePitch: 0.85,
    voiceRate: 1.05,
    accent: 'SecOps Telemetry',
    badge: 'SecOps & FIX',
    color: 'from-emerald-500 to-teal-600',
    glowColor: 'emerald',
    specialties: [
      'Real-Time Web Audio API Latency Benchmarking',
      'FIX Tag 35=D Pre-Trade Order Halt Interceptors',
      'FIPS 140-3 Hardware Token Cryptography',
      'Zero-Day Deepfake Vector Neutralization'
    ],
    suggestedPrompts: [
      'Report on our live Web Audio API acoustic analysis latency.',
      'Verify the FIX Tag 35=D pre-trade order quarantine buffer is active.',
      'Run a security integrity scan on our MFA authentication gateways.',
      'Check system memory buffer and WebSocket throughput.'
    ],
    morningFocus: 'Sub-20ms Latency SLA & FIX Order Quarantine Buffers'
  },
  {
    id: 'betaflight',
    name: 'BetaFlight QA Lead',
    title: 'Beta Launch & Pre-Release Certification Commander',
    avatar: 'Rocket',
    roleDescription: 'Executes comprehensive pre-release test suites, verifies multi-modal pipelines, tracks blockers, and certifies Beta readiness.',
    voiceGender: 'female',
    voicePitch: 1.15,
    voiceRate: 1.05,
    accent: 'QA Commander',
    badge: 'Beta Certification',
    color: 'from-blue-500 to-cyan-600',
    glowColor: 'blue',
    specialties: [
      'End-to-End Regression Test Suites',
      'Pre-Release Blocker Auditing & Resolution',
      'Beta Cohort Onboarding & Access Control',
      'Zero-Defect Release Certification'
    ],
    suggestedPrompts: [
      'Execute the full Beta Release verification test suite.',
      'Are there any unresolved critical blockers before we open Beta testing?',
      'Show me the test coverage report across all 6 core modules.',
      'Generate the official C2PA-signed Beta Release Certificate.'
    ],
    morningFocus: 'Pre-Release Test Suites & Beta Cohort Readiness'
  }
];

export const INITIAL_BETA_CHECKS = [
  {
    id: 'chk-audio-fft',
    category: 'Forensic Engine' as const,
    name: 'Web Audio API Acoustic Spectrogram & Frequency Pipeline',
    description: 'Verifies real-time Web Audio API frequency analysis, spectral flux, and synthetic pitch jitter detector.',
    status: 'PASS' as const,
    latencyMs: 8.4,
    details: 'Live audio stream analyzer calibrated at 44.1kHz / 2048 FFT bins. Sub-8kHz harmonic cutoff active.',
    statutoryRef: 'AES-EBU Digital Audio Forensics',
    criticalForBeta: true
  },
  {
    id: 'chk-c2pa-pki',
    category: 'Data & Provenance' as const,
    name: 'C2PA Manifest Engine & ECDSA P-256 Digital Signing',
    description: 'Verifies tamper-evident digital signing, RFC 3161 TSA timestamping, and SHA-256 evidence hashing.',
    status: 'PASS' as const,
    latencyMs: 14.1,
    details: 'ECDSA P-256 digital signature verified against certificate serial root. Non-repudiation verified.',
    statutoryRef: 'C2PA v2.1 / W3C Provenance',
    criticalForBeta: true
  },
  {
    id: 'chk-reg-registry',
    category: 'Compliance & Legal' as const,
    name: 'SEBI / SEC Dual Regulatory Registry Synchronization',
    description: 'Checks instant indexing of SEBI SCORES 2.0 and SEC EDGAR circulars and verified key fingerprints.',
    status: 'PASS' as const,
    latencyMs: 5.2,
    details: '100% circular hashes verified against official exchange gazette signatures.',
    statutoryRef: 'SEBI PFUTP 2003 / SEC 10b-5',
    criticalForBeta: true
  },
  {
    id: 'chk-mfa-security',
    category: 'Security & MFA' as const,
    name: 'Client Authentication & FIPS 140-3 MFA Security Gateways',
    description: 'Audits Google Identity, SMS OTP Carrier Gateway, and TOTP hardware token verification flows.',
    status: 'PASS' as const,
    latencyMs: 9.8,
    details: 'Zero plain-text token leaks. Session expiry and logout redirects fully hardened.',
    statutoryRef: 'NIST SP 800-63B / FIPS 140-3',
    criticalForBeta: true
  },
  {
    id: 'chk-fix-quarantine',
    category: 'Latency & FIX Protocol' as const,
    name: 'Pre-Trade Order Quarantine FIX Tag 35=D Interceptor',
    description: 'Measures pre-trade halt interceptor latency to ensure compliance with HFT execution limits (<20ms).',
    status: 'PASS' as const,
    latencyMs: 11.7,
    details: 'Average execution latency is 11.7ms (SLA ceiling: 20ms). Quarantine triggers active.',
    statutoryRef: 'FIX Protocol 4.4 / SEBI Algorithmic Mandate',
    criticalForBeta: true
  },
  {
    id: 'chk-gemini-ai',
    category: 'AI & Gemini SLA' as const,
    name: 'Google GenAI Gemini 3.8 Flash Neural Forensic Engine',
    description: 'Tests Gemini server-side model availability and conversational multi-agent latency.',
    status: 'PASS' as const,
    latencyMs: 185.0,
    details: 'Model connected with server-side API proxy. High-fidelity offline rule engine fallback primed.',
    statutoryRef: 'Gemini SDK v0.1.2 / Server-Side Architecture',
    criticalForBeta: false
  }
];

export const INITIAL_BETA_TESTERS = [
  {
    id: 'usr-beta-1',
    name: 'Aarav Mehta',
    email: 'amehta@kotaksecurities.com',
    organization: 'Kotak Institutional Equities',
    role: 'broker_compliance' as const,
    status: 'ACTIVE' as const,
    accessKey: 'VM-BETA-7719-KTK',
    invitedDate: '2026-09-10',
    feedbackRating: 5,
    feedbackNotes: 'Pre-trade FIX Tag 35=D quarantine worked under 14ms on telephonic order spoof simulation.'
  },
  {
    id: 'usr-beta-2',
    name: 'Sarah Jenkins, Esq.',
    email: 'sjenkins@finra-audits.org',
    organization: 'FINRA Market Operations',
    role: 'secops_auditor' as const,
    status: 'ACTIVE' as const,
    accessKey: 'VM-BETA-8820-FNR',
    invitedDate: '2026-09-11',
    feedbackRating: 5,
    feedbackNotes: 'C2PA PDF statutory watermark is admissible under FRE 902(14). Verified SHA-256 chain.'
  },
  {
    id: 'usr-beta-3',
    name: 'Dr. Rajiv Singhania',
    email: 'rsinghania@hdfcsec.in',
    organization: 'HDFC Securities Compliance',
    role: 'mii_regulator' as const,
    status: 'FEEDBACK_SUBMITTED' as const,
    accessKey: 'VM-BETA-9931-HDF',
    invitedDate: '2026-09-12',
    feedbackRating: 5,
    feedbackNotes: 'Audio frequency visualizer caught WhatsApp pump-and-dump CEO deepfake audio instantly.'
  },
  {
    id: 'usr-beta-4',
    name: 'David Chen',
    email: 'dchen@apexclearing.com',
    organization: 'Apex Clearing Prime Brokerage',
    role: 'csuite_ir' as const,
    status: 'INVITED' as const,
    accessKey: 'VM-BETA-4422-APX',
    invitedDate: '2026-09-13'
  }
];
