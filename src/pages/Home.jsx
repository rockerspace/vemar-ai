import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

const FEATURES = [
  { icon: '🎙', title: 'VOICE CLONE DETECTION', desc: 'Spectral fingerprinting & neural waveform analysis. Detects ElevenLabs, Murf, and all major synthesizers with 95%+ accuracy.', to: '/detect', badge: false },
  { icon: '🎭', title: 'DEEPFAKE DETECTION', desc: 'Deep artifact analysis, temporal consistency checks, and micro-expression validation to expose face & video manipulation.', to: '/detect', badge: false },
  { icon: '🧬', title: 'BEHAVIORAL AI VERIFICATION', desc: 'Analyzes typing cadence, mouse dynamics & interaction rhythms to detect synthetic behavioral impersonation.', to: '/behavioral', badge: true },
  { icon: '🔐', title: 'LIVE CHALLENGE AUTH', desc: 'Real-time liveness challenges impossible for AI agents to pass. Dynamic prompts, timing analysis, entropy scoring.', to: '/behavioral', badge: true },
  { icon: '🕸', title: 'AI IDENTITY GRAPHS', desc: 'Maps relationships between identities, devices & accounts to surface synthetic identity networks and fraud rings.', to: '/identity', badge: true },
  { icon: '💧', title: 'CONTENT WATERMARKING', desc: 'Invisible cryptographic watermarks embedded in your media. Trace unauthorized AI-generated copies back to their origin.', to: '/identity', badge: true },
  { icon: '📡', title: 'REAL-TIME MONITORING', desc: 'Continuous scanning of social media, video platforms & comms channels. Instant alerts on identity attack detection.', to: '/dashboard', badge: false },
  { icon: '🧠', title: 'CLAUDE AI ANALYST', desc: 'Powered by Claude. Explains detections, advises response strategy, generates takedown reports and threat summaries.', to: '/chat', badge: false },
]
const STATS = [
  { label: 'Video Deepfakes', val: 98, color: 'var(--red)' },
  { label: 'Image Deepfakes', val: 96, color: 'var(--amber)' },
  { label: 'Audio Deepfakes', val: 95, color: 'var(--cyan)' },
  { label: 'Behavioral Fraud', val: 91, color: 'var(--purple)' },
  { label: 'Synthetic Identity', val: 89, color: 'var(--green)' },
]
const ROADMAP = [
  { phase: 'PHASE 1', title: 'MVP DEVELOPMENT', period: '0 – 6 Months', items: ['Core detection engine build', 'Behavioral AI module', 'Live challenge auth system', 'Beta testing with 50 partners'], highlight: false },
  { phase: 'PHASE 2', title: 'LAUNCH & ACQUIRE', period: '6 – 12 Months', items: ['Public product launch', 'Enterprise sales pipeline', 'API marketplace listing', 'First 500 paying customers'], highlight: true },
  { phase: 'PHASE 3', title: 'SCALE & EXPAND', period: 'Year 2+', items: ['Web3 / Blockchain identity', 'AI misinformation detection', 'Government partnerships', 'Global expansion'], highlight: false },
]

export default function Home() {
  const navigate = useNavigate()
  return (
    <>
      <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '4rem 2rem' }}>
        <div className="grid-bg" />
        <div className="scan-line" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 820 }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Logo size={110} style={{ filter: 'drop-shadow(0 0 28px rgba(0,229,255,0.4))' }} />
          </div>
          <div style={{ display: 'inline-block', border: '1px solid var(--cyan3)', color: 'var(--cyan)', fontSize: 11, letterSpacing: 3, padding: '5px 14px', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            AI CLONE DEFENSE SYSTEM v2.5 — Powered by Claude
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,6vw,4rem)', fontWeight: 700, letterSpacing: 2, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            DETECT. DEFEND.<br /><span style={{ color: 'var(--cyan)' }}>DESTROY CLONES.</span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.8, maxWidth: 560, margin: '0 auto 2.5rem' }}>
            Real-time AI-powered detection of voice cloning, deepfakes, synthetic identities, and behavioral fraud. Protect people, brands, and governments — before damage is done.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/detect')}>RUN DETECTION</button>
            <button className="btn-outline" onClick={() => navigate('/behavioral')}>BEHAVIORAL AI</button>
            <button className="btn-outline" onClick={() => navigate('/chat')}>AI ANALYST</button>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', marginTop: '3.5rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
            {[['99.4%', 'Detection Accuracy'], ['$500B+', 'Market by 2028'], ['$20B+', 'Fraud Losses/yr'], ['2.1M+', 'Threats Blocked']].map(([n, l]) => (
              <div key={l}><div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--cyan)' }}>{n}</div><div style={{ color: 'var(--text3)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginTop: 4 }}>{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <div className="section-tag">CAPABILITIES</div>
          <h2 className="section-title">Full-Spectrum Clone Defense</h2>
          <p className="section-sub">VEMAR.AI deploys multi-layered neural analysis across all identity attack surfaces.</p>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card" onClick={() => navigate(f.to)}>
                {f.badge && <div className="new-badge">NEW</div>}
                <div style={{ fontSize: 26, marginBottom: '.75rem' }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, marginBottom: '.5rem' }}>{f.title}</div>
                <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="section-tag">DETECTION ACCURACY</div>
          <h2 className="section-title">Verified Performance</h2>
          <div style={{ maxWidth: 500, marginTop: '2rem' }}>
            {STATS.map(s => (
              <div key={s.label} className="stat-bar-row">
                <span className="stat-bar-label">{s.label}</span>
                <div className="stat-bar-track"><div className="stat-bar-fill" style={{ width: s.val + '%', background: s.color }} /></div>
                <span className="stat-bar-val" style={{ color: s.color }}>{s.val}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <div className="section-tag">ROADMAP</div>
          <h2 className="section-title">Go-To-Market Strategy</h2>
          <div className="roadmap">
            {ROADMAP.map(r => (
              <div key={r.phase} className="road-card" style={r.highlight ? { borderLeft: '2px solid var(--cyan)' } : {}}>
                <div className="road-phase">{r.phase}</div>
                <div className="road-title">{r.title}</div>
                <div className="road-period">{r.period}</div>
                {r.items.map(i => <div key={i} className="road-item">{i}</div>)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer>
        <div>VEMAR.AI © 2026 — AI-POWERED DIGITAL IDENTITY DEFENSE</div>
        <nav aria-label="Footer navigation" style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'MARKET', to: '/market' },
            { label: 'PRICING', to: '/pricing' },
            { label: 'PRIVACY', to: '/privacy' },
            { label: 'TERMS', to: '/terms' },
            { label: 'API DOCS', to: '/api-docs' },
          ].map(({ label, to }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 11, letterSpacing: 1, padding: '2px 0', transition: 'color .2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
              onMouseLeave={e => e.target.style.color = 'var(--text3)'}
            >
              {label}
            </button>
          ))}
        </nav>
      </footer>
    </>
  )
}
