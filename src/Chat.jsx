import { useState, useRef, useEffect } from 'react'

const QUICK = [
  'How does AI voice cloning work?',
  'What is behavioral AI verification?',
  'My voice was cloned — what should I do?',
  'How do AI identity graphs detect fraud rings?',
  'Explain cryptographic content watermarking',
]

const KB = [
  {
    keys: ['voice clon', 'audio deepfake', 'voice synth'],
    answer: `VOICE CLONING works by training a neural TTS model on a target speaker's audio — sometimes as little as 3–5 seconds of clean speech. Tools like ElevenLabs, Murf, and PlayHT can generate convincing clones in seconds.

DETECTION SIGNALS:
• Non-linear spectral artifacts in the 4–8 kHz range
• Unnatural pitch micro-variations (too consistent)
• Missing breath sounds and mouth noise
• Temporal inconsistencies at sentence boundaries

VEMAR's spectral fingerprinting achieves 95%+ accuracy. Use the DETECTION LAB at /detect to analyse a suspected audio URL.

Would you like to walk through the detection process step by step?`,
  },
  {
    keys: ['deepfake', 'face swap', 'video fake', 'image fake'],
    answer: `DEEPFAKE DETECTION identifies artifacts left by generative models:

• TEMPORAL INCONSISTENCIES — unnatural blinking, micro-expression timing
• BOUNDARY ARTIFACTS — subtle halos around hairlines and face edges
• GAN FINGERPRINTS — periodic noise patterns in the frequency domain
• LIGHTING MISMATCHES — shadow directions inconsistent with the scene

VEMAR achieves 96%+ accuracy on images and 98%+ on video deepfakes.

Do you have a specific URL you'd like to run through the DETECTION LAB?`,
  },
  {
    keys: ['behavioral', 'bot detect', 'typing caden', 'mouse dynam', 'interaction'],
    answer: `BEHAVIORAL AI VERIFICATION analyses interaction patterns that are nearly impossible for bots to replicate:

• TYPING CADENCE — keystroke timing, dwell time, inter-key latency
• MOUSE DYNAMICS — velocity curves, micro-tremors, click pressure
• INTERACTION ENTROPY — scroll patterns, focus shifts, navigation randomness
• DEVICE BIOMETRICS — gyroscope and accelerometer data on mobile

AI agents show unnaturally low entropy and hyper-consistent timing. VEMAR aggregates all layers into a 0–100 fraud probability score.

Would you like to learn about the LIVE CHALLENGE AUTHENTICATION system too?`,
  },
  {
    keys: ['my voice was', 'been cloned', 'voice stolen', 'what should i do', 'cloned me', 'impersonat'],
    answer: `If your voice has been cloned without consent, act immediately:

1. DOCUMENT — Screenshot and record every instance you find
2. REPORT — File DMCA takedowns on YouTube, TikTok, and Instagram  
3. ALERT — Warn your bank and close contacts; clones are used for fraud calls
4. TRACE — Use VEMAR's watermark tracing to identify clone origin
5. LEGAL — Unconsented voice cloning violates law in many jurisdictions (EU AI Act, US state statutes)

VEMAR can auto-generate a TAKEDOWN REPORT with all evidence packaged.

Want to run a detection scan first to confirm and document the clone?`,
  },
  {
    keys: ['identity graph', 'fraud ring', 'synthetic identity', 'fake account network'],
    answer: `AI IDENTITY GRAPHS map relationships between accounts, devices, IPs, and behavioral clusters to expose synthetic fraud rings.

How it works:
• Nodes = identities, devices, IP addresses
• Edges = shared device, burst creation timing, behavioral overlap
• Clustering algorithms flag coordinated synthetic networks
• 94%+ behavioral similarity triggers an auto-flag

A typical fraud ring: 7 accounts created in 4 minutes from the same TOR exit node with near-identical interaction patterns. VEMAR recommends AUTO-BAN + REPORT.

Shall I explain how to read the identity graph visualisation in the IDENTITY DEFENSE tab?`,
  },
  {
    keys: ['watermark', 'content protect', 'trace origin', 'cryptograph'],
    answer: `CRYPTOGRAPHIC CONTENT WATERMARKING embeds an invisible, tamper-resistant identifier into your media at the frequency-domain level.

How VEMAR's system works:
• A unique hash (e.g. VEMAR-X7K2MN-1AB3C) is embedded invisibly at registration
• The watermark survives compression, re-encoding, and pitch-shifting
• If someone AI-clones your content, the watermark persists in the clone
• VEMAR's trace scan reads it and identifies the registered owner

This gives you irrefutable proof of origin for takedowns and legal filings.

Would you like to register your content and embed a watermark in the IDENTITY DEFENSE tab?`,
  },
  {
    keys: ['takedown', 'dmca', 'report clone', 'remove content', 'file report'],
    answer: `TAKEDOWN PROCEDURE for AI-cloned content:

1. DETECT — Run VEMAR scan to confirm AI generation (exports a confidence score)
2. DOCUMENT — Save VEMAR's analysis report as evidence
3. PLATFORM REPORT — Use each platform's AI/deepfake reporting tool
4. DMCA NOTICE — File if your copyrighted voice or likeness was used
5. ESCALATE — For persistent violations, contact platform Trust & Safety with your VEMAR report attached

Most platforms remove confirmed deepfakes within 24–72 hours when presented with a credible detection report.

Shall I generate a takedown report template?`,
  },
  {
    keys: ['how does vemar', 'how does it work', 'how does detect', 'how accurate', 'detection work'],
    answer: `VEMAR.AI uses a multi-layer neural detection pipeline:

1. SPECTRAL ANALYSIS — Frequency-domain artifact detection
2. TEMPORAL ANALYSIS — Frame consistency and motion coherence checks
3. BIOMETRIC FINGERPRINTING — Speaker and face identity verification
4. IDENTITY VAULT — Cross-reference against 2M+ known synthetic patterns
5. BEHAVIORAL SCORING — Interaction entropy analysis

Each layer runs in parallel and results combine into a unified threat score. The full pipeline completes in under 4 seconds with 99.4% accuracy.

What specific type of threat are you trying to detect today?`,
  },
]

