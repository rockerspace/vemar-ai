import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
      <div style={{ fontSize: '6rem', fontWeight: 900, letterSpacing: -4, color: 'var(--red)', opacity: 0.15, lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontSize: '1.2rem', letterSpacing: 4, marginTop: '1rem' }}>PAGE NOT FOUND</h1>
      <p style={{ color: 'var(--text3)', fontSize: 12, letterSpacing: 2, marginTop: '0.5rem' }}>
        THIS ROUTE DOES NOT EXIST IN THE VEMAR NETWORK
      </p>
      <Link to="/">
        <button
          className="btn-primary"
          style={{ marginTop: '2rem', padding: '10px 28px', letterSpacing: 2 }}
        >
          ← RETURN HOME
        </button>
      </Link>
    </div>
  )
}
