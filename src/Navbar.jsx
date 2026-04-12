import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { ThreatTicker, SkipLink, ToastContainer } from './UIComponents'
import './Navbar.css'

const links = [
  { to: '/', label: 'HOME' },
  { to: '/dashboard', label: 'DASHBOARD' },
  { to: '/detect', label: 'DETECT' },
  { to: '/behavioral', label: 'BEHAVIORAL' },
  { to: '/identity', label: 'IDENTITY' },
  { to: '/chat', label: 'AI ANALYST' },
  { to: '/market', label: 'MARKET' },
  { to: '/pricing', label: 'PRICING' },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <SkipLink />
      <header role="banner">
        <nav className="navbar" aria-label="Main navigation">
          <Link to="/" className="nav-logo" aria-label="VEMAR.AI — Home">
            <Logo size={38} />
            <span className="nav-logo-text">VEMAR<span className="nav-logo-dot">.AI</span></span>
          </Link>
          <div className="nav-links" role="list">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                role="listitem"
                className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}
                aria-current={location.pathname === l.to ? 'page' : undefined}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/auth" className="nav-cta">LOGIN</Link>
          </div>
          <button
            className="nav-mobile-toggle"
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </nav>
        {menuOpen && (
          <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`mobile-link ${location.pathname === l.to ? 'active' : ''}`}
                aria-current={location.pathname === l.to ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/auth" className="mobile-link mobile-cta" onClick={() => setMenuOpen(false)}>LOGIN</Link>
          </nav>
        )}
        <ThreatTicker />
      </header>
      <ToastContainer />
    </>
  )
}
