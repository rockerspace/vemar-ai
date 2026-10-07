import { BenchmarkCase } from '../types';

export const BENCHMARK_CASES: BenchmarkCase[] = [
  // --- INDIA JURISDICTION (SEBI / NSE / BSE) ---
  {
    id: 'case-deepfake-ceo',
    title: 'Deepfake CEO Sudden Resignation & Q3 Restatement Alert',
    channel: 'video_frame',
    channelName: 'Deepfake Video Broadcast',
    jurisdiction: 'IN',
    targetEntity: 'Tata Motors Limited (NSE: TATAMOTORS)',
    severity: 'CRITICAL',
    isSynthetic: true,
    summary: 'A 45-second high-resolution video circulated on social platforms showing the Managing Director appearing to announce catastrophic internal accounting irregularities, sudden resignation, and dividend cancellation prior to market opening.',
    sampleContent: `[Transcript of Video Broadcast]:
"Good morning, valued shareholders and market participants. Due to material accounting misstatements discovered during our internal audit of EV battery supply chain capitalizations, I am immediately tendering my resignation from the Board. We expect a restated net loss of INR 2,800 Crores for the current quarter. We advise institutional holders to adjust their portfolios accordingly before exchange trading commences."`,
    hasMedia: 'image',
    mediaPlaceholderTitle: 'CEO Deepfake Broadcast Frame (Artifact Analysis)',
    mediaDescription: 'Frame extracted at timestamp 00:14. Notice anomalous facial warping around the jawline, unnatural bilateral eye blink freeze, and specular reflection inconsistency on spectacles.',
    mockAudioFrequencies: [72, 85, 91, 14, 18, 22, 19, 15, 11, 8, 4, 2]
  },
  {
    id: 'case-voice-vishing-sebi',
    title: 'AI Voice Clone: Fake SEBI Officer Demanding Escrow Deposit',
    channel: 'audio_call',
    channelName: 'AI Voice Clone (Vishing)',
    jurisdiction: 'IN',
    targetEntity: 'Retail Demat Account Holder & HNW Brokerage Client',
    severity: 'CRITICAL',
    isSynthetic: true,
    summary: 'An automated VoIP call cloning the vocal timbre, cadence, and Indian accent of an official SEBI Joint Director. The caller claims the investor\'s Demat account is flagged for illegal foreign trading and demands immediate transfer of INR 4,50,000 to an "official interim escrow vault".',
    sampleContent: `[Incoming Audio Call Transcript]:
"This is Joint Director R. Ramanathan speaking directly from the SEBI Enforcement & Surveillance Cell, Bandra-Kurla Complex. We have intercepted suspicious algorithmic block orders originating from your Zerodha Trading ID linked to overseas money laundering networks. As per Section 11B of the SEBI Act, your Demat and bank accounts will be frozen at 3:30 PM today unless an investigative escrow deposit of INR 4,50,000 is transferred immediately to the designated Reserve Verification Account. Do not contact your broker; this investigation is under strict regulatory confidentiality."`,
    hasMedia: 'audio',
    mediaPlaceholderTitle: 'Voice Audio Sample: Vishing Call #8821',
    mediaDescription: 'Acoustic feature analysis displays sharp synthetic cutoff above 7.8 kHz, monotonic fundamental frequency pitch (F0), and absence of natural human breath pauses and acoustic room reverberation.',
    mockAudioFrequencies: [95, 92, 94, 93, 89, 91, 88, 12, 5, 2, 1, 0]
  },
  {
    id: 'case-spear-phishing-nse',
    title: 'Hyper-Personalized Spear Phishing: Fake NSE Margin Shortfall',
    channel: 'email',
    channelName: 'LLM Spear Phishing Email',
    jurisdiction: 'IN',
    targetEntity: 'Active F&O Derivatives Traders & Brokerage Clients',
    severity: 'HIGH',
    isSynthetic: true,
    summary: 'A spoofed HTML email using legitimate NSE logos claiming an urgent Peak Margin shortfall of INR 68,420 with imminent 5% penalty, directing users to a cloned lookalike portal (nseindia-clearing-settlement.cc).',
    sampleContent: `From: "NSE Clearing Corporation Notice" <settlement-notice@nseindia-clearing-settlement.cc>
To: <investor.trades@gmail.com>
Subject: URGENT: Intimation of Margin Shortfall & Trading Terminal Deactivation - Client ID: ZD9821

Dear Valued Investor,

As per circular NSE/INSP/2024/77 on Peak Margin Enforcement, our automated surveillance has detected an uncollateralized intraday shortfall of INR 68,420 in your NIFTY OPTION position expiring this Thursday.

Under SEBI Master Circular guidelines, failure to replenish this margin by 11:00 AM IST today will result in:
1. Immediate square-off of all open equity and derivative positions at market price.
2. Imposition of a 5.0% compounding non-compliance penalty.
3. Temporary deactivation of your Trading & Demat facility across all exchanges.

Please settle the shortfall immediately via the secure Exchange Clearing Gateway:
https://portal.nseindia-clearing-settlement.cc/pay/gateway?client=ZD9821&amount=68420

National Stock Exchange of India Ltd.
Exchange Plaza, C-1, Block G, Bandra Kurla Complex, Mumbai 400051`,
    hasMedia: 'none'
  },
  {
    id: 'case-social-telegram-pump',
    title: 'AI Botnet Coordinated Pump-and-Dump: Microcap Manipulative Tips',
    channel: 'social_post',
    channelName: 'Telegram / WhatsApp Syndicate',
    jurisdiction: 'IN',
    targetEntity: 'First-Generation Retail Investors & Penny Stock Traders',
    severity: 'HIGH',
    isSynthetic: true,
    summary: 'Coordinated dissemination of 3,200+ synthetically generated messages across 45 Telegram channels claiming an impending confidential acquisition of a micro-cap company with guaranteed 350% returns.',
    sampleContent: `🚀🚀 BOMB MULTIBAGGER ALERT! GUARANTEED 350% RETURN IN 5 SESSIONS! 🚀🚀
TICKER: MICROTECH IND (BSE: 541920) | CMP: ₹18.40 | TARGET: ₹85.00

CONFIDENTIAL INSIDER UPDATE FROM SEBI REGISTERED WHALE DESK:
Major US tech titan is acquiring 51% controlling stake in Microtech at ₹92/share! Announcement coming this Friday after market close!
Institutions already accumulating! Stock will be hitting 20% UPPER CIRCUIT daily starting Monday 9:15 AM!

Do NOT miss this lifetime jackpot! Retail quota closing fast!
Buy immediately at market open! Minimum target: 4x!
Join our VIP Institutional Insider Group for daily guaranteed calls: https://t.me/sebi_approved_jackpot_tips`,
    hasMedia: 'none'
  },

  // --- US JURISDICTION (SEC / FINRA / NYSE / NASDAQ) ---
  {
    id: 'case-us-deepfake-fed',
    title: 'Federal Reserve Chair Deepfake: Emergency 75bps Rate Hike Shock',
    channel: 'video_frame',
    channelName: 'Deepfake Video Broadcast',
    jurisdiction: 'US',
    targetEntity: 'CME S&P 500 E-mini & Treasury Yield Futures Markets',
    severity: 'CRITICAL',
    isSynthetic: true,
    summary: 'A synthetic video of Federal Reserve Chair Jerome Powell appearing at a fabricated Brookings Institution podium announcing an unscheduled 75bps inter-meeting interest rate hike to quell renewed inflation spikes, triggering an immediate 3.2% algorithmic futures flash crash.',
    sampleContent: `[Transcript of Video Broadcast]:
"Good afternoon, ladies and gentlemen. In light of revised core PCE print anomalies over the past 72 hours, the Federal Open Market Committee has voted unanimously in an emergency unscheduled session to raise the target federal funds rate by 75 basis points, effective immediately at 2:00 PM Eastern. Furthermore, we are doubling our quantitative tightening runoff cap. We recognize the market volatility this induces, but price stability demands immediate monetary contraction."`,
    hasMedia: 'image',
    mediaPlaceholderTitle: 'Fed Chair Deepfake Frame Analysis (SEC Rule 10b-5 Evidence)',
    mediaDescription: 'Analysis detects phoneme-viseme speech synchronization mismatch (42ms audio lead), absence of micro-saccadic eye movement, and synthetic blending seam along collar boundary.',
    mockAudioFrequencies: [88, 93, 85, 11, 14, 16, 12, 10, 8, 5, 2, 1]
  },
  {
    id: 'case-us-voice-vishing-hedgefund',
    title: 'AI Voice Clone: Hedge Fund CIO Authorizing $45M Prime Broker Wire',
    channel: 'audio_call',
    channelName: 'AI Voice Clone (Vishing)',
    jurisdiction: 'US',
    targetEntity: 'Goldman Sachs Prime Brokerage Trading & Wire Operations Desk',
    severity: 'CRITICAL',
    isSynthetic: true,
    summary: 'An automated voice clone mimicking the exact vocal timbre, breath cadence, and colloquial speech pattern of a top Manhattan macro hedge fund CIO calling the prime brokerage wire room to authorize an emergency $45,000,000 margin collateral transfer to an offshore Swiss account.',
    sampleContent: `[Recorded Prime Broker Telephone Audio Transcript]:
"Hey Dan, it's Ken. We've got a sudden margin reconciliation call on our Tokyo Yen carry swap before the Asian open. I need you to bypass the standard portal authorization and wire $45,000,000 from our Master Collateral Sub-account #GS-MACRO-991 to our Zurich liquidity clearing partner at UBS AG right now. The routing coordinates are in the email I just pinged from my personal proton address. We have 18 minutes before the BOJ fixing. Execute it immediately and mark it urgent under our verbal standing authorization agreement."`,
    hasMedia: 'audio',
    mediaPlaceholderTitle: 'Acoustic Voice Biometric Analysis: Hedge Fund CIO Clone',
    mediaDescription: 'Spectrogram reveals zero vocal tract resonant damping, synthetic Mel-frequency cepstral coefficient (MFCC) anomalies, and artificial background office noise loop repeating at 4.2-second intervals.',
    mockAudioFrequencies: [96, 94, 95, 91, 89, 90, 87, 8, 3, 2, 1, 0]
  },
  {
    id: 'case-us-sec-edgar-phish',
    title: 'Spoofed SEC EDGAR Form 8-K: Fabricated $120/Share Tender Offer',
    channel: 'email',
    channelName: 'LLM Spear Phishing Email',
    jurisdiction: 'US',
    targetEntity: 'Nasdaq Listed Cloud Enterprise (NASDAQ: CLOU)',
    severity: 'HIGH',
    isSynthetic: true,
    summary: 'A spoofed press release and Form 8-K distribution mimicking Business Wire and SEC EDGAR notification servers, claiming a private equity consortium has launched a definitive all-cash tender offer at a 75% premium, accompanied by forged CIK access codes.',
    sampleContent: `From: "U.S. SEC EDGAR Automated Filing System" <edgar-filing-notice@sec-edgar-filings.us>
To: <institutional-trading@citadel.com>, <derivatives@twosigma.com>
Subject: SEC FILING INTIMATION: Form 8-K (Item 1.01) - CloudMatrix Technologies (CIK: 0001899214)

UNITED STATES SECURITIES AND EXCHANGE COMMISSION
Washington, D.C. 20549
FORM 8-K / CURRENT REPORT

Item 1.01 Entry into a Material Definitive Agreement.
On September 8, 2026, CloudMatrix Technologies, Inc. entered into a definitive merger agreement with Apollo Global & Silver Lake Partners pursuant to which the Buyer will acquire all outstanding shares of common stock at a price of $120.00 per share in cash, representing an equity transaction value of $14.8 Billion.

The tender offer commences Wednesday at 9:00 AM EST. Shareholders may view the full Schedule TO and tender documentation at:
https://sec-edgar-filings.us/data/0001899214/0001899214-26-000412.htm

SEC EDGAR Operations Branch
100 F Street, N.E., Washington, D.C. 20549`,
    hasMedia: 'none'
  },
  {
    id: 'case-us-discord-pump-meme',
    title: 'AI Agent Swarm: Reddit / Discord Gamma Squeeze Manipulation',
    channel: 'social_post',
    channelName: 'Social Bot Syndicate',
    jurisdiction: 'US',
    targetEntity: 'Retail Option Traders & US Small-Cap BioTech (NASDAQ: BIOX)',
    severity: 'HIGH',
    isSynthetic: true,
    summary: 'Coordinated deployment of 1,800 autonomous LLM-driven bot accounts across Reddit r/wallstreetbets, StockTwits, and Discord trading servers generating synthetic screenshot P&L proofs to induce a retail call-option gamma squeeze.',
    sampleContent: `🚨🚨 $BIOX FDA APPROVAL LEAK! 1000% SHORT SQUEEZE INCOMING TODAY! 🚨🚨
Wall Street short hedge funds are trapped! 84% of the float is shorted and FDA Phase 3 trial results were just approved 20 minutes ago!
Institutions are desperate to cover before 10:30 AM halt!

My Bloomberg terminal is showing 40,000 $15 Call contracts bought at ask!
I just mortgaged my truck and bought 2,500 shares at $4.10!
Target: $45.00+ today! Do not sell a single share to the hedgies!
Post your YOLO positions in our verified Discord alpha channel: https://discord.gg/sec-whales-unlimited-yolo`,
    hasMedia: 'none'
  },

  // --- AUTHENTIC RECORDS ---
  {
    id: 'case-authentic-sebi-circular',
    title: 'GENUINE: Official SEBI Circular on Digital Provenance & Deepfake Prevention',
    channel: 'circular',
    channelName: 'Official Regulatory Circular',
    jurisdiction: 'IN',
    targetEntity: 'All Recognized Stock Exchanges, Clearing Corporations & Brokers',
    severity: 'AUTHENTIC',
    isSynthetic: false,
    summary: 'Authentic circular officially published on the SEBI portal with verified cryptographic SHA-256 hash, correct official numbering sequence, and matching gazette entry.',
    sampleContent: `CIRCULAR
SEBI/HO/MIRSD/MIRSD-PoD-1/P/CIR/2024/89
June 20, 2024

To,
1. All Recognized Stock Exchanges
2. All Registered Stock Brokers and Intermediaries
3. Association of Mutual Funds in India (AMFI)

Subject: Measures to Prevent Fraudulent and Deepfake Market Communications by Entities

1. In recent times, it has been observed that unauthorized entities and bad actors are deploying generative artificial intelligence, voice cloning, and synthetic deepfakes to impersonate market leadership and misguide retail investors.
2. In order to protect the integrity of the securities market and safeguard the interests of investors, it is hereby directed that:
   a. All registered stock brokers and intermediaries shall institute verifiable cryptographic provenance for official client notifications.
   b. Intermediaries shall not associate, directly or indirectly, with any person providing unauthorized stock advice or making promises of assured returns.
3. This circular is issued in exercise of powers conferred under Section 11(1) of the Securities and Exchange Board of India Act, 1992.`,
    hasMedia: 'none',
    provenanceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'case-authentic-sec-8k',
    title: 'GENUINE: Official SEC Form 8-K Material Event (Microsoft Corporation)',
    channel: 'circular',
    channelName: 'Official SEC EDGAR Filing',
    jurisdiction: 'US',
    targetEntity: 'Securities and Exchange Commission (SEC EDGAR)',
    severity: 'AUTHENTIC',
    isSynthetic: false,
    summary: 'Authentic SEC EDGAR Form 8-K filing with verifiable Accession Number 0000789019-24-000045, CIK 0000789019, and matching SEC public repository cryptographic digest.',
    sampleContent: `UNITED STATES SECURITIES AND EXCHANGE COMMISSION
Washington, D.C. 20549
FORM 8-K
CURRENT REPORT PURSUANT TO SECTION 13 OR 15(d) OF THE SECURITIES EXCHANGE ACT OF 1934

Date of Report: July 23, 2024
MICROSOFT CORPORATION (Exact name of registrant as specified in its charter)
Washington | Commission File Number: 001-37845 | CIK: 0000789019

Item 2.02 Results of Operations and Financial Condition.
On July 23, 2024, Microsoft Corporation issued a press release announcing its financial results for the quarter ended June 30, 2024. A copy of the press release is furnished as Exhibit 99.1 to this Current Report on Form 8-K.

Item 9.01 Financial Statements and Exhibits.
(d) Exhibits: 99.1 Press Release dated July 23, 2024.

SIGNATURES:
Pursuant to the requirements of the Securities Exchange Act of 1934, the registrant has duly caused this report to be signed on its behalf by the undersigned hereunto duly authorized.
MICROSOFT CORPORATION
By: /s/ Amy E. Hood, Executive Vice President and Chief Financial Officer`,
    hasMedia: 'none',
    provenanceHash: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'
  }
];
