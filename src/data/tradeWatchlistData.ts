import { WatchlistTicker, Jurisdiction, ThreatLevel } from '../types';

export const INITIAL_INDIA_WATCHLIST: WatchlistTicker[] = [
  {
    id: 'wl-in-tatamotors',
    ticker: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    exchange: 'NSE',
    assetClass: 'Equities',
    jurisdiction: 'IN',
    currentPrice: 968.40,
    currency: 'INR',
    currencySymbol: '₹',
    change24h: -34.80,
    changePercent24h: -3.47,
    dayHigh: 1004.20,
    dayLow: 961.50,
    volume24h: '18.4M',
    vwap: 974.10,
    bidPrice: 968.20,
    askPrice: 968.50,
    riskScore: 94,
    threatLevel: 'CRITICAL',
    primaryThreatVector: 'Synthetic CEO Resignation Video Broadcast & Glottal Pitch Discontinuity',
    activeAttackDetected: true,
    lastFlaggedIncident: 'Deep neural scanner flagged 94% synthetic probability with 12 missing glottal pulses.',
    statutoryRegime: 'SEBI PFUTP Reg 4(2)(k) / IT Act §66D',
    priceHistory: [
      { time: '09:15', price: 1002.50, risk: 25 },
      { time: '10:00', price: 998.00, risk: 28 },
      { time: '11:00', price: 994.20, risk: 42 },
      { time: '12:00', price: 988.50, risk: 65 },
      { time: '13:00', price: 975.00, risk: 89 },
      { time: '14:00', price: 965.20, risk: 94 },
      { time: '14:30', price: 968.40, risk: 94 }
    ],
    alerts: [
      {
        id: 'alt-tata-1',
        type: 'PRICE_BELOW',
        targetValue: 970.00,
        note: 'SEBI CSCRF Pre-Trade FIX Quarantine Trigger',
        createdAt: '2026-10-04T05:30:00.000Z',
        triggered: true,
        triggeredAt: '2026-10-04T07:15:22.000Z',
        active: true,
        autoQuarantine: true
      },
      {
        id: 'alt-tata-2',
        type: 'RISK_SCORE_ABOVE',
        targetValue: 90,
        note: 'Critical Deepfake Incident Threshold Alert',
        createdAt: '2026-10-04T05:30:00.000Z',
        triggered: true,
        triggeredAt: '2026-10-04T07:12:10.000Z',
        active: true
      }
    ],
    isFlaggedByVemar: true,
    quarantined: true,
    addedAt: '2026-10-04T05:15:00.000Z'
  },
  {
    id: 'wl-in-reliance',
    ticker: 'RELIANCE',
    name: 'Reliance Industries Limited',
    exchange: 'NSE',
    assetClass: 'Equities',
    jurisdiction: 'IN',
    currentPrice: 2942.50,
    currency: 'INR',
    currencySymbol: '₹',
    change24h: -48.00,
    changePercent24h: -1.60,
    dayHigh: 2995.00,
    dayLow: 2935.20,
    volume24h: '9.2M',
    vwap: 2955.40,
    bidPrice: 2942.10,
    askPrice: 2942.80,
    riskScore: 88,
    threatLevel: 'CRITICAL',
    primaryThreatVector: 'Counterfeit Corporate Demerger Circular & Fake SEBI Disclosure Hash',
    activeAttackDetected: true,
    lastFlaggedIncident: 'Pre-Trade Order Quarantine & FIX 35=D Isolation executed in 13.4ms.',
    statutoryRegime: 'SEBI Circular CIR/ISD/1/2011',
    priceHistory: [
      { time: '09:15', price: 2990.00, risk: 20 },
      { time: '10:00', price: 2984.00, risk: 22 },
      { time: '11:00', price: 2978.50, risk: 35 },
      { time: '12:00', price: 2965.00, risk: 72 },
      { time: '13:00', price: 2950.20, risk: 85 },
      { time: '14:00', price: 2940.00, risk: 88 },
      { time: '14:30', price: 2942.50, risk: 88 }
    ],
    alerts: [
      {
        id: 'alt-rel-1',
        type: 'PRICE_BELOW',
        targetValue: 2950.00,
        note: 'Institutional Stop Loss & Pre-Trade Scan Trigger',
        createdAt: '2026-10-04T05:45:00.000Z',
        triggered: true,
        triggeredAt: '2026-10-04T06:55:00.000Z',
        active: true
      }
    ],
    isFlaggedByVemar: true,
    quarantined: false,
    addedAt: '2026-10-04T05:20:00.000Z'
  },
  {
    id: 'wl-in-waaree',
    ticker: 'WAAREEENER',
    name: 'Waaree Energies Limited (IPO)',
    exchange: 'NSE',
    assetClass: 'Equities',
    jurisdiction: 'IN',
    currentPrice: 1520.00,
    currency: 'INR',
    currencySymbol: '₹',
    change24h: 185.00,
    changePercent24h: 13.86,
    dayHigh: 1545.00,
    dayLow: 1320.00,
    volume24h: '31.5M',
    vwap: 1475.00,
    bidPrice: 1519.50,
    askPrice: 1520.50,
    riskScore: 91,
    threatLevel: 'CRITICAL',
    primaryThreatVector: 'Spoofed Grey Market (GMP) Syndicate Portal & Fake Mandates',
    activeAttackDetected: true,
    lastFlaggedIncident: 'Lookalike domain `nse-clearing-settlement.cc` blocked via CERT-In.',
    statutoryRegime: 'SEBI ICDR Regulations / IT Act §66D',
    priceHistory: [
      { time: '09:15', price: 1335.00, risk: 45 },
      { time: '10:00', price: 1390.00, risk: 55 },
      { time: '11:00', price: 1440.00, risk: 78 },
      { time: '12:00', price: 1490.00, risk: 88 },
      { time: '13:00', price: 1530.00, risk: 91 },
      { time: '14:00', price: 1515.00, risk: 91 },
      { time: '14:30', price: 1520.00, risk: 91 }
    ],
    alerts: [
      {
        id: 'alt-waaree-1',
        type: 'PRICE_ABOVE',
        targetValue: 1500.00,
        note: 'Grey Market Volatility Circuit Breaker',
        createdAt: '2026-10-04T05:50:00.000Z',
        triggered: true,
        triggeredAt: '2026-10-04T06:30:15.000Z',
        active: true
      }
    ],
    isFlaggedByVemar: true,
    quarantined: false,
    addedAt: '2026-10-04T05:25:00.000Z'
  },
  {
    id: 'wl-in-nifty-opt',
    ticker: 'NIFTY_24800_PE',
    name: 'NIFTY 24800 Weekly Put Option',
    exchange: 'NSE',
    assetClass: 'Derivatives',
    jurisdiction: 'IN',
    currentPrice: 142.80,
    currency: 'INR',
    currencySymbol: '₹',
    change24h: 68.40,
    changePercent24h: 91.93,
    dayHigh: 165.00,
    dayLow: 64.00,
    volume24h: '142.8M Contracts',
    vwap: 118.50,
    bidPrice: 142.50,
    askPrice: 143.00,
    riskScore: 86,
    threatLevel: 'HIGH',
    primaryThreatVector: 'Coordinated Telegram Syndicate Zero-DTE Gamma Squeeze Botnet',
    activeAttackDetected: true,
    lastFlaggedIncident: 'Syntactic text perplexity cluster matching across 142 private channels.',
    statutoryRegime: 'SEBI Graded Surveillance Measure (GSM) Stage 2',
    priceHistory: [
      { time: '09:15', price: 74.40, risk: 30 },
      { time: '10:00', price: 82.00, risk: 35 },
      { time: '11:00', price: 95.00, risk: 50 },
      { time: '12:00', price: 110.00, risk: 75 },
      { time: '13:00', price: 135.00, risk: 84 },
      { time: '14:00', price: 148.00, risk: 86 },
      { time: '14:30', price: 142.80, risk: 86 }
    ],
    alerts: [
      {
        id: 'alt-nifty-1',
        type: 'PRICE_ABOVE',
        targetValue: 150.00,
        note: 'Gamma Spike Dynamic Margin Guard',
        createdAt: '2026-10-04T06:00:00.000Z',
        triggered: false,
        active: true
      }
    ],
    isFlaggedByVemar: true,
    quarantined: false,
    addedAt: '2026-10-04T05:30:00.000Z'
  },
  {
    id: 'wl-in-infy',
    ticker: 'INFY',
    name: 'Infosys Limited',
    exchange: 'NSE',
    assetClass: 'Equities',
    jurisdiction: 'IN',
    currentPrice: 1885.20,
    currency: 'INR',
    currencySymbol: '₹',
    change24h: 12.40,
    changePercent24h: 0.66,
    dayHigh: 1898.00,
    dayLow: 1872.00,
    volume24h: '5.1M',
    vwap: 1882.10,
    bidPrice: 1885.00,
    askPrice: 1885.50,
    riskScore: 35,
    threatLevel: 'LOW',
    primaryThreatVector: 'Routine ADR Cross-Validation (Nominal Integrity)',
    activeAttackDetected: false,
    priceHistory: [
      { time: '09:15', price: 1874.00, risk: 20 },
      { time: '10:00', price: 1878.00, risk: 22 },
      { time: '11:00', price: 1882.00, risk: 25 },
      { time: '12:00', price: 1880.50, risk: 28 },
      { time: '13:00', price: 1886.00, risk: 32 },
      { time: '14:00', price: 1884.20, risk: 35 },
      { time: '14:30', price: 1885.20, risk: 35 }
    ],
    alerts: [
      {
        id: 'alt-infy-1',
        type: 'PRICE_BELOW',
        targetValue: 1850.00,
        note: 'Quarterly Earnings Hedging Level',
        createdAt: '2026-10-04T06:05:00.000Z',
        triggered: false,
        active: true
      }
    ],
    isFlaggedByVemar: false,
    quarantined: false,
    addedAt: '2026-10-04T05:35:00.000Z'
  }
];

