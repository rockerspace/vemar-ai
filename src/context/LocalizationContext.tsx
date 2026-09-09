import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Jurisdiction } from '../types';

export type Language = 'en' | 'hi';
export type MarketMode = 'IN' | 'GLOBAL';

export interface SebiTermDefinition {
  id: string;
  category: 'REGULATORY' | 'INTERMEDIARY' | 'MARKET_INFRA' | 'FRAUD_FORENSIC' | 'ENFORCEMENT';
  termEn: string;
  termHi: string;
  transliteration: string;
  statutoryRef: string;
  definitionEn: string;
  definitionHi: string;
  threatWarningEn: string;
  threatWarningHi: string;
}

export const SEBI_FINANCIAL_GLOSSARY: SebiTermDefinition[] = [
  {
    id: 'sebi',
    category: 'REGULATORY',
    termEn: 'Securities and Exchange Board of India (SEBI)',
    termHi: 'भारतीय प्रतिभूति एवं विनिमय बोर्ड (सेबी)',
    transliteration: 'Bharatiya Pratibhuti evam Vinimay Board',
    statutoryRef: 'Securities and Exchange Board of India Act, 1992',
    definitionEn: 'The primary statutory regulatory body for the securities and commodity markets in India under the administrative jurisdiction of the Ministry of Finance.',
    definitionHi: 'भारत में प्रतिभूति एवं जिंस बाजार का प्रमुख वैधानिक नियामक प्राधिकरण, जिसका मुख्य उद्देश्य निवेशकों के हितों की रक्षा करना एवं बाजार का व्यवस्थित विकास सुनिश्चित करना है।',
    threatWarningEn: 'SEBI never conducts direct cold calls, WhatsApp messages, or requests funds into individual escrow bank accounts.',
    threatWarningHi: 'सेबी कभी भी सीधे निवेशकों को फोन, व्हाट्सएप या व्यक्तिगत बैंक खातों में अग्रिम सुरक्षा राशि जमा करने का निर्देश नहीं देता।'
  },
  {
    id: 'pfutp',
    category: 'REGULATORY',
    termEn: 'Prohibition of Fraudulent and Unfair Trade Practices (PFUTP)',
    termHi: 'धोखाधड़ी एवं अनुचित व्यापार व्यवहार रोकथाम विनियम (पीएफयूटीपी)',
    transliteration: 'Dhokhadhadi evam Anuchit Vyapar Vyavahar Roktham Viniyam',
    statutoryRef: 'SEBI (PFUTP) Regulations, 2003 (Regulation 3 & 4)',
    definitionEn: 'Comprehensive statutory regulations prohibiting market manipulation, fraudulent inducement, circular trading, and deceptive dissemination of synthetic financial news.',
    definitionHi: 'शेयर बाजार में कृत्रिम हेरफेर, भ्रामक अफवाहें, डीपफेक या गलत समाचारों के माध्यम से निवेशकों को गुमराह करने और अनुचित व्यापार करने पर पूर्ण प्रतिबंध लगाने वाले सेबी के सख्त नियम।',
    threatWarningEn: 'Spreading synthetic audio of CEOs to trigger sharp share price swings constitutes a non-bailable violation of PFUTP Regulation 4(2)(k).',
    threatWarningHi: 'शेयर के भाव प्रभावित करने के लिए सीईओ की फर्जी आवाज (एआई वॉयस क्लोन) का प्रसार करना पीएफयूटीपी विनियम 4(2)(k) का गंभीर उल्लंघन है।'
  },
  {
    id: 'scores',
    category: 'REGULATORY',
    termEn: 'SEBI Complaints Redress System (SCORES 2.0)',
    termHi: 'सेबी शिकायत निवारण प्रणाली (स्कोर्स 2.0)',
    transliteration: 'SEBI Shikayat Nivaran Pranali',
    statutoryRef: 'SEBI Master Circular on Investor Grievance Handling',
    definitionEn: 'A centralized cloud-based platform enabling retail and institutional investors to lodge and track complaints against listed companies and SEBI-registered intermediaries.',
    definitionHi: 'सेबी का आधिकारिक ऑनलाइन पोर्टल जिसके माध्यम से कोई भी निवेशक सूचीबद्ध कंपनियों, ब्रोकर्स या मध्यस्थों के खिलाफ ऑनलाइन शिकायत दर्ज करा सकता है।',
    threatWarningEn: 'Fraudsters create fake lookalike SCORES web portals to collect Demat credentials and OTPs.',
    threatWarningHi: 'साइबर धोखेबाज सेबी स्कोर्स से मिलती-जुलती फर्जी वेबसाइटें बनाकर निवेशकों के डीमैट क्रेडेंशियल्स और ओटीपी चुराने का प्रयास करते हैं।'
  },
  {
    id: 'ria',
    category: 'INTERMEDIARY',
    termEn: 'Registered Investment Advisor (RIA)',
    termHi: 'पंजीकृत निवेश सलाहकार (आरआईए)',
    transliteration: 'Panjikrit Nivesh Salahkar',
    statutoryRef: 'SEBI (Investment Advisers) Regulations, 2013',
    definitionEn: 'A certified individual or corporate entity holding an official SEBI registration number (INA...) legally mandated to provide fiduciary fee-only investment advice.',
    definitionHi: 'सेबी द्वारा आधिकारिक रूप से प्रमाणित एवं लाइसेंस प्राप्त (INA पंजीकरण कोड) व्यक्ति या संस्था, जो निवेशकों को निष्पक्ष निवेश परामर्श देने के लिए कानूनी रूप से अधिकृत है।',
    threatWarningEn: 'Unregistered Telegram channels claiming "99% Sure Jackpot Tips" are NOT registered RIAs and are illegal under SEBI norms.',
    threatWarningHi: 'टेलीग्राम या व्हाट्सएप पर "99% पक्का जैकपॉट कॉल" देने वाले अनधिकृत चैनल सेबी पंजीकृत सलाहकार नहीं हैं और यह पूरी तरह अवैध है।'
  },
  {
    id: 'ra',
    category: 'INTERMEDIARY',
    termEn: 'Research Analyst (RA)',
    termHi: 'शोध विश्लेषक (रिसर्च एनालिस्ट - आरए)',
    transliteration: 'Shodh Vishleshak',
    statutoryRef: 'SEBI (Research Analysts) Regulations, 2014',
    definitionEn: 'An authorized market specialist with a SEBI INH registration number qualified to publish equity research reports, price targets, and fundamental analyses.',
    definitionHi: 'सेबी से पंजीकृत विशेषज्ञ (INH कोड धारक) जो कंपनियों के वित्तीय आंकड़ों और शेयरों के उचित मूल्य पर वैधानिक शोध रिपोर्ट प्रकाशित करने के लिए अधिकृत हैं।',
    threatWarningEn: 'Finfluencers forging SEBI RA registration certificates face impounding of bank accounts under Section 11B.',
    threatWarningHi: 'फर्जी सेबी आरए प्रमाणपत्र दिखाकर लोगों से पैसे ठगने वाले सोशल मीडिया प्रभावकों के खिलाफ सेबी खातों को सीज करने की कार्रवाई करती है।'
  },
  {
    id: 'stock_broker',
    category: 'INTERMEDIARY',
    termEn: 'SEBI Registered Stock Broker',
    termHi: 'सेबी पंजीकृत स्टॉक ब्रोकर (दलाल)',
    transliteration: 'SEBI Panjikrit Stock Broker',
    statutoryRef: 'SEBI (Stock Brokers) Regulations, 1992 (INZ Registration)',
    definitionEn: 'A member of recognized stock exchanges (NSE/BSE) licensed with a unique INZ certificate to route client orders and handle trading accounts.',
    definitionHi: 'मान्यता प्राप्त स्टॉक एक्सचेंज (NSE/BSE) का अधिकृत सदस्य जिसके पास सेबी द्वारा जारी वैध INZ कोड होता है और जो निवेशकों के व्यापारिक सौदों को निष्पादित करता है।',
    threatWarningEn: 'Verify broker credentials directly against SEBI portal. Cloned APK applications mimicking Zerodha or Groww steal funds directly.',
    threatWarningHi: 'ब्रोकर की विश्वसनीयता हमेशा सेबी वेबसाइट पर जांचें। नकली ऐप डाउनलोड कराकर फर्जी ट्रेडिंग स्क्रीन दिखाने वाले घोटालों से सावधान रहें।'
  },
  {
    id: 'demat_account',
    category: 'MARKET_INFRA',
    termEn: 'Demat & Trading Account',
    termHi: 'डीमैट एवं ट्रेडिंग खाता',
    transliteration: 'Demat evam Trading Khata',
    statutoryRef: 'Depositories Act, 1996 & SEBI Depository Regulations',
    definitionEn: 'Dematerialized electronic accounts maintained by national depositories (NSDL and CDSL) that securely hold an investor’s shares and securities in digital form.',
    definitionHi: 'राष्ट्रीय डिपॉजिटरी (NSDL और CDSL) के पास सुरक्षित खाता, जिसमें निवेशकों के शेयर और प्रतिभूतियां भौतिक कागजात के बजाय सुरक्षित डिजिटल रूप में रखी जाती हैं।',
    threatWarningEn: 'Never share Power of Attorney (PoA) or T-PIN credentials with unverified entities or social media tips providers.',
    threatWarningHi: 'अपना टी-पिन (T-PIN), पासवर्ड या पावर ऑफ अटॉर्नी (PoA) किसी भी अज्ञात व्यक्ति या व्हाट्सएप ग्रुप एडमिन के साथ कभी साझा न करें।'
  },
  {
    id: 'nsdl_cdsl',
    category: 'MARKET_INFRA',
    termEn: 'National Depositories (NSDL & CDSL)',
    termHi: 'राष्ट्रीय डिपॉजिटरी (एनएसडीएल एवं सीडीएसएल)',
    transliteration: 'Rashtriya Depository (NSDL evam CDSL)',
    statutoryRef: 'Depositories Act, 1996',
    definitionEn: 'The two central securities depositories in India facilitating book-entry transfers, corporate actions, and asset immutability.',
    definitionHi: 'भारत की दो प्रमुख केंद्रीय डिपॉजिटरी संस्थाएं जो निवेशकों के शेयरों का इलेक्ट्रॉनिक रिकॉर्ड और सुरक्षित हस्तांतरण सुनिश्चित करती हैं।',
    threatWarningEn: 'Authentic debit alerts arrive solely via official SMS headers (VK-NSDL, AX-CDSL). Spoofed sender IDs (e.g., AD-NSDLTRD) are phishing traps.',
    threatWarningHi: 'शेयर डेबिट होने का प्रामाणिक एसएमएस केवल आधिकारिक हेडर (जैसे VK-NSDL या AX-CDSL) से आता है। किसी भी सामान्य मोबाइल नंबर से आए संदेश पर भरोसा न करें।'
  },
  {
    id: 'pre_trade_halt',
    category: 'ENFORCEMENT',
    termEn: 'Pre-Trade Execution Interception (FIX 35=D Reject)',
    termHi: 'पूर्व-व्यापार निष्पादन रोक (फिक्स प्रोटोकॉल 35=D अस्वीकृति)',
    transliteration: 'Poorv-Vyapar Nishpadan Rok',
    statutoryRef: 'SEBI Master Circular for Stock Brokers / Risk Management Framework',
    definitionEn: 'Automated pre-trade risk filter that intercepts and blocks suspicious institutional orders before they touch the exchange matching engine.',
    definitionHi: 'एक्सचेंज पर सौदा दर्ज होने से पहले ही स्वचालित सुरक्षा प्रणाली द्वारा संदिग्ध या अनधिकृत ऑर्डर्स को तुरंत अस्वीकार एवं ब्लॉक करने की तकनीक।',
    threatWarningEn: 'VEMAR AI triggers an automated FIX tag 35=D halt within <380ms upon detecting synthetic voice clone or spoofed broker credentials.',
    threatWarningHi: 'वेमार एआई कृत्रिम आवाज या फर्जी ब्रोकर कॉल की पहचान होते ही 380 मिलीसेकंड के भीतर सौदे को निष्पादित होने से रोक देता है।'
  },
  {
    id: 'section_11b',
    category: 'ENFORCEMENT',
    termEn: 'SEBI Section 11B Directions (Disgorgement & Asset Freeze)',
    termHi: 'सेबी अधिनियम धारा 11बी निर्देश (अवैध लाभ जब्ती एवं खाता रोक)',
    transliteration: 'SEBI Adhiniyam Dhara 11B Nirdesh',
    statutoryRef: 'Securities and Exchange Board of India Act, 1992 (Section 11B)',
    definitionEn: 'Statutory emergency power of SEBI to issue binding directions, impound illicit gains, bar market participants, and freeze fraudulent trading accounts.',
    definitionHi: 'सेबी की आपातकालीन वैधानिक शक्तियां, जिसके तहत बाजार में हेरफेर करने वाले अपराधियों की अवैध कमाई जब्त की जाती है और उन्हें शेयर बाजार से प्रतिबंधित किया जाता है।',
    threatWarningEn: 'VEMAR generates cryptographically sealed forensic audit dossiers directly formatted for submission to SEBI Enforcement Cell under Section 11B.',
    threatWarningHi: 'वेमार एआई द्वारा तैयार किया गया फोरेंसिक डॉसियर सेबी धारा 11बी के तहत कानूनी कार्रवाई के लिए कोर्ट में मान्य डिजिटल साक्ष्य के रूप में उपयोग किया जा सकता है।'
  },
  {
    id: 'synthetic_voice_clone',
    category: 'FRAUD_FORENSIC',
    termEn: 'Acoustic Synthetic Voice Cloning (Vishing)',
    termHi: 'कृत्रिम ध्वनि क्लोनिंग एवं फर्जी वॉयस कॉल (विशिंग)',
    transliteration: 'Kritrim Dhwani Cloning evam Vishig',
    statutoryRef: 'IT Act 2000 Section 66D & SEBI PFUTP Reg 4(2)(r)',
    definitionEn: 'AI deepfake technology used by syndicates to clone voice timbre, pitch, and cadence of company directors, SEBI officials, or fund managers to induce panic or illicit fund transfers.',
    definitionHi: 'आर्टिफिशियल इंटेलिजेंस द्वारा किसी कंपनी के सीईओ या सेबी अधिकारी की आवाज की नकल कर निवेशकों को डराकर अवैध बैंक खातों में पैसे ट्रांसफर कराने की धोखाधड़ी।',
    threatWarningEn: 'Acoustic spectrum displays LPCC vocoder phase anomalies and loss of high-frequency prosody above 8 kHz.',
    threatWarningHi: 'कंप्यूटर निर्मित आवाज में प्राकृतिक सांस लेने की आवाज नहीं होती और ध्वनि स्पेक्ट्रोग्राम में उच्च आवृत्तियों पर कृत्रिम विरूपण साफ दिखाई देता है।'
  },
  {
    id: 'telegram_pump_dump',
    category: 'FRAUD_FORENSIC',
    termEn: 'Unregistered Social Media "Pump & Dump" Syndicate',
    termHi: 'अपंजीकृत सोशल मीडिया "पंप और डंप" सिंडिकेट',
    transliteration: 'Apanjikrit Social Media Pump aur Dump Syndicate',
    statutoryRef: 'SEBI Circular on Unregistered Financial Influencers (Finfluencers)',
    definitionEn: 'Organized schemes where bad actors artificially inflate illiquid micro-cap shares via paid WhatsApp/Telegram groups, then dump holdings onto unsuspecting retail investors.',
    definitionHi: 'टेलीग्राम या यूट्यूब पर कम कारोबार वाले पेनी स्टॉक्स के फर्जी टारगेट देकर भाव बढ़ाना और फिर शीर्ष भाव पर खुद के शेयर बेचकर आम निवेशकों को फंसाना।',
    threatWarningEn: 'Any group demanding monthly subscription for "Guaranteed 100% Upper Circuit Penny Stocks" is an active pump & dump operation.',
    threatWarningHi: 'अपर सर्किट लगने का झूठा दावा कर गारंटीड रिटर्न का वादा करने वाले सभी व्हाट्सएप और टेलीग्राम ग्रुप पूर्णतः अवैध हैं।'
  },
  {
    id: 'c2pa_provenance',
    category: 'FRAUD_FORENSIC',
    termEn: 'C2PA Cryptographic Provenance Manifest',
    termHi: 'सी2पीए डिजिटल प्रामाणिकता एवं क्रिप्टोग्राफिक मुहर',
    transliteration: 'C2PA Digital Pramanikata evam Cryptographic Muhar',
    statutoryRef: 'Coalition for Content Provenance and Authenticity v1.3 Standards',
    definitionEn: 'An immutable digital cryptographic signature embedded into official corporate earnings reports and circulars, proving the file has not been altered or synthesized.',
    definitionHi: 'कंपनियों द्वारा अपने तिमाही नतीजों और प्रेस विज्ञप्तियों पर लगाई जाने वाली डिजिटल मुहर, जो यह साबित करती है कि दस्तावेज असली है और उसमें कोई छेड़छाड़ नहीं की गई है।',
    threatWarningEn: 'Files lacking a valid C2PA manifest or exhibiting broken SHA-256 certificate chains are flagged as untrusted by VEMAR.',
    threatWarningHi: 'जिन दस्तावेजों में मान्य डिजिटल हस्ताक्षर नहीं होते या जिनके हैश कोड मेल नहीं खाते, वेमार उन्हें तत्काल संदिग्ध घोषित करता है।'
  },
  {
    id: 'peak_margin',
    category: 'MARKET_INFRA',
    termEn: 'Peak Margin & Upfront Collateral Norms',
    termHi: 'पीक मार्जिन एवं अग्रिम जमानत नियम',
    transliteration: 'Peak Margin evam Agrim Zamanat Niyam',
    statutoryRef: 'SEBI Circular on Upfront Collection of Margins from Clients in Cash & F&O',
    definitionEn: 'Mandatory upfront cash or collateral requirements enforced by clearing corporations to prevent unauthorized speculative exposure and broker default.',
    definitionHi: 'शेयरों की खरीद-फरोख्त से पहले निवेशक के खाते में आवश्यक मार्जिन राशि होना अनिवार्य है, जिससे बाजार में अनपेक्षित जोखिम और डिफॉल्ट को रोका जा सके।',
    threatWarningEn: 'Phishing emails falsely citing "urgent peak margin deficiency penalty" are designed to trick victims into paying into external scam UPI IDs.',
    threatWarningHi: 'नकली ईमेल जो "पीक मार्जिन पेनाल्टी" का डर दिखाकर तुरंत बाहरी यूपीआई पर पैसे जमा करने को कहते हैं, वे फर्जी फिशिंग हमले होते हैं।'
  }
];

