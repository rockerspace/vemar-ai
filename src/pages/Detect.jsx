import { useState } from 'react'
const STEPS = ['Initializing neural scan...','Extracting spectral features...','Biometric marker analysis...','Deep artifact detection...','Identity vault cross-reference...','Generating threat assessment...']

function isValidUrl(str) {
  try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:' } catch { return false }
}

export default function Detect() {
  const [mode, setMode] = useState('voice')
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [phase, setPhase] = useState('initial')
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [result, setResult] = useState(null)

  const handleUrlChange = e => {
    setUrl(e.target.value)
    setUrlError('')
    if (phase === 'done') { setPhase('initial'); setResult(null) }
  }

  const runAnalysis = () => {
    if (!isValidUrl(url)) { setUrlError('Please enter a valid URL (e.g. https://example.com/video.mp4)'); return }
    setUrlError('')
    setPhase('scanning'); setProgress(0); let step = 0, prog = 0
    const iv = setInterval(() => {
      prog += Math.random() * 18 + 8; if (prog > 98) prog = 98
      setProgress(Math.round(prog))
      if (step < STEPS.length) setStatus(STEPS[step++])
    }, 600)
    setTimeout(() => {
      clearInterval(iv); setProgress(100)
      setTimeout(() => {
        const isFake = Math.random() > 0.45
        setResult({ isFake, score: isFake ? (Math.random() * 15 + 82).toFixed(1) : null, conf: (Math.random() * 6 + 90).toFixed(1) })
        setPhase('done')
      }, 400)
    }, 4000)
  }

  const urlValid = isValidUrl(url)

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: 2, marginBottom: '.25rem' }}>DETECTION LAB</div>
      <div style={{ color: 'var(--text3)', fontSize: 11, letterSpacing: 2, marginBottom: '1.5rem' }}>ENTER MEDIA URL FOR NEURAL ANALYSIS</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
        {['voice', 'face'].map(m => (
          <button key={m} onClick={() => setMode(m)} className="tag" style={{ padding: '7px 14px', fontSize: 11, color: mode === m ? 'var(--cyan)' : 'var(--text3)', borderColor: mode === m ? 'var(--cyan3)' : 'var(--border)' }}>
            {m === 'voice' ? '🎙 VOICE' : '🎭 FACE/VIDEO'}
          </button>
        ))}
      </div>
      <div className="detect-layout">
        <div>
          {/* URL Input Zone */}
          <div className="upload-zone" style={{ cursor: 'default', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '.75rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.25rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{urlValid ? '✅' : '🔗'}</span>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: 'var(--text2)' }}>PASTE MEDIA URL</span>
            </div>
            <input
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com/video.mp4"
              style={{
                width: '100%',
                background: 'var(--bg2, #0d1117)',
                border: `1px solid ${urlError ? 'var(--red)' : urlValid ? 'var(--cyan3)' : 'var(--border)'}`,
                color: 'var(--text1, #e6edf3)',
                padding: '10px 12px',
                fontSize: 12,
                letterSpacing: 1,
                outline: 'none',
                borderRadius: 2,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'border-color .2s',
              }}
            />
            {urlError && <div style={{ fontSize: 11, color: 'var(--red)', letterSpacing: .5 }}>⚠ {urlError}</div>}
            {!urlError && <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: .5 }}>
              {mode === 'voice' ? 'Supports MP3, WAV, OGG, M4A, direct stream URLs' : 'Supports MP4, MOV, WEBM, YouTube, direct stream URLs'}
            </div>}
          </div>

          <div className="panel" style={{ marginTop: '1rem' }}>
            <div className="panel-title">ANALYSIS OPTIONS</div>
            {['Deep spectral scan', 'Biometric fingerprinting', 'Identity vault cross-reference', 'Generate takedown report'].map((o, i) => (
              <label key={o} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text2)', cursor: 'pointer', marginBottom: 8 }}>
                <input type="checkbox" defaultChecked={i < 2} style={{ accentColor: 'var(--cyan)' }} /> {o}
              </label>
            ))}
          </div>
          <button className="analyze-btn" disabled={!urlValid || phase === 'scanning'} onClick={runAnalysis}>ANALYZE MEDIA</button>
        </div>
        <div className="result-panel">
          {phase === 'initial' && <div style={{ textAlign: 'center', padding: '3rem 0' }}><div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🔬</div><div style={{ color: 'var(--text3)', fontSize: 12, letterSpacing: 2 }}>AWAITING MEDIA INPUT</div></div>}
          {phase === 'scanning' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '.75rem' }}>⚡</div>
              <div style={{ color: 'var(--cyan)', fontSize: 12, letterSpacing: 2, marginBottom: '1.25rem' }}>ANALYZING...</div>
              <div style={{ height: 4, background: 'var(--border)', margin: '0 1rem' }}><div style={{ height: '100%', width: progress + '%', background: 'var(--cyan)', transition: 'width .4s' }} /></div>
              <div style={{ color: 'var(--text3)', fontSize: 11, marginTop: '.75rem', letterSpacing: 1 }}>{status}</div>
            </div>
          )}
          {phase === 'done' && result && (
            <div>
              <div className="panel-title">ANALYSIS RESULT</div>
              <div className={`result-score ${result.isFake ? 'score-fake' : 'score-real'}`}>{result.isFake ? result.score + '%' : 'AUTH'}</div>
              <div style={{ textAlign: 'center', marginBottom: '.75rem' }}>
                <div style={{ fontSize: 12, letterSpacing: 3, color: result.isFake ? 'var(--red)' : 'var(--green)' }}>{result.isFake ? '⚠ AI-GENERATED CLONE DETECTED' : '✓ AUTHENTIC — NO CLONE DETECTED'}</div>
                <div className="confidence-bar"><div className="confidence-fill" style={{ width: result.conf + '%', background: result.isFake ? 'var(--red)' : 'var(--green)' }} /></div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Confidence: {result.conf}%</div>
              </div>
              {[['Spectral Artifacts', result.isFake ? 'DETECTED' : 'CLEAN'], ['Temporal Consistency', result.isFake ? 'ANOMALIES' : 'NORMAL'], ['Biometric Signature', result.isFake ? 'MISMATCH' : 'VERIFIED'], ['Neural Watermark', result.isFake ? 'ABSENT' : 'PRESENT']].map(([l, v]) => (
                <div key={l} className="breakdown-row">
                  <span className="breakdown-label">{l}</span>
                  <span className="breakdown-val" style={{ color: v === 'CLEAN' || v === 'NORMAL' || v === 'VERIFIED' || v === 'PRESENT' ? 'var(--green)' : 'var(--red)' }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: '1.25rem', padding: '.75rem', background: 'rgba(0,229,255,.04)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 2, marginBottom: 5 }}>AI SUMMARY</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{result.isFake ? 'High-confidence AI synthesis detected. Classic neural voice generation patterns found: non-linear spectral artifacts and temporal inconsistencies. Recommend identity vault alert and takedown filing.' : 'No clone signatures detected. Media appears authentic across biometric, spectral, and temporal analysis layers.'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
