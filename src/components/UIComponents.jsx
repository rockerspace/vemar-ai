import { useState, useEffect, useRef } from 'react'

/* ─── Animated Counter ───────────────────────────────────── */
export function AnimatedCounter({ target, duration = 1200, suffix = '' }) {
  const [val, setVal] = useState(0)
  const start = useRef(null)
  useEffect(() => {
    const num = parseFloat(String(target).replace(/[^0-9.]/g, ''))
    const isFloat = String(target).includes('.')
    const decimals = isFloat ? (String(target).split('.')[1]?.length || 1) : 0
    const tick = (ts) => {
      if (!start.current) start.current = ts
      const prog = Math.min((ts - start.current) / duration, 1)
      const eased = 1 - Math.pow(1 - prog, 3)
      const cur = isFloat ? (eased * num).toFixed(decimals) : Math.floor(eased * num)
      setVal(cur)
      if (prog < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return <span aria-label={`${target}${suffix}`}>{val}{suffix}</span>
}

/* ─── Threat Ticker Tape ─────────────────────────────────── */
const TICKER_ITEMS = [
  '⚠ Voice clone detected — Instagram · 2m ago',
  '🔴 Deepfake video — YouTube · 14m ago',
  '🟡 Behavioral anomaly — Login attempt · 1h ago',
  '⚠ Synthetic identity cluster — 7 nodes · 3h ago',
  '🔴 AI-generated audio — Telegram · 5h ago',
  '✓ Watermark traced — TikTok clone confirmed · 6h ago',
]
export function ThreatTicker() {
  return (
    <div
      className="threat-ticker"
      role="marquee"
      aria-label="Live threat feed"
      aria-live="polite"
    >
      <div className="ticker-inner" aria-hidden="true">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="ticker-item">{item}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── Live Dot ───────────────────────────────────────────── */
export function LiveDot({ label = 'LIVE', color = 'var(--green)' }) {
  return (
    <div
      className="live-dot-wrap"
      role="status"
      aria-label={`Status: ${label}`}
    >
      <span className="pulse" style={{ background: color }} aria-hidden="true" />
      <span style={{ fontSize: 11, color, letterSpacing: 1 }}>{label}</span>
    </div>
  )
}

/* ─── Scan Progress Bar ──────────────────────────────────── */
export function ScanProgress({ progress, status }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Scan progress: ${progress}%`}
    >
      <div className="scan-progress-track">
        <div
          className="scan-progress-fill"
          style={{ width: `${progress}%` }}
        />
        <div
          className="scan-progress-glow"
          style={{ left: `${Math.max(0, progress - 2)}%` }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 1 }}>{status}</span>
        <span style={{ fontSize: 11, color: 'var(--cyan)', fontWeight: 700 }}>{progress}%</span>
      </div>
    </div>
  )
}

/* ─── Skeleton Loader ────────────────────────────────────── */
export function Skeleton({ width = '100%', height = 16, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, ...style }}
      aria-hidden="true"
      role="presentation"
    />
  )
}

/* ─── Toast Notification ─────────────────────────────────── */
let toastId = 0
const toastListeners = []
export function showToast(msg, type = 'info') {
  toastListeners.forEach(fn => fn({ id: toastId++, msg, type }))
}
export function ToastContainer() {
  const [toasts, setToasts] = useState([])
  useEffect(() => {
    const fn = (t) => {
      setToasts(p => [...p, t])
      setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3500)
    }
    toastListeners.push(fn)
    return () => { const i = toastListeners.indexOf(fn); if (i > -1) toastListeners.splice(i, 1) }
  }, [])
  return (
    <div
      className="toast-container"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} role="alert">
          {t.msg}
        </div>
      ))}
    </div>
  )
}

/* ─── Accessible Icon Button ─────────────────────────────── */
export function IconBtn({ icon, label, onClick, disabled, style = {} }) {
  return (
    <button
      className="icon-btn"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      style={style}
    >
      {icon}
    </button>
  )
}

/* ─── Status Badge ───────────────────────────────────────── */
export function StatusBadge({ level }) {
  const map = {
    CRITICAL: { bg: 'rgba(255,61,87,.15)', color: 'var(--red)', border: 'var(--red2)' },
    HIGH: { bg: 'rgba(255,179,0,.12)', color: 'var(--amber)', border: 'var(--amber2)' },
    MEDIUM: { bg: 'rgba(0,230,118,.1)', color: 'var(--green)', border: 'var(--green2)' },
    LOW: { bg: 'rgba(0,229,255,.08)', color: 'var(--cyan)', border: 'var(--cyan3)' },
  }
  const s = map[level] || map.LOW
  return (
    <span
      className="status-badge"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
      role="status"
      aria-label={`Threat level: ${level}`}
    >
      {level}
    </span>
  )
}

/* ─── Focus Ring Enhancer (global skip link) ─────────────── */
export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  )
}
