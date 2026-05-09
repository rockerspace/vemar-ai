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
  const location = useLocation();

  // Don't render Navbar on the auth page
  if (location.pathname === '/auth') return null;
export default function Navbar() {
  const location = useLocation();     // already there
  const navigate = useNavigate();     // already there

  // ADD THIS — must be inside the function, after the hooks
  if (location.pathname === '/auth') return null;

  // ... rest of your existing JSX ...
}
}
