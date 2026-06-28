import { useState, useRef } from "react";
import DetectionPipeline from "../components/DetectionPipeline";
import { analyzeImageElement, analyzeVideoElement } from "../utils/visionML";

const URL_PLACEHOLDERS = {
  voice: "https://example.com/audio.mp3 or youtube.com/watch?v=...",
  video: "https://youtube.com/watch?v=... or vimeo.com/...",
  image: "https://example.com/image.jpg or imgur.com/...",
};

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function loadVideoFromFile(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.onloadedmetadata = () => resolve(video);
    video.onerror = reject;
    video.src = URL.createObjectURL(file);
  });
}

export default function Detect() {
  const [activeTab, setActiveTab] = useState("voice");
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [inputMode, setInputMode] = useState("file");
  const [triggerPipeline, setTriggerPipeline] = useState(false);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [realAnalysis, setRealAnalysis] = useState(null); // { deepfake: {...} } from visionML
  const [analysisError, setAnalysisError] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setTriggerPipeline(false); setPipelineResult(null); setRealAnalysis(null); setAnalysisError(""); }
  };

  const validateUrl = (val) => { try { new URL(val); return true; } catch { return false; } };

  const handleAnalyze = async () => {
    if (inputMode === "url") {
      if (!url.trim()) return;
      if (!validateUrl(url.trim())) { setUrlError("Please enter a valid URL (e.g. https://example.com/file.mp3)"); return; }
      setUrlError("");
    } else {
      if (!file) return;
    }
    setIsAnalyzing(true);
    setPipelineResult(null);
    setTriggerPipeline(false);
    setAnalysisError("");

    // Real analysis only runs for locally uploaded image/video files.
    // URL-based and voice/audio inputs still use the labeled simulation layers below.
    let layerResults = null;
    if (inputMode === "file" && file && (activeTab === "image" || activeTab === "video")) {
      try {
        if (activeTab === "image") {
          const img = await loadImageFromFile(file);
          const result = await analyzeImageElement(img);
          layerResults = { deepfake: { passed: result.verdict === "AUTHENTIC" } };
          setRealAnalysis({ deepfake: result });
        } else {
          const video = await loadVideoFromFile(file);
          await new Promise((r) => { if (video.readyState >= 1) r(); else video.onloadedmetadata = r; });
          const result = await analyzeVideoElement(video, 5);
          layerResults = { deepfake: { passed: result.verdict === "AUTHENTIC" } };
          setRealAnalysis({ deepfake: result });
        }
      } catch (err) {
        setAnalysisError("Real analysis failed (" + err.message + ") — falling back to simulated layers for this run.");
        setRealAnalysis(null);
      }
    } else {
      setRealAnalysis(null);
    }

    setTimeout(() => setTriggerPipeline(true), 50);
    window.__vemarLayerResults = layerResults; // read by onComplete via closure below
  };

  const handleReset = () => {
    setFile(null); setUrl(""); setUrlError(""); setTriggerPipeline(false);
    setPipelineResult(null); setIsAnalyzing(false); setRealAnalysis(null); setAnalysisError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePipelineComplete = (result) => { setPipelineResult(result); setIsAnalyzing(false); };
  const canAnalyze = inputMode === "file" ? !!file : !!url.trim();

  return (
    <div className="detect-page">
      <div className="detect-header">
        <h1>Detection Lab</h1>
        <p className="detect-subtitle">Upload a file or paste a URL. Image and video uploads run real client-side analysis (face detection, frequency artifacts, noise consistency). Voice and URL-based checks use labeled simulated layers for now.</p>
      </div>

      <div className="detect-tabs">
        {["voice", "video", "image"].map((tab) => (
          <button key={tab} className={`detect-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => { setActiveTab(tab); handleReset(); }}>
            {tab === "voice" ? "🎙 Voice" : tab === "video" ? "🎥 Video" : "🖼 Image"}
          </button>
        ))}
      </div>

      <div className="input-mode-toggle">
        <button className={`mode-btn ${inputMode === "file" ? "active" : ""}`} onClick={() => { setInputMode("file"); handleReset(); }}>📁 Upload File</button>
        <button className={`mode-btn ${inputMode === "url" ? "active" : ""}`} onClick={() => { setInputMode("url"); handleReset(); }}>🔗 Paste URL</button>
      </div>

      {inputMode === "file" && (
        <div className={`detect-dropzone ${file ? "has-file" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) { setFile(f); setTriggerPipeline(false); setPipelineResult(null); setRealAnalysis(null); } }}>
          <input ref={fileInputRef} type="file"
            accept={activeTab === "voice" ? "audio/*" : activeTab === "video" ? "video/*" : "image/*"}
            style={{ display: "none" }} onChange={handleFile} />
          {file ? (
            <div className="file-info">
              <span className="file-icon">{activeTab === "voice" ? "🎵" : activeTab === "video" ? "🎬" : "🖼"}</span>
              <div><p className="file-name">{file.name}</p><p className="file-size">{(file.size / 1024).toFixed(1)} KB</p></div>
            </div>
          ) : (
            <div className="dropzone-prompt">
              <span className="dropzone-icon">{activeTab === "voice" ? "◈" : activeTab === "video" ? "◉" : "◇"}</span>
              <p>Drop {activeTab} file here or click to browse</p>
              <span className="dropzone-hint">{activeTab === "voice" ? "Supports MP3, WAV, M4A, OGG" : activeTab === "video" ? "Supports MP4, MOV, WebM" : "Supports JPG, PNG, WEBP"}</span>
            </div>
          )}
        </div>
      )}

      {inputMode === "url" && (
        <div className="url-input-zone">
          <div className="url-input-wrapper">
            <span className="url-icon">🔗</span>
            <input type="url" className={`url-input ${urlError ? "error" : ""}`}
              placeholder={URL_PLACEHOLDERS[activeTab]} value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()} />
            {url && <button className="url-clear" onClick={() => { setUrl(""); setUrlError(""); }}>✕</button>}
          </div>
          {urlError && <p className="url-error">{urlError}</p>}
          <p className="url-hint">URL-based content can't be analyzed locally yet — this runs the labeled simulated layers.</p>
        </div>
      )}

      <div className="detect-actions">
        <button className="btn-analyze" onClick={handleAnalyze} disabled={!canAnalyze || isAnalyzing}>
          {isAnalyzing ? "Analyzing…" : "Run Full Analysis"}
        </button>
        {(file || url || pipelineResult) && <button className="btn-reset" onClick={handleReset}>Reset</button>}
      </div>

      {analysisError && <p className="url-error" style={{ marginTop: 8 }}>{analysisError}</p>}

      <DetectionPipeline trigger={triggerPipeline}
        label={`Running ${activeTab} analysis${inputMode === "url" ? " on URL" : ""}`}
        layerResults={window.__vemarLayerResults}
        onComplete={handlePipelineComplete} />

      {pipelineResult && (
        <div className={`threat-report ${pipelineResult.passed ? "clean" : "threat"}`}>
          <div className="threat-header">
            <span className="threat-verdict">{pipelineResult.passed ? "✓ No Synthetic Signatures Detected" : "✗ Threat Detected — Synthetic Content Identified"}</span>
          </div>

          {realAnalysis?.deepfake && (
            <div className="real-signals">
              <div className="real-signals-label">Real-time analysis signals (verdict: {realAnalysis.deepfake.verdict}, score: {realAnalysis.deepfake.detectionScore}/100, confidence: {realAnalysis.deepfake.confidence}%)</div>
              {realAnalysis.deepfake.signals.map((s, i) => (
                <div key={i} className="real-signal-row">
                  <span className={`real-signal-badge ${s.severity.toLowerCase()}`}>{s.severity}</span>
                  <div>
                    <span className="real-signal-name">{s.name}</span>
                    <span className="real-signal-detail">{s.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {inputMode === "url" && url && (
            <p className="threat-source">Source: <a href={url} target="_blank" rel="noreferrer" className="threat-url">{url.length > 60 ? url.slice(0, 60) + "…" : url}</a></p>
          )}

          <div className="threat-stats">
            <div className="threat-stat"><span className="ts-label">Pipeline time</span><span className="ts-value">{pipelineResult.time}ms</span></div>
            <div className="threat-stat"><span className="ts-label">Under 2s</span><span className="ts-value">{pipelineResult.time < 2000 ? "✓ Yes" : "✗ No"}</span></div>
          </div>
        </div>
      )}

      <style>{`
        .detect-page { max-width: 760px; margin: 0 auto; padding: 40px 24px; }
        .detect-header h1 { font-size: 28px; font-weight: 700; margin: 0 0 8px; color: var(--vemar-text, #e8eaf0); }
        .detect-subtitle { font-size: 14px; color: var(--vemar-muted, #6b7280); margin: 0 0 28px; line-height: 1.6; }
        .detect-tabs { display: flex; gap: 8px; margin-bottom: 16px; }
        .detect-tab { padding: 8px 18px; border-radius: 8px; border: 1px solid rgba(108,143,255,0.2); background: transparent; color: var(--vemar-muted, #6b7280); font-size: 13px; font-weight: 600; cursor: pointer; }
        .detect-tab.active { background: rgba(108,143,255,0.12); border-color: rgba(108,143,255,0.5); color: var(--vemar-accent, #6c8fff); }
        .input-mode-toggle { display: flex; gap: 8px; margin-bottom: 16px; }
        .mode-btn { padding: 7px 16px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: var(--vemar-muted, #6b7280); font-size: 13px; font-weight: 600; cursor: pointer; }
        .mode-btn.active { background: rgba(108,143,255,0.15); border-color: rgba(108,143,255,0.5); color: var(--vemar-accent, #6c8fff); }
        .detect-dropzone { border: 1.5px dashed rgba(108,143,255,0.25); border-radius: 12px; padding: 40px 24px; text-align: center; cursor: pointer; background: rgba(108,143,255,0.03); margin-bottom: 16px; }
        .detect-dropzone.has-file { border-color: rgba(108,143,255,0.5); }
        .dropzone-icon { font-size: 32px; color: var(--vemar-accent, #6c8fff); display: block; margin-bottom: 12px; }
        .dropzone-prompt p { color: var(--vemar-text, #e8eaf0); font-size: 15px; margin: 0 0 6px; }
        .dropzone-hint { font-size: 12px; color: var(--vemar-muted, #6b7280); }
        .file-info { display: flex; align-items: center; gap: 16px; justify-content: center; }
        .file-icon { font-size: 28px; }
        .file-name { font-size: 14px; font-weight: 600; color: var(--vemar-text, #e8eaf0); margin: 0 0 4px; }
        .file-size { font-size: 12px; color: var(--vemar-muted, #6b7280); margin: 0; }
        .url-input-zone { margin-bottom: 16px; }
        .url-input-wrapper { display: flex; align-items: center; gap: 10px; background: rgba(108,143,255,0.05); border: 1.5px solid rgba(108,143,255,0.25); border-radius: 12px; padding: 12px 16px; }
        .url-icon { font-size: 18px; flex-shrink: 0; }
        .url-input { flex: 1; background: transparent; border: none; outline: none; color: var(--vemar-text, #e8eaf0); font-size: 14px; }
        .url-input.error { color: #e0473d; }
        .url-clear { background: none; border: none; color: var(--vemar-muted, #6b7280); cursor: pointer; }
        .url-error { color: #e0473d; font-size: 12px; margin: 6px 4px 0; }
        .url-hint { font-size: 12px; color: var(--vemar-muted, #6b7280); margin: 8px 4px 0; }
        .detect-actions { display: flex; gap: 12px; margin-bottom: 4px; }
        .btn-analyze { padding: 11px 28px; border-radius: 8px; background: var(--vemar-accent, #6c8fff); border: none; color: #fff; font-size: 14px; font-weight: 700; cursor: pointer; }
        .btn-analyze:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-reset { padding: 11px 20px; border-radius: 8px; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: var(--vemar-muted, #6b7280); font-size: 14px; cursor: pointer; }
        .threat-report { border-radius: 12px; border: 1px solid; padding: 20px 24px; margin-top: 4px; }
        .threat-report.clean { border-color: rgba(29,184,122,0.25); background: rgba(29,184,122,0.05); }
        .threat-report.threat { border-color: rgba(224,71,61,0.25); background: rgba(224,71,61,0.05); }
        .threat-verdict { font-size: 14px; font-weight: 700; }
        .threat-report.clean .threat-verdict { color: #1db87a; }
        .threat-report.threat .threat-verdict { color: #e0473d; }
        .threat-header { margin-bottom: 12px; }
        .threat-source { font-size: 12px; color: var(--vemar-muted, #6b7280); margin: 0 0 16px; }
        .threat-url { color: var(--vemar-accent, #6c8fff); text-decoration: none; }
        .threat-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-top: 16px; }
        .threat-stat { display: flex; flex-direction: column; gap: 4px; }
        .ts-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--vemar-muted, #6b7280); font-weight: 600; }
        .ts-value { font-size: 16px; font-weight: 700; color: var(--vemar-text, #e8eaf0); }
        .real-signals { background: rgba(108,143,255,0.04); border: 1px solid rgba(108,143,255,0.15); border-radius: 8px; padding: 14px 16px; margin-bottom: 16px; }
        .real-signals-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--vemar-accent, #6c8fff); font-weight: 700; margin-bottom: 10px; }
        .real-signal-row { display: flex; gap: 10px; margin-bottom: 8px; align-items: flex-start; }
        .real-signal-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.06em; padding: 2px 7px; border-radius: 4px; white-space: nowrap; margin-top: 2px; }
        .real-signal-badge.low { background: rgba(29,184,122,0.15); color: #1db87a; }
        .real-signal-badge.medium { background: rgba(255,179,0,0.15); color: #ffb300; }
        .real-signal-badge.high { background: rgba(224,71,61,0.15); color: #e0473d; }
        .real-signal-name { font-size: 12px; font-weight: 700; color: var(--vemar-text, #e8eaf0); display: block; }
        .real-signal-detail { font-size: 11px; color: var(--vemar-muted, #6b7280); display: block; margin-top: 2px; }
      `}</style>
    </div>
  );
}
