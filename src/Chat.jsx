import { useState, useRef, useEffect } from 'react'
import SarvamVoice from './components/SarvamVoice'

const QUICK = [
  'How does AI voice cloning work?',
  'What is behavioral AI verification?',
  'My voice was cloned — what should I do?',
  'How do AI identity graphs detect fraud rings?',
  'Explain cryptographic content watermarking',
]

const KB = [
  { keys: ['voice clon','audio deepfake','voice synth'], answer: `VOICE CLONING works by training a neural TTS model on a target speaker's audio — sometimes as little as 3–5 seconds.\n\nDETECTION SIGNALS:\n• Non-linear spectral artifacts in the 4–8 kHz range\n• Unnatural pitch micro-variations\n• Missing breath sounds and mouth noise\n\nVEMAR's spectral fingerprinting achieves 95%+ accuracy.` },
  { keys: ['deepfake','face swap','video fake','image fake'], answer: `DEEPFAKE DETECTION identifies artifacts left by generative models:\n\n• TEMPORAL INCONSISTENCIES — unnatural blinking\n• BOUNDARY ARTIFACTS — halos around hairlines\n• GAN FINGERPRINTS — periodic noise patterns\n• LIGHTING MISMATCHES — inconsistent shadows\n\nVEMAR achieves 96%+ on images and 98%+ on video deepfakes.` },
  { keys: ['behavioral','bot detect','typing caden','mouse dynam'], answer: `BEHAVIORAL AI VERIFICATION analyses interaction patterns:\n\n• TYPING CADENCE — keystroke timing and dwell time\n• MOUSE DYNAMICS — velocity curves and micro-tremors\n• INTERACTION ENTROPY — scroll patterns and focus shifts\n• DEVICE BIOMETRICS — gyroscope data on mobile\n\nVEMAR aggregates all layers into a 0–100 fraud probability score.` },
  { keys: ['my voice was','been cloned','voice stolen','what should i do','cloned me','impersonat'], answer: `If your voice has been cloned without consent, act immediately:\n\n1. DOCUMENT — Screenshot every instance\n2. REPORT — File DMCA takedowns on YouTube, TikTok, Instagram\n3. ALERT — Warn your bank and close contacts\n4. TRACE — Use VEMAR watermark tracing\n5. LEGAL — Contact a digital rights attorney\n\nVEMAR can auto-generate a TAKEDOWN REPORT instantly.` },
  { keys: ['identity graph','fraud ring','synthetic identity'], answer: `AI IDENTITY GRAPHS map relationships between accounts, devices, and IPs to expose synthetic fraud rings.\n\n• Nodes = identities, devices, IP addresses\n• Edges = shared device, burst creation, behavioral overlap\n• 94%+ similarity triggers an auto-flag\n\nVEMAR recommends AUTO-BAN + REPORT for confirmed rings.` },
  { keys: ['watermark','content protect','trace origin','cryptograph'], answer: `CRYPTOGRAPHIC CONTENT WATERMARKING embeds an invisible identifier in your media.\n\n• Unique hash embedded at registration\n• Survives compression, re-encoding, pitch-shifting\n• Watermark persists in any clone\n• Provides irrefutable proof of origin for DMCA filings.` },
  { keys: ['takedown','dmca','report clone','remove content'], answer: `TAKEDOWN PROCEDURE:\n\n1. DETECT — Run VEMAR scan (confidence score exported)\n2. DOCUMENT — Save VEMAR analysis report\n3. PLATFORM REPORT — Use platform's AI/deepfake reporting tool\n4. DMCA NOTICE — File if your voice/likeness was used\n5. ESCALATE — Contact Trust & Safety with VEMAR report\n\nMost platforms remove deepfakes within 24–72 hours.` },
  { keys: ['how does vemar','how does it work','how accurate','detection work'], answer: `VEMAR.AI uses a multi-layer neural detection pipeline:\n\n1. SPECTRAL ANALYSIS — Frequency-domain artifact detection\n2. TEMPORAL ANALYSIS — Frame consistency checks\n3. BIOMETRIC FINGERPRINTING — Speaker and face verification\n4. IDENTITY VAULT — Cross-reference 2M+ synthetic patterns\n5. BEHAVIORAL SCORING — Interaction entropy analysis\n\nFull pipeline completes in under 4 seconds at 99.4% accuracy.` },
]

