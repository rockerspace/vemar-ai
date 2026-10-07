import { Jurisdiction } from '../types';

export interface KnownVoiceSignature {
  id: string;
  executiveName: string;
  organization: string;
  title: string;
  jurisdiction: Jurisdiction;
  exchangeTicker: string;
  kycRegistrationId: string;
  c2paHardwareCertSerial: string;
  enrollmentDate: string;
  avatarInitials: string;
  avatarColor: string;
  biometricProfile: {
    fundamentalFrequencyHz: number; // Mean F0
    pitchRangeHz: [number, number]; // [Min F0, Max F0]
    formantFrequenciesHz: [number, number, number, number]; // F1, F2, F3, F4
    jitterPPQ5Percent: number; // Natural vocal jitter (0.5% - 1.2%)
    shimmerLocalPercent: number; // Natural amplitude perturbation (1.8% - 3.2%)
    harmonicsToNoiseRatioDb: number; // HNR (18 - 26 dB)
    vocalTractLengthCm: number; // Estimated VTL (15 - 18 cm)
    spectralCentroidHz: number; // Spectral energy center
    mfccVectorDigest: string; // SHA-256 fingerprint of 128-dim acoustic vector
  };
  sampleAudioPreset: 'executive_male_deep' | 'executive_male_crisp' | 'executive_female_formal' | 'regulator_authoritative';
  description: string;
  authorizedChannels: string[];
}

