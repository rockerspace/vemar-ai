import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Courier New, monospace', color: '#fff',
      background: '#0a0e0f', textAlign: 'center', padding: '2rem',
    }}>
      <div style={{ fontSize: 11, color: '#00d4ff', letterSpacing: '0.15em', marginBottom: 16 }}>404</div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>PAGE NOT FOUND</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 32 }}>
        This route does not exist in the system.
      </p>
      <Link to="/dashboard" style={{
        background: '#00d4ff', color: '#020b18', padding: '12px 32px',
        textDecoration: 'none', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
      }}>
        // RETURN TO DASHBOARD
      </Link>
    </div>
  )
}
