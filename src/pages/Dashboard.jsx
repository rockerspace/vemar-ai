import { useState, useEffect } from 'react'
import { AnimatedCounter, LiveDot, showToast } from '../components/UIComponents'

// ─── Stable, internally-consistent base metrics ──────────────────────────────
// All numbers relate to each other (threats < scans, accuracy is high, etc.)
// Refresh adds small deltas so numbers feel live but stay coherent.
const BASE_METRICS = {
  threats:   53,
  scans:     3847,
  blocked:   2109,
  accuracy:  99.4,
  behavioral: 312,
}

const THREATS = [
  { name: 'Voice clone — Instagram DM',    meta: '@user · 2 min ago',       level: 'CRITICAL', color: 'var(--red)'   },
  { name: 'Deepfake video — YouTube',      meta: 'Pending review · 14 min ago', level: 'CRITICAL', color: 'var(--red)'   },
  { name: 'Behavioral anomaly — Login',    meta: 'Synthetic bot · 1hr ago', level: 'HIGH',     color: 'var(--amber)' },
  { name: 'Text impersonation — Telegram', meta: 'Phishing · 3hr ago',      level: 'MEDIUM',   color: 'var(--green)' },
]

const ACTIVITY = [
  { time: '02:14',     bold: 'AUTO-SCAN',       rest: ' completed — 47 media items analyzed'          },
  { time: '01:58',     bold: 'BEHAVIORAL ALERT', rest: ' — bot-like typing pattern flagged'            },
  { time: '01:32',     bold: 'TAKEDOWN FILED',   rest: ' — YouTube deepfake reported'                  },
  { time: '00:47',     bold: 'WATERMARK TRACED', rest: ' — clone origin identified'                    },
  { time: 'Yesterday', bold: 'IDENTITY GRAPH',   rest: ' — 7-node fraud cluster flagged'               },
]

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'TODAY']
// Weekly scan volumes — last value matches BASE_METRICS.scans for TODAY
const BASE_BARS = [42, 78, 55, 91, 64, 38, 76]

const BREAKDOWN = [
  { label: 'Voice Clones',       pct: 42, color: 'var(--red)'    },
  { label: 'Face Deepfakes',     pct: 26, color: 'var(--amber)'  },
  { label: 'Behavioral Fraud',   pct: 19, color: 'var(--purple)' },
  { label: 'Synthetic Identity', pct: 13, color: 'var(--cyan)'   },
]

