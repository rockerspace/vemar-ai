import { useState } from 'react'
const THREATS = [
  { name: 'Voice clone — Instagram DM', meta: '@user · 2 min ago', level: 'CRITICAL', color: '#FF3D57' },
  { name: 'Deepfake video — YouTube', meta: 'Pending review · 14 min ago', level: 'CRITICAL', color: '#FF3D57' },
  { name: 'Behavioral anomaly — Login', meta: 'Synthetic bot · 1hr ago', level: 'HIGH', color: '#FFB300' },
  { name: 'Text impersonation — Telegram', meta: 'Phishing · 3hr ago', level: 'MEDIUM', color: '#00E676' },
]
const ACTIVITY = [
  { time: '02:14', text: '<strong>AUTO-SCAN</strong> completed — 47 media items analyzed' },
  { time: '01:58', text: '<strong>BEHAVIORAL ALERT</strong> — bot-like typing pattern flagged' },
  { time: '01:32', text: '<strong>TAKEDOWN FILED</strong> — YouTube deepfake reported' },
  { time: '00:47', text: '<strong>WATERMARK TRACED</strong> — clone origin identified' },
  { time: 'Yesterday', text: '<strong>IDENTITY GRAPH</strong> — 7-node fraud cluster flagged' },
]
const BARS = [42, 78, 55, 91, 64, 38, 76]
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'TODAY']

export default function Dashboard() {
  const [t, setT] = useState(47)
  const [s, setS] = useState('1,284')
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: 2 }}>THREAT DASHBOARD</div>
          <div style={{ color: 'var(--text3)', fontSize: 10, letterSpacing: 2, marginTop: 3 }}>LIVE MONITORING ACTIVE</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--green)', letterSpacing: 1 }}>
            <div className="pulse" /> LIVE
          </div>
          <button className="btn-primary" style={{ padding: '7px 16px', fontSize: 10 }} onClick={() => { setT(Math.floor(40 + Math.random() * 20)); setS((1100 + Math.floor(Math.random() * 400)).toLocaleString()) }}>⟳ REFRESH</button>
        </div>
      </div>
      <div className="metrics-row">
        {[
          { val: t, label: 'Active Threats', color: 'var(--red)', delta: '▲ 12% this week', cls: 'delta-up' },
          { val: s, label: 'Scans Today', color: 'var(--cyan)', delta: '▼ 3%', cls: 'delta-down' },
          { val: '2,109', label: 'Blocked / Month', color: 'var(--green)', delta: '▼ 8%', cls: 'delta-down' },
          { val: '99.4%', label: 'Accuracy', color: 'var(--amber)', delta: '─ stable', cls: '' },
          { val: '312', label: 'Behavioral Alerts', color: 'var(--purple)', delta: '▲ 5%', cls: 'delta-up' },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="metric-val" style={{ color: m.color }}>{m.val}</div>
            <div className="metric-label">{m.label}</div>
            <div className={`metric-delta ${m.cls}`}>{m.delta}</div>
          </div>
        ))}
      </div>
      <div className="dash-grid">
        <div>
          <div className="panel">
            <div className="panel-title">DETECTION VOLUME — LAST 7 DAYS</div>
            <div className="chart-bars">
              {BARS.map((v, i) => <div key={i} className={`bar ${i === 6 ? 'bar-red' : 'bar-cyan'}`} style={{ height: v + '%' }} />)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
              {DAYS.map(d => <span key={d} style={{ fontSize: 10, color: 'var(--text3)' }}>{d}</span>)}
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">ACTIVE THREAT ALERTS</div>
            {THREATS.map(t => (
              <div key={t.name} className="threat-item">
                <div className="threat-dot" style={{ background: t.color }} />
                <div className="threat-info"><div className="threat-name">{t.name}</div><div className="threat-meta">{t.meta}</div></div>
                <div className={`threat-level level-${t.level.toLowerCase()}`}>{t.level}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="panel">
            <div className="panel-title">BREAKDOWN BY TYPE</div>
            {[['Voice Clones', 42, 'var(--red)'], ['Face Deepfakes', 26, 'var(--amber)'], ['Behavioral Fraud', 19, 'var(--purple)'], ['Synthetic Identity', 13, 'var(--cyan)']].map(([l, p, c]) => (
              <div key={l} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: 'var(--text2)' }}>{l}</span>
                  <span style={{ color: c, fontWeight: 700 }}>{p}%</span>
                </div>
                <div style={{ height: 4, background: 'var(--border)' }}><div style={{ height: '100%', width: p + '%', background: c, opacity: .8 }} /></div>
              </div>
            ))}
          </div>
          <div className="panel">
            <div className="panel-title">RECENT ACTIVITY</div>
            {ACTIVITY.map((a, i) => (
              <div key={i} className="activity-item">
                <div className="act-time">{a.time}</div>
                <div className="act-text" dangerouslySetInnerHTML={{ __html: a.text }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
