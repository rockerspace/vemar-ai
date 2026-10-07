import { RegulatoryNewsItem, Jurisdiction, RegulatoryWireCategory, RegulatoryWireUrgency } from '../types';

/**
 * Institutional Seed Data for SEBI (India) & SEC (US) Regulatory Wire
 */
const SEED_REGULATORY_NEWS: RegulatoryNewsItem[] = [
  {
    id: 'wire-sebi-01',
    headline: 'SEBI Issues Master Directive on GenAI Voice-Clone Impersonations & Unregistered Finfluencer Syndicates',
    hindiHeadline: 'सेबी ने जेनएआई वॉयस-क्लोन प्रतिरूपण और अपंजीकृत फिनफ्लुएंसर्स पर मास्टर निर्देश जारी किया',
    source: 'SEBI',
    sourceFullName: 'Securities and Exchange Board of India (ISD/MIRSD)',
    jurisdiction: 'IN',
    category: 'DEEPFAKE_ALERT',
    urgency: 'CRITICAL',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    displayTime: '4m ago',
    statutoryReference: 'SEBI/HO/ISD/CIR/P/2024/118',
    summary: 'Mandates all registered stock brokers, research analysts, and mutual funds to implement automated acoustic verification and cryptographic provenance logging for telephonic order execution.',
    hindiSummary: 'सभी पंजीकृत स्टॉक ब्रोकरों और मध्यवर्तियों को टेलीफोनिक ऑर्डर निष्पादन के लिए ध्वनिक सत्यापन और क्रिप्टोग्राफिक साक्ष्य अनिवार्य करने का निर्देश।',
    impactedSectorOrEntity: 'Institutional Brokers, Research Analysts, F&O Trading Desks',
    officialDocUrl: 'https://www.sebi.gov.in/legal/circulars/master-circular-surveillance-2024.html',
    verifiedSignatureHash: '8f7a9d3c5b2e1f40a6e8b9c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a2b4c6e8fa',
    isBreaking: true
  },
  {
    id: 'wire-sec-01',
    headline: 'SEC Division of Enforcement Charges Syndicate with Rule 10b-5 Fraud via Synthesized EDGAR Form 8-K',
    source: 'SEC',
    sourceFullName: 'U.S. Securities and Exchange Commission (Enforcement Div)',
    jurisdiction: 'US',
    category: 'ENFORCEMENT',
    urgency: 'CRITICAL',
    timestamp: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    displayTime: '11m ago',
    statutoryReference: 'SEC Litigation Release No. 26140 / 15 U.S.C. § 78j(b)',
    summary: 'Offshore algorithmic manipulation ring charged with circulating falsified SEC EDGAR accession documents paired with AI-cloned CEO executive audio to induce pre-market liquidity flash crashes.',
    impactedSectorOrEntity: 'U.S. Small-Cap Equities, Algorithmic Market Makers',
    officialDocUrl: 'https://www.sec.gov/litigation/litreleases/2024/lr26140.htm',
    verifiedSignatureHash: '3c5d7e9f0a2b4c6e8fa1b3c5d7e9f0a28f7a9d3c5b2e1f40a6e8b9c1d3e5f7a9',
    isBreaking: true
  },
  {
    id: 'wire-sebi-02',
    headline: 'SEBI CSCRF 2024 Framework Takes Effect: Mandatory 15-Minute Cyber & AI Breach Ingress Reporting',
    hindiHeadline: 'सेबी CSCRF 2024: 15 मिनट की साइबर एवं एआई ब्रीच रिपोर्टिंग और अपरिवर्तनीय लॉग अनिवार्य',
    source: 'SEBI',
    sourceFullName: 'SEBI Cybersecurity & Cyber Resilience Framework',
    jurisdiction: 'IN',
    category: 'CSCRF',
    urgency: 'ALERT',
    timestamp: new Date(Date.now() - 26 * 60 * 1000).toISOString(),
    displayTime: '26m ago',
    statutoryReference: 'SEBI/HO/MRD/TPD/P/CIR/2024/074',
    summary: 'Requires qualified financial market intermediaries to maintain 7-year immutable WORM storage for communication logs and report synthetic audio or order-book spoofing within 15 minutes of detection.',
    hindiSummary: 'वित्तीय मध्यवर्तियों के लिए 7-वर्षीय अपरिवर्तनीय WORM स्टोरेज और संदिग्ध सिंथेटिक गतिविधि की 15 मिनट में रिपोर्टिंग अनिवार्य।',
    impactedSectorOrEntity: 'Qualified Market Infrastructure Institutions (MIIs), Depository Participants',
    officialDocUrl: 'https://www.sebi.gov.in/legal/circulars/cscrf-guidelines-2024.html',
    verifiedSignatureHash: 'a6e8b9c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a2b4c6e8fa8f7a9d3c5b2e1f40'
  },
  {
    id: 'wire-sec-02',
    headline: 'FINRA Regulatory Notice 24-11: Supervisory Controls for Generative AI & Executive Voice Verification',
    source: 'FINRA',
    sourceFullName: 'Financial Industry Regulatory Authority (Market Operations)',
    jurisdiction: 'US',
    category: 'MARKET_ABUSE',
    urgency: 'ALERT',
    timestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    displayTime: '48m ago',
    statutoryReference: 'FINRA Notice 24-11 / FINRA Rule 3110 (Supervision)',
    summary: 'FINRA reminds member firms of stringent obligations under Rule 3110 to maintain written supervisory procedures (WSPs) specifically preventing AI-driven telephonic dealer spoofing.',
    impactedSectorOrEntity: 'FINRA Member Broker-Dealers, Clearing Firms',
    officialDocUrl: 'https://www.finra.org/rules-guidance/notices/24-11',
    verifiedSignatureHash: 'b0c2d4e6f8a1b3c5d7e9f0a2b4c6e8fa8f7a9d3c5b2e1f40a6e8b9c1d3e5f7a9'
  },
  {
    id: 'wire-sebi-03',
    headline: 'NSE & BSE Surveillance Circular: Automated Pre-Trade FIX Tag 35=D Interception Protocol Deployed',
    hindiHeadline: 'एनएसई एवं बीएसई निगरानी परिपत्र: स्वचालित प्री-ट्रेड एफआईएक्स टैग 35=D इंटरसेप्शन प्रोटोकॉल तैनात',
    source: 'NSE',
    sourceFullName: 'National Stock Exchange of India (Surveillance & Investigation)',
    jurisdiction: 'IN',
    category: 'ENFORCEMENT',
    urgency: 'ALERT',
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    displayTime: '1h ago',
    statutoryReference: 'NSE/SURV/61482 & BSE/2024/09-18',
    summary: 'Exchanges activate synchronized pre-trade drop-copy filtering to quarantine high-frequency order spikes linked to unauthenticated VoIP call recordings or suspicious algorithmic velocity.',
    hindiSummary: 'अनधिकृत वीओआईपी या संदिग्ध एल्गोरिदम से जुड़े उच्च-आवृत्ति ऑर्डर को तुरंत अलग करने के लिए स्वचालित प्री-ट्रेड नियंत्रण।',
    impactedSectorOrEntity: 'NSE & BSE Colocation Trading Members, Clearing Corporations',
    officialDocUrl: 'https://www.nseindia.com/circulars/surveillance-2024',
    verifiedSignatureHash: 'e9f0a2b4c6e8fa8f7a9d3c5b2e1f40a6e8b9c1d3e5f7a9b0c2d4e6f8a1b3c5d7'
  },
  {
    id: 'wire-sec-03',
    headline: 'SEC Adopts Strict Technical Standard on C2PA Provenance Signing for Public Issuer Disclosures',
    source: 'SEC',
    sourceFullName: 'U.S. Securities and Exchange Commission (Corp Fin)',
    jurisdiction: 'US',
    category: 'CIRCULAR',
    urgency: 'UPDATE',
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    displayTime: '1.8h ago',
    statutoryReference: 'SEC Release No. 34-99812 / 17 CFR § 240.17a-4(f)',
    summary: 'Public registrants encouraged to embed C2PA v1.3 cryptographic manifests signed via FIPS 140-3 Hardware Security Modules in all earnings webcasts and video releases to guarantee authenticity.',
    impactedSectorOrEntity: 'S&P 500 Public Companies, Investor Relations Executives',
    officialDocUrl: 'https://www.sec.gov/rules/final/2024/34-99812.pdf',
    verifiedSignatureHash: '1b3c5d7e9f0a2b4c6e8fa8f7a9d3c5b2e1f40a6e8b9c1d3e5f7a9b0c2d4e6f8a'
  },
  {
    id: 'wire-sebi-04',
    headline: 'SEBI SCORES 2.0 Integrates Real-Time Section 11B Evidence Docket Generator for Deepfake Inquiries',
    hindiHeadline: 'सेबी स्कोर्स 2.0 ने डीपफेक जांच के लिए रीयल-टाइम धारा 11B साक्ष्य डॉकेट जनरेटर एकीकृत किया',
    source: 'SEBI',
    sourceFullName: 'SEBI Office of Investor Assistance & Education',
    jurisdiction: 'IN',
    category: 'CIRCULAR',
    urgency: 'UPDATE',
    timestamp: new Date(Date.now() - 160 * 60 * 1000).toISOString(),
    displayTime: '2.6h ago',
    statutoryReference: 'SEBI/HO/OIAE/IGRD/CIR/P/2024/39',
    summary: 'Upgraded grievance portal now directly ingests cryptographic acoustic spectral dumps and SHA-256 evidence digests conforming to Section 63 of the Bharatiya Sakshya Adhiniyam, 2023.',
    hindiSummary: 'उन्नत शिकायत पोर्टल अब भारतीय साक्ष्य अधिनियम की धारा 63 के तहत सीधे डिजिटल साक्ष्य और स्पेक्ट्रोग्राम स्वीकार करता है।',
    impactedSectorOrEntity: 'Retail Investors, Registered Investment Advisers',
    officialDocUrl: 'https://scores.sebi.gov.in/notices/2024/scores-evidence-portal.html',
    verifiedSignatureHash: '7a9b0c2d4e6f8a1b3c5d7e9f0a2b4c6e8fa8f7a9d3c5b2e1f40a6e8b9c1d3e5f'
  },
  {
    id: 'wire-sec-04',
    headline: 'SEC & CFTC Joint Enforcement Alert: Algorithmic Social Media Botnets Targeting Micro-Cap Float',
    source: 'EDGAR',
    sourceFullName: 'SEC EDGAR Market Surveillance & Microstructure Desk',
    jurisdiction: 'GLOBAL',
    category: 'LITIGATION',
    urgency: 'ADVISORY',
    timestamp: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    displayTime: '4h ago',
    statutoryReference: 'Joint Alert SEC-2024-ALERT-04 / CFTC Advisory 8821',
    summary: 'Multi-agency bulletin highlights a 340% surge in coordinated Telegram and X/Twitter disinformation botnets deploying synthetic audio snippets of purported FDA biotech approvals.',
    impactedSectorOrEntity: 'Healthcare Equities, Retail Social Platforms',
    officialDocUrl: 'https://www.sec.gov/oiea/investor-alerts-and-bulletins/ia_socialmediaai',
    verifiedSignatureHash: '2b4c6e8fa8f7a9d3c5b2e1f40a6e8b9c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0a'
  }
];

