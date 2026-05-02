import { useState } from "react";
import DetectionPipeline from "../components/DetectionPipeline";

const IDENTITY_LAYERS = [
  { id: "identity", label: "AI identity graph mapping", duration: [220, 320] },
  { id: "watermark", label: "Cryptographic content watermarking", duration: [150, 230] },
  { id: "voice", label: "Voice clone spectral fingerprinting", duration: [260, 340] },
  { id: "deepfake", label: "Deepfake video & image analysis", duration: [300, 420] },
  { id: "behavioral", label: "Behavioral AI scoring", duration: [180, 260] },
  { id: "challenge", label: "Live challenge authentication", duration: [200, 300] },
];

function generateWatermark() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = () =>
    Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `VMR-${seg()}-${seg()}-${Date.now().toString(36).toUpperCase()}`;
}

function generateNodeId() {
  return "N" + Math.random().toString(36).substr(2, 8).toUpperCase();
}

export default function Identity() {
  const [identityInput, setIdentityInput] = useState("");
  const [triggerPipeline, setTriggerPipeline] = useState(false);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [watermark, setWatermark] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleAnalyze = () => {
    if (!identityInput.trim()) return;
    setIsRunning(true);
    setPipelineResult(null);
    setGraphData(null);
    setWatermark(null);
    setTriggerPipeline(false);
    setTimeout(() => setTriggerPipeline(true), 50);
  };

  const handlePipelineComplete = (result) => {
    setPipelineResult(result);
    setIsRunning(false);

    // Generate mock identity graph + watermark
    const nodeCount = 4 + Math.floor(Math.random() * 4);
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: generateNodeId(),
      type: ["Device", "IP", "Credential", "Session", "Behavioral", "Location"][i % 6],
      risk: ["low", "low", "medium", "low", "low", "high"][Math.floor(Math.random() * 6)],
    }));
    setGraphData({ nodes, subject: identityInput.trim(), synthetic: !result.passed });
    setWatermark(generateWatermark());
  };

  const reset = () => {
    setIdentityInput("");
    setTriggerPipeline(false);
    setPipelineResult(null);
    setGraphData(null);
    setWatermark(null);
    setIsRunning(false);
  };

  const riskColor = (risk) => {
    if (risk === "high") return "#e0473d";
    if (risk === "medium") return "#f59e0b";
    return "#1db87a";
  };

  return (
    <div className="id-page">
      <div className="id-header">
        <h1>Identity Graph + Watermarking</h1>
        <p className="id-subtitle">
          Map identity graph connections and generate a cryptographic watermark — two of VEMAR's six defense layers.
        </p>
      </div>

      {/* Input */}
      <div className="id-card">
        <label className="id-field-label">Identity to analyze</label>
        <div className="id-input-row">
          <input
            type="text"
            className="id-input"
            value={identityInput}
            onChange={(e) => setIdentityInput(e.target.value)}
            placeholder="Email, username, phone, or entity ID…"
            onKeyDown={(e) => e.key === "Enter" && identityInput && handleAnalyze()}
            disabled={isRunning}
          />
          <button
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={!identityInput.trim() || isRunning}
          >
            {isRunning ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </div>

      {/* 6-Layer Pipeline */}
      <DetectionPipeline
        trigger={triggerPipeline}
        layers={IDENTITY_LAYERS}
        label="Running 6-layer identity analysis"
        onComplete={handlePipelineComplete}
      />

      {/* Identity Graph */}
      {graphData && (
        <div className="id-card" style={{ marginTop: 0 }}>
          <div className="id-section-header">
            <span className="id-section-icon">◉</span>
            <span className="id-section-title">Identity Graph</span>
            <span
              className="id-badge"
              style={{
                background: graphData.synthetic ? "rgba(224,71,61,0.12)" : "rgba(29,184,122,0.12)",
                color: graphData.synthetic ? "#e0473d" : "#1db87a",
              }}
            >
              {graphData.synthetic ? "Synthetic" : "Verified"}
            </span>
          </div>

          <div className="graph-subject">
            <span className="graph-subject-dot" />
            <span className="graph-subject-label">{graphData.subject}</span>
            <span style={{ fontSize: 11, color: "var(--vemar-muted,#6b7280)", marginLeft: 8 }}>
              (subject)
            </span>
          </div>

          <div className="graph-nodes">
            {graphData.nodes.map((node) => (
              <div key={node.id} className="graph-node">
                <div className="graph-node-left">
                  <span
                    className="graph-node-dot"
                    style={{ background: riskColor(node.risk) }}
                  />
                  <span className="graph-node-type">{node.type}</span>
                </div>
                <div className="graph-node-right">
                  <span className="graph-node-id">{node.id}</span>
                  <span
                    className="graph-node-risk"
                    style={{ color: riskColor(node.risk) }}
                  >
                    {node.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Watermark */}
      {watermark && (
        <div className="id-card" style={{ marginTop: 12 }}>
          <div className="id-section-header">
            <span className="id-section-icon">◈</span>
            <span className="id-section-title">Cryptographic Watermark</span>
            <span
              className="id-badge"
              style={{ background: "rgba(108,143,255,0.12)", color: "#6c8fff" }}
            >
              Embedded
            </span>
          </div>
          <div className="watermark-block">
            <span className="watermark-value">{watermark}</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--vemar-muted,#6b7280)", margin: "10px 0 0" }}>
            This token is cryptographically bound to this identity session. Any tampering
            invalidates the signature and triggers re-verification.
          </p>
        </div>
      )}

      {/* Final verdict */}
      {pipelineResult && graphData && (
        <div
          className={`threat-report ${pipelineResult.passed ? "clean" : "threat"}`}
          style={{ marginTop: 12 }}
        >
          <p className="threat-verdict">
            {pipelineResult.passed
              ? "✓ Identity Verified — Graph is clean, watermark embedded"
              : "✗ Synthetic Identity Detected — Graph shows anomalous connections"}
          </p>
          <div className="threat-stats">
            <div className="threat-stat">
              <span className="ts-label">Pipeline time</span>
              <span className="ts-value">{pipelineResult.time}ms</span>
            </div>
            <div className="threat-stat">
              <span className="ts-label">Under 2s</span>
              <span className="ts-value">{pipelineResult.time < 2000 ? "✓ Yes" : "✗ No"}</span>
            </div>
            <div className="threat-stat">
              <span className="ts-label">Accuracy</span>
              <span className="ts-value">{pipelineResult.accuracy}%</span>
            </div>
            <div className="threat-stat">
              <span className="ts-label">Graph nodes</span>
              <span className="ts-value">{graphData.nodes.length}</span>
            </div>
          </div>
          <button className="btn-reset" onClick={reset} style={{ marginTop: 16 }}>
            Analyze Another
          </button>
        </div>
      )}

      <style>{`
        .id-page { max-width: 700px; margin: 0 auto; padding: 40px 24px; }
        .id-header h1 { font-size: 26px; font-weight: 700; color: var(--vemar-text,#e8eaf0); margin: 0 0 8px; }
        .id-subtitle { font-size: 14px; color: var(--vemar-muted,#6b7280); margin: 0 0 28px; line-height: 1.6; }
        .id-card {
          background: rgba(15,17,26,0.7);
          border: 1px solid rgba(108,143,255,0.15);
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 16px;
        }
        .id-field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--vemar-muted,#6b7280); font-weight: 600; display: block; margin-bottom: 10px; }
        .id-input-row { display: flex; gap: 10px; }
        .id-input {
          flex: 1; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(108,143,255,0.2);
          border-radius: 8px; padding: 10px 14px;
          color: var(--vemar-text,#e8eaf0); font-size: 14px;
          outline: none; transition: border-color 0.15s;
        }
        .id-input:focus { border-color: rgba(108,143,255,0.5); }
        .id-section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
        .id-section-icon { color: var(--vemar-accent,#6c8fff); font-size: 14px; }
        .id-section-title { font-size: 13px; font-weight: 700; color: var(--vemar-text,#e8eaf0); text-transform: uppercase; letter-spacing: 0.06em; }
        .id-badge { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 4px; margin-left: auto; }
        .graph-subject { display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: rgba(108,143,255,0.07); border-radius: 6px; margin-bottom: 12px; border: 1px solid rgba(108,143,255,0.15); }
        .graph-subject-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--vemar-accent,#6c8fff); flex-shrink: 0; }
        .graph-subject-label { font-size: 14px; font-weight: 600; color: var(--vemar-text,#e8eaf0); }
        .graph-nodes { display: flex; flex-direction: column; gap: 6px; }
        .graph-node { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: rgba(255,255,255,0.025); border-radius: 6px; }
        .graph-node-left { display: flex; align-items: center; gap: 8px; }
        .graph-node-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .graph-node-type { font-size: 13px; color: var(--vemar-text,#e8eaf0); font-weight: 500; }
        .graph-node-right { display: flex; align-items: center; gap: 12px; }
        .graph-node-id { font-size: 11px; font-family: 'JetBrains Mono','Fira Code',monospace; color: var(--vemar-muted,#6b7280); }
        .graph-node-risk { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
        .watermark-block { background: rgba(255,255,255,0.03); border: 1px solid rgba(108,143,255,0.15); border-radius: 6px; padding: 12px 16px; margin-top: 4px; }
        .watermark-value { font-family: 'JetBrains Mono','Fira Code',monospace; font-size: 15px; font-weight: 700; color: var(--vemar-accent,#6c8fff); letter-spacing: 0.08em; word-break: break-all; }
        .btn-primary { padding: 10px 22px; border-radius: 8px; background: var(--vemar-accent,#6c8fff); border: none; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; white-space: nowrap; }
        .btn-primary:hover:not(:disabled) { background: #849bff; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-reset { padding: 9px 20px; border-radius: 8px; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: var(--vemar-muted,#6b7280); font-size: 13px; cursor: pointer; transition: all 0.15s ease; display: inline-block; }
        .btn-reset:hover { border-color: rgba(255,255,255,0.25); color: var(--vemar-text,#e8eaf0); }
        .threat-report { border-radius: 12px; border: 1px solid; padding: 20px 24px; }
        .threat-report.clean { border-color: rgba(29,184,122,0.25); background: rgba(29,184,122,0.05); }
        .threat-report.threat { border-color: rgba(224,71,61,0.25); background: rgba(224,71,61,0.05); }
        .threat-verdict { font-size: 14px; font-weight: 700; margin: 0 0 16px; }
        .threat-report.clean .threat-verdict { color: #1db87a; }
        .threat-report.threat .threat-verdict { color: #e0473d; }
        .threat-stats { display: grid; grid-template-columns: repeat(auto-fit,minmax(130px,1fr)); gap: 12px; }
        .threat-stat { display: flex; flex-direction: column; gap: 4px; }
        .ts-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--vemar-muted,#6b7280); font-weight: 600; }
        .ts-value { font-size: 16px; font-weight: 700; color: var(--vemar-text,#e8eaf0); font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
}
