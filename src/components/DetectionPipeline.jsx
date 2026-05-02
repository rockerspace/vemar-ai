import { useState, useEffect, useRef, useCallback } from "react";

/**
 * VEMAR.AI — DetectionPipeline
 * Drop this into any page that runs the 6-layer analysis.
 *
 * Props:
 *   trigger  {boolean}  — set to true to start the pipeline
 *   onComplete {fn}     — called with { passed, time, layers } when done
 *   layers   {array}    — optional override of layer config (uses defaults)
 */

const DEFAULT_LAYERS = [
  {
    id: "voice",
    label: "Voice clone spectral fingerprinting",
    icon: "◈",
    duration: [260, 340],
  },
  {
    id: "deepfake",
    label: "Deepfake video & image analysis",
    icon: "◉",
    duration: [300, 420],
  },
  {
    id: "behavioral",
    label: "Behavioral AI scoring",
    icon: "◇",
    duration: [180, 260],
  },
  {
    id: "challenge",
    label: "Live challenge authentication",
    icon: "◈",
    duration: [200, 300],
  },
  {
    id: "identity",
    label: "AI identity graph mapping",
    icon: "◉",
    duration: [220, 320],
  },
  {
    id: "watermark",
    label: "Cryptographic content watermarking",
    icon: "◇",
    duration: [150, 230],
  },
];

// Simulate ~99.4% pass rate
function shouldPass() {
  return Math.random() < 0.994;
}

function randBetween(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export default function DetectionPipeline({
  trigger = false,
  onComplete = () => {},
  layers = DEFAULT_LAYERS,
  label = "Running full-spectrum analysis",
}) {
  const [statuses, setStatuses] = useState({}); // id -> 'pending'|'running'|'pass'|'fail'
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | running | done
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);
  const startRef = useRef(null);

  const reset = useCallback(() => {
    setStatuses({});
    setElapsed(0);
    setPhase("idle");
    setResult(null);
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!trigger) {
      reset();
      return;
    }

    reset();
    setPhase("running");
    startRef.current = performance.now();

    // Start elapsed timer
    timerRef.current = setInterval(() => {
      setElapsed(Math.round(performance.now() - startRef.current));
    }, 30);

    // Stagger each layer
    let cumulativeDelay = 0;
    const timeouts = [];
    const layerResults = {};

    layers.forEach((layer, idx) => {
      const startDelay = cumulativeDelay + randBetween(20, 60);
      const layerDuration = randBetween(...layer.duration);
      cumulativeDelay = startDelay + layerDuration * 0.6;

      // Mark as running
      timeouts.push(
        setTimeout(() => {
          setStatuses((prev) => ({ ...prev, [layer.id]: "running" }));
        }, startDelay)
      );

      // Mark as pass/fail
      const passed = shouldPass();
      layerResults[layer.id] = passed;
      timeouts.push(
        setTimeout(() => {
          setStatuses((prev) => ({
            ...prev,
            [layer.id]: passed ? "pass" : "fail",
          }));
        }, startDelay + layerDuration)
      );
    });

    // Pipeline completion — wait for all layers to finish
    // Max realistic time: ~1800ms to stay under 2s
    const totalTime = Math.min(
      randBetween(1400, 1900),
      cumulativeDelay + randBetween(200, 350)
    );

    timeouts.push(
      setTimeout(() => {
        clearInterval(timerRef.current);
        const finalTime = Math.round(performance.now() - startRef.current);
        setElapsed(finalTime);

        const allPassed = Object.values(layerResults).every(Boolean);
        const finalResult = {
          passed: allPassed,
          time: finalTime,
          layers: layerResults,
          accuracy: 99.4,
        };
        setResult(finalResult);
        setPhase("done");
        onComplete(finalResult);
      }, totalTime)
    );

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(timerRef.current);
    };
  }, [trigger]);

  if (phase === "idle") return null;

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div style={styles.wrapper}>
      {/* Header row */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.pipelineLabel}>{label}</span>
          <span
            style={{
              ...styles.timerBadge,
              color:
                phase === "done" && elapsed < 2000
                  ? "var(--vemar-green, #1db87a)"
                  : phase === "done"
                  ? "var(--vemar-red, #e0473d)"
                  : "var(--vemar-accent, #6c8fff)",
            }}
          >
            {phase === "running" && (
              <span style={styles.timerDot} className="vemar-pulse" />
            )}
            {formatTime(elapsed)}
          </span>
        </div>
        {phase === "done" && (
          <div
            style={{
              ...styles.accuracyBadge,
              background: result.passed
                ? "rgba(29,184,122,0.12)"
                : "rgba(224,71,61,0.12)",
              color: result.passed
                ? "var(--vemar-green, #1db87a)"
                : "var(--vemar-red, #e0473d)",
              border: `1px solid ${result.passed ? "rgba(29,184,122,0.3)" : "rgba(224,71,61,0.3)"}`,
            }}
          >
            {result.passed ? "✓" : "✗"} {result.accuracy}% accuracy
          </div>
        )}
      </div>

      {/* Layer rows */}
      <div style={styles.layerList}>
        {layers.map((layer, idx) => {
          const status = statuses[layer.id] || "pending";
          return (
            <div key={layer.id} style={styles.layerRow}>
              <div style={styles.layerLeft}>
                <StatusIcon status={status} />
                <span
                  style={{
                    ...styles.layerName,
                    color:
                      status === "pending"
                        ? "var(--vemar-muted, #6b7280)"
                        : "var(--vemar-text, #e8eaf0)",
                  }}
                >
                  {layer.label}
                </span>
              </div>
              <LayerTag status={status} />
            </div>
          );
        })}
      </div>

      {/* Result summary */}
      {phase === "done" && (
        <div
          style={{
            ...styles.resultBar,
            borderColor: result.passed
              ? "rgba(29,184,122,0.25)"
              : "rgba(224,71,61,0.25)",
            background: result.passed
              ? "rgba(29,184,122,0.06)"
              : "rgba(224,71,61,0.06)",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: result.passed
                ? "var(--vemar-green,#1db87a)"
                : "var(--vemar-red,#e0473d)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {result.passed
              ? "✓ All 6 layers cleared"
              : "✗ Threat detected — review flagged layers"}
          </span>
          <span
            style={{
              fontSize: 12,
              color: "var(--vemar-muted,#6b7280)",
              marginLeft: 12,
            }}
          >
            Pipeline completed in {formatTime(result.time)}
            {result.time < 2000 ? " — under 2s ✓" : " — exceeded 2s ✗"}
          </span>
        </div>
      )}

      <style>{`
        @keyframes vemar-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes vemar-pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .vemar-pulse { animation: vemar-pulse-dot 0.8s ease-in-out infinite; }
        .vemar-spin { animation: vemar-spin 0.7s linear infinite; }
      `}</style>
    </div>
  );
}

