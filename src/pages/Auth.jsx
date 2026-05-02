import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Auth.css'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'granted'
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setStatus('loading')

    // Simulate auth — replace with real API call
    setTimeout(() => {
      setStatus('granted')
      // Navigate to dashboard after brief "Access Granted" display
      setTimeout(() => {
        navigate('/dashboard')
      }, 1200)
    }, 1000)
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
