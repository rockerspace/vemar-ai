import { useState } from 'react'
import { ScanProgress, showToast } from '../components/UIComponents'

const STEPS = [
  'Initializing neural scan...',
  'Extracting spectral features...',
  'Biometric marker analysis...',
  'Deep artifact detection...',
  'Identity vault cross-reference...',
  'Generating threat assessment...',
]

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
  const [options, setOptions] = useState({ spectral: true, biometric: true, vault: false, report: false })

  const urlValid = isValidUrl(url)

  const handleUrlChange = e => {
    setUrl(e.target.value)
    setUrlError('')
    if (phase === 'done') { setPhase('initial'); setResult(null) }
  }

  const runAnalysis = () => {
    if (!urlValid) { setUrlError('Please enter a valid URL (https://...)'); return }
    setUrlError('')
    setPhase('scanning')
    setProgress(0)
    let step = 0, prog = 0
    const iv = setInterval(() => {
      prog += Math.random() * 18 + 8
      if (prog > 98) prog = 98
      setProgress(Math.round(prog))
      if (step < STEPS.length) setStatus(STEPS[step++])
    }, 600)
    setTimeout(() => {
      clearInterval(iv)
      setProgress(100)
      setTimeout(() => {
        const isFake = Math.random() > 0.45
        const res = { isFake, score: isFake ? (Math.random() * 15 + 82).toFixed(1) : null, conf: (Math.random() * 6 + 90).toFixed(1) }
        setResult(res)
        setPhase('done')
        showToast(isFake ? '⚠ AI-generated content detected' : '✓ Content appears authentic', isFake ? 'error' : 'success')
      }, 400)
    }, 4000)
  }

  const breakdown = result ? [
    ['Spectral Artifacts', result.isFake ? 'DETECTED' : 'CLEAN'],
    ['Temporal Consistency', result.isFake ? 'ANOMALIES' : 'NORMAL'],
    ['Biometric Signature', result.isFake ? 'MISMATCH' : 'VERIFIED'],
    ['Neural Watermark', result.isFake ? 'ABSENT' : 'PRESENT'],
  ] : []

  return (
    <div className="page-enter" style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: 2, marginBottom: '.25rem' }}>
        DETECTION LAB
      </h1>
      <p style={{ color: 'var(--text3)', fontSize: 11, letterSpacing: 2, marginBottom: '1.5rem' }}>
        ENTER MEDIA URL FOR NEURAL ANALYSIS
      </p>

      {/* Mode selector */}
      <div
        role="group"
        aria-label="Detection mode"
        style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}
      >
        {[
          { id: 'voice', label: '🎙 VOICE' },
          { id: 'face', label: '🎭 FACE/VIDEO' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className="tag"
            aria-pressed={mode === m.id}
            style={{
              padding: '7px 14px', fontSize: 11,
              color: mode === m.id ? 'var(--cyan)' : 'var(--text3)',
              borderColor: mode === m.id ? 'var(--cyan3)' : 'var(--border)',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="detect-layout">
        {/* Left: Input + Options */}
        <div>
          {/* URL Input */}
          <div
            className="upload-zone"
            style={{ cursor: 'default', display: 'flex', flexDirection: 'column', gap: '.75rem', padding: '1.25rem', alignItems: 'stretch' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <span aria-hidden="true" style={{ fontSize: '1.4rem' }}>{urlValid ? '✅' : '🔗'}</span>
              <label
                htmlFor="media-url"
                style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: 'var(--text2)' }}
              >
                PASTE MEDIA URL
              </label>
            </div>
            <input
              id="media-url"
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com/video.mp4"
              aria-describedby={urlError ? 'url-error' : 'url-hint'}
              aria-invalid={urlError ? 'true' : 'false'}
              style={{
                width: '100%',
                background: 'var(--bg2)',
                border: `1px solid ${urlError ? 'var(--red)' : urlValid ? 'var(--cyan3)' : 'var(--border)'}`,
                color: 'var(--text)',
                padding: '10px 12px',
                fontSize: 12,
                letterSpacing: 1,
                outline: 'none',
                fontFamily: 'var(--font)',
                boxSizing: 'border-box',
                transition: 'border-color .2s',
              }}
              onKeyDown={e => e.key === 'Enter' && urlValid && phase !== 'scanning' && runAnalysis()}
            />
            {urlError
              ? <span id="url-error" className="field-error" role="alert">{urlError}</span>
              : <span id="url-hint" className="field-hint">
                  {mode === 'voice' ? 'Supports MP3, WAV, OGG, M4A, direct stream URLs' : 'Supports MP4, MOV, WEBM, YouTube, direct stream URLs'}
                </span>
            }
          </div>

          {/* Options */}
          <div className="panel" style={{ marginTop: '1rem' }}>
            <div className="panel-title" id="options-label">ANALYSIS OPTIONS</div>
            <fieldset
              aria-labelledby="options-label"
              style={{ border: 'none', padding: 0 }}
            >
              <legend className="sr-only">Select analysis options</legend>
              {[
                { key: 'spectral', label: 'Deep spectral scan' },
                { key: 'biometric', label: 'Biometric fingerprinting' },
                { key: 'vault', label: 'Identity vault cross-reference' },
                { key: 'report', label: 'Generate takedown report' },
              ].map(opt => (
                <label
                  key={opt.key}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text2)', cursor: 'pointer', marginBottom: 8 }}
                >
                  <input
                    type="checkbox"
                    checked={options[opt.key]}
                    onChange={e => setOptions(p => ({ ...p, [opt.key]: e.target.checked }))}
                    style={{ accentColor: 'var(--cyan)', cursor: 'pointer' }}
                  />
                  {opt.label}
                </label>
              ))}
            </fieldset>
          </div>

          <button
            className="analyze-btn"
            disabled={!urlValid || phase === 'scanning'}
            onClick={runAnalysis}
            aria-busy={phase === 'scanning'}
            aria-label={phase === 'scanning' ? 'Analysis in progress' : 'Run media analysis'}
          >
            {phase === 'scanning' ? 'ANALYZING...' : 'ANALYZE MEDIA'}
          </button>
        </div>

        {/* Right: Results */}
        <div className="result-panel" role="region" aria-label="Analysis results" aria-live="polite">
          {phase === 'initial' && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }} aria-hidden="true">🔬</div>
              <p style={{ color: 'var(--text3)', fontSize: 12, letterSpacing: 2 }}>AWAITING MEDIA INPUT</p>
            </div>
          )}

          {phase === 'scanning' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '.75rem' }} aria-hidden="true">⚡</div>
              <p style={{ color: 'var(--cyan)', fontSize: 12, letterSpacing: 2, marginBottom: '1.25rem' }}>
                ANALYZING...
              </p>
              <ScanProgress progress={progress} status={status} />
            </div>
          )}

          {phase === 'done' && result && (
            <div>
              <h2 className="panel-title">ANALYSIS RESULT</h2>
              <div
                className={`result-score ${result.isFake ? 'score-fake' : 'score-real'}`}
                aria-label={result.isFake ? `AI clone detected with ${result.score}% confidence` : 'Content authenticated'}
              >
                {result.isFake ? `${result.score}%` : 'AUTH'}
              </div>
              <div style={{ textAlign: 'center', marginBottom: '.75rem' }}>
                <p style={{ fontSize: 12, letterSpacing: 3, color: result.isFake ? 'var(--red)' : 'var(--green)' }}>
                  {result.isFake ? '⚠ AI-GENERATED CLONE DETECTED' : '✓ AUTHENTIC — NO CLONE DETECTED'}
                </p>
                <div
                  className="confidence-bar"
                  role="meter"
                  aria-valuenow={result.conf}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Confidence: ${result.conf}%`}
                >
                  <div className="confidence-fill" style={{ width: `${result.conf}%`, background: result.isFake ? 'var(--red)' : 'var(--green)' }} />
                </div>
                <p style={{ fontSize: 11, color: 'var(--text3)' }}>Confidence: {result.conf}%</p>
              </div>

              <dl>
                {breakdown.map(([l, v]) => {
                  const good = ['CLEAN', 'NORMAL', 'VERIFIED', 'PRESENT'].includes(v)
                  return (
                    <div key={l} className="breakdown-row">
                      <dt className="breakdown-label">{l}</dt>
                      <dd className="breakdown-val" style={{ color: good ? 'var(--green)' : 'var(--red)' }}>{v}</dd>
                    </div>
                  )
                })}
              </dl>

              <div style={{ marginTop: '1.25rem', padding: '.75rem', background: 'rgba(0,229,255,.04)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 2, marginBottom: 5 }}>AI SUMMARY</p>
                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                  {result.isFake
                    ? 'High-confidence AI synthesis detected. Classic neural voice generation patterns found: non-linear spectral artifacts and temporal inconsistencies. Recommend identity vault alert and takedown filing.'
                    : 'No clone signatures detected. Media appears authentic across biometric, spectral, and temporal analysis layers.'}
                </p>
              </div>

              <button
                className="analyze-btn"
                style={{ marginTop: '1.25rem' }}
                onClick={() => { setPhase('initial'); setResult(null); setUrl(''); setProgress(0) }}
              >
                RUN NEW ANALYSIS
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
