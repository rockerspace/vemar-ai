import { useLocation, useNavigate, Link } from 'react-router-dom'
import Logo from './Logo'
import './Navbar.css'

const links = [
  // ← keep your existing links array exactly as-is
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  if (location.pathname === '/auth') return null

  // ← paste your existing Navbar JSX return here, unchanged
  return (
    // ... your existing return ...
  )
}
