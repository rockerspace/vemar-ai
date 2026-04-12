import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
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
  const navigate = useNavigate()
  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate('/')}>
        <Logo size={38} />
        <span className="nav-logo-text">VEMAR<span className="nav-logo-dot">.AI</span></span>
      </div>
      <div className="nav-links">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}>
            {l.label}
          </Link>
        ))}
        <Link to="/auth" className="nav-cta">LOGIN</Link>
      </div>
    </nav>
  )
}