export const KNOWN_VOICE_SIGNATURES: KnownVoiceSignature[] = [
  {
    id: 'sig-rel-001',
    executiveName: 'Mukesh D. Ambani',
    organization: 'Reliance Industries Ltd',
    title: 'Chairman & Managing Director',
    jurisdiction: 'IN',
    exchangeTicker: 'NSE: RELIANCE / BSE: 500325',
    kycRegistrationId: 'SEBI-DIR-00019248',
    c2paHardwareCertSerial: 'C2PA-KMS-HSM-IN-9812-7A',
    enrollmentDate: '2024-03-15 (FIPS 140-3 HSM Sealed)',
    avatarInitials: 'MA',
    avatarColor: 'from-blue-600 to-indigo-700',
    biometricProfile: {
      fundamentalFrequencyHz: 114,
      pitchRangeHz: [88, 148],
      formantFrequenciesHz: [510, 1420, 2380, 3350],
      jitterPPQ5Percent: 0.78,
      shimmerLocalPercent: 2.18,
      harmonicsToNoiseRatioDb: 22.4,
      vocalTractLengthCm: 17.4,
      spectralCentroidHz: 1680,
      mfccVectorDigest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    sampleAudioPreset: 'executive_male_deep',
    description: 'Enrolled voice signature for telephonic dividend authorizations, AGM keynote broadcasts, and board disclosures.',
    authorizedChannels: ['Corporate Investor Relations SIP', 'BSE/NSE Direct Order Dispatch', 'Certified Press Feed']
  },
  {
    id: 'sig-tat-002',
    executiveName: 'N. Chandrasekaran',
    organization: 'Tata Sons / Tata Motors Ltd',
    title: 'Executive Chairman',
    jurisdiction: 'IN',
    exchangeTicker: 'NSE: TATAMOTORS / BSE: 500570',
    kycRegistrationId: 'SEBI-DIR-00048192',
    c2paHardwareCertSerial: 'C2PA-KMS-HSM-IN-4421-9C',
    enrollmentDate: '2024-05-20 (FIPS 140-3 HSM Sealed)',
    avatarInitials: 'NC',
    avatarColor: 'from-cyan-600 to-blue-700',
    biometricProfile: {
      fundamentalFrequencyHz: 128,
      pitchRangeHz: [98, 165],
      formantFrequenciesHz: [540, 1510, 2480, 3450],
      jitterPPQ5Percent: 0.84,
      shimmerLocalPercent: 2.35,
      harmonicsToNoiseRatioDb: 21.8,
      vocalTractLengthCm: 16.8,
      spectralCentroidHz: 1790,
      mfccVectorDigest: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    },
    sampleAudioPreset: 'executive_male_crisp',
    description: 'Enrolled voice signature for commercial vehicle M&A calls, quarterly earnings conferences, and block trade orders.',
    authorizedChannels: ['Tata Group Telephonic Order Desk', 'Bloomberg Colocation Bridge', 'NSE Surveillance Ingress']
  },
  {
    id: 'sig-nvd-003',
    executiveName: 'Jensen Huang',
    organization: 'NVIDIA Corporation',
    title: 'President & Chief Executive Officer',
    jurisdiction: 'US',
    exchangeTicker: 'NASDAQ: NVDA',
    kycRegistrationId: 'SEC-CIK-0001045810',
    c2paHardwareCertSerial: 'C2PA-KMS-HSM-US-8891-2E',
    enrollmentDate: '2024-02-10 (FIPS 140-3 Level 3 Sealed)',
    avatarInitials: 'JH',
    avatarColor: 'from-emerald-600 to-green-800',
    biometricProfile: {
      fundamentalFrequencyHz: 136,
      pitchRangeHz: [102, 185],
      formantFrequenciesHz: [560, 1560, 2520, 3500],
      jitterPPQ5Percent: 0.89,
      shimmerLocalPercent: 2.42,
      harmonicsToNoiseRatioDb: 23.1,
      vocalTractLengthCm: 16.5,
      spectralCentroidHz: 1880,
      mfccVectorDigest: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    },
    sampleAudioPreset: 'executive_male_crisp',
    description: 'Enrolled signature for GTC Keynote live audio feeds, SEC Form 8-K accompanying briefings, and investor roadshows.',
    authorizedChannels: ['SEC EDGAR Audio Relay', 'Nasdaq MarketSite Audio Gateway', 'Institutional Earnings Bridge']
  },
  {
    id: 'sig-apl-004',
    executiveName: 'Tim Cook',
    organization: 'Apple Inc.',
    title: 'Chief Executive Officer',
    jurisdiction: 'US',
    exchangeTicker: 'NASDAQ: AAPL',
    kycRegistrationId: 'SEC-CIK-0000320193',
    c2paHardwareCertSerial: 'C2PA-KMS-HSM-US-1102-4A',
    enrollmentDate: '2024-01-18 (FIPS 140-3 Level 3 Sealed)',
    avatarInitials: 'TC',
    avatarColor: 'from-slate-600 to-zinc-800',
    biometricProfile: {
      fundamentalFrequencyHz: 122,
      pitchRangeHz: [92, 155],
      formantFrequenciesHz: [525, 1470, 2410, 3380],
      jitterPPQ5Percent: 0.76,
      shimmerLocalPercent: 2.05,
      harmonicsToNoiseRatioDb: 24.2,
      vocalTractLengthCm: 17.1,
      spectralCentroidHz: 1720,
      mfccVectorDigest: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
    },
    sampleAudioPreset: 'executive_male_deep',
    description: 'Enrolled signature for Apple Park Keynote broadcasts, SEC Regulation FD compliance feeds, and dividend announcements.',
    authorizedChannels: ['Apple Treasury Ingress', 'Institutional Wire Desk (Goldman Sachs)', 'Nasdaq Compliance Colocation']
  },
  {
    id: 'sig-seb-005',
    executiveName: 'Dr. Arjun Mehta (Regulatory Officer)',
    organization: 'Securities & Exchange Board of India (SEBI)',
    title: 'Wholetime Member (Surveillance & Investigation)',
    jurisdiction: 'IN',
    exchangeTicker: 'SEBI REGULATORY BENCH',
    kycRegistrationId: 'SEBI-WTM-2024-001',
    c2paHardwareCertSerial: 'SEBI-ROOT-CA-2026-FIPS3',
    enrollmentDate: '2024-04-01 (Govt of India CCA Signed)',
    avatarInitials: 'AM',
    avatarColor: 'from-amber-600 to-orange-700',
    biometricProfile: {
      fundamentalFrequencyHz: 130,
      pitchRangeHz: [95, 170],
      formantFrequenciesHz: [535, 1490, 2460, 3420],
      jitterPPQ5Percent: 0.81,
      shimmerLocalPercent: 2.22,
      harmonicsToNoiseRatioDb: 22.9,
      vocalTractLengthCm: 16.9,
      spectralCentroidHz: 1760,
      mfccVectorDigest: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d'
    },
    sampleAudioPreset: 'regulator_authoritative',
    description: 'Official enforcement voice signature used to authenticate statutory Section 11B oral directives and court depositions.',
    authorizedChannels: ['SEBI SCORES 2.0 Direct Line', 'CERT-In Emergency Bridge', 'National Stock Exchange Colocation']
  },
  {
    id: 'sig-fed-006',
    executiveName: 'Jerome H. Powell',
    organization: 'Federal Reserve Board',
    title: 'Chair of the Board of Governors',
    jurisdiction: 'US',
    exchangeTicker: 'FOMC / US TREASURY',
    kycRegistrationId: 'FRB-GOV-0001',
    c2paHardwareCertSerial: 'FED-ROOT-HSM-2026-01',
    enrollmentDate: '2024-01-05 (FIPS 140-3 HSM Sealed)',
    avatarInitials: 'JP',
    avatarColor: 'from-indigo-600 to-slate-900',
    biometricProfile: {
      fundamentalFrequencyHz: 118,
      pitchRangeHz: [90, 150],
      formantFrequenciesHz: [515, 1440, 2390, 3360],
      jitterPPQ5Percent: 0.74,
      shimmerLocalPercent: 2.10,
      harmonicsToNoiseRatioDb: 23.8,
      vocalTractLengthCm: 17.3,
      spectralCentroidHz: 1690,
      mfccVectorDigest: '6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b'
    },
    sampleAudioPreset: 'regulator_authoritative',
    description: 'Official FOMC rate decision press briefing signature for high-frequency algorithmic trade feed verification.',
    authorizedChannels: ['Fedwire Secure Terminal', 'CME Market Integrity Audio Feed', 'SEC Market Oversight Stream']
  }
];
