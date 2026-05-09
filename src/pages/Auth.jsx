import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

// ─── Auth helpers (imported by App.jsx PrivateRoute) ─────────────────────────
const AUTH_KEY = 'vemar_user'

export function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) }
  catch { return null }
}

function saveUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'granted'
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setStatus('loading')

    try {
      // ── Swap this block for a real API call when ready ──────────────────
      // const res = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // })
      // if (!res.ok) throw new Error((await res.json()).message || 'Auth failed')
      // const user = await res.json()
      // ────────────────────────────────────────────────────────────────────

      await new Promise(r => setTimeout(r, 900)) // simulated network delay

      const user = {
        email,
        name: email.split('@')[0],
        plan: 'free',
        loginAt: Date.now(),
      }
      saveUser(user)
      setStatus('granted')
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <div className="auth-page">
      <nav className="auth-nav">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">🛡</div>
          <span className="logo-text">VEMAR<span>.AI</span></span>
        </Link>
        <div className="nav-links">
          {['HOME', 'DASHBOARD', 'DETECT', 'BEHAVIORAL', 'IDENTITY', 'AI ANALYST', 'MARKET', 'PRICING'].map(item => (
            <Link
              key={item}
              to={`/${item === 'HOME' ? '' : item === 'AI ANALYST' ? 'chat' : item.toLowerCase()}`}
              className="nav-link"
            >
              {item}
            </Link>
          ))}
        </div>
        <button className="btn-login active">LOGIN</button>
      </nav>

      <div className="auth-center">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="auth-logo-icon">🛡</div>
          </div>
          <h1 className="auth-title">VEMAR.AI</h1>
          <p className="auth-subtitle">SECURE ACCESS</p>

          {status === 'granted' ? (
            <div className="granted-state">
              <div className="granted-icon">✅</div>
              <h2 className="granted-text">ACCESS GRANTED</h2>
              <p className="granted-sub">Welcome to VEMAR.AI</p>
              <button className="btn-enter" onClick={() => navigate('/dashboard')}>
                ENTER DASHBOARD
              </button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="tab-row">
                <button
                  type="button"
                  className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
                  onClick={() => setMode('login')}
                >
                  LOGIN
                </button>
                <button
                  type="button"
                  className={`tab-btn ${mode === 'signup' ? 'active' : ''}`}
                  onClick={() => setMode('signup')}
                >
                  SIGN UP
                </button>
              </div>

              {error && <div className="auth-error">{error}</div>}

              <div className="field-group">
                <label className="field-label">EMAIL</label>
                <input
                  type="email"
                  className="field-input"
                  placeholder="user@vemar.ai"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={status === 'loading'}
                />
              </div>

              <div className="field-group">
                <label className="field-label">PASSWORD</label>
                <input
                  type="password"
                  className="field-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  disabled={status === 'loading'}
                />
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={status === 'loading'}
              >
                {status === 'loading'
                  ? 'AUTHENTICATING...'
                  : mode === 'login'
                  ? 'LOGIN'
                  : 'CREATE ACCOUNT'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
