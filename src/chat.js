// VEMAR AI Analyst — no API key required, pure knowledge base
const KB = {
  'voice clon': `VOICE CLONING works by training a neural TTS model on a target speaker's audio — sometimes as little as 3–5 seconds. Tools like ElevenLabs, Murf, and PlayHT can generate convincing clones in seconds.

DETECTION SIGNALS:
• Non-linear spectral artifacts in the 4–8 kHz range
• Unnatural pitch micro-variations (too consistent)
• Missing breath sounds and mouth noise
• Temporal inconsistencies at sentence boundaries

VEMAR's spectral fingerprinting achieves 95%+ accuracy detecting these patterns.

Would you like to run a detection scan on a suspected audio sample?`,

  'deepfake': `DEEPFAKE DETECTION relies on identifying artifacts left by generative models:

• TEMPORAL INCONSISTENCIES — unnatural blinking, micro-expression timing
• BOUNDARY ARTIFACTS — subtle halos around hairlines and face edges
• GAN FINGERPRINTS — periodic noise patterns in the frequency domain
• LIGHTING MISMATCHES — shadow directions inconsistent with scene

VEMAR's multi-layer analysis checks all these signals simultaneously with 96%+ accuracy on image deepfakes and 98%+ on video.

Do you have a specific video or image you'd like to analyse?`,

  'behavioral': `BEHAVIORAL AI VERIFICATION analyses interaction patterns that are nearly impossible for bots to replicate:

• TYPING CADENCE — keystroke timing, dwell time, inter-key latency
• MOUSE DYNAMICS — velocity curves, micro-tremors, click pressure
• INTERACTION ENTROPY — scroll patterns, focus shifts, navigation randomness
• DEVICE BIOMETRICS — gyroscope/accelerometer data on mobile

AI agents show unnaturally low entropy and hyper-consistent timing. VEMAR's risk scoring aggregates all layers into a single fraud probability (0–100).

Would you like to learn about the Live Challenge Authentication system as well?`,

  'cloned': `If your voice has been cloned without consent, act immediately:

1. DOCUMENT — Screenshot and record every instance you find
2. REPORT — File DMCA takedowns on YouTube, TikTok, and Instagram
3. ALERT — Notify your bank and close contacts the clone may be used for fraud
4. TRACE — Use VEMAR's watermark tracing to identify the clone's origin
5. LEGAL — Contact a digital rights attorney; unconsented voice cloning violates laws in many jurisdictions (EU AI Act, US state laws)

VEMAR can auto-generate a TAKEDOWN REPORT with all evidence packaged. Want to start a detection scan first?`,

  'identity graph': `AI IDENTITY GRAPHS map relationships between accounts, devices, IPs, and behavioral clusters to expose synthetic fraud rings.

How it works:
• Nodes = identities, devices, IP addresses
• Edges = shared device, burst creation, behavioural overlap
• Clustering flags coordinated synthetic networks
• 94%+ behavioral similarity triggers auto-flagging

A typical fraud ring: 7 accounts created in 4 minutes from the same TOR exit node with near-identical interaction patterns. VEMAR auto-flags these for review or auto-ban.

Shall I explain how to read the identity graph visualisation?`,

  'watermark': `CRYPTOGRAPHIC CONTENT WATERMARKING embeds an invisible, tamper-resistant identifier into your media at the frequency-domain level.

How VEMAR's system works:
• A unique hash (e.g. VEMAR-X7K2MN-1AB3C) is embedded invisibly
• The watermark survives compression, re-encoding, and pitch-shifting
• If someone AI-clones your content, the watermark persists
• VEMAR's trace scan reads it and identifies the registered owner

This gives you irrefutable proof of origin for takedowns and legal filings.

Would you like to register your content and embed a watermark now?`,

  'takedown': `TAKEDOWN PROCEDURE for AI-cloned content:

1. DETECT — Run VEMAR scan to confirm AI generation (get confidence score)
2. DOCUMENT — Export VEMAR's analysis report as evidence
3. PLATFORM REPORT — Use each platform's AI/deepfake reporting tool
4. DMCA — File a DMCA notice if your copyrighted voice/likeness was used
5. ESCALATE — For persistent violations, contact the platform's Trust & Safety team directly with your VEMAR report

Most platforms remove confirmed deepfakes within 24–72 hours when presented with a credible detection report.

Shall I generate a takedown report template for you?`,

  'how does': `VEMAR.AI uses a multi-layer neural detection pipeline:

1. SPECTRAL ANALYSIS — Frequency-domain artifact detection
2. TEMPORAL ANALYSIS — Frame consistency and motion coherence
3. BIOMETRIC FINGERPRINTING — Speaker/face identity verification
4. IDENTITY VAULT — Cross-reference against known synthetic patterns
5. BEHAVIORAL SCORING — Interaction entropy analysis

Each layer runs in parallel and results are combined into a unified threat score. The entire pipeline completes in under 4 seconds.

What specific type of threat are you trying to detect?`,
}

function getAnswer(msg) {
  const lower = msg.toLowerCase()
  for (const [key, answer] of Object.entries(KB)) {
    if (lower.includes(key)) return answer
  }
  return `I can help you with the following VEMAR threat intelligence topics:

• VOICE CLONING detection and prevention
• DEEPFAKE analysis (image and video)
• BEHAVIORAL AI verification and bot detection
• IDENTITY GRAPHS and synthetic fraud networks
• CONTENT WATERMARKING and origin tracing
• TAKEDOWN procedures and legal recourse

Try asking about any of these topics, or use the detection lab at /detect to analyse a specific media URL.

What threat are you most concerned about today?`
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { message } = body || {}
    if (!message) return res.status(400).json({ error: 'Message required' })
    return res.status(200).json({ text: getAnswer(message) })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