/**
 * Filter and query options for the regulatory news client
 */
export interface RegulatoryNewsQueryOptions {
  jurisdiction?: Jurisdiction | 'ALL';
  category?: RegulatoryWireCategory | 'ALL';
  urgency?: RegulatoryWireUrgency | 'ALL';
  search?: string;
  limit?: number;
}

/**
 * Simulated News API Client Class
 * Provides async network simulation, fallback resilience, filtering, and real-time event subscription.
 */
export class RegulatoryNewsApiClient {
  private cache: RegulatoryNewsItem[] = [...SEED_REGULATORY_NEWS];
  private subscribers: Array<(news: RegulatoryNewsItem[]) => void> = [];
  private liveTickerInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startSimulatedLiveFeed();
  }

  /**
   * Fetches regulatory news with optional server backend fetch and guaranteed simulated fallback
   */
  async fetchNews(options: RegulatoryNewsQueryOptions = {}): Promise<RegulatoryNewsItem[]> {
    // Simulate realistic regulatory network latency (100-250ms)
    await new Promise(resolve => setTimeout(resolve, 140));

    // Optional attempt to fetch from backend API if available
    try {
      const queryParams = new URLSearchParams();
      if (options.jurisdiction && options.jurisdiction !== 'ALL') queryParams.set('jurisdiction', options.jurisdiction);
      if (options.category && options.category !== 'ALL') queryParams.set('category', options.category);
      if (options.search) queryParams.set('search', options.search);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`/api/market-news?${queryParams.toString()}`, {
        signal: controller.signal
      }).catch(() => null);

      clearTimeout(timeout);

      if (res && res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          this.cache = data.items;
          return this.applyFilters(this.cache, options);
        }
      }
    } catch {
      // Fallback silently to client-side simulated data
    }

    return this.applyFilters(this.cache, options);
  }

  /**
   * Fetches single detailed news record by ID
   */
  async getNewsById(id: string): Promise<RegulatoryNewsItem | null> {
    await new Promise(resolve => setTimeout(resolve, 80));
    const found = this.cache.find(item => item.id === id);
    return found || null;
  }

  /**
   * Filter helper
   */
  private applyFilters(items: RegulatoryNewsItem[], options: RegulatoryNewsQueryOptions): RegulatoryNewsItem[] {
    let result = [...items];

    if (options.jurisdiction && options.jurisdiction !== 'ALL') {
      result = result.filter(item => {
        if (options.jurisdiction === 'GLOBAL') return true;
        return item.jurisdiction === options.jurisdiction || item.jurisdiction === 'GLOBAL';
      });
    }

    if (options.category && options.category !== 'ALL') {
      result = result.filter(item => item.category === options.category);
    }

    if (options.urgency && options.urgency !== 'ALL') {
      result = result.filter(item => item.urgency === options.urgency);
    }

    if (options.search && options.search.trim() !== '') {
      const q = options.search.toLowerCase().trim();
      result = result.filter(item =>
        item.headline.toLowerCase().includes(q) ||
        (item.hindiHeadline && item.hindiHeadline.toLowerCase().includes(q)) ||
        item.statutoryReference.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.sourceFullName.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q)
      );
    }

    if (options.limit && options.limit > 0) {
      result = result.slice(0, options.limit);
    }

    return result;
  }

  /**
   * Allows components to subscribe to live incoming ticker headlines
   */
  subscribe(callback: (news: RegulatoryNewsItem[]) => void): () => void {
    this.subscribers.push(callback);
    // Immediate push
    callback(this.cache);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * Starts periodic injection of simulated live market intelligence flashes
   */
  private startSimulatedLiveFeed() {
    if (typeof window === 'undefined') return;

    // Periodically update relative times or inject a fresh alert every 60s
    this.liveTickerInterval = setInterval(() => {
      this.updateRelativeTimes();
      this.subscribers.forEach(cb => cb([...this.cache]));
    }, 60000);
  }

  private updateRelativeTimes() {
    const now = Date.now();
    this.cache = this.cache.map(item => {
      const diffMs = now - new Date(item.timestamp).getTime();
      const diffMin = Math.max(1, Math.floor(diffMs / 60000));
      let displayTime = `${diffMin}m ago`;
      if (diffMin >= 60) {
        const hrs = (diffMin / 60).toFixed(1);
        displayTime = `${hrs}h ago`;
      }
      return { ...item, displayTime };
    });
  }

  /**
   * Manually trigger a new simulated flash alert (useful for testing and demoing live updates)
   */
  injectSimulatedBreakingAlert(source: 'SEBI' | 'SEC' = 'SEBI'): RegulatoryNewsItem {
    const isIndia = source === 'SEBI';
    const newAlert: RegulatoryNewsItem = {
      id: `wire-live-${Date.now()}`,
      headline: isIndia
        ? 'LIVE BREAKING: SEBI Surveillance Halts Trading in 4 Script Stocks Linked to Deepfake Audio Leak'
        : 'LIVE BREAKING: SEC Initiates Trading Suspension Under Exchange Act § 12(k) on Disinformation Spike',
      hindiHeadline: isIndia
        ? 'लाइव ब्रेकिंग: सेबी निगरानी ने डीपफेक ऑडियो से जुड़े 4 शेयरों में ट्रेडिंग को रोका'
        : undefined,
      source: isIndia ? 'SEBI' : 'SEC',
      sourceFullName: isIndia
        ? 'Securities and Exchange Board of India (Integrated Surveillance Dept)'
        : 'U.S. Securities and Exchange Commission (Office of Market Surveillance)',
      jurisdiction: isIndia ? 'IN' : 'US',
      category: 'ENFORCEMENT',
      urgency: 'CRITICAL',
      timestamp: new Date().toISOString(),
      displayTime: 'Just now',
      statutoryReference: isIndia ? 'SEBI/ISD/FLASH/2026/04' : 'SEC 12(k) Halt Order No. 2026-88',
      summary: isIndia
        ? 'Automated algorithmic surge halted after acoustic forensic telemetry identified synthetic clone of Managing Director announcing fabricated dividend.'
        : 'Emergency suspension exercised to protect market participants from unverified synthetic audio circulating across pre-market automated trading networks.',
      impactedSectorOrEntity: 'Pre-Market Order Routing, Small-Cap Equities',
      verifiedSignatureHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      isBreaking: true
    };

    this.cache = [newAlert, ...this.cache];
    this.subscribers.forEach(cb => cb([...this.cache]));
    return newAlert;
  }
}

// Export singleton client instance
export const newsApiClient = new RegulatoryNewsApiClient();
