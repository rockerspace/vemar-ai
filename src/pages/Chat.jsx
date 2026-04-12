import { useState, useRef, useEffect } from 'react'

const QUICK = [
  'How does AI voice cloning work?',
  'What is behavioral AI verification?',
  'My voice was cloned — what should I do?',
  'How do AI identity graphs detect fraud rings?',
  'Explain cryptographic content watermarking',
]

// Local fallback answers shown when API credits are exhausted
const LOCAL_KB = {
  'voice clon': `VOICE CLONING works by training a neural text-to-speech model on a target speaker's audio — sometimes as little as 3–5 seconds of clean speech. Tools like ElevenLabs, Murf, and PlayHT can generate convincing clones in seconds.

DETECTION SIGNALS to look for:
• Non-linear spectral artifacts in the 4–8 kHz range
• Unnatural pitch micro-variations (too consistent)
• Missing breath sounds and mouth noise
• Temporal inconsistencies at sentence boundaries

VEMAR's spectral fingerprinting achieves 95%+ accuracy detecting these patterns. Want me to walk you through the detection process step by step?`,

  'behavioral': `BEHAVIORAL AI VERIFICATION analyses the way a real human interacts with a device — patterns that are nearly impossible for AI bots to replicate:

• TYPING CADENCE — keystroke timing, dwell time, inter-key latency
• MOUSE DYNAMICS — velocity curves, micro-tremors, click pressure
• INTERACTION ENTROPY — scroll patterns, focus shifts, navigation randomness
• DEVICE BIOMETRICS — gyroscope/accelerometer data on mobile

AI agents exhibit unnaturally low entropy and hyper-consistent timing. VEMAR's risk scoring aggregates all layers into a single fraud probability score.

Would you like to learn about the live challenge authentication system as well?`,

  'cloned': `If your voice has been cloned without consent, act immediately:

1. DOCUMENT — Screenshot/record every instance of the clone
2. REPORT — File DMCA takedowns on YouTube, TikTok, Instagram
3. ALERT — Notify your bank and contacts the voice may be used for fraud
4. TRACE — Use VEMAR's watermark tracing to identify clone origin
5. LEGAL — Contact a digital rights attorney; AI voice cloning without consent violates laws in many jurisdictions

VEMAR can generate a TAKEDOWN REPORT with all the evidence you need. Would you like to run a detection scan first?`,

  'identity graph': `AI IDENTITY GRAPHS map relationships between accounts, devices, IPs and behavioural clusters to expose synthetic identity fraud rings.

How it works:
• Graph nodes represent identities, devices, and IP addresses
• Edges encode relationships (shared device, burst account creation, behavioural overlap)
• Clustering algorithms flag coordinated synthetic networks
• 94%+ behavioural similarity = high fraud probability

A typical fraud ring might show 7 accounts created in 4 minutes from the same TOR exit node with near-identical interaction patterns. VEMAR auto-flags these clusters for review or auto-ban.

Shall I explain how to interpret the identity graph visualisation?`,

  'watermark': `CRYPTOGRAPHIC CONTENT WATERMARKING embeds an invisible, tamper-resistant identifier into your media at the pixel/sample level.

How VEMAR's watermarking works:
• A unique hash (e.g. VEMAR-X7K2MN-1AB3C) is embedded in the frequency domain
• The watermark survives compression, re-encoding, and pitch-shifting
• If someone AI-clones your content, the watermark persists in the clone
• VEMAR's trace scan reads the watermark and identifies the registered owner

This gives you irrefutable proof of origin for takedown filings and legal action. Would you like to learn how to register your content and embed a watermark?`,
}

function getLocalAnswer(msg) {
  const lower = msg.toLowerCase()
  for (const [key, answer] of Object.entries(LOCAL_KB)) {
    if (lower.includes(key)) return answer
  }
  return null
}

async function callAPI(message, history) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })
  const data = await res.json()
  if (!res.ok) {
    // Pass errorType through so we can handle credits differently
    const err = new Error(data.error || 'API error ' + res.status)
    err.errorType = data.errorType || ''
    err.status = res.status
    throw err
  }
  return data.text
}

const CREDIT_MSG = `⚡ The live AI Analyst is temporarily unavailable (API credit limit reached).

I'm showing you answers from VEMAR's built-in knowledge base instead. Try asking about:
• Voice cloning detection
• Behavioral AI verification  
• What to do if your voice was cloned
• AI identity graphs
• Content watermarking

To restore full AI Analyst access, add credits to your Anthropic account at console.anthropic.com and redeploy.`