export const INITIAL_US_WATCHLIST: WatchlistTicker[] = [
  {
    id: 'wl-us-nvda',
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    assetClass: 'Equities',
    jurisdiction: 'US',
    currentPrice: 128.60,
    currency: 'USD',
    currencySymbol: '$',
    change24h: -7.20,
    changePercent24h: -5.30,
    dayHigh: 136.40,
    dayLow: 127.10,
    volume24h: '68.4M',
    vwap: 130.80,
    bidPrice: 128.55,
    askPrice: 128.65,
    riskScore: 96,
    threatLevel: 'CRITICAL',
    primaryThreatVector: 'Synthetic CEO Deepfake Webcast & Spoofed SEC Form 8-K Server Outage',
    activeAttackDetected: true,
    lastFlaggedIncident: 'Phoneme-viseme speech desync (42ms) & synthetic collar seam identified by Sensor #1.',
    statutoryRegime: 'SEC Rule 10b-5 / 18 U.S. Code § 1343 Wire Fraud',
    priceHistory: [
      { time: '09:30', price: 135.80, risk: 20 },
      { time: '10:30', price: 134.20, risk: 35 },
      { time: '11:30', price: 132.00, risk: 68 },
      { time: '12:30', price: 130.40, risk: 85 },
      { time: '13:30', price: 129.10, risk: 94 },
      { time: '14:30', price: 127.80, risk: 96 },
      { time: '15:30', price: 128.60, risk: 96 }
    ],
    alerts: [
      {
        id: 'alt-nvda-1',
        type: 'PRICE_BELOW',
        targetValue: 130.00,
        note: 'SEC Rule 10b-5 Volatility Circuit Breach',
        createdAt: '2026-10-04T05:30:00.000Z',
        triggered: true,
        triggeredAt: '2026-10-04T07:18:00.000Z',
        active: true,
        autoQuarantine: true
      },
      {
        id: 'alt-nvda-2',
        type: 'RISK_SCORE_ABOVE',
        targetValue: 90,
        note: 'FINRA Rule 2010 Automated Trading Halt Threshold',
        createdAt: '2026-10-04T05:30:00.000Z',
        triggered: true,
        triggeredAt: '2026-10-04T07:10:00.000Z',
        active: true
      }
    ],
    isFlaggedByVemar: true,
    quarantined: true,
    addedAt: '2026-10-04T05:15:00.000Z'
  },
  {
    id: 'wl-us-tsla',
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    exchange: 'NASDAQ',
    assetClass: 'Equities',
    jurisdiction: 'US',
    currentPrice: 244.50,
    currency: 'USD',
    currencySymbol: '$',
    change24h: -14.30,
    changePercent24h: -5.53,
    dayHigh: 259.80,
    dayLow: 242.00,
    volume24h: '52.1M',
    vwap: 248.20,
    bidPrice: 244.40,
    askPrice: 244.60,
    riskScore: 92,
    threatLevel: 'CRITICAL',
    primaryThreatVector: 'Voice Phishing (Vishing) Impersonation for $45M Treasury Wire Diversion',
    activeAttackDetected: true,
    lastFlaggedIncident: 'Absence of acoustic room reverberation & synthetic MFCC patterns blocked by Prime Desk.',
    statutoryRegime: 'FINRA Rule 3110 / SEC Rule 17a-4(f)',
    priceHistory: [
      { time: '09:30', price: 258.00, risk: 25 },
      { time: '10:30', price: 254.20, risk: 38 },
      { time: '11:30', price: 250.00, risk: 62 },
      { time: '12:30', price: 247.50, risk: 81 },
      { time: '13:30', price: 245.00, risk: 90 },
      { time: '14:30', price: 243.20, risk: 92 },
      { time: '15:30', price: 244.50, risk: 92 }
    ],
    alerts: [
      {
        id: 'alt-tsla-1',
        type: 'PRICE_BELOW',
        targetValue: 245.00,
        note: 'Prime Broker Wire Verification Stop',
        createdAt: '2026-10-04T05:40:00.000Z',
        triggered: true,
        triggeredAt: '2026-10-04T07:22:45.000Z',
        active: true
      }
    ],
    isFlaggedByVemar: true,
    quarantined: false,
    addedAt: '2026-10-04T05:20:00.000Z'
  },
  {
    id: 'wl-us-spy-0dte',
    ticker: 'SPY_570P_0DTE',
    name: 'SPDR S&P 500 ETF 570 Put (Zero-DTE)',
    exchange: 'CME',
    assetClass: 'Derivatives',
    jurisdiction: 'US',
    currentPrice: 3.85,
    currency: 'USD',
    currencySymbol: '$',
    change24h: 1.95,
    changePercent24h: 102.63,
    dayHigh: 4.40,
    dayLow: 1.60,
    volume24h: '3.8M Contracts',
    vwap: 2.90,
    bidPrice: 3.80,
    askPrice: 3.90,
    riskScore: 89,
    threatLevel: 'CRITICAL',
    primaryThreatVector: 'Fabricated Federal Reserve Emergency Rate Hike Deepfake Audio',
    activeAttackDetected: true,
    lastFlaggedIncident: 'CME Market Integrity Automated Sensor #1 Intercepted flash-crash spoofing.',
    statutoryRegime: 'CFTC Dynamic Margin & CME Rule 575',
    priceHistory: [
      { time: '09:30', price: 1.80, risk: 30 },
      { time: '10:30', price: 2.10, risk: 40 },
      { time: '11:30', price: 2.60, risk: 65 },
      { time: '12:30', price: 3.20, risk: 80 },
      { time: '13:30', price: 3.70, risk: 88 },
      { time: '14:30', price: 4.10, risk: 89 },
      { time: '15:30', price: 3.85, risk: 89 }
    ],
    alerts: [
      {
        id: 'alt-spy-1',
        type: 'PRICE_ABOVE',
        targetValue: 4.00,
        note: 'Zero-DTE Expiry Margin Spike Filter',
        createdAt: '2026-10-04T05:55:00.000Z',
        triggered: true,
        triggeredAt: '2026-10-04T07:25:00.000Z',
        active: true
      }
    ],
    isFlaggedByVemar: true,
    quarantined: false,
    addedAt: '2026-10-04T05:25:00.000Z'
  },
  {
    id: 'wl-us-aapl',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    assetClass: 'Equities',
    jurisdiction: 'US',
    currentPrice: 228.30,
    currency: 'USD',
    currencySymbol: '$',
    change24h: 1.80,
    changePercent24h: 0.79,
    dayHigh: 229.50,
    dayLow: 226.40,
    volume24h: '38.9M',
    vwap: 227.90,
    bidPrice: 228.25,
    askPrice: 228.35,
    riskScore: 42,
    threatLevel: 'LOW',
    primaryThreatVector: 'Routine SEC EDGAR Form 8-K Accession Match (Digest Valid)',
    activeAttackDetected: false,
    priceHistory: [
      { time: '09:30', price: 226.80, risk: 20 },
      { time: '10:30', price: 227.20, risk: 25 },
      { time: '11:30', price: 227.90, risk: 30 },
      { time: '12:30', price: 228.40, risk: 35 },
      { time: '13:30', price: 228.00, risk: 38 },
      { time: '14:30', price: 228.50, risk: 42 },
      { time: '15:30', price: 228.30, risk: 42 }
    ],
    alerts: [
      {
        id: 'alt-aapl-1',
        type: 'PRICE_ABOVE',
        targetValue: 235.00,
        note: 'Breakout Hedging Level',
        createdAt: '2026-10-04T06:00:00.000Z',
        triggered: false,
        active: true
      }
    ],
    isFlaggedByVemar: false,
    quarantined: false,
    addedAt: '2026-10-04T05:30:00.000Z'
  }
];

