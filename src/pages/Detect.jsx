import { useState, useRef } from "react";
import DetectionPipeline from "../components/DetectionPipeline";

const VOICE_LAYERS = [
  { id: "voice", label: "Voice clone spectral fingerprinting", duration: [260, 340] },
  { id: "deepfake", label: "Deepfake video & image analysis", duration: [300, 420] },
  { id: "behavioral", label: "Behavioral AI scoring", duration: [180, 260] },
  { id: "challenge", label: "Live challenge authentication", duration: [200, 300] },
  { id: "identity", label: "AI identity graph mapping", duration: [220, 320] },
  { id: "watermark", label: "Cryptographic content watermarking", duration: [150, 230] },
];

export default function Detect() {
  const [activeTab, setActiveTab] = useState("voice");
  const [file, setFile] = useState(null);
  const [triggerPipeline, setTriggerPipeline] = useState(false);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setTriggerPipeline(false);
      setPipelineResult(null);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    setIsAnalyzing(true);
    setPipelineResult(null);
    setTriggerPipeline(false);
    // Small delay so state resets cleanly before pipeline mounts
    setTimeout(() => setTriggerPipeline(true), 50);
  };

  const handlePipelineComplete = (result) => {
    setPipelineResult(result);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setFile(null);
    setTriggerPipeline(false);
    setPipelineResult(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="detect-page">
      <div className="detect-header">
        <h1>Detection Lab</h1>
        <p className="detect-subtitle">
          Upload voice or media — all six defense layers run in parallel, completing in under 2 seconds.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="detect-tabs">
        {["voice", "video", "image"].map((tab) => (
          <button
            key={tab}
            className={`detect-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              handleReset();
            }}
          >
            {tab === "voice" ? "🎙 Voice" : tab === "video" ? "🎥 Video" : "🖼 Image"}
          </button>
        ))}
      </div>

      {/* Upload zone */}
      <div
        className={`detect-dropzone ${file ? "has-file" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) {
            setFile(f);
            setTriggerPipeline(false);
            setPipelineResult(null);
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={
            activeTab === "voice"
              ? "audio/*"
              : activeTab === "video"
              ? "video/*"
              : "image/*"
          }
          style={{ display: "none" }}
          onChange={handleFile}
        />
        {file ? (
          <div className="file-info">
            <span className="file-icon">
              {activeTab === "voice" ? "🎵" : activeTab === "video" ? "🎬" : "🖼"}
            </span>
            <div>
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        ) : (
          <div className="dropzone-prompt">
            <span className="dropzone-icon">
              {activeTab === "voice" ? "◈" : activeTab === "video" ? "◉" : "◇"}
            </span>
            <p>Drop {activeTab} file here or click to browse</p>
            <span className="dropzone-hint">
              {activeTab === "voice"
                ? "Supports MP3, WAV, M4A, OGG"
                : activeTab === "video"
                ? "Supports MP4, MOV, WebM"
                : "Supports JPG, PNG, WEBP"}
            </span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="detect-actions">
        <button
          className="btn-analyze"
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing}
        >
          {isAnalyzing ? "Analyzing…" : "Run Full Analysis"}
        </button>
        {(file || pipelineResult) && (
          <button className="btn-reset" onClick={handleReset}>
            Reset
          </button>
        )}
      </div>

      {/* 6-Layer Pipeline */}
      <DetectionPipeline
        trigger={triggerPipeline}
        layers={VOICE_LAYERS}
        label={`Running 6-layer ${activeTab} analysis`}
        onComplete={handlePipelineComplete}
      />

      {/* Threat report */}
      {pipelineResult && (
        <div className={`threat-report ${pipelineResult.passed ? "clean" : "threat"}`}>
          <div className="threat-header">
            <span className="threat-verdict">
              {pipelineResult.passed
                ? "✓ Content Verified — No Synthetic Signatures Detected"
                : "✗ Threat Detected — Synthetic Content Identified"}
            </span>
          </div>
          <div className="threat-stats">
            <div className="threat-stat">
              <span className="ts-label">Pipeline time</span>
              <span className="ts-value">{pipelineResult.time}ms</span>
            </div>
            <div className="threat-stat">
              <span className="ts-label">Under 2s</span>
              <span className="ts-value">
                {pipelineResult.time < 2000 ? "✓ Yes" : "✗ No"}
              </span>
            </div>
            <div className="threat-stat">
              <span className="ts-label">Detection accuracy</span>
              <span className="ts-value">{pipelineResult.accuracy}%</span>
            </div>
            <div className="threat-stat">
              <span className="ts-label">Layers passed</span>
              <span className="ts-value">
                {Object.values(pipelineResult.layers).filter(Boolean).length} / 6
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .detect-page {
          max-width: 760px;
          margin: 0 auto;
          padding: 40px 24px;
        }
        .detect-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px;
          color: var(--vemar-text, #e8eaf0);
        }
        .detect-subtitle {
          font-size: 15px;
          color: var(--vemar-muted, #6b7280);
          margin: 0 0 28px;
          line-height: 1.6;
        }
        .detect-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .detect-tab {
          padding: 8px 18px;
          border-radius: 8px;
          border: 1px solid rgba(108,143,255,0.2);
          background: transparent;
          color: var(--vemar-muted, #6b7280);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          text-transform: capitalize;
        }
        .detect-tab:hover {
          border-color: rgba(108,143,255,0.5);
          color: var(--vemar-accent, #6c8fff);
        }
        .detect-tab.active {
          background: rgba(108,143,255,0.12);
          border-color: rgba(108,143,255,0.5);
          color: var(--vemar-accent, #6c8fff);
        }
        .detect-dropzone {
          border: 1.5px dashed rgba(108,143,255,0.25);
          border-radius: 12px;
          padding: 40px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(108,143,255,0.03);
          margin-bottom: 16px;
        }
        .detect-dropzone:hover, .detect-dropzone.has-file {
          border-color: rgba(108,143,255,0.5);
          background: rgba(108,143,255,0.06);
        }
        .dropzone-icon {
          font-size: 32px;
          color: var(--vemar-accent, #6c8fff);
          display: block;
          margin-bottom: 12px;
        }
        .dropzone-prompt p {
          color: var(--vemar-text, #e8eaf0);
          font-size: 15px;
          margin: 0 0 6px;
        }
        .dropzone-hint {
          font-size: 12px;
          color: var(--vemar-muted, #6b7280);
        }
        .file-info {
          display: flex;
          align-items: center;
          gap: 16px;
          justify-content: center;
        }
        .file-icon { font-size: 28px; }
        .file-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--vemar-text, #e8eaf0);
          margin: 0 0 4px;
        }
        .file-size {
          font-size: 12px;
          color: var(--vemar-muted, #6b7280);
          margin: 0;
        }
        .detect-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 4px;
        }
        .btn-analyze {
          padding: 11px 28px;
          border-radius: 8px;
          background: var(--vemar-accent, #6c8fff);
          border: none;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
          letter-spacing: 0.02em;
        }
        .btn-analyze:hover:not(:disabled) {
          background: #849bff;
          transform: translateY(-1px);
        }
        .btn-analyze:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .btn-reset {
          padding: 11px 20px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--vemar-muted, #6b7280);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-reset:hover {
          border-color: rgba(255,255,255,0.25);
          color: var(--vemar-text, #e8eaf0);
        }
        .threat-report {
          border-radius: 12px;
          border: 1px solid;
          padding: 20px 24px;
          margin-top: 4px;
        }
        .threat-report.clean {
          border-color: rgba(29,184,122,0.25);
          background: rgba(29,184,122,0.05);
        }
        .threat-report.threat {
          border-color: rgba(224,71,61,0.25);
          background: rgba(224,71,61,0.05);
        }
        .threat-verdict {
          font-size: 14px;
          font-weight: 700;
        }
        .threat-report.clean .threat-verdict { color: #1db87a; }
        .threat-report.threat .threat-verdict { color: #e0473d; }
        .threat-header { margin-bottom: 16px; }
        .threat-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }
        .threat-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ts-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--vemar-muted, #6b7280);
          font-weight: 600;
        }
        .ts-value {
          font-size: 16px;
          font-weight: 700;
          color: var(--vemar-text, #e8eaf0);
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </div>
  );
}
