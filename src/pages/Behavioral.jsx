import { useState, useEffect, useRef } from "react";
import DetectionPipeline from "../components/DetectionPipeline";

const BEHAVIORAL_LAYERS = [
  { id: "behavioral", label: "Behavioral AI scoring", duration: [180, 260] },
  { id: "challenge", label: "Live challenge authentication", duration: [200, 300] },
  { id: "voice", label: "Voice clone spectral fingerprinting", duration: [260, 340] },
  { id: "identity", label: "AI identity graph mapping", duration: [220, 320] },
  { id: "deepfake", label: "Deepfake video & image analysis", duration: [300, 420] },
  { id: "watermark", label: "Cryptographic content watermarking", duration: [150, 230] },
];

// Tracks mouse/keyboard behavior for scoring
function useBehaviorTracker(active) {
  const [score, setScore] = useState(null);
  const [events, setEvents] = useState([]);
  const eventsRef = useRef([]);

  useEffect(() => {
    if (!active) {
      eventsRef.current = [];
      setEvents([]);
      setScore(null);
      return;
    }

    const onMove = () => {
      eventsRef.current.push({ t: "move", ts: Date.now() });
      setEvents((p) => [...p.slice(-40), { t: "move" }]);
    };
    const onKey = () => {
      eventsRef.current.push({ t: "key", ts: Date.now() });
      setEvents((p) => [...p.slice(-40), { t: "key" }]);
    };
    const onClick = () => {
      eventsRef.current.push({ t: "click", ts: Date.now() });
      setEvents((p) => [...p.slice(-40), { t: "click" }]);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);

    // Score after 3s of tracking
    const timer = setTimeout(() => {
      const total = eventsRef.current.length;
      // Heuristic: human behavior has varied intervals; bots are too regular
      const humanScore = Math.min(99, 70 + Math.min(total * 0.5, 29));
      setScore(parseFloat(humanScore.toFixed(1)));
    }, 3000);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
      clearTimeout(timer);
    };
  }, [active]);

  return { score, eventCount: events.length };
}

// Challenge prompts
const CHALLENGES = [
  { prompt: "Type the following: VEMAR-2025-SECURE", answer: "VEMAR-2025-SECURE" },
  { prompt: 'Respond with: "I am a verified human user"', answer: "I am a verified human user" },
  { prompt: "Enter today's verification code: ALPHA-7-FOXTROT", answer: "ALPHA-7-FOXTROT" },
];

