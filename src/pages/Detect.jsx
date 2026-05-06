import { useState, useRef } from 'react';

const VERDICT_COLOR = {
  AUTHENTIC: '#00e887',
  DEEPFAKE: '#ff3b5c',
  SUSPICIOUS: '#ffb300',
};

export default function Detect() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
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

  const runDetection = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          analysisType: file.type.startsWith('audio') ? 'voice' : file.type.startsWith('video') ? 'video' : 'image',
        }),
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
      <div style={{ fontSize: 11, color: '#00d4ff', letterSpacing: '0.15em', marginBottom: 16 }}>DETECTION LAB</div>
      <h1 style={{ fontSize: 32, color: '#fff', fontWeight: 700, marginBottom: 8 }}>
        DETECT. <span style={{ color: '#00d4ff' }}>ANALYZE.</span>
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 40 }}>
        Upload an image, audio, or video file. Our AI engine analyzes it for deepfake signatures in real time.
      </p>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current.click()}
        style={{
          border: `1px solid ${file ? '#00d4ff' : 'rgba(0,212,255,0.2)'}`,
          borderRadius: 4,
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: file ? 'rgba(0,212,255,0.05)' : 'rgba(0,0,0,0.3)',
          transition: 'all 0.2s',
          marginBottom: 24,
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

      {/* Run button */}
      <button
        onClick={runDetection}
        disabled={!file || loading}
        style={{
          background: file && !loading ? '#00d4ff' : 'rgba(0,212,255,0.15)',
          color: file && !loading ? '#020b18' : 'rgba(0,212,255,0.4)',
          border: 'none',
          padding: '14px 40px',
          fontFamily: 'Courier New, monospace',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.12em',
          cursor: file && !loading ? 'pointer' : 'not-allowed',
          width: '100%',
          transition: 'all 0.2s',
        }}
      >
        {loading ? '// ANALYZING...' : '// RUN DETECTION'}
      </button>

      {/* Error */}
      {error && (
        <div style={{ marginTop: 24, padding: 16, border: '1px solid rgba(255,59,92,0.3)', color: '#ff3b5c', fontSize: 12 }}>
          ERROR: {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{ marginTop: 32, border: '1px solid rgba(0,212,255,0.15)', background: 'rgba(0,0,0,0.4)' }}>
          {/* Verdict banner */}
          <div style={{
            padding: '24px 28px',
            borderBottom: '1px solid rgba(0,212,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginBottom: 4 }}>VERDICT</div>
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
                    padding: '2px 8px',
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: s.severity === 'HIGH' ? '#ff3b5c' : s.severity === 'MEDIUM' ? '#ffb300' : '#00e887',
                    border: `1px solid ${s.severity === 'HIGH' ? 'rgba(255,59,92,0.3)' : s.severity === 'MEDIUM' ? 'rgba(255,179,0,0.3)' : 'rgba(0,232,135,0.3)'}`,
                    whiteSpace: 'nowrap',
                    marginTop: 2,
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
          <div style={{ padding: '16px 28px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
            <span>MODEL: {result.modelUsed}</span>
            <span>{result.processingTime}ms</span>
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
