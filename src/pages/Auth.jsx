// src/pages/Auth.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Tiny auth helpers (move to src/auth.js if preferred) ────────────
const AUTH_KEY = 'vemar_user';

export function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); }
  catch { return null; }
}

function saveUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
// ─────────────────────────────────────────────────────────────────────

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email.includes('@')) { setError('Enter a valid email.'); return; }
    if (password.length < 6)  { setError('Password must be 6+ characters.'); return; }

    setLoading(true);

    try {
      // ── Swap this block for a real API call when ready ──────────────
      // const res  = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
      // const user = await res.json();
      // ────────────────────────────────────────────────────────────────

      // Simulated network delay (remove with real API)
      await new Promise(r => setTimeout(r, 800));

      const user = { email, name: email.split('@')[0], plan: 'free', loginAt: Date.now() };
      saveUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Sign in to VEMAR</h2>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
