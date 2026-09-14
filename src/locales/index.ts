import { Language } from '../types/languages';
import { INDIAN_TRANSLATIONS } from './indianLanguages';
import { GLOBAL_FOREIGN_TRANSLATIONS } from './globalLanguages';

export const ENGLISH_TRANSLATIONS: Record<string, string> = {
  // Brand & Header
  'brand.title': 'VEMAR AI',
  'brand.tagline': 'Voice, Entity & Media Authentication and Risk Intelligence',
  'brand.edition': 'ENTERPRISE v3.0',
  'market.label': 'Market:',
  'market.india': 'India (SEBI)',
  'market.global': 'Global (SEC / FINRA)',
  'market.india_short': 'India',
  'market.global_short': 'Global',
  'language.label': 'Language:',
  'language.en': 'English',
  'language.hi': 'हिन्दी (Hindi)',
  'glossary.btn': 'SEBI Financial Glossary',
  'glossary.title': 'SEBI Capital Markets Terminology & Regulatory Glossary',
  'glossary.subtitle': 'Official statutory terms, Devanagari definitions, and forensic threat analysis under the SEBI framework.',

  // Roles
  'role.retail': 'Retail Investor',
  'role.broker': 'Broker Compliance',
  'role.mii': 'MII / Exchange',
  'role.csuite': 'C-Suite & IR',
  'role.secops': 'SecOps Auditor',

  // Navigation Tabs
  'nav.overview': 'Overview',
  'nav.scanner': 'Threat Scanner',
  'nav.vemar_arch': 'VEMAR Pipeline',
  'nav.vemar_gaps': '8 Industry Gaps',
  'nav.authenticator': 'SEBI Registry & Circulars',
  'nav.authenticator_global': 'SEC EDGAR & FINRA Validator',
  'nav.provenance': 'C2PA Provenance',
  'nav.radar': 'Surveillance Radar',
  'nav.enterprise': 'SIEM & OMS Gateway',
  'nav.investor_pitch': 'Investor Pitch Decks',
  'nav.guide': 'Investor Defense Guide',

  // Quick Ribbon
  'ribbon.badge': 'VEMAR AI ENTERPRISE',
  'ribbon.sub_in': 'Production-grade defense for Institutional Brokers, Clearing Corps, & Regulators in India (SEBI).',
  'ribbon.sub_global': 'Production-grade defense for Prime Brokers, Market Makers, & Regulators across Global & US Markets (SEC / FINRA).',
  'ribbon.pipeline_btn': 'VEMAR Pipeline',
  'ribbon.gaps_btn': '8 Industry Gaps',
  'ribbon.pitch_btn': 'Dual Pitch Decks',
  'ribbon.gateway_btn': 'SIEM & OMS Gateway',

  // Scanner
  'scanner.title': 'Multi-Modal Forensic Threat Scanner',
  'scanner.subtitle': 'Real-time detection of AI voice clones, deepfake videos, spoofed regulatory circulars, and algorithmic pump campaigns.',
  'scanner.input_label': 'Ingest Audio, Video, Document, or Market Communication:',
  'scanner.scan_action': 'Run VEMAR Deep Forensic Scan',
  'scanner.scanning': 'Running Deep Forensic Pipeline...',
  'scanner.verdict_authentic': 'VERIFIED AUTHENTIC',
  'scanner.verdict_synthetic': 'CRITICAL SYNTHETIC RISK DETECTED',
  'scanner.risk_score': 'Synthetic Risk Score',
  'scanner.halt_order': 'Trigger Pre-Trade FIX Halt',
  'scanner.order_halted': 'FIX 35=D Order Halted & Logged',
  'scanner.dossier_btn': 'Export Regulatory Audit Dossier',

  // Common
  'common.status': 'Status',
  'common.verified': 'Verified Genuine',
  'common.unverified': 'Suspicious / Unverified',
  'common.search': 'Search or Query',
  'common.download': 'Download Evidence',
  'common.close': 'Close',
  'common.filter': 'Filter by Category'
};

export const ALL_UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: ENGLISH_TRANSLATIONS,
  ...INDIAN_TRANSLATIONS,
  ...GLOBAL_FOREIGN_TRANSLATIONS
};

export function getLocalizedText(lang: Language, key: string, fallback?: string): string {
  const langDict = ALL_UI_TRANSLATIONS[lang];
  if (langDict && langDict[key]) {
    return langDict[key];
  }
  const enDict = ALL_UI_TRANSLATIONS.en;
  if (enDict && enDict[key]) {
    return enDict[key];
  }
  return fallback || key;
}

export * from './indianLanguages';
export * from './globalLanguages';