export interface AddableAssetCatalogItem {
  ticker: string;
  name: string;
  exchange: 'NSE' | 'BSE' | 'NASDAQ' | 'NYSE' | 'CME' | 'MCX';
  assetClass: 'Equities' | 'Derivatives' | 'Commodities' | 'Debt' | 'Forex';
  jurisdiction: 'IN' | 'US' | 'GLOBAL';
  currentPrice: number;
  currency: 'INR' | 'USD';
  currencySymbol: '₹' | '$';
  dayHigh: number;
  dayLow: number;
  volume24h: string;
  riskScore: number;
  threatLevel: ThreatLevel;
  primaryThreatVector: string;
  isFlaggedByVemar: boolean;
  statutoryRegime?: string;
}

export const ADDABLE_ASSET_CATALOG: AddableAssetCatalogItem[] = [
  // India
  {
    ticker: 'ZOMATO',
    name: 'Zomato Limited',
    exchange: 'NSE',
    assetClass: 'Equities',
    jurisdiction: 'IN',
    currentPrice: 265.40,
    currency: 'INR',
    currencySymbol: '₹',
    dayHigh: 272.00,
    dayLow: 261.20,
    volume24h: '42.1M',
    riskScore: 82,
    threatLevel: 'HIGH',
    primaryThreatVector: 'Syndicate WhatsApp Tip Swarm & Fabricated Board Meeting Leak',
    isFlaggedByVemar: true,
    statutoryRegime: 'SEBI (Research Analysts) Regulations 2014'
  },
  {
    ticker: 'PAYTM',
    name: 'One97 Communications Ltd',
    exchange: 'NSE',
    assetClass: 'Equities',
    jurisdiction: 'IN',
    currentPrice: 712.00,
    currency: 'INR',
    currencySymbol: '₹',
    dayHigh: 728.50,
    dayLow: 698.00,
    volume24h: '11.8M',
    riskScore: 79,
    threatLevel: 'HIGH',
    primaryThreatVector: 'Spoofed RBI Regulatory Directive PDF circulating on Telegram',
    isFlaggedByVemar: true,
    statutoryRegime: 'SEBI PFUTP Reg 4(2)(k)'
  },
  {
    ticker: 'HDFCBANK',
    name: 'HDFC Bank Limited',
    exchange: 'NSE',
    assetClass: 'Equities',
    jurisdiction: 'IN',
    currentPrice: 1640.10,
    currency: 'INR',
    currencySymbol: '₹',
    dayHigh: 1652.00,
    dayLow: 1634.00,
    volume24h: '8.7M',
    riskScore: 32,
    threatLevel: 'LOW',
    primaryThreatVector: 'Nominal Interbank RTGS Clearance (Valid Cryptographic Seal)',
    isFlaggedByVemar: false
  },
  {
    ticker: 'TCS',
    name: 'Tata Consultancy Services',
    exchange: 'NSE',
    assetClass: 'Equities',
    jurisdiction: 'IN',
    currentPrice: 4180.00,
    currency: 'INR',
    currencySymbol: '₹',
    dayHigh: 4210.00,
    dayLow: 4160.00,
    volume24h: '2.4M',
    riskScore: 28,
    threatLevel: 'NOMINAL',
    primaryThreatVector: 'Verified C2PA Signed Earnings Release (SHA-256 Validated)',
    isFlaggedByVemar: false
  },
  {
    ticker: 'MCX_GOLD_OCT',
    name: 'Gold Oct 2026 (1kg Standard)',
    exchange: 'MCX',
    assetClass: 'Commodities',
    jurisdiction: 'IN',
    currentPrice: 76450.00,
    currency: 'INR',
    currencySymbol: '₹',
    dayHigh: 76900.00,
    dayLow: 76200.00,
    volume24h: '12.4K Lots',
    riskScore: 64,
    threatLevel: 'MEDIUM',
    primaryThreatVector: 'Fabricated Geopolitical Middle-East Voice Dispatch on X',
    isFlaggedByVemar: true,
    statutoryRegime: 'SEBI Commodity Derivatives Surveillance'
  },
  {
    ticker: 'USDINR_FUT',
    name: 'USD/INR Currency Future (Oct)',
    exchange: 'NSE',
    assetClass: 'Forex',
    jurisdiction: 'IN',
    currentPrice: 83.98,
    currency: 'INR',
    currencySymbol: '₹',
    dayHigh: 84.12,
    dayLow: 83.92,
    volume24h: '1.8M Contracts',
    riskScore: 61,
    threatLevel: 'MEDIUM',
    primaryThreatVector: 'Phishing SWIFT Bank Confirmation Telemetry',
    isFlaggedByVemar: true
  },
  // US & Global
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    assetClass: 'Equities',
    jurisdiction: 'US',
    currentPrice: 448.20,
    currency: 'USD',
    currencySymbol: '$',
    dayHigh: 452.00,
    dayLow: 444.10,
    volume24h: '21.5M',
    riskScore: 45,
    threatLevel: 'MEDIUM',
    primaryThreatVector: 'LLM Spear Phishing Lures Targeting Partner Cloud Billing',
    isFlaggedByVemar: false
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    exchange: 'NASDAQ',
    assetClass: 'Equities',
    jurisdiction: 'US',
    currentPrice: 189.40,
    currency: 'USD',
    currencySymbol: '$',
    dayHigh: 191.80,
    dayLow: 187.20,
    volume24h: '34.2M',
    riskScore: 54,
    threatLevel: 'MEDIUM',
    primaryThreatVector: 'Counterfeit Prime Day Vendor Invoicing Wire Scam',
    isFlaggedByVemar: true
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    assetClass: 'Equities',
    jurisdiction: 'US',
    currentPrice: 166.80,
    currency: 'USD',
    currencySymbol: '$',
    dayHigh: 168.90,
    dayLow: 165.10,
    volume24h: '26.8M',
    riskScore: 38,
    threatLevel: 'LOW',
    primaryThreatVector: 'Official Accession Digest Verified in SEC Master Index',
    isFlaggedByVemar: false
  },
  {
    ticker: 'IBIT',
    name: 'iShares Bitcoin Trust ETF',
    exchange: 'NASDAQ',
    assetClass: 'Equities',
    jurisdiction: 'US',
    currentPrice: 36.80,
    currency: 'USD',
    currencySymbol: '$',
    dayHigh: 38.20,
    dayLow: 35.90,
    volume24h: '48.9M',
    riskScore: 84,
    threatLevel: 'HIGH',
    primaryThreatVector: 'Synthetic ETF Custody Attestation Letter Impersonating Coinbase Prime',
    isFlaggedByVemar: true,
    statutoryRegime: 'SEC Rule 10b-5 / CFTC Sec 6(c)'
  },
  {
    ticker: 'CRUDE_WTI',
    name: 'WTI Light Sweet Crude Oil (Nov)',
    exchange: 'CME',
    assetClass: 'Commodities',
    jurisdiction: 'US',
    currentPrice: 74.20,
    currency: 'USD',
    currencySymbol: '$',
    dayHigh: 75.80,
    dayLow: 73.10,
    volume24h: '380K Lots',
    riskScore: 76,
    threatLevel: 'HIGH',
    primaryThreatVector: 'Synthetic OPEC Production Quota Audio Leak',
    isFlaggedByVemar: true,
    statutoryRegime: 'CFTC Dynamic Margin & Storage Verification'
  }
];

export const getInitialWatchlist = (jurisdiction: Jurisdiction): WatchlistTicker[] => {
  return jurisdiction === 'US' ? [...INITIAL_US_WATCHLIST] : [...INITIAL_INDIA_WATCHLIST];
};
