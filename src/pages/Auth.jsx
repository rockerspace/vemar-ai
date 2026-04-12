import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) return
    setSuccess(true)
  }

  return (
    <div style={{ maxWidth: 420, margin: '3rem auto', padding: '0 1rem' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Logo size={60} style={{ margin: '0 auto .75rem' }} />
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, color: 'var(--cyan)' }}>VEMAR.AI</div>
          <div style={{ color: 'var(--text3)', fontSize: 11, letterSpacing: 2, marginTop: 4, textTransform: 'uppercase' }}>
            {isSignup ? 'CREATE ACCOUNT' : 'SECURE ACCESS'}
          </div>
        </div>

        {isSignup && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,229,255,.06)', border: '1px solid var(--cyan3)', padding: '10px 14px', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: 18 }}>🛡</div>
            <div style={{ fontSize: 12, color: 'var(--cyan)', letterSpacing: 1 }}>PRO PLAN — 30-DAY FREE TRIAL INCLUDED</div>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="form-group">
                <label className="form-label">FULL NAME</label>
                <input type="text" className="form-input" placeholder="Your full name" />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">EMAIL ADDRESS</label>
              <input type="email" className="form-input" placeholder="agent@domain.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">PASSWORD</label>
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {isSignup && (
              <div className="form-group">
                <label className="form-label">CONFIRM PASSWORD</label>
                <input type="password" className="form-input" placeholder="••••••••" />
              </div>
            )}
            <button type="submit" className="form-submit">
              {isSignup ? 'CREATE ACCOUNT' : 'LOGIN'}
            </button>
            <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 11, margin: '1.25rem 0' }}>— OR —</div>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text2)' }}>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              {' '}<button type="button" onClick={() => setIsSignup(!isSignup)} style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 12 }}>
                {isSignup ? 'SIGN IN' : 'CREATE ACCOUNT'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>✅</div>
            <div style={{ color: 'var(--cyan)', fontSize: 15, letterSpacing: 2, fontWeight: 700, marginBottom: '.5rem' }}>ACCESS GRANTED</div>
            <div style={{ color: 'var(--text2)', fontSize: 12, marginBottom: '1.5rem' }}>Welcome to VEMAR.AI</div>
            <button className="form-submit" onClick={() => navigate('/dashboard')}>ENTER DASHBOARD</button>
          </div>
        )}
      </div>
    </div>
  )
}
