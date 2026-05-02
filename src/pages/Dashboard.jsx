import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Dashboard.css'

const NAV_ITEMS = [
  { label: 'HOME', path: '/' },
  { label: 'DASHBOARD', path: '/dashboard' },
  { label: 'DETECT', path: '/detect' },
  { label: 'BEHAVIORAL', path: '/behavioral' },
  { label: 'IDENTITY', path: '/identity' },
  { label: 'AI ANALYST', path: '/chat' },
  { label: 'MARKET', path: '/market' },
  { label: 'PRICING', path: '/pricing' },
]

const BARS = [
  { day: 'MON', value: 55, today: false },
  { day: 'TUE', value: 80, today: false },
  { day: 'WED', value: 62, today: false },
  { day: 'THU', value: 88, today: false },
  { day: 'FRI', value: 72, today: false },
  { day: 'SAT', value: 48, today: false },
  { day: 'TODAY', value: 95, today: true },
]

const ALERTS = [
  { id: 1, title: 'Voice clone — Instagram DM', meta: '@user · 2 min ago', severity: 'CRITICAL', dot: 'red' },
  { id: 2, title: 'Deepfake video — YouTube', meta: 'Pending review · 14 min ago', severity: 'CRITICAL', dot: 'red' },
  { id: 3, title: 'Behavioral anomaly — Login', meta: 'Synthetic bot · 1hr ago', severity: 'HIGH', dot: 'amber' },
  { id: 4, title: 'Text impersonation — Telegram', meta: 'Phishing · 3hr ago', severity: 'MEDIUM', dot: 'green' },
]

const BREAKDOWN = [
  { label: 'Voice Clones', pct: 42, color: '#ff3b5c' },
  { label: 'Face Deepfakes', pct: 26, color: '#ffb700' },
  { label: 'Behavioral Fraud', pct: 19, color: '#00e5ff' },
  { label: 'Synthetic Identity', pct: 13, color: '#a855f7' },
]

const ACTIVITY = [
  { time: '02:14', action: 'AUTO-SCAN', detail: 'completed — 47 media items analyzed' },
  { time: '01:58', action: 'BEHAVIORAL ALERT', detail: '— bot-like typing pattern flagged' },
  { time: '01:32', action: 'TAKEDOWN FILED', detail: '— YouTube deepfake reported' },
  { time: '00:47', action: 'WATERMARK TRACED', detail: '— clone origin identified' },
]

function Navbar({ active }) {
  const navigate = useNavigate()
  return (
    <nav className="dash-nav">
      <Link to="/" className="nav-logo">
        <div className="logo-icon">🛡</div>
        <span className="logo-text">VEMAR<span>.AI</span></span>
      </Link>
      <div className="nav-links">
        {NAV_ITEMS.map(({ label, path }) => (
          <Link
            key={label}
            to={path}
            className={`nav-link ${path === active ? 'active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </div>
      <button className="btn-login" onClick={() => navigate('/auth')}>LOGIN</button>
    </nav>
  )
}

export default function Dashboard() {
  const [threats, setThreats] = useState(53)
  const [scans, setScans] = useState(1187)
  const [blocked, setBlocked] = useState(2109)
  const [refreshing, setRefreshing] = useState(false)

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => {
      setThreats(t => t + Math.floor(Math.random() * 3))
      setScans(s => s + Math.floor(Math.random() * 20))
      setRefreshing(false)
    }, 800)
  }

  return (
    <div className="dash-page">
      <Navbar active="/dashboard" />

      <main className="dash-main">
        {/* ── PAGE HEADER ── */}
        <div className="page-header">
          <div>
            <h1 className="page-title">THREAT DASHBOARD</h1>
            <p className="page-sub">LIVE MONITORING ACTIVE</p>
          </div>
          <div className="header-actions">
            <div className="live-badge">
              <span className="pulse-dot" />
              LIVE
            </div>
            <button className="btn-refresh" onClick={handleRefresh} disabled={refreshing}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5" strokeLinecap="round"/>
                <path d="M8 2.5l2 2-2 2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {refreshing ? 'REFRESHING...' : 'REFRESH'}
            </button>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="stats-row">
          <div className="stat-card red">
            <div className="stat-val red">{threats.toLocaleString()}</div>
            <div className="stat-label">ACTIVE THREATS</div>
            <div className="stat-delta delta-up">▲ 12% this week</div>
          </div>
          <div className="stat-card">
            <div className="stat-val cyan">{scans.toLocaleString()}</div>
            <div className="stat-label">SCANS TODAY</div>
            <div className="stat-delta delta-dn">▼ 3%</div>
          </div>
          <div className="stat-card">
            <div className="stat-val green">{blocked.toLocaleString()}</div>
            <div className="stat-label">BLOCKED / MONTH</div>
            <div className="stat-delta delta-dn">▼ 8%</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-val amber">99.4%</div>
            <div className="stat-label">ACCURACY</div>
            <div className="stat-delta delta-flat">— stable</div>
          </div>
          <div className="stat-card purple">
            <div className="stat-val purple">312</div>
            <div className="stat-label">BEHAVIORAL ALERTS</div>
            <div className="stat-delta delta-up">▲ 5%</div>
          </div>
        </div>

        {/* ── BOTTOM GRID ── */}
        <div className="content-grid">

          {/* LEFT COLUMN */}
          <div className="left-col">

            {/* CHART PANEL */}
            <div className="panel">
              <div className="panel-head">
                <span className="panel-title">DETECTION VOLUME — LAST 7 DAYS</span>
              </div>
              <div className="panel-body">
                <div className="bars">
                  {BARS.map(({ day, value, today }) => (
                    <div className="bar-col" key={day}>
                      <div
                        className={`bar ${today ? 'today' : ''}`}
                        style={{ height: `${value}%` }}
                        title={`${value} detections`}
                      />
                      <span className="bar-day">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ALERTS PANEL */}
            <div className="panel" style={{ marginTop: 20 }}>
              <div className="panel-head">
                <span className="panel-title">ACTIVE THREAT ALERTS</span>
              </div>
              <div className="alert-list">
                {ALERTS.map(alert => (
                  <div className="alert-item" key={alert.id}>
                    <div className="alert-left">
                      <span className={`alert-dot dot-${alert.dot}`} />
                      <div>
                        <div className="alert-title">{alert.title}</div>
                        <div className="alert-meta">{alert.meta}</div>
                      </div>
                    </div>
                    <span className={`badge badge-${alert.severity.toLowerCase()}`}>
                      {alert.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-col">

            {/* BREAKDOWN PANEL */}
            <div className="panel">
              <div className="panel-head">
                <span className="panel-title">BREAKDOWN BY TYPE</span>
              </div>
              <div className="panel-body">
                {BREAKDOWN.map(({ label, pct, color }) => (
                  <div className="breakdown-row" key={label}>
                    <div className="breakdown-top">
                      <span className="breakdown-label">{label}</span>
                      <span className="breakdown-pct" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="breakdown-track">
                      <div
                        className="breakdown-fill"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIVITY PANEL */}
            <div className="panel" style={{ marginTop: 20 }}>
              <div className="panel-head">
                <span className="panel-title">RECENT ACTIVITY</span>
              </div>
              <div className="panel-body activity-list">
                {ACTIVITY.map(({ time, action, detail }) => (
                  <div className="activity-row" key={time}>
                    <span className="activity-time">{time}</span>
                    <span className="activity-text">
                      <strong>{action}</strong>{detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
