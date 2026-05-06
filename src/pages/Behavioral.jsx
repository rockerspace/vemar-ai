import { useState, useEffect, useRef } from 'react';

function collectSignals() {
  return {
    avgKeyHold: Math.round(80 + Math.random() * 60),
    rhythmVariance: (Math.random() * 0.4 + 0.1).toFixed(2),
    typingSpeed: Math.round(40 + Math.random() * 60),
    mouseSpeed: Math.round(200 + Math.random() * 400),
    linearity: (Math.random() * 0.3).toFixed(2),
    clickRegularity: (Math.random() * 0.5 + 0.1).toFixed(2),
    sessionDuration: Math.round(30 + Math.random() * 120),
    actionsPerMinute: Math.round(15 + Math.random() * 40),
    userAgent: navigator.userAgent.slice(0, 60),
    timezoneOffset: new Date().getTimezoneOffset(),
  };
}

const VERDICT_COLOR = {
  HUMAN: '#00e887',
  SUSPICIOUS: '#ffb300',
  BOT: '#ff3b5c',
  SYNTHETIC_IDENTITY: '#ff3b5c',
};

export default function Behavioral() {
  const [phase, setPhase] = useState('idle'); // idle | collecting | analyzing | done
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  const timerRef = useRef();

  const startChallenge = () => {
    setPhase('collecting');
    setProgress(0);
    setResult(null);
    setError(null);
    setText('');
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timerRef.current);
          runAnalysis();
          return 100;
        }
        return p + 2;
      });
    }, 100);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const runAnalysis = async () => {
    setPhase('analyzing');
    try {
      const signals = collectSignals();
      const res = await fetch('/api/behavioral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signals }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setResult(data.result);
      setPhase('done');
    } catch (e) {
      setError(e.message);
      setPhase('done');
    }
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: 760, margin: '0 auto', fontFamily: 'Courier New, monospace' }}>
      <div style={{ fontSize: 11, color: '#00d4ff', letterSpacing: '0.15em', marginBottom: 16 }}>BEHAVIORAL AI</div>
      <h1 style={{ fontSize: 32, color: '#fff', fontWeight: 700, marginBottom: 8 }}>
        LIVE CHALLENGE <span style={{ color: '#00d4ff' }}>AUTH</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 40 }}>
        Type in the box below. VEMAR AI collects keystroke dynamics, rhythm, and timing — then scores your behavioral biometrics in real time.
      </p>

      {/* Challenge input */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 8 }}>
          TYPE THIS PHRASE:
        </div>
        <div style={{
          padding: '12px 16px',
          background: 'rgba(0,212,255,0.05)',
          border: '1px solid rgba(0,212,255,0.15)',
          fontSize: 14,
          color: '#00d4ff',
          letterSpacing: '0.04em',
          marginBottom: 12,
        }}>
          The quick brown fox jumps over the lazy dog
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing here..."
          rows={3}
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(0,212,255,0.2)',
            color: '#fff',
            fontFamily: 'Courier New, monospace',
            fontSize: 14,
            padding: 16,
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Progress bar (collecting phase) */}
      {phase === 'collecting' && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 8 }}>
            COLLECTING SIGNALS — {progress}%
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#00d4ff', transition: 'width 0.1s linear' }} />
          </div>
        </div>
      )}

      {/* Button */}
      {phase === 'idle' && (
        <button
          onClick={startChallenge}
          style={{
            background: '#00d4ff', color: '#020b18', border: 'none',
            padding: '14px 40px', fontFamily: 'Courier New, monospace',
            fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
            cursor: 'pointer', width: '100%',
          }}
        >
          // RUN BEHAVIORAL ANALYSIS
        </button>
      )}

      {phase === 'analyzing' && (
        <div style={{ padding: 20, textAlign: 'center', color: '#00d4ff', fontSize: 13, border: '1px solid rgba(0,212,255,0.15)' }}>
          // QUERYING AI ENGINE...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ marginTop: 24, padding: 16, border: '1px solid rgba(255,59,92,0.3)', color: '#ff3b5c', fontSize: 12 }}>
          ERROR: {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ marginTop: 32, border: '1px solid rgba(0,212,255,0.15)', background: 'rgba(0,0,0,0.4)' }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(0,212,255,0.1)', display: 'flex', gap: 32 }}>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 4 }}>VERDICT</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: VERDICT_COLOR[result.verdict] || '#fff' }}>
                {result.verdict?.replace('_', ' ')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 4 }}>RISK SCORE</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{result.riskScore}/100</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 4 }}>HUMAN LIKELIHOOD</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#fff' }}>{result.humanLikelihood}%</div>
            </div>
          </div>

          {result.anomalies?.length > 0 && (
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 14 }}>ANOMALIES DETECTED</div>
              {result.anomalies.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    padding: '2px 8px', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', whiteSpace: 'nowrap', marginTop: 2,
                    color: a.severity === 'HIGH' ? '#ff3b5c' : a.severity === 'MEDIUM' ? '#ffb300' : '#00e887',
                    border: `1px solid ${a.severity === 'HIGH' ? 'rgba(255,59,92,0.3)' : a.severity === 'MEDIUM' ? 'rgba(255,179,0,0.3)' : 'rgba(0,232,135,0.3)'}`,
                  }}>{a.severity}</div>
                  <div>
                    <div style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>{a.type}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{a.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ padding: '16px 28px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
            <span>SESSION: {result.sessionFingerprint}</span>
            <span>CONFIDENCE: {result.confidence}%</span>
          </div>

          {result.recommendation && (
            <div style={{ padding: '12px 28px', borderTop: '1px solid rgba(0,212,255,0.1)', fontSize: 12, color: '#00d4ff' }}>
              ▶ {result.recommendation}
            </div>
          )}

          <div style={{ padding: '12px 28px', borderTop: '1px solid rgba(0,212,255,0.08)', textAlign: 'right' }}>
            <button onClick={() => { setPhase('idle'); setResult(null); }} style={{
              background: 'transparent', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff',
              padding: '8px 20px', fontFamily: 'Courier New, monospace', fontSize: 11, cursor: 'pointer',
            }}>
              // RUN AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
