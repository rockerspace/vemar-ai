import { useState } from 'react'
import { AnimatedCounter, LiveDot, showToast } from '../components/UIComponents'

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
  const [s, setS] = useState(1284)
  const [refreshKey, setRefreshKey] = useState(0)

  const doRefresh = () => {
    setT(Math.floor(40 + Math.random() * 20))
    setS(1100 + Math.floor(Math.random() * 400))
    setRefreshKey(k => k + 1)
    showToast('Dashboard refreshed', 'success')
  }

  const metrics = [
    { val: t, label: 'Active Threats', color: 'var(--red)', delta: '▲ 12% this week', cls: 'delta-up' },
    { val: s, label: 'Scans Today', color: 'var(--cyan)', delta: '▼ 3%', cls: 'delta-down' },
    { val: 2109, label: 'Blocked / Month', color: 'var(--green)', delta: '▼ 8%', cls: 'delta-down' },
    { val: '99.4', label: 'Accuracy', color: 'var(--amber)', delta: '─ stable', cls: '', suffix: '%' },
    { val: 312, label: 'Behavioral Alerts', color: 'var(--purple)', delta: '▲ 5%', cls: 'delta-up' },
  ]

  return (
    <div className="page-enter" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: 2 }}>THREAT DASHBOARD</h1>
          <p style={{ color: 'var(--text3)', fontSize: 10, letterSpacing: 2, marginTop: 3 }}>LIVE MONITORING ACTIVE</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LiveDot label="LIVE" />
          <button
            className="btn-primary"
            style={{ padding: '7px 16px', fontSize: 10 }}
            onClick={doRefresh}
            aria-label="Refresh dashboard data"
          >
            ⟳ REFRESH
          </button>
        </div>
      </div>

      {/* Metrics */}
      <section
        className="metrics-row"
        aria-label="Key metrics"
      >
        {metrics.map((m, i) => (
          <article
            key={m.label}
            className={`metric-card fade-in fade-in-${i + 1}`}
            aria-label={`${m.label}: ${m.val}${m.suffix || ''}`}
          >
            <div className="metric-val" style={{ color: m.color }}>
              <AnimatedCounter key={refreshKey + m.label} target={m.val} suffix={m.suffix || ''} />
            </div>
            <div className="metric-label">{m.label}</div>
            <div className={`metric-delta ${m.cls}`} aria-label={`Trend: ${m.delta}`}>{m.delta}</div>
          </article>
        ))}
      </section>

      <div className="dash-grid">
        <div>
          {/* Chart */}
          <section className="panel" aria-label="Detection volume last 7 days">
            <h2 className="panel-title">DETECTION VOLUME — LAST 7 DAYS</h2>
            <div
              className="chart-bars"
              role="img"
              aria-label={`Bar chart: ${BARS.map((v, i) => `${DAYS[i]}: ${v}`).join(', ')}`}
            >
              {BARS.map((v, i) => (
                <div
                  key={i}
                  className={`bar ${i === 6 ? 'bar-red' : 'bar-cyan'}`}
                  style={{ height: `${v}%` }}
                  title={`${DAYS[i]}: ${v} detections`}
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }} aria-hidden="true">
              {DAYS.map(d => <span key={d} style={{ fontSize: 10, color: 'var(--text3)' }}>{d}</span>)}
            </div>
          </section>

          {/* Threats */}
          <section className="panel" aria-label="Active threat alerts" aria-live="polite">
            <h2 className="panel-title">ACTIVE THREAT ALERTS</h2>
            <ul style={{ listStyle: 'none' }}>
              {THREATS.map(t => (
                <li key={t.name} className="threat-item">
                  <span className="threat-dot" style={{ background: t.color }} aria-hidden="true" />
                  <div className="threat-info">
                    <div className="threat-name">{t.name}</div>
                    <div className="threat-meta">{t.meta}</div>
                  </div>
                  <span
                    className={`threat-level level-${t.level.toLowerCase()}`}
                    aria-label={`Threat level: ${t.level}`}
                  >
                    {t.level}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div>
          {/* Breakdown */}
          <section className="panel" aria-label="Breakdown by threat type">
            <h2 className="panel-title">BREAKDOWN BY TYPE</h2>
            {[['Voice Clones', 42, 'var(--red)'], ['Face Deepfakes', 26, 'var(--amber)'], ['Behavioral Fraud', 19, 'var(--purple)'], ['Synthetic Identity', 13, 'var(--cyan)']].map(([l, p, c]) => (
              <div key={l} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: 'var(--text2)' }}>{l}</span>
                  <span style={{ color: c, fontWeight: 700 }}>{p}%</span>
                </div>
                <div
                  style={{ height: 4, background: 'var(--border)' }}
                  role="meter"
                  aria-valuenow={p}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${l}: ${p}%`}
                >
                  <div style={{ height: '100%', width: `${p}%`, background: c, opacity: .8, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </section>

          {/* Activity */}
          <section className="panel" aria-label="Recent activity log" aria-live="polite" aria-atomic="false">
            <h2 className="panel-title">RECENT ACTIVITY</h2>
            <ul style={{ listStyle: 'none' }}>
              {ACTIVITY.map((a, i) => (
                <li key={i} className="activity-item">
                  <time className="act-time">{a.time}</time>
                  <div className="act-text" dangerouslySetInnerHTML={{ __html: a.text }} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
