import { useState, useEffect, useRef } from 'react'
const STEPS = [
  { num: '01', title: 'TYPING CADENCE ANALYSIS', desc: 'Keystroke timing, rhythm variance, and pause patterns. AI bots exhibit unnaturally consistent intervals.', status: 'PASS', cls: 'status-pass' },
  { num: '02', title: 'MOUSE DYNAMICS', desc: 'Cursor velocity, micro-tremors, and click pressure patterns unique to human motor control.', status: 'PASS', cls: 'status-pass' },
  { num: '03', title: 'INTERACTION ENTROPY', desc: 'Scroll behavior, focus shifts, navigation paths. Synthetic agents show low entropy.', status: 'SCANNING', cls: 'status-active' },
  { num: '04', title: 'DEVICE BIOMETRICS', desc: 'Gyroscope, accelerometer, touch pressure. Impossible for remote AI agents to replicate.', status: 'PENDING', cls: 'status-pending' },
  { num: '05', title: 'BEHAVIORAL RISK SCORE', desc: 'Aggregated fraud probability across all layers with configurable sensitivity thresholds.', status: 'PENDING', cls: 'status-pending' },
]
const CHALLENGES = ['K7-X2-9M', 'ALPHA-42', 'ZX-9-PQ', '73-DELTA', 'NEON-X8', 'QR-21-KL']
function BehavioralTab() {
  const [active, setActive] = useState(0)
  const [risk, setRisk] = useState(12)
  const riskColor = risk < 30 ? 'var(--green)' : risk < 60 ? 'var(--amber)' : 'var(--red)'
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      <div>
        <p style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.7, marginBottom: '1.5rem' }}>VEMAR's Behavioral AI monitors real-time interaction patterns to detect AI-driven or synthetic identity fraud through multi-layer behavioral fingerprinting.</p>
        <div>{STEPS.map((s, i) => (
          <div key={s.num} className={`verify-step ${active === i ? 'active' : ''}`} onClick={() => setActive(i)}>
            <div className="step-num">{s.num}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
            <div className={`step-status ${s.cls}`}>{s.status}</div>
          </div>
        ))}</div>
      </div>
      <div>
        <div className="panel">
          <div className="panel-title">RISK SCORE MONITOR</div>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '4rem', fontWeight: 700, color: riskColor }}>{risk}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 2 }}>RISK SCORE / 100</div>
            <div style={{ marginTop: '1rem', height: 8, background: 'var(--border)' }}>
              <div style={{ height: '100%', width: risk + '%', background: `linear-gradient(90deg,var(--green),var(--amber))`, transition: 'width 1s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)', marginTop: 4 }}><span>LOW RISK</span><span>HIGH RISK</span></div>
          </div>
          {[['Typing Cadence', 'HUMAN ✓', 'var(--green)'], ['Mouse Dynamics', 'HUMAN ✓', 'var(--green)'], ['Interaction Entropy', 'ANALYZING…', 'var(--amber)'], ['Device Biometrics', 'AWAITING', 'var(--text3)']].map(([l, v, c]) => (
            <div key={l} className="breakdown-row"><span className="breakdown-label">{l}</span><span className="breakdown-val" style={{ color: c, fontSize: 12 }}>{v}</span></div>
          ))}
          <button className="analyze-btn" onClick={() => setRisk(Math.floor(Math.random() * 100))}>SIMULATE DETECTION</button>
        </div>
      </div>
    </div>
  )
}
function ChallengeTab() {
  const [code, setCode] = useState('K7-X2-9M')
  const [timeLeft, setTimeLeft] = useState(15)
  const [input, setInput] = useState('')
  const [res, setRes] = useState(null)
  const [log, setLog] = useState([
    { time: '02:14', text: '<strong>PASSED</strong> — Visual code in 3.2s', pass: true },
    { time: '01:55', text: '<strong style="color:var(--red)">FAILED</strong> — Timeout (bot)', pass: false },
  ])
  const tmr = useRef()
  const start = (c = code) => {
    clearInterval(tmr.current); setTimeLeft(15); setRes(null); setInput('')
    tmr.current = setInterval(() => setTimeLeft(p => { if (p <= 1) { clearInterval(tmr.current); done(false, 'TIMEOUT — BOT DETECTED'); return 0 } return p - 1 }), 1000)
  }
  const done = (pass, msg) => {
    clearInterval(tmr.current); setRes({ pass, msg })
    const now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
    setLog(p => [{ time: now, text: `<strong>${pass ? 'PASSED' : 'FAILED'}</strong> — ${msg}`, pass }, ...p.slice(0, 4)])
  }
  useEffect(() => { start(); return () => clearInterval(tmr.current) }, [])
  const handleInput = e => { const v = e.target.value.toUpperCase(); setInput(v); if (v.trim() === code) done(true, 'CHALLENGE PASSED — HUMAN VERIFIED') }
  const newChallenge = () => { const c = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]; setCode(c); start(c) }
  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <p style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.7, marginBottom: '1.5rem' }}>Live Challenge Authentication presents real-time dynamic challenges trivial for humans but unsolvable by AI agents in the allotted time window.</p>
      <div className="panel">
        <div className="panel-title">CHALLENGE TYPE: <span style={{ color: 'var(--cyan)' }}>VISUAL PATTERN</span></div>
        <div className="challenge-box">
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: '.5rem' }}>TYPE THE CODE WITHIN <span style={{ color: 'var(--cyan)' }}>{timeLeft}s</span></div>
          <div className="challenge-code">{code}</div>
          <div className="challenge-bar"><div className="challenge-fill" style={{ width: (timeLeft / 15 * 100) + '%' }} /></div>
          <input type="text" className="form-input" style={{ marginTop: '1rem', textAlign: 'center', letterSpacing: 6, fontSize: 18, textTransform: 'uppercase' }} placeholder="ENTER CODE" maxLength={10} value={input} onChange={handleInput} />
          {res && <div style={{ padding: '1rem', border: '1px solid', marginTop: '1rem', fontSize: 13, fontWeight: 700, letterSpacing: 1 }} className={res.pass ? 'challenge-pass' : 'challenge-fail'}>{res.msg}</div>}
        </div>
        <button className="analyze-btn" onClick={newChallenge}>GENERATE NEW CHALLENGE</button>
      </div>
      <div className="panel">
        <div className="panel-title">CHALLENGE LOG</div>
        {log.map((l, i) => <div key={i} className="activity-item"><div className="act-time">{l.time}</div><div className="act-text" dangerouslySetInnerHTML={{ __html: l.text }} /></div>)}
      </div>
    </div>
  )
}
export default function Behavioral() {
  const [tab, setTab] = useState('analysis')
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: 2, marginBottom: '.25rem' }}>BEHAVIORAL AI VERIFICATION</div>
      <div style={{ color: 'var(--text3)', fontSize: 11, letterSpacing: 2, marginBottom: '1.5rem' }}>DETECT SYNTHETIC IDENTITY FRAUD THROUGH BEHAVIOR PATTERNS</div>
      <div className="tabs">
        <button className={`tab ${tab === 'analysis' ? 'active' : ''}`} onClick={() => setTab('analysis')}>BEHAVIORAL ANALYSIS</button>
        <button className={`tab ${tab === 'challenge' ? 'active' : ''}`} onClick={() => setTab('challenge')}>LIVE CHALLENGE AUTH</button>
      </div>
      {tab === 'analysis' ? <BehavioralTab /> : <ChallengeTab />}
    </div>
  )
}
