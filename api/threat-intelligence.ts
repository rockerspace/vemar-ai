export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');

  return res.status(200).json({
    success: true,
    statistics: {
      totalAttacksAnalyzedToday: 1482,
      syntheticMediaDetected: 312,
      phishingAttacksPrevented: 894,
      authenticCommunicationsValidated: 276,
      averageDetectionLatencyMs: 410,
      activeSurveillanceAlerts: 7,
      marketValueProtectedINR: '428.5 Cr',
      marketValueProtectedUSD: '$51.4 Million'
    },
    vectorsBreakdown: [
      { name: 'Voice Phishing (Vishing Clones)', percentage: 34, risk: 'High' },
      { name: 'Deepfake Executive Videos', percentage: 26, risk: 'Critical' },
      { name: 'Spear Phishing & Spoofed Portals', percentage: 23, risk: 'High' },
      { name: 'Social Bot Syndicates / Fake Tips', percentage: 17, risk: 'Medium' }
    ],
    recentIncidents: [
      {
        id: 'INC-2026-0881',
        timestamp: '11 mins ago',
        targetEntity: 'Ken Griffin (Citadel CIO Voice Clone)',
        channel: 'audio_call',
        severity: 'CRITICAL',
        mitigationAction: 'FIX Protocol Automated Pre-Trade Block (Execution latency 14ms)',
        jurisdiction: 'US'
      },
      {
        id: 'INC-2026-0882',
        timestamp: '24 mins ago',
        targetEntity: 'SEBI Enforcement Cell Order Fake Notice',
        channel: 'circular',
        severity: 'HIGH',
        mitigationAction: 'Registry Hash Mismatch Flagged; Broker Alert Broadcast via SCORES',
        jurisdiction: 'IN'
      },
      {
        id: 'INC-2026-0883',
        timestamp: '47 mins ago',
        targetEntity: 'Nifty 50 Top 5 Banking CEO Resignation Deepfake',
        channel: 'video_frame',
        severity: 'CRITICAL',
        mitigationAction: 'Exchange Surveillance Price Band Freeze Prevented Flash Crash',
        jurisdiction: 'IN'
      },
      {
        id: 'INC-2026-0884',
        timestamp: '1 hour ago',
        targetEntity: 'SEC EDGAR Accession Spoofed 8-K Tender Offer',
        channel: 'email',
        severity: 'HIGH',
        mitigationAction: 'Clearing Settlement Hold Enforced on Wire Transfers',
        jurisdiction: 'US'
      }
    ]
  });
}
