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

  const runAnalysis = async () => {
    if (!urlValid) { setUrlError('Please enter a valid URL (https://...)'); return }
    setUrlError('')
    setPhase('scanning')
    setProgress(0)

    // Animate progress bar while waiting for real API response
    let prog = 0
    let step = 0
    const iv = setInterval(() => {
      prog += Math.random() * 12 + 5
      if (prog > 90) prog = 90
      setProgress(Math.round(prog))
      if (step < STEPS.length) setStatus(STEPS[step++])
    }, 500)

    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: url.split('/').pop() || 'media-file',
          fileType: mode === 'voice' ? 'audio' : 'video',
          fileSize: null,
          analysisType: mode,
        }),
      })

      const data = await response.json()
      clearInterval(iv)
      setProgress(100)

      if (!data.success) throw new Error(data.error || 'Analysis failed')

      const { verdict, confidence, detectionScore, signals, recommendation } = data.result
      const isFake = verdict === 'DEEPFAKE' || verdict === 'SUSPICIOUS'

      setTimeout(() => {
        setResult({ isFake, score: detectionScore.toFixed(1), conf: confidence.toFixed(1), signals, recommendation, verdict })
        setPhase('done')
        showToast(isFake ? '⚠ AI-generated content detected' : '✓ Content appears authentic', isFake ? 'error' : 'success')
      }, 400)

    } catch (err) {
      clearInterval(iv)
      setPhase('initial')
      setProgress(0)
      showToast('Analysis failed: ' + err.message, 'error')
    }
  }

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
                {(result.signals || []).map(({ name, detail, severity }) => {
                  const good = severity === 'LOW'
                  return (
                    <div key={name} className="breakdown-row">
                      <dt className="breakdown-label">{name}</dt>
                      <dd className="breakdown-val" style={{ color: severity === 'HIGH' ? 'var(--red)' : severity === 'MEDIUM' ? 'var(--yellow, orange)' : 'var(--green)' }}>
                        {detail}
                      </dd>
                    </div>
                  )
                })}
              </dl>

              <div style={{ marginTop: '1.25rem', padding: '.75rem', background: 'rgba(0,229,255,.04)', border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 2, marginBottom: 5 }}>AI SUMMARY</p>
                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                  {result.recommendation}
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
