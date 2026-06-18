// Real-time behavioral biometric capture + scoring.
// Captures genuine keystroke and mouse dynamics (zero randomness) and
// scores them against published human-vs-automation timing/motion baselines.
// Runs entirely client-side — no network call, no latency.

export function createKeystrokeTracker() {
  const downTimes = new Map();
  const holdDurations = [];
  const interKeyGaps = [];
  let lastKeyUpTime = null;
  let firstKeyTime = null;
  let keyCount = 0;

  function onKeyDown(e) {
    const t = performance.now();
    if (!downTimes.has(e.key)) downTimes.set(e.key, t);
    if (firstKeyTime === null) firstKeyTime = t;
    if (lastKeyUpTime !== null) interKeyGaps.push(t - lastKeyUpTime);
  }

  function onKeyUp(e) {
    const t = performance.now();
    const downT = downTimes.get(e.key);
    if (downT !== undefined) {
      holdDurations.push(t - downT);
      downTimes.delete(e.key);
    }
    lastKeyUpTime = t;
    keyCount += 1;
  }

  function getSignals() {
    const totalTime = lastKeyUpTime && firstKeyTime ? (lastKeyUpTime - firstKeyTime) / 1000 : 0;
    return {
      avgKeyHold: round(average(holdDurations), 1),
      rhythmVariance: round(coefficientOfVariation(interKeyGaps), 3),
      typingSpeed: totalTime > 0 ? Math.round((keyCount / 5) / (totalTime / 60)) : 0,
      keyCount,
      sessionDuration: round(totalTime, 1),
    };
  }

  function reset() {
    downTimes.clear();
    holdDurations.length = 0;
    interKeyGaps.length = 0;
    lastKeyUpTime = null;
    firstKeyTime = null;
    keyCount = 0;
  }

  return { onKeyDown, onKeyUp, getSignals, reset };
}

export function createMouseTracker() {
  let lastPoint = null;
  let lastTime = null;
  const speeds = [];
  const points = [];

  function onMouseMove(e) {
    const t = performance.now();
    const point = { x: e.clientX, y: e.clientY };
    points.push(point);
    if (lastPoint && lastTime) {
      const dt = (t - lastTime) / 1000;
      if (dt > 0) speeds.push(Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) / dt);
    }
    lastPoint = point;
    lastTime = t;
  }

  function getSignals() {
    if (points.length < 2) return { mouseSpeed: 0, linearity: 0, pathPoints: points.length };
    const pathLength = points.slice(1).reduce(
      (sum, p, i) => sum + Math.hypot(p.x - points[i].x, p.y - points[i].y), 0
    );
    const straightLine = Math.hypot(
      points[points.length - 1].x - points[0].x,
      points[points.length - 1].y - points[0].y
    );
    return {
      mouseSpeed: round(average(speeds), 1),
      linearity: round(pathLength > 0 ? straightLine / pathLength : 0, 3),
      pathPoints: points.length,
    };
  }

  function reset() {
    lastPoint = null;
    lastTime = null;
    speeds.length = 0;
    points.length = 0;
  }

  return { onMouseMove, getSignals, reset };
}

// Deterministic weighted scoring model — based on known human-vs-bot
// keystroke/mouse dynamics ranges. Instant, explainable, no API call.
export function scoreBehavior(signals) {
  const { avgKeyHold = 0, rhythmVariance = 0, typingSpeed = 0, mouseSpeed = 0, linearity = 0, keyCount = 0 } = signals;
  const anomalies = [];
  let riskScore = 0;

  if (keyCount < 8) {
    return {
      verdict: 'INSUFFICIENT_DATA', riskScore: 0, confidence: 0, humanLikelihood: 0,
      anomalies: [{ type: 'Sample Size', severity: 'LOW', description: 'Not enough keystrokes captured for a reliable read — type a bit more.' }],
      sessionFingerprint: makeFingerprint(signals),
      recommendation: 'Collect more input before scoring.',
    };
  }

  if (avgKeyHold > 0 && avgKeyHold < 40) {
    riskScore += 30;
    anomalies.push({ type: 'Keystroke Dynamics', severity: 'HIGH', description: `Average key hold of ${avgKeyHold}ms is far faster than natural human pressure (typically 70-180ms).` });
  } else if (avgKeyHold > 400) {
    riskScore += 10;
    anomalies.push({ type: 'Keystroke Dynamics', severity: 'LOW', description: `Unusually long key holds (${avgKeyHold}ms) — could indicate accessibility input or distraction.` });
  }

  if (rhythmVariance < 0.08) {
    riskScore += 35;
    anomalies.push({ type: 'Rhythm Analysis', severity: 'HIGH', description: `Inter-key timing variance (${rhythmVariance}) is too uniform for natural typing — consistent with scripted input.` });
  } else if (rhythmVariance > 1.2) {
    riskScore += 8;
    anomalies.push({ type: 'Rhythm Analysis', severity: 'LOW', description: 'Highly irregular typing rhythm — may reflect distraction, not automation.' });
  }

  if (typingSpeed > 130) {
    riskScore += 15;
    anomalies.push({ type: 'Typing Speed', severity: 'MEDIUM', description: `${typingSpeed} WPM exceeds typical sustained human typing speed.` });
  }

  if (linearity > 0.97 && mouseSpeed > 0) {
    riskScore += 20;
    anomalies.push({ type: 'Mouse Dynamics', severity: 'MEDIUM', description: `Cursor path linearity of ${linearity} indicates near-perfectly straight movement, atypical of human motor control.` });
  }

  riskScore = Math.min(100, riskScore);
  const humanLikelihood = Math.max(0, 100 - riskScore);
  const verdict = riskScore >= 60 ? 'BOT' : riskScore >= 30 ? 'SUSPICIOUS' : 'HUMAN';

  if (anomalies.length === 0) {
    anomalies.push({ type: 'Overall Pattern', severity: 'LOW', description: 'Timing and motion patterns are consistent with natural human input.' });
  }

  return {
    verdict, riskScore, humanLikelihood, anomalies,
    confidence: keyCount > 30 ? 92 : keyCount > 15 ? 80 : 65,
    sessionFingerprint: makeFingerprint(signals),
    recommendation: verdict === 'BOT' ? 'Block or escalate to secondary verification (CAPTCHA / OTP).'
      : verdict === 'SUSPICIOUS' ? 'Flag for monitoring; request secondary signal if action is high-risk.'
      : 'No action required.',
  };
}

function average(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
function coefficientOfVariation(arr) {
  if (arr.length < 2) return 0;
  const mean = average(arr);
  if (mean === 0) return 0;
  const variance = arr.reduce((sum, v) => sum + (v - mean) ** 2, 0) / arr.length;
  return Math.sqrt(variance) / mean;
}
function round(n, d) { const f = 10 ** d; return Math.round(n * f) / f; }
function makeFingerprint(signals) {
  const str = JSON.stringify(signals) + Date.now();
  let hash = 0;
  for (let i = 0; i < str.length; i++) { hash = (hash << 5) - hash + str.charCodeAt(i); hash |= 0; }
  return 'sf_' + Math.abs(hash).toString(16).slice(0, 10);
}
