import { useState, useRef } from 'react';

const VERDICT_COLOR = {
  AUTHENTIC:  '#00e887',
  DEEPFAKE:   '#ff3b5c',
  SUSPICIOUS: '#ffb300',
};

export default function Detect() {
  const [mode,    setMode]    = useState('file'); // 'file' | 'url'
  const [file,    setFile]    = useState(null);
  const [url,     setUrl]     = useState('');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const switchMode = (m) => {
    setMode(m);
    setResult(null);
    setError(null);
  };

  const canRun = mode === 'file' ? !!file : url.trim().length > 0;

  const runDetection = async () => {
    if (!canRun || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = mode === 'url'
        ? {
            url: url.trim(),
            analysisType: 'url',
          }
        : {
            fileName:     file.name,
            fileType:     file.type,
            fileSize:     file.size,
            analysisType: file.type.startsWith('audio') ? 'voice'
                        : file.type.startsWith('video') ? 'video'
                        : 'image',
          };

      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

  return (
    <div style={{ padding: '40px 24px', maxWidth: 760, margin: '0 auto', fontFamily: 'Courier New, monospace' }}>

      {/* Header */}
      <div style={{ fontSize: 11, color: '#00d4ff', letterSpacing: '0.15em', marginBottom: 16 }}>DETECTION LAB</div>
      <h1 style={{ fontSize: 32, color: '#fff', fontWeight: 700, marginBottom: 8 }}>
        DETECT. <span style={{ color: '#00d4ff' }}>ANALYZE.</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 32 }}>
        Upload a file or paste a URL. Our AI engine analyzes it for deepfake signatures in real time.
      </p>

      {/* Mode toggle */}
      <div style={{
        display: 'flex', marginBottom: 28,
        border: '1px solid rgba(0,212,255,0.2)',
        borderRadius: 4, overflow: 'hidden',
      }}>
        {[
          { key: 'file', label: '// UPLOAD FILE' },
          { key: 'url',  label: '// PASTE URL'   },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            style={{
              flex: 1, padding: '11px',
              fontFamily: 'Courier New, monospace',
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.12em', border: 'none',
              cursor: 'pointer', transition: 'all 0.2s',
              background: mode === key ? '#00d4ff' : 'transparent',
              color:      mode === key ? '#020b18' : 'rgba(0,212,255,0.5)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* File upload mode */}
      {mode === 'file' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current.click()}
          style={{
            border: `1px solid ${file ? '#00d4ff' : 'rgba(0,212,255,0.2)'}`,
            borderRadius: 4, padding: '48px 24px',
            textAlign: 'center', cursor: 'pointer',
            background: file ? 'rgba(0,212,255,0.05)' : 'rgba(0,0,0,0.3)',
            transition: 'all 0.2s', marginBottom: 24,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,audio/*,video/*"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />
          {file ? (
            <>
              <div style={{ fontSize: 28, marginBottom: 8 }}>
                {file.type.startsWith('audio') ? '🎵' : file.type.startsWith('video') ? '🎬' : '🖼️'}
              </div>
              <div style={{ color: '#00d4ff', fontSize: 14, fontWeight: 700 }}>{file.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 4 }}>
                {(file.size / 1024).toFixed(1)} KB · {file.type || 'unknown type'}
              </div>
              <div
                onClick={(e) => { e.stopPropagation(); handleFile(null); }}
                style={{
                  marginTop: 12, fontSize: 10, color: 'rgba(255,59,92,0.6)',
                  cursor: 'pointer', letterSpacing: '0.1em',
                }}
              >
                ✕ REMOVE
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📂</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                DROP FILE HERE OR CLICK TO BROWSE
              </div>
              <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 8 }}>
                Supported: JPG, PNG, MP3, WAV, MP4, MOV
              </div>
            </>
          )}
        </div>
      )}

      {/* URL mode */}
      {mode === 'url' && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 8 }}>
            MEDIA URL TO ANALYZE
          </div>
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute', left: 12, top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(0,212,255,0.5)', fontSize: 14, pointerEvents: 'none',
            }}>
              🔗
            </span>
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setResult(null); setError(null); }}
              onKeyDown={(e) => e.key === 'Enter' && canRun && runDetection()}
              placeholder="https://example.com/video.mp4"
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: `1px solid ${url ? '#00d4ff' : 'rgba(0,212,255,0.2)'}`,
                color: '#fff',
                fontFamily: 'Courier New, monospace',
                fontSize: 13,
                padding: '14px 14px 14px 38px',
                outline: 'none',
                boxSizing: 'border-box',
                borderRadius: 4,
                transition: 'border-color 0.2s',
              }}
            />
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 8, letterSpacing: '0.05em' }}>
            Supports: direct image, audio, video URLs · YouTube · Instagram · TikTok · Twitter/X
          </div>
        </div>
      )}

      {/* Run button */}
      <button
        onClick={runDetection}
        disabled={!canRun || loading}
        style={{
          background: canRun && !loading ? '#00d4ff' : 'rgba(0,212,255,0.15)',
          color:      canRun && !loading ? '#020b18' : 'rgba(0,212,255,0.4)',
          border: 'none', padding: '14px 40px',
          fontFamily: 'Courier New, monospace',
          fontSize: 13, fontWeight: 700,
          letterSpacing: '0.12em',
          cursor: canRun && !loading ? 'pointer' : 'not-allowed',
          width: '100%', transition: 'all 0.2s', borderRadius: 4,
        }}
      >
        {loading ? '// ANALYZING...' : '// RUN DETECTION'}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 24, padding: 16,
          border: '1px solid rgba(255,59,92,0.3)',
          borderRadius: 4, color: '#ff3b5c', fontSize: 12,
        }}>
          ERROR: {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          marginTop: 32,
          border: '1px solid rgba(0,212,255,0.15)',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: 4,
        }}>

          {/* Verdict + score */}
          <div style={{
            padding: '24px 28px',
            borderBottom: '1px solid rgba(0,212,255,0.1)',
            display: 'flex', alignItems: 'center', gap: 24,
          }}>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 4 }}>
                VERDICT
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: VERDICT_COLOR[result.verdict] || '#fff' }}>
                {result.verdict}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 8 }}>
                DETECTION SCORE
              </div>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${result.detectionScore}%`,
                  background: VERDICT_COLOR[result.verdict] || '#00d4ff',
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
                {result.detectionScore}/100 · {result.confidence}% confidence
              </div>
            </div>
          </div>

          {/* Signals */}
          {result.signals?.length > 0 && (
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 16 }}>
                DETECTION SIGNALS
              </div>
              {result.signals.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    padding: '2px 8px', fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.08em', whiteSpace: 'nowrap', marginTop: 2,
                    color:  s.severity === 'HIGH'   ? '#ff3b5c'
                          : s.severity === 'MEDIUM' ? '#ffb300' : '#00e887',
                    border: `1px solid ${
                      s.severity === 'HIGH'   ? 'rgba(255,59,92,0.3)'
                    : s.severity === 'MEDIUM' ? 'rgba(255,179,0,0.3)'
                    : 'rgba(0,232,135,0.3)'}`,
                  }}>
                    {s.severity}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{
            padding: '16px 28px',
            display: 'flex', justifyContent: 'space-between',
            fontSize: 11, color: 'rgba(255,255,255,0.3)',
          }}>
            <span>MODEL: {result.modelUsed}</span>
            <span>{result.processingTime}ms</span>
          </div>

          {result.recommendation && (
            <div style={{ padding: '12px 28px', borderTop: '1px solid rgba(0,212,255,0.1)', fontSize: 12, color: '#00d4ff' }}>
              ▶ {result.recommendation}
            </div>
          )}

          {/* Run again */}
          <div style={{ padding: '12px 28px', borderTop: '1px solid rgba(0,212,255,0.08)', textAlign: 'right' }}>
            <button
              onClick={() => { setResult(null); setFile(null); setUrl(''); }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,212,255,0.2)',
                color: '#00d4ff', padding: '8px 20px',
                fontFamily: 'Courier New, monospace',
                fontSize: 11, cursor: 'pointer', borderRadius: 4,
              }}
            >
              // RUN AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