export default function Chat() {
  const [msgs, setMsgs] = useState([{
    role: 'ai',
    text: "Hello. I'm VEMAR's AI Threat Analyst, powered by Claude.\n\nI specialise in voice/face cloning detection, deepfake analysis, behavioral fraud, identity graph analysis, and content watermarking.\n\nHow can I help protect your identity today?",
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [creditsExhausted, setCreditsExhausted] = useState(false)
  const endRef = useRef()
  const inputRef = useRef()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading])

  const send = async (text) => {
    const m = (text || input).trim()
    if (!m || loading) return
    setInput('')

    const newMsg = { role: 'user', text: m }
    const updatedMsgs = [...msgs, newMsg]
    setMsgs(updatedMsgs)
    setLoading(true)

    // If credits already exhausted, try local KB first
    if (creditsExhausted) {
      const local = getLocalAnswer(m)
      setMsgs(p => [...p, {
        role: 'ai',
        text: local || "I don't have a pre-built answer for that topic right now. Please restore API credits to get full AI Analyst responses.",
        isLocal: true,
      }])
      setLoading(false)
      inputRef.current?.focus()
      return
    }

    try {
      // Pass last 6 messages as context (3 exchanges) to keep costs low
      const historyForAPI = updatedMsgs.slice(-7, -1)
      const reply = await callAPI(m, historyForAPI)
      setMsgs(p => [...p, { role: 'ai', text: reply }])
    } catch (e) {
      const isCredit = e.status === 529 || e.status === 402 ||
        e.errorType === 'overloaded_error' ||
        e.message?.toLowerCase().includes('credit') ||
        e.message?.toLowerCase().includes('billing') ||
        e.message?.toLowerCase().includes('quota') ||
        e.message?.toLowerCase().includes('529')

      if (isCredit) {
        setCreditsExhausted(true)
        // Try local KB for this first failed message
        const local = getLocalAnswer(m)
        setMsgs(p => [...p,
          { role: 'ai', text: CREDIT_MSG, isWarning: true },
          ...(local ? [{ role: 'ai', text: local, isLocal: true }] : []),
        ])
      } else {
        setMsgs(p => [...p, {
          role: 'ai',
          text: `⚠ Error: ${e.message}\n\nMake sure ANTHROPIC_API_KEY is set in your Vercel environment variables (Settings → Environment Variables).`,
          isError: true,
        }])
      }
    }

    setLoading(false)
    inputRef.current?.focus()
  }

  return (
    <div className="page-enter" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: '.25rem' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: 2 }}>AI THREAT ANALYST</h1>
        {creditsExhausted && (
          <span style={{ fontSize: 10, letterSpacing: 1, padding: '3px 9px', background: 'rgba(255,179,0,.12)', color: 'var(--amber)', border: '1px solid var(--amber2)', fontWeight: 700 }}>
            ⚡ OFFLINE — KB MODE
          </span>
        )}
      </div>
      <p style={{ color: 'var(--text3)', fontSize: 11, letterSpacing: 2, marginBottom: '1.5rem' }}>
        POWERED BY CLAUDE — ASK ANYTHING ABOUT AI CLONE THREATS
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
            <div
              key={i}
              className={`msg msg-${m.role}`}
              aria-label={m.role === 'ai' ? 'VEMAR Analyst' : 'You'}
            >
              <div className="msg-label" aria-hidden="true">
                {m.role === 'ai'
                  ? (m.isLocal ? 'KNOWLEDGE BASE' : m.isWarning ? '⚡ SYSTEM' : 'VEMAR ANALYST')
                  : 'YOU'}
              </div>
              <div
                className="msg-bubble"
                style={{
                  whiteSpace: 'pre-wrap',
                  ...(m.isWarning ? { borderLeftColor: 'var(--amber)', color: 'var(--text2)' } : {}),
                  ...(m.isLocal ? { borderLeftColor: 'var(--cyan3)', opacity: .9 } : {}),
                  ...(m.isError ? { borderLeftColor: 'var(--red)', color: 'var(--text2)' } : {}),
                }}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg msg-ai" aria-label="VEMAR Analyst is typing">
              <div className="msg-label" aria-hidden="true">VEMAR ANALYST</div>
              <div className="msg-bubble" style={{ display: 'flex', gap: 4, alignItems: 'center' }} aria-label="Typing...">
                <div className="dot" aria-hidden="true" />
                <div className="dot" aria-hidden="true" />
                <div className="dot" aria-hidden="true" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {msgs.length === 1 && (
          <div
            style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: 6 }}
            role="group"
            aria-label="Quick questions"
          >
            {QUICK.map(q => (
              <button
                key={q}
                className="tag tag-cyan"
                onClick={() => send(q)}
                aria-label={`Ask: ${q}`}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-row" role="form" aria-label="Send a message">
          <label htmlFor="chat-input" className="sr-only">Message</label>
          <input
            id="chat-input"
            ref={inputRef}
            className="chat-input"
            type="text"
            placeholder={creditsExhausted
              ? 'Ask about voice cloning, deepfakes, behavioral AI...'
              : 'Ask about threats, detection, behavioral AI, identity graphs...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={loading}
            aria-disabled={loading}
            aria-label="Type your message"
          />
          <button
            className="chat-send"
            onClick={() => send()}
            disabled={loading || !input.trim()}
            aria-label={loading ? 'Sending...' : 'Send message'}
            aria-busy={loading}
          >
            SEND
          </button>
        </div>
        <p style={{ color: 'var(--text3)', fontSize: 10, marginTop: 7, letterSpacing: 1 }}>
          {creditsExhausted
            ? 'Knowledge base mode — restore API credits for full Claude AI responses'
            : 'Powered by Claude via secure backend API · Using claude-haiku-4-5 for efficiency'}
        </p>
      </div>
    </div>
  )
}
