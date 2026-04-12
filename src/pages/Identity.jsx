import { useState, useRef } from 'react'
const NODES = [
  { x: 130, y: 155, r: 22, color: '#00E5FF', label: 'REAL' },
  { x: 280, y: 80, r: 18, color: '#FF3D57', label: 'FAKE' },
  { x: 280, y: 240, r: 16, color: '#FF3D57', label: 'FAKE' },
  { x: 430, y: 155, r: 14, color: '#FFB300', label: '?' },
  { x: 220, y: 155, r: 20, color: '#FF3D57', label: 'FAKE' },
  { x: 350, y: 80, r: 14, color: '#B388FF', label: 'IP' },
  { x: 350, y: 240, r: 14, color: '#B388FF', label: 'DEV' },
  { x: 500, y: 80, r: 18, color: '#FF3D57', label: 'FAKE' },
]
const EDGES = [[0,1],[0,2],[0,3],[1,4],[2,4],[3,4],[4,5],[4,6],[3,7]]
function GraphTab() {
  return (
    <div>
      <p style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 600 }}>The AI Identity Graph maps relationships between identities, devices, IP addresses, and behavioral clusters to expose synthetic identity networks and coordinated fraud rings.</p>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '1rem' }}>
        <svg width="100%" viewBox="0 0 560 320" style={{ display: 'block' }}>
          {EDGES.map(([a, b], i) => <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke="#1E2D45" strokeWidth="1.5" />)}
          {NODES.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} fillOpacity=".2" stroke={n.color} strokeWidth="1.5" />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fill={n.color} fontSize="9" fontFamily="Courier New" fontWeight="700">{n.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        {[['#00E5FF', 'Verified Identity'], ['#FF3D57', 'Synthetic / Flagged'], ['#FFB300', 'Suspicious / Review'], ['#B388FF', 'Device / IP Node']].map(([c, l]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text2)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} /> {l}
          </div>
        ))}
      </div>
      <div className="panel" style={{ marginTop: '1rem' }}>
        <div className="panel-title">FLAGGED CLUSTER DETAILS</div>
        {[['Cluster Size', '7 synthetic identities', 'var(--red)'], ['Shared IP Range', '185.220.x.x (TOR exit)', 'var(--amber)'], ['Account Creation', 'Burst: 7 accounts in 4min', 'var(--red)'], ['Behavioral Overlap', '94% similarity score', 'var(--red)'], ['Recommendation', 'AUTO-BAN + REPORT', 'var(--cyan)']].map(([l, v, c]) => (
          <div key={l} className="breakdown-row"><span className="breakdown-label">{l}</span><span className="breakdown-val" style={{ color: c }}>{v}</span></div>
        ))}
      </div>
    </div>
  )
}
function WatermarkTab() {
  const [wmFile, setWmFile] = useState(null)
  const [wmResult, setWmResult] = useState(null)
  const [traceFile, setTraceFile] = useState(null)
  const [traceResult, setTraceResult] = useState(null)
  const wmRef = useRef(); const traceRef = useRef()
  return (
    <div>
      <p style={{ color: 'var(--text2)', fontSize: 12, lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 600 }}>VEMAR embeds invisible cryptographic watermarks in your media. If cloned or AI-synthesized, the watermark persists and can be traced back to the registered source.</p>
      <div className="wm-panel">
        <div className="wm-card">
          <div className="wm-label">REGISTER CONTENT</div>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: '.75rem' }}>Upload original media to embed a cryptographic identity watermark.</p>
          <input type="file" ref={wmRef} accept="audio/*,video/*,image/*" onChange={e => setWmFile(e.target.files[0])} style={{ display: 'none' }} />
          <div className="upload-zone" style={{ padding: '1.5rem' }} onClick={() => wmRef.current.click()}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{wmFile ? '✅' : '📂'}</div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{wmFile ? wmFile.name : 'UPLOAD MEDIA'}</div>
          </div>
          <button className="analyze-btn" style={{ marginTop: '.75rem' }} onClick={() => setWmResult('VEMAR-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now().toString(36).toUpperCase())} disabled={!wmFile}>EMBED WATERMARK</button>
          {wmResult && <div style={{ marginTop: '1rem' }}><div className="wm-label">WATERMARK HASH</div><div className="wm-hash">{wmResult}</div><div style={{ fontSize: 11, color: 'var(--green)', marginTop: '.5rem', letterSpacing: 1 }}>✓ WATERMARK EMBEDDED SUCCESSFULLY</div></div>}
        </div>
        <div className="wm-card">
          <div className="wm-label">TRACE CONTENT</div>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: '.75rem' }}>Scan suspected cloned content to detect and trace the original source watermark.</p>
          <input type="file" ref={traceRef} accept="audio/*,video/*,image/*" onChange={e => setTraceFile(e.target.files[0])} style={{ display: 'none' }} />
          <div className="upload-zone" style={{ padding: '1.5rem' }} onClick={() => traceRef.current.click()}>
            <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>{traceFile ? '✅' : '🔍'}</div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>{traceFile ? traceFile.name : 'UPLOAD SUSPECTED CLONE'}</div>
          </div>
          <button className="analyze-btn" style={{ marginTop: '.75rem' }} onClick={() => setTraceResult(Math.random() > 0.4 ? 'found' : 'notfound')} disabled={!traceFile}>TRACE ORIGIN</button>
          {traceResult && <div style={{ marginTop: '1rem' }}>
            {traceResult === 'found' ? (<><div style={{ color: 'var(--amber)', fontSize: 12, marginBottom: '.5rem', fontWeight: 700, letterSpacing: 1 }}>⚠ WATERMARK DETECTED — CLONE CONFIRMED</div><div className="wm-hash">ORIGIN: VEMAR-X7K2MN-1AB3C<br/>REGISTERED: 2025-03-12 14:22 UTC<br/>OWNER: user@protected.com<br/>PLATFORM: TikTok (unauthorized)</div></>) : (<div style={{ color: 'var(--text3)', fontSize: 12, letterSpacing: 1 }}>No VEMAR watermark detected.</div>)}
          </div>}
        </div>
      </div>
    </div>
  )
}
export default function Identity() {
  const [tab, setTab] = useState('graph')
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: 2, marginBottom: '.25rem' }}>IDENTITY DEFENSE</div>
      <div style={{ color: 'var(--text3)', fontSize: 11, letterSpacing: 2, marginBottom: '1.5rem' }}>IDENTITY GRAPHS · WATERMARKING · SYNTHETIC NETWORK DETECTION</div>
      <div className="tabs">
        <button className={`tab ${tab === 'graph' ? 'active' : ''}`} onClick={() => setTab('graph')}>AI IDENTITY GRAPH</button>
        <button className={`tab ${tab === 'watermark' ? 'active' : ''}`} onClick={() => setTab('watermark')}>CONTENT WATERMARKING</button>
      </div>
      {tab === 'graph' ? <GraphTab /> : <WatermarkTab />}
    </div>
  )
}