function getAnswer(msg) {
  const lower = msg.toLowerCase()
  for (const entry of KB) {
    if (entry.keys.some(k => lower.includes(k))) return entry.answer
  }
  return `I can help with:\n\n• VOICE CLONING — detection, prevention, legal recourse\n• DEEPFAKES — image and video analysis\n• BEHAVIORAL AI — bot detection and entropy scoring\n• IDENTITY GRAPHS — synthetic fraud network mapping\n• CONTENT WATERMARKING — origin tracing\n• TAKEDOWN PROCEDURES — DMCA and platform reporting\n\nWhat threat are you most concerned about?`
}

export default function Chat() {
  const [msgs,        setMsgs]        = useState([{ role:'ai', text:"Hello. I'm VEMAR's AI Threat Analyst.\n\nI specialise in voice/face cloning detection, deepfake analysis, behavioral fraud, and identity defense.\n\nHow can I help protect your identity today?" }])
  const [input,       setInput]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [lastAiMsg,   setLastAiMsg]   = useState(null)
  const [speakTarget, setSpeakTarget] = useState(null)
  const endRef   = useRef()
  const inputRef = useRef()

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading])

  const send = (text) => {
    const m = (text || input).trim()
    if (!m || loading) return
    setInput('')
    setLoading(true)
    setMsgs(p => [...p, { role:'user', text:m }])
    setTimeout(() => {
      const aiText = getAnswer(m)
      setMsgs(p => [...p, { role:'ai', text:aiText }])
      setLastAiMsg(aiText)
      setSpeakTarget(null)
      setLoading(false)
      inputRef.current?.focus()
    }, 600)
  }

  return (
    <div className="page-enter" style={{ padding:'2rem' }}>
      <h1 style={{ fontSize:'1.3rem', fontWeight:700, letterSpacing:2, marginBottom:'.25rem' }}>AI THREAT ANALYST</h1>
      <p style={{ color:'var(--text3)', fontSize:11, letterSpacing:2, marginBottom:'1.5rem' }}>POWERED BY VEMAR INTELLIGENCE</p>
      <div style={{ maxWidth:760, margin:'0 auto' }}>
        <div className="chat-messages" role="log" aria-live="polite">
          {msgs.map((m,i) => (
            <div key={i} className={`msg msg-${m.role}`}>
              <div className="msg-label">{m.role==='ai'?'VEMAR ANALYST':'YOU'}</div>
              <div className="msg-bubble" style={{ whiteSpace:'pre-wrap' }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="msg msg-ai">
              <div className="msg-label">VEMAR ANALYST</div>
              <div className="msg-bubble" style={{ display:'flex', gap:4, alignItems:'center' }}>
                <div className="dot"/><div className="dot"/><div className="dot"/>
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>
        {msgs.length===1 && (
          <div style={{ marginBottom:'1rem', display:'flex', flexWrap:'wrap', gap:6 }}>
            {QUICK.map(q => <button key={q} className="tag tag-cyan" onClick={()=>send(q)}>{q}</button>)}
          </div>
        )}
        <SarvamVoice
          onTranscript={(text) => { setInput(text); inputRef.current?.focus() }}
          textToSpeak={speakTarget}
          onSpeakDone={() => setSpeakTarget(null)}
        />
        {lastAiMsg && !speakTarget && (
          <button className="sv-use-btn" style={{ marginBottom:8 }} onClick={()=>setSpeakTarget(lastAiMsg)}>
            🔊 Listen to last response
          </button>
        )}
        <div className="chat-input-row">
          <label htmlFor="chat-input" className="sr-only">Message</label>
          <input id="chat-input" ref={inputRef} className="chat-input" type="text"
            placeholder="Ask about threats, detection, behavioral AI..."
            value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()} disabled={loading}/>
          <button className="chat-send" onClick={()=>send()} disabled={loading||!input.trim()}>SEND</button>
        </div>
        <p style={{ color:'var(--text3)', fontSize:10, marginTop:7, letterSpacing:1 }}>VEMAR Threat Intelligence · Always online</p>
      </div>
    </div>
  )
}