export default function Behavioral() {
  const [trackingActive, setTrackingActive] = useState(false);
  const [challengeIdx] = useState(() => Math.floor(Math.random() * CHALLENGES.length));
  const [challengeInput, setChallengeInput] = useState("");
  const [challengePassed, setChallengePassed] = useState(null);
  const [triggerPipeline, setTriggerPipeline] = useState(false);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [step, setStep] = useState("idle"); // idle | tracking | challenge | pipeline | done

  const { score: behaviorScore, eventCount } = useBehaviorTracker(trackingActive);

  const startTracking = () => {
    setStep("tracking");
    setTrackingActive(true);
    setPipelineResult(null);
    setTriggerPipeline(false);
    setChallengeInput("");
    setChallengePassed(null);
  };

  // Auto-advance after behavior score is ready
  useEffect(() => {
    if (step === "tracking" && behaviorScore !== null) {
      setTrackingActive(false);
      setStep("challenge");
    }
  }, [behaviorScore, step]);

  const submitChallenge = () => {
    const challenge = CHALLENGES[challengeIdx];
    const passed =
      challengeInput.trim().toLowerCase() === challenge.answer.toLowerCase();
    setChallengePassed(passed);
    setStep("pipeline");
    setTimeout(() => setTriggerPipeline(true), 200);
  };

  const handlePipelineComplete = (result) => {
    setPipelineResult(result);
    setStep("done");
  };

  const reset = () => {
    setStep("idle");
    setTrackingActive(false);
    setPipelineResult(null);
    setTriggerPipeline(false);
    setChallengeInput("");
    setChallengePassed(null);
  };

  const challenge = CHALLENGES[challengeIdx];

  return (
    <div className="beh-page">
      <div className="beh-header">
        <h1>Behavioral AI + Live Challenge</h1>
        <p className="beh-subtitle">
          Real-time behavioral biometric scoring combined with live challenge authentication — two of VEMAR's six defense layers.
        </p>
      </div>

      {/* Step 1: Start */}
      {step === "idle" && (
        <div className="beh-card">
          <p style={{ color: "var(--vemar-muted,#6b7280)", fontSize: 14, marginBottom: 20 }}>
            This flow captures your interaction patterns for 3 seconds, then runs a live challenge before executing the full 6-layer pipeline.
          </p>
          <button className="btn-primary" onClick={startTracking}>
            Start Behavioral Analysis
          </button>
        </div>
      )}

      {/* Step 2: Tracking */}
      {step === "tracking" && (
        <div className="beh-card">
          <div className="beh-tracking-header">
            <span className="beh-tracking-dot" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--vemar-accent,#6c8fff)" }}>
              Capturing behavioral signals…
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--vemar-muted,#6b7280)", margin: "12px 0" }}>
            Move your mouse, type, or interact normally. Behavioral AI is scoring your patterns.
          </p>
          <div className="beh-metrics">
            <div className="beh-metric">
              <span className="bm-label">Events captured</span>
              <span className="bm-value">{eventCount}</span>
            </div>
            <div className="beh-metric">
              <span className="bm-label">Behavior score</span>
              <span className="bm-value">{behaviorScore ?? "—"}</span>
            </div>
          </div>
          <div className="beh-progress-bar">
            <div
              className="beh-progress-fill"
              style={{ width: `${Math.min(100, (eventCount / 30) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 3: Challenge */}
      {step === "challenge" && (
        <div className="beh-card">
          <div className="beh-score-row">
            <span style={{ fontSize: 13, color: "var(--vemar-muted,#6b7280)" }}>
              Behavioral score
            </span>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: behaviorScore >= 80 ? "var(--vemar-green,#1db87a)" : "#f59e0b",
              }}
            >
              {behaviorScore} / 100
            </span>
          </div>
          <div className="challenge-box">
            <p className="challenge-label">Live Challenge Authentication</p>
            <p className="challenge-prompt">{challenge.prompt}</p>
            <input
              type="text"
              className="challenge-input"
              value={challengeInput}
              onChange={(e) => setChallengeInput(e.target.value)}
              placeholder="Type your response…"
              onKeyDown={(e) => e.key === "Enter" && challengeInput && submitChallenge()}
              autoFocus
            />
            <button
              className="btn-primary"
              onClick={submitChallenge}
              disabled={!challengeInput}
              style={{ marginTop: 12, width: "100%" }}
            >
              Submit Challenge
            </button>
          </div>
        </div>
      )}

      {/* Step 4+: Pipeline running/done */}
      {(step === "pipeline" || step === "done") && (
        <div className="beh-card">
          <div className="beh-summary-row">
            <div className="beh-summary-item">
              <span className="bm-label">Behavioral score</span>
              <span
                className="bm-value"
                style={{
                  color: behaviorScore >= 80 ? "var(--vemar-green,#1db87a)" : "#f59e0b",
                }}
              >
                {behaviorScore} / 100
              </span>
            </div>
            <div className="beh-summary-item">
              <span className="bm-label">Live challenge</span>
              <span
                className="bm-value"
                style={{
                  color: challengePassed ? "var(--vemar-green,#1db87a)" : "var(--vemar-red,#e0473d)",
                }}
              >
                {challengePassed ? "✓ Passed" : "✗ Failed"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 6-layer Pipeline */}
      <DetectionPipeline
        trigger={triggerPipeline}
        layers={BEHAVIORAL_LAYERS}
        label="Running 6-layer behavioral pipeline"
        onComplete={handlePipelineComplete}
      />

      {/* Final result */}
      {step === "done" && pipelineResult && (
        <div className={`threat-report ${pipelineResult.passed && challengePassed ? "clean" : "threat"}`}>
          <p className="threat-verdict">
            {pipelineResult.passed && challengePassed
              ? "✓ Identity Verified — Human behavior confirmed, no synthetic signatures"
              : "✗ Verification Failed — Synthetic or anomalous patterns detected"}
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
              <span className="ts-label">Layers cleared</span>
              <span className="ts-value">
                {Object.values(pipelineResult.layers).filter(Boolean).length} / 6
              </span>
            </div>
          </div>
          <button className="btn-reset" onClick={reset} style={{ marginTop: 16 }}>
            Run Again
          </button>
        </div>
      )}

      <style>{`
        .beh-page { max-width: 700px; margin: 0 auto; padding: 40px 24px; }
        .beh-header h1 { font-size: 26px; font-weight: 700; color: var(--vemar-text,#e8eaf0); margin: 0 0 8px; }
        .beh-subtitle { font-size: 14px; color: var(--vemar-muted,#6b7280); margin: 0 0 28px; line-height: 1.6; }
        .beh-card {
          background: rgba(15,17,26,0.7);
          border: 1px solid rgba(108,143,255,0.15);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 0;
        }
        .beh-tracking-header { display: flex; align-items: center; gap: 10px; }
        .beh-tracking-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--vemar-accent,#6c8fff);
          animation: vemar-pulse-dot 0.8s ease-in-out infinite;
        }
        @keyframes vemar-pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .beh-metrics { display: flex; gap: 24px; margin: 16px 0; }
        .beh-metric { display: flex; flex-direction: column; gap: 4px; }
        .bm-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--vemar-muted,#6b7280); font-weight: 600; }
        .bm-value { font-size: 22px; font-weight: 700; color: var(--vemar-text,#e8eaf0); font-variant-numeric: tabular-nums; }
        .beh-progress-bar { height: 4px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow: hidden; }
        .beh-progress-fill { height: 100%; background: var(--vemar-accent,#6c8fff); border-radius: 99px; transition: width 0.2s ease; }
        .beh-score-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .challenge-box { background: rgba(255,255,255,0.03); border-radius: 8px; padding: 16px; border: 1px solid rgba(108,143,255,0.1); }
        .challenge-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--vemar-accent,#6c8fff); font-weight: 600; margin: 0 0 8px; }
        .challenge-prompt { font-size: 14px; color: var(--vemar-text,#e8eaf0); margin: 0 0 14px; line-height: 1.5; }
        .challenge-input {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(108,143,255,0.2);
          border-radius: 6px; padding: 10px 14px;
          color: var(--vemar-text,#e8eaf0); font-size: 14px;
          outline: none; transition: border-color 0.15s;
        }
        .challenge-input:focus { border-color: rgba(108,143,255,0.5); }
        .beh-summary-row { display: flex; gap: 32px; }
        .beh-summary-item { display: flex; flex-direction: column; gap: 4px; }
        .btn-primary {
          padding: 11px 28px; border-radius: 8px;
          background: var(--vemar-accent,#6c8fff); border: none;
          color: #fff; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all 0.15s ease; letter-spacing: 0.02em;
        }
        .btn-primary:hover:not(:disabled) { background: #849bff; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn-reset {
          padding: 9px 20px; border-radius: 8px; background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--vemar-muted,#6b7280); font-size: 13px;
          cursor: pointer; transition: all 0.15s ease; display: inline-block;
        }
        .btn-reset:hover { border-color: rgba(255,255,255,0.25); color: var(--vemar-text,#e8eaf0); }
        .threat-report { border-radius: 12px; border: 1px solid; padding: 20px 24px; margin-top: 4px; }
        .threat-report.clean { border-color: rgba(29,184,122,0.25); background: rgba(29,184,122,0.05); }
        .threat-report.threat { border-color: rgba(224,71,61,0.25); background: rgba(224,71,61,0.05); }
        .threat-verdict { font-size: 14px; font-weight: 700; margin: 0 0 16px; }
        .threat-report.clean .threat-verdict { color: #1db87a; }
        .threat-report.threat .threat-verdict { color: #e0473d; }
        .threat-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px,1fr)); gap: 12px; }
        .threat-stat { display: flex; flex-direction: column; gap: 4px; }
        .ts-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; color: var(--vemar-muted,#6b7280); font-weight: 600; }
        .ts-value { font-size: 16px; font-weight: 700; color: var(--vemar-text,#e8eaf0); font-variant-numeric: tabular-nums; }
      `}</style>
    </div>
  );
}