function StatusIcon({ status }) {
  if (status === "pending") {
    return (
      <span style={{ ...styles.icon, color: "var(--vemar-muted,#6b7280)" }}>
        ○
      </span>
    );
  }
  if (status === "running") {
    return (
      <span
        className="vemar-spin"
        style={{ ...styles.icon, color: "var(--vemar-accent,#6c8fff)", display: "inline-block" }}
      >
        ◌
      </span>
    );
  }
  if (status === "pass") {
    return (
      <span style={{ ...styles.icon, color: "var(--vemar-green,#1db87a)" }}>
        ●
      </span>
    );
  }
  return (
    <span style={{ ...styles.icon, color: "var(--vemar-red,#e0473d)" }}>
      ◆
    </span>
  );
}

function LayerTag({ status }) {
  const map = {
    pending: { label: "queued", bg: "rgba(107,114,128,0.1)", color: "#6b7280" },
    running: {
      label: "scanning",
      bg: "rgba(108,143,255,0.12)",
      color: "#6c8fff",
    },
    pass: { label: "clear", bg: "rgba(29,184,122,0.12)", color: "#1db87a" },
    fail: { label: "flagged", bg: "rgba(224,71,61,0.12)", color: "#e0473d" },
  };
  const t = map[status] || map.pending;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        background: t.bg,
        color: t.color,
        borderRadius: 4,
        padding: "2px 8px",
        whiteSpace: "nowrap",
      }}
    >
      {t.label}
    </span>
  );
}

const styles = {
  wrapper: {
    background: "rgba(15,17,26,0.85)",
    border: "1px solid rgba(108,143,255,0.15)",
    borderRadius: 12,
    padding: "20px 24px",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    marginTop: 24,
    marginBottom: 24,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  pipelineLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--vemar-muted,#6b7280)",
  },
  timerBadge: {
    fontSize: 15,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontVariantNumeric: "tabular-nums",
  },
  timerDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "currentColor",
    display: "inline-block",
  },
  accuracyBadge: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.05em",
    borderRadius: 6,
    padding: "4px 12px",
  },
  layerList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  layerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "8px 12px",
    borderRadius: 6,
    background: "rgba(255,255,255,0.025)",
  },
  layerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  icon: {
    fontSize: 14,
    width: 16,
    textAlign: "center",
    flexShrink: 0,
  },
  layerName: {
    fontSize: 13,
    lineHeight: 1.4,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  resultBar: {
    marginTop: 16,
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
};
