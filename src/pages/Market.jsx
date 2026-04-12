const FRAUD = [150, 300, 500, 700, 850, 1000]
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN']
const MAX = Math.max(...FRAUD)
const TEAM = [
  { abbr: 'CEO', role: 'Cybersecurity & AI Fraud Prevention', desc: '10+ years in enterprise security, identity fraud prevention, and AI product leadership.', bg: 'rgba(0,229,255,.1)', c: 'var(--cyan)' },
  { abbr: 'CTO', role: 'AI/ML · Deepfake Detection', desc: 'Specialist in neural network architectures for biometric and synthetic media analysis.', bg: 'rgba(179,136,255,.1)', c: 'var(--purple)' },
  { abbr: 'ENG', role: 'Biometric Security Systems', desc: 'Expert in behavioral biometrics, liveness detection, and cryptographic identity systems.', bg: 'rgba(0,230,118,.1)', c: 'var(--green)' },
  { abbr: 'BIZ', role: 'Fintech & B2B Sales', desc: 'Background in enterprise SaaS sales across fintech, insurtech, and government sectors.', bg: 'rgba(255,179,0,.1)', c: 'var(--amber)' },
]
export default function Market() {
  return (
    <div className="section">
      <div className="container">
        <div className="section-tag">MARKET OPPORTUNITY</div>
        <h2 className="section-title">A $500B+ Cybersecurity Market</h2>
        <p className="section-sub">Synthetic identity fraud is the fastest-growing segment of cybercrime, driven by the democratization of AI generative tools.</p>
        <div className="market-grid">
          {[['$500B+', 'Global Cybersecurity Market by 2028'], ['$20B+', 'Annual Synthetic Identity Fraud Losses'], ['900%', 'Deepfake Incident Growth (2019–2024)'], ['78%', 'Enterprises Lack AI Clone Detection']].map(([v, l]) => (
            <div key={l} className="market-card"><div className="market-val">{v}</div><div className="market-label">{l}</div></div>
          ))}
        </div>
        <div className="panel" style={{ marginTop: '2rem' }}>
          <div className="panel-title">FRAUD ATTEMPTS DETECTED OVER TIME (VEMAR NETWORK)</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, marginTop: '.5rem' }}>
            {FRAUD.map((v, i) => <div key={i} style={{ flex: 1, background: 'var(--cyan)', opacity: .4 + i * .1, height: (v / MAX * 100) + '%' }} />)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            {MONTHS.map(m => <span key={m} style={{ fontSize: 10, color: 'var(--text3)' }}>{m}</span>)}
          </div>
        </div>
        <div className="panel" style={{ marginTop: '1rem' }}>
          <div className="panel-title">SEED ROUND — $2M ALLOCATION</div>
          <div style={{ marginTop: '.5rem' }}>
            {[['AI Model Development', '$700K', 35, 'var(--cyan)'], ['AI Talent Hiring', '$500K', 25, 'var(--purple)'], ['Go-To-Market', '$500K', 25, 'var(--amber)'], ['Compliance', '$300K', 15, 'var(--green)']].map(([l, v, p, c]) => (
              <div key={l} className="stat-bar-row">
                <span className="stat-bar-label">{l}</span>
                <div className="stat-bar-track"><div className="stat-bar-fill" style={{ width: p + '%', background: c }} /></div>
                <span className="stat-bar-val" style={{ color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '3rem' }}>
          <div className="section-tag">TEAM</div>
          <h2 className="section-title">Leadership</h2>
          <div className="team-grid">
            {TEAM.map(t => (
              <div key={t.abbr} className="team-card">
                <div className="team-avatar" style={{ background: t.bg, color: t.c }}>{t.abbr}</div>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, marginBottom: '.25rem' }}>{t.abbr === 'CEO' ? 'CHIEF EXECUTIVE' : t.abbr === 'CTO' ? 'CHIEF TECHNOLOGY' : t.abbr === 'ENG' ? 'LEAD ENGINEER' : 'HEAD OF GROWTH'}</div>
                <div style={{ color: t.c, fontSize: 11, letterSpacing: 2, marginBottom: '.5rem' }}>{t.role}</div>
                <div style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.6 }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