// Master Translations Dictionary
export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
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
  },
  hi: {
    // Brand & Header
    'brand.title': 'वेमार एआई (VEMAR AI)',
    'brand.tagline': 'ध्वनि, मध्यस्थ एवं मीडिया प्रामाणिकता और जोखिम विश्लेषण प्रणाली',
    'brand.edition': 'एंटरप्राइज संस्करण v3.0',
    'market.label': 'बाजार:',
    'market.india': 'भारत (सेबी / एनएसई / बीएसई)',
    'market.global': 'वैश्विक (एसईसी / फिनरा)',
    'market.india_short': 'भारत',
    'market.global_short': 'वैश्विक',
    'language.label': 'भाषा:',
    'language.en': 'English (अंग्रेजी)',
    'language.hi': 'हिन्दी (Hindi)',
    'glossary.btn': 'सेबी वित्तीय शब्दावली',
    'glossary.title': 'सेबी पूंजी बाजार शब्दावली एवं वैधानिक मार्गदर्शिका',
    'glossary.subtitle': 'भारतीय प्रतिभूति एवं विनिमय बोर्ड (SEBI) के तहत आधिकारिक शब्दावली, कानूनी धाराएं एवं साइबर सुरक्षा विश्लेषण।',

    // Roles
    'role.retail': 'खुदरा निवेशक',
    'role.broker': 'ब्रोकर अनुपालन डेस्क',
    'role.mii': 'बाजार अवसंरचना (MII/एक्सचेंज)',
    'role.csuite': 'कॉर्पोरेट नेतृत्व एवं आईआर',
    'role.secops': 'सुरक्षा लेखा परीक्षक (SecOps)',

    // Navigation Tabs
    'nav.overview': 'अवलोकन (होम)',
    'nav.scanner': 'ख़तरा फोरेंसिक स्कैनर',
    'nav.vemar_arch': 'वेमार पाइपलाइन आर्किटेक्चर',
    'nav.vemar_gaps': '8 उद्योग कमियां एवं समाधान',
    'nav.authenticator': 'सेबी पंजी एवं परिपत्र सत्यापन',
    'nav.authenticator_global': 'वैश्विक एसईसी व फिनरा सत्यापन',
    'nav.provenance': 'डिजिटल साक्ष्य (C2PA)',
    'nav.radar': 'शेयर बाजार निगरानी रडार',
    'nav.enterprise': 'एंटरप्राइज एसआईईएम एवं ओएमएस',
    'nav.investor_pitch': 'निवेशक पिच डेक',
    'nav.guide': 'निवेशक सुरक्षा मार्गदर्शिका',

    // Quick Ribbon
    'ribbon.badge': 'वेमार एआई एंटरप्राइज',
    'ribbon.sub_in': 'भारतीय प्रतिभूति बाजार (SEBI, NSE, BSE) के संस्थागत ब्रोकर्स एवं निवेशकों के लिए समर्पित रक्षा प्रणाली।',
    'ribbon.sub_global': 'वैश्विक एवं अमेरिकी वित्तीय बाजारों (SEC, FINRA, NYSE) के लिए संस्थागत फोरेंसिक एवं पूर्व-व्यापार नियंत्रण।',
    'ribbon.pipeline_btn': 'वेमार 5-स्तरीय पाइपलाइन',
    'ribbon.gaps_btn': '8 उद्योग सुरक्षा कमियां',
    'ribbon.pitch_btn': 'निवेशक पिच डेक',
    'ribbon.gateway_btn': 'एसआईईएम एवं ओएमएस गेटवे',

    // Scanner
    'scanner.title': 'मल्टी-मॉडल फोरेंसिक ख़तरा स्कैनर',
    'scanner.subtitle': 'एआई वॉयस क्लोन, डीपफेक वीडियो, फर्जी सेबी परिपत्र और अवैध टेलीग्राम पंप ऑपरेशन्स की तत्काल पहचान।',
    'scanner.input_label': 'ऑडियो, वीडियो, नियामक परिपत्र या बाजार संचार अपलोड करें:',
    'scanner.scan_action': 'वेमार डीप फोरेंसिक जांच शुरू करें',
    'scanner.scanning': 'गहन फोरेंसिक विश्लेषण जारी है...',
    'scanner.verdict_authentic': 'पूर्णतः प्रामाणिक एवं सत्यापित',
    'scanner.verdict_synthetic': 'अति-गंभीर कृत्रिम ख़तरा (डीपफेक / क्लोन) पाया गया',
    'scanner.risk_score': 'कृत्रिम जोखिम स्कोर',
    'scanner.halt_order': 'तत्काल पूर्व-व्यापार रोक (FIX Halt) लागू करें',
    'scanner.order_halted': 'फिक्स 35=D ऑर्डर रोका गया एवं लॉग दर्ज',
    'scanner.dossier_btn': 'वैधानिक फोरेंसिक डॉसियर डाउनलोड करें',

    // Common
    'common.status': 'स्थिति',
    'common.verified': 'प्रमाणित वैध',
    'common.unverified': 'संदिग्ध / अप्रमाणित',
    'common.search': 'खोजें या जांचें',
    'common.download': 'साक्ष्य डाउनलोड करें',
    'common.close': 'बंद करें',
    'common.filter': 'श्रेणी अनुसार छांटें'
  }
};

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isHindi: boolean;
  market: MarketMode;
  setMarket: (market: MarketMode) => void;
  t: (key: string, defaultVal?: string) => string;
  sebiGlossary: SebiTermDefinition[];
  getSebiTerm: (id: string) => SebiTermDefinition | undefined;
  isGlossaryOpen: boolean;
  openGlossary: () => void;
  closeGlossary: () => void;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{
  children: ReactNode;
  initialJurisdiction?: Jurisdiction;
  onJurisdictionChange?: (j: Jurisdiction) => void;
}> = ({ children, initialJurisdiction = 'IN', onJurisdictionChange }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('vemar_language');
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  const [market, setMarketState] = useState<MarketMode>(() => {
    if (initialJurisdiction === 'GLOBAL' || initialJurisdiction === 'US') {
      return 'GLOBAL';
    }
    return 'IN';
  });

  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  // Synchronize initialJurisdiction if changed from outside
  useEffect(() => {
    if (initialJurisdiction === 'GLOBAL' || initialJurisdiction === 'US') {
      setMarketState('GLOBAL');
    } else {
      setMarketState('IN');
    }
  }, [initialJurisdiction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('vemar_language', lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const setMarket = (newMarket: MarketMode) => {
    setMarketState(newMarket);
    if (onJurisdictionChange) {
      onJurisdictionChange(newMarket === 'IN' ? 'IN' : 'GLOBAL');
    }
  };

  const t = (key: string, defaultVal?: string): string => {
    const dict = UI_TRANSLATIONS[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English
    const fallbackDict = UI_TRANSLATIONS['en'];
    if (fallbackDict && fallbackDict[key]) {
      return fallbackDict[key];
    }
    return defaultVal || key;
  };

  const getSebiTerm = (id: string) => {
    return SEBI_FINANCIAL_GLOSSARY.find((item) => item.id === id);
  };

  return (
    <LocalizationContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isHindi: language === 'hi',
        market,
        setMarket,
        t,
        sebiGlossary: SEBI_FINANCIAL_GLOSSARY,
        getSebiTerm,
        isGlossaryOpen,
        openGlossary: () => setIsGlossaryOpen(true),
        closeGlossary: () => setIsGlossaryOpen(false)
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
