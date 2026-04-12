import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { showToast } from '../components/UIComponents'

function validate(fields, isSignup) {
  const errors = {}
  if (isSignup && !fields.name?.trim()) errors.name = 'Full name is required'
  if (!fields.email?.trim()) errors.email = 'Email address is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Enter a valid email address'
  if (!fields.password) errors.password = 'Password is required'
  else if (fields.password.length < 8) errors.password = 'Password must be at least 8 characters'
  if (isSignup && fields.password !== fields.confirm) errors.confirm = 'Passwords do not match'
  return errors
}

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false)
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (k) => (e) => setFields(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate(fields, isSignup)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      showToast(isSignup ? 'Account created!' : 'Login successful', 'success')
    }, 800)
  }

  const switchMode = () => {
    setIsSignup(p => !p)
    setErrors({})
    setFields({ name: '', email: '', password: '', confirm: '' })
  }

  return (
    <div className="page-enter" style={{ maxWidth: 420, margin: '3rem auto', padding: '0 1rem' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Logo size={60} style={{ margin: '0 auto .75rem' }} />
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, color: 'var(--cyan)' }}>VEMAR.AI</div>
          <p style={{ color: 'var(--text3)', fontSize: 11, letterSpacing: 2, marginTop: 4, textTransform: 'uppercase' }}>
            {isSignup ? 'CREATE ACCOUNT' : 'SECURE ACCESS'}
          </p>
        </div>

        {isSignup && (
          <div
            role="note"
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,229,255,.06)', border: '1px solid var(--cyan3)', padding: '10px 14px', marginBottom: '1.25rem' }}
          >
            <span style={{ fontSize: 18 }} aria-hidden="true">🛡</span>
            <p style={{ fontSize: 12, color: 'var(--cyan)', letterSpacing: 1 }}>PRO PLAN — 30-DAY FREE TRIAL INCLUDED</p>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} noValidate aria-label={isSignup ? 'Create account form' : 'Login form'}>
            {isSignup && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">FULL NAME</label>
                <input
                  id="auth-name"
                  type="text"
                  className="form-input"
                  placeholder="Your full name"
                  value={fields.name}
                  onChange={set('name')}
                  aria-required="true"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'err-name' : undefined}
                  autoComplete="name"
                />
                {errors.name && <span id="err-name" className="field-error" role="alert">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">EMAIL ADDRESS</label>
              <input
                id="auth-email"
                type="email"
                className="form-input"
                placeholder="agent@domain.com"
                value={fields.email}
                onChange={set('email')}
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'err-email' : undefined}
                autoComplete="email"
              />
              {errors.email && <span id="err-email" className="field-error" role="alert">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">PASSWORD</label>
              <input
                id="auth-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={fields.password}
                onChange={set('password')}
                aria-required="true"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'err-password' : 'hint-password'}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />
              {errors.password
                ? <span id="err-password" className="field-error" role="alert">{errors.password}</span>
                : isSignup && <span id="hint-password" className="field-hint">Minimum 8 characters</span>
              }
            </div>

            {isSignup && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-confirm">CONFIRM PASSWORD</label>
                <input
                  id="auth-confirm"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={fields.confirm}
                  onChange={set('confirm')}
                  aria-required="true"
                  aria-invalid={errors.confirm ? 'true' : 'false'}
                  aria-describedby={errors.confirm ? 'err-confirm' : undefined}
                  autoComplete="new-password"
                />
                {errors.confirm && <span id="err-confirm" className="field-error" role="alert">{errors.confirm}</span>}
              </div>
            )}

            {/* Summarised error for screen readers */}
            {Object.keys(errors).length > 0 && (
              <div role="alert" className="sr-only">
                Form has {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''}. Please review the fields above.
              </div>
            )}

            <button
              type="submit"
              className="form-submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'PROCESSING...' : isSignup ? 'CREATE ACCOUNT' : 'LOGIN'}
            </button>

            <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 11, margin: '1.25rem 0' }}>— OR —</div>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text2)' }}>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={switchMode}
                style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 12, textDecoration: 'underline' }}
              >
                {isSignup ? 'SIGN IN' : 'CREATE ACCOUNT'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }} role="alert" aria-live="polite">
            <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }} aria-hidden="true">✅</div>
            <p style={{ color: 'var(--cyan)', fontSize: 15, letterSpacing: 2, fontWeight: 700, marginBottom: '.5rem' }}>ACCESS GRANTED</p>
            <p style={{ color: 'var(--text2)', fontSize: 12, marginBottom: '1.5rem' }}>Welcome to VEMAR.AI</p>
            <button className="form-submit" onClick={() => navigate('/dashboard')}>ENTER DASHBOARD</button>
          </div>
        )}
      </div>
    </div>
  )
}
