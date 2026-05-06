import { useState } from 'react';

const VERDICT_COLOR = {
  AUTHENTIC: '#00e887',
  SYNTHETIC: '#ff3b5c',
  STOLEN: '#ff3b5c',
  SUSPICIOUS: '#ffb300',
};

export default function Identity() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', ip: '',
    accountAge: '', profileCompleteness: '75',
    linkedAccounts: '2', previousFlags: '0',
    country: 'IN', deviceFingerprint: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identityData: form }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResult(data.result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,212,255,0.15)',
    color: '#fff', fontFamily: 'Courier New, monospace', fontSize: 12,
    padding: '10px 12px', width: '100%', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = { fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 4, display: 'block' };

  return (
    <div style={{ padding: '40px 24px', maxWidth: 760, margin: '0 auto', fontFamily: 'Courier New, monospace' }}>
      <div style={{ fontSize: 11, color: '#00d4ff', letterSpacing: '0.15em', marginBottom: 16 }}>IDENTITY GRAPH</div>
      <h1 style={{ fontSize: 32, color: '#fff', fontWeight: 700, marginBottom: 8 }}>
        IDENTITY <span style={{ color: '#00d4ff' }}>ANALYSIS</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 40 }}>
        Submit an identity profile. Our AI builds a risk graph and determines if this is a real, synthetic, or stolen identity.
      </p>

      {/* Form grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {[
          { k: 'name', l: 'FULL NAME', ph: 'John Doe' },
          { k: 'email', l: 'EMAIL ADDRESS', ph: 'john@example.com' },
          { k: 'phone', l: 'PHONE NUMBER', ph: '+91 98765 43210' },
          { k: 'ip', l: 'IP ADDRESS', ph: '192.168.1.1' },
          { k: 'accountAge', l: 'ACCOUNT AGE (DAYS)', ph: '365' },
          { k: 'country', l: 'COUNTRY CODE', ph: 'IN' },
          { k: 'linkedAccounts', l: 'LINKED ACCOUNTS', ph: '3' },
          { k: 'previousFlags', l: 'PREVIOUS FLAGS', ph: '0' },
        ].map(({ k, l, ph }) => (
          <div key={k}>
            <label style={labelStyle}>{l}</label>
            <input value={form[k]} onChange={set(k)} placeholder={ph} style={inputStyle} />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>PROFILE COMPLETENESS (%): {form.profileCompleteness}%</label>
        <input type="range" min="0" max="100" value={form.profileCompleteness} onChange={set('profileCompleteness')}
          style={{ width: '100%', accentColor: '#00d4ff' }} />
      </div>

      <button
        onClick={runAnalysis}
        disabled={loading}
        style={{
          background: loading ? 'rgba(0,212,255,0.15)' : '#00d4ff',
          color: loading ? 'rgba(0,212,255,0.4)' : '#020b18',
          border: 'none', padding: '14px 40px',
          fontFamily: 'Courier New, monospace', fontSize: 13, fontWeight: 700,
          letterSpacing: '0.12em', cursor: loading ? 'not-allowed' : 'pointer', width: '100%',
        }}
      >
        {loading ? '// ANALYZING IDENTITY...' : '// RUN IDENTITY ANALYSIS'}
      </button>

      {error && (
        <div style={{ marginTop: 24, padding: 16, border: '1px solid rgba(255,59,92,0.3)', color: '#ff3b5c', fontSize: 12 }}>
          ERROR: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 32, border: '1px solid rgba(0,212,255,0.15)', background: 'rgba(0,0,0,0.4)' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(0,212,255,0.1)', display: 'flex', gap: 32 }}>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 4 }}>VERDICT</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: VERDICT_COLOR[result.verdict] || '#fff' }}>{result.verdict}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 4 }}>THREAT SCORE</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{result.threatScore}/100</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 4 }}>GRAPH CONSISTENCY</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{result.graphConsistency}%</div>
            </div>
          </div>

          {result.identityNodes?.length > 0 && (
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 14 }}>IDENTITY GRAPH NODES</div>
              {result.identityNodes.map((n, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    padding: '2px 8px', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', whiteSpace: 'nowrap', marginTop: 2,
                    color: n.status === 'ANOMALOUS' ? '#ff3b5c' : n.status === 'VERIFIED' ? '#00e887' : '#ffb300',
                    border: `1px solid ${n.status === 'ANOMALOUS' ? 'rgba(255,59,92,0.3)' : n.status === 'VERIFIED' ? 'rgba(0,232,135,0.3)' : 'rgba(255,179,0,0.3)'}`,
                  }}>{n.status}</div>
                  <div>
                    <div style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>{n.node}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{n.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.redFlags?.length > 0 && (
            <div style={{ padding: '16px 28px', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 10 }}>RED FLAGS</div>
              {result.redFlags.map((f, i) => (
                <div key={i} style={{ fontSize: 12, color: '#ff3b5c', marginBottom: 6 }}>▶ {f}</div>
              ))}
            </div>
          )}

          <div style={{ padding: '16px 28px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
            <span>WATERMARK: {result.watermarkStatus}</span>
            <span>CONFIDENCE: {result.confidence}%</span>
          </div>

          {result.recommendation && (
            <div style={{ padding: '12px 28px', borderTop: '1px solid rgba(0,212,255,0.1)', fontSize: 12, color: '#00d4ff' }}>
              ▶ {result.recommendation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