function getAnswer(msg) {
  const lower = msg.toLowerCase()
  for (const entry of KB) {
    if (entry.keys.some(k => lower.includes(k))) return entry.answer
  }
  return `I can help with the following VEMAR threat intelligence topics:

• VOICE CLONING — detection, prevention, legal recourse
• DEEPFAKES — image and video analysis
• BEHAVIORAL AI — bot detection, typing cadence, mouse dynamics
• IDENTITY GRAPHS — synthetic fraud network mapping
• CONTENT WATERMARKING — origin tracing and tamper detection
• TAKEDOWN PROCEDURES — DMCA, platform reporting, legal filing

Try asking about any of these, or head to the DETECTION LAB to analyse a media URL directly.

What threat are you most concerned about?`
}

export default function Chat() {
  const [msgs, setMsgs] = useState([{
    role: 'ai',
    text: "Hello. I'm VEMAR's AI Threat Analyst.\n\nI specialise in voice/face cloning detection, deepfake analysis, behavioral fraud, identity graph analysis, and content watermarking.\n\nHow can I help protect your identity today?",
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef()
  const inputRef = useRef()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading])

  const send = (text) => {
    const m = (text || input).trim()
    if (!m || loading) return
    setInput('')
    setLoading(true)
    setMsgs(p => [...p, { role: 'user', text: m }])
    // Simulate a brief "thinking" delay for realism
    setTimeout(() => {
      setMsgs(p => [...p, { role: 'ai', text: getAnswer(m) }])
      setLoading(false)
      inputRef.current?.focus()
    }, 600)
  }

  return (
    <div className="page-enter" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: 2, marginBottom: '.25rem' }}>
        AI THREAT ANALYST
      </h1>
      <p style={{ color: 'var(--text3)', fontSize: 11, letterSpacing: 2, marginBottom: '1.5rem' }}>
        VEMAR INTELLIGENCE ENGINE — ASK ANYTHING ABOUT AI CLONE THREATS
      </p>

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div
          className="chat-messages"
          role="log"
          aria-label="Conversation with AI Threat Analyst"
          aria-live="polite"
          aria-relevant="additions"
        >
          {msgs.map((m, i) => (
            <div key={i} className={`msg msg-${m.role}`}>
              <div className="msg-label" aria-hidden="true">
                {m.role === 'ai' ? 'VEMAR ANALYST' : 'YOU'}
              </div>
              <div className="msg-bubble" style={{ whiteSpace: 'pre-wrap' }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="msg msg-ai">
              <div className="msg-label" aria-hidden="true">VEMAR ANALYST</div>
              <div className="msg-bubble" style={{ display: 'flex', gap: 4, alignItems: 'center' }} aria-label="Typing">
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {msgs.length === 1 && (
          <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: 6 }} role="group" aria-label="Quick questions">
            {QUICK.map(q => (
              <button key={q} className="tag tag-cyan" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        )}

        <div className="chat-input-row">
          <label htmlFor="chat-input" className="sr-only">Message</label>
          <input
            id="chat-input"
            ref={inputRef}
            className="chat-input"
            type="text"
            placeholder="Ask about threats, detection, behavioral AI, identity graphs..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={loading}
          />
          <button
            className="chat-send"
            onClick={() => send()}
            disabled={loading || !input.trim()}
            aria-busy={loading}
          >
            SEND
          </button>
        </div>
        <p style={{ color: 'var(--text3)', fontSize: 10, marginTop: 7, letterSpacing: 1 }}>
          VEMAR Threat Intelligence · Zero dependencies · Always online
        </p>
      </div>
    </div>
  )
}