export default function Dashboard() {
  const [loading,      setLoading]      = useState(true)
  const [metrics,      setMetrics]      = useState(BASE_METRICS)
  const [refreshKey,   setRefreshKey]   = useState(0)
  const [bars,         setBars]         = useState(BASE_BARS)
  const [barsVisible,  setBarsVisible]  = useState(false)

  // Simulate initial data load
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false)
      setTimeout(() => setBarsVisible(true), 100)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  // Live tick — increments scans slowly, occasionally bumps threats
  useEffect(() => {
    if (loading) return
    const id = setInterval(() => {
      setMetrics(m => ({
        ...m,
        scans:    m.scans + Math.floor(Math.random() * 3),
        threats:  m.threats + (Math.random() > 0.75 ? 1 : 0),
        blocked:  m.blocked + (Math.random() > 0.8  ? 1 : 0),
      }))
    }, 4000)
    return () => clearInterval(id)
  }, [loading])

  function doRefresh() {
    setMetrics({
      threats:   BASE_METRICS.threats   + Math.floor(Math.random() * 15),
      scans:     BASE_METRICS.scans     + Math.floor(Math.random() * 300),
      blocked:   BASE_METRICS.blocked   + Math.floor(Math.random() * 50),
      accuracy:  +(99.1 + Math.random() * 0.5).toFixed(1),
      behavioral: BASE_METRICS.behavioral + Math.floor(Math.random() * 20),
    })
    setBars(BASE_BARS.map(b => Math.max(15, b + Math.floor((Math.random() - 0.5) * 20))))
    setRefreshKey(k => k + 1)
    showToast('Dashboard refreshed', 'success')
  }

  const metricCards = [
    { val: metrics.threats,   label: 'Active Threats',    color: 'var(--red)',    delta: '▲ 12% this week', up: true  },
    { val: metrics.scans,     label: 'Scans Today',       color: 'var(--cyan)',   delta: '▲ 3%',            up: true  },
    { val: metrics.blocked,   label: 'Blocked / Month',   color: 'var(--green)',  delta: '▼ 8%',            up: false },
    { val: metrics.accuracy,  label: 'Accuracy',          color: 'var(--amber)',  delta: '─ stable',         up: null, suffix: '%' },
    { val: metrics.behavioral, label: 'Behavioral Alerts', color: 'var(--purple)', delta: '▲ 5%',           up: true  },
  ]

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" />
          <p style={{ marginTop: '1rem', color: 'var(--text3)', fontSize: 11, letterSpacing: 2 }}>
            LOADING THREAT DATA...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter" style={{ padding: '2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: 2 }}>THREAT DASHBOARD</h1>
          <p style={{ color: 'var(--text3)', fontSize: 10, letterSpacing: 2, marginTop: 3 }}>LIVE MONITORING ACTIVE</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <LiveDot label="LIVE" />
          <button className="btn-primary" style={{ padding: '7px 16px', fontSize: 10 }} onClick={doRefresh}>
            ⟳ REFRESH
          </button>
        </div>
      </div>

      {/* Metrics */}
      <section className="metrics-row" aria-label="Key metrics">
        {metricCards.map((m, i) => (
          <article key={m.label} className={`metric-card fade-in fade-in-${i + 1}`}>
            <div className="metric-val" style={{ color: m.color }}>
              <AnimatedCounter key={refreshKey + m.label} target={m.val} suffix={m.suffix || ''} />
            </div>
            <div className="metric-label">{m.label}</div>
            <div style={{
              fontSize: 10, marginTop: 4, letterSpacing: 1,
              color: m.up === true ? 'var(--red)' : m.up === false ? 'var(--green)' : 'var(--text3)'
            }}>{m.delta}</div>
          </article>
        ))}
      </section>

      <div className="dash-grid">
        {/* Left column */}
        <div>

          {/* Chart */}
          <section className="panel" aria-label="Detection volume last 7 days">
            <h2 className="panel-title">DETECTION VOLUME — LAST 7 DAYS</h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160, marginTop: '0.75rem', padding: '0 4px', position: 'relative' }}>
              {[25, 50, 75, 100].map(pct => (
                <div key={pct} style={{ position: 'absolute', left: 0, right: 0, bottom: `${pct}%`, height: 1, background: 'var(--border)', opacity: 0.4, pointerEvents: 'none' }} />
              ))}
              {bars.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      width: '100%',
                      height: barsVisible ? `${v}%` : '0%',
                      background: i === 6 ? 'linear-gradient(to top, #cc1a2e, var(--red))' : 'linear-gradient(to top, var(--cyan2), var(--cyan))',
                      opacity: i === 6 ? 0.9 : 0.8,
                      borderRadius: '2px 2px 0 0',
                      transition: `height 0.8s ease ${i * 0.08}s`,
                      cursor: 'pointer',
                      minHeight: 4,
                    }}
                    title={`${DAYS[i]}: ${v} detections`}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'brightness(1.15)' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = i === 6 ? '0.9' : '0.8'; e.currentTarget.style.filter = 'none' }}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 6 }}>
              {DAYS.map(d => (
                <span key={d} style={{ fontSize: 10, color: d === 'TODAY' ? 'var(--red)' : 'var(--text3)', letterSpacing: 1, flex: 1, textAlign: 'center' }}>{d}</span>
              ))}
            </div>
          </section>

          {/* Threat alerts */}
          <section className="panel" aria-label="Active threat alerts">
            <h2 className="panel-title">ACTIVE THREAT ALERTS</h2>
            <ul style={{ listStyle: 'none' }}>
              {THREATS.map(t => (
                <li key={t.name} className="threat-item">
                  <span className="threat-dot" style={{ background: t.color }} />
                  <div className="threat-info">
                    <div className="threat-name">{t.name}</div>
                    <div className="threat-meta">{t.meta}</div>
                  </div>
                  <span className={`threat-level level-${t.level.toLowerCase()}`}>{t.level}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right column */}
        <div>

          {/* Breakdown */}
          <section className="panel" aria-label="Breakdown by threat type">
            <h2 className="panel-title">BREAKDOWN BY TYPE</h2>
            {BREAKDOWN.map(({ label, pct, color }) => (
              <div key={label} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)', letterSpacing: 0.5 }}>{label}</span>
                  <span style={{ fontSize: 12, color, fontWeight: 700, letterSpacing: 1 }}>{pct}%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, opacity: 0.85, transition: 'width 1.2s ease' }} />
                </div>
              </div>
            ))}
          </section>

          {/* Recent activity */}
          <section className="panel" aria-label="Recent activity log">
            <h2 className="panel-title">RECENT ACTIVITY</h2>
            <ul style={{ listStyle: 'none' }}>
              {ACTIVITY.map((a, i) => (
                <li key={i} className="activity-item">
                  <time className="act-time">{a.time}</time>
                  <div className="act-text" style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--cyan)' }}>{a.bold}</strong>
                    {a.rest}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
