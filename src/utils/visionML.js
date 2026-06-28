// Real client-side image/video authenticity analysis.
// Uses BlazeFace (a real, published TensorFlow.js face detector) plus
// genuine image-forensics signals: frequency-domain artifact analysis (FFT),
// sensor-noise consistency between face and background, and edge/boundary
// consistency at the face seam. Runs entirely in-browser — nothing uploaded.

let blazefaceModelPromise = null;

async function loadFaceModel() {
  if (!blazefaceModelPromise) {
    blazefaceModelPromise = (async () => {
      const tf = await import('@tensorflow/tfjs');
      const blazeface = await import('@tensorflow-models/blazeface');
      await tf.ready();
      return blazeface.load();
    })();
  }
  return blazefaceModelPromise;
}

export async function detectFaces(imageOrCanvas) {
  const model = await loadFaceModel();
  const predictions = await model.estimateFaces(imageOrCanvas, false);
  return predictions.map(p => ({
    topLeft: p.topLeft,
    bottomRight: p.bottomRight,
    probability: Array.isArray(p.probability) ? p.probability[0] : p.probability,
  }));
}

function drawToCanvas(source, w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(source, 0, 0, w, h);
  return { canvas, ctx };
}

function toGrayscale(imageData) {
  const { data, width, height } = imageData;
  const gray = new Float32Array(width * height);
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return gray;
}

// ---------- Iterative radix-2 FFT (Cooley-Tukey) ----------
function fft1d(real, imag) {
  const n = real.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [real[i], real[j]] = [real[j], real[i]];
      [imag[i], imag[j]] = [imag[j], imag[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wr0 = Math.cos(ang), wi0 = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let curWr = 1, curWi = 0;
      const half = len / 2;
      for (let k = 0; k < half; k++) {
        const aR = real[i + k], aI = imag[i + k];
        const bR = real[i + k + half] * curWr - imag[i + k + half] * curWi;
        const bI = real[i + k + half] * curWi + imag[i + k + half] * curWr;
        real[i + k] = aR + bR; imag[i + k] = aI + bI;
        real[i + k + half] = aR - bR; imag[i + k + half] = aI - bI;
        const nWr = curWr * wr0 - curWi * wi0;
        const nWi = curWr * wi0 + curWi * wr0;
        curWr = nWr; curWi = nWi;
      }
    }
  }
}

function fft2dMagnitude(gray, size) {
  const real = Float32Array.from(gray);
  const imag = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    fft1d(real.subarray(y * size, y * size + size), imag.subarray(y * size, y * size + size));
  }
  const colR = new Float32Array(size), colI = new Float32Array(size);
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) { colR[y] = real[y * size + x]; colI[y] = imag[y * size + x]; }
    fft1d(colR, colI);
    for (let y = 0; y < size; y++) { real[y * size + x] = colR[y]; imag[y * size + x] = colI[y]; }
  }
  const mag = new Float32Array(size * size);
  for (let i = 0; i < mag.length; i++) mag[i] = Math.hypot(real[i], imag[i]);
  return mag;
}

// Radial power spectrum + "peakiness". GAN upsampling/deconvolution layers
// leave sharp, localized periodic spikes in the mid/high frequency band;
// natural camera photos show a smooth, gradually falling spectrum — a
// documented signature from GAN-image-detection forensics research.
function analyzeSpectrum(gray, size) {
  const mag = fft2dMagnitude(gray, size);
  const maxR = Math.floor(size / 2);
  const bins = new Float64Array(maxR + 1);
  const counts = new Float64Array(maxR + 1);
  for (let y = 0; y < size; y++) {
    const fy = Math.min(y, size - y);
    for (let x = 0; x < size; x++) {
      const fx = Math.min(x, size - x);
      const r = Math.round(Math.hypot(fx, fy));
      if (r === 0 || r > maxR) continue;
      bins[r] += mag[y * size + x];
      counts[r] += 1;
    }
  }
  const radial = [];
  for (let r = 1; r <= maxR; r++) radial.push(counts[r] ? bins[r] / counts[r] : 0);

  const hiBand = radial.slice(Math.floor(radial.length * 0.35));
  const meanHi = average(hiBand);
  const maxHi = Math.max(...hiBand, 0.0001);
  const peakiness = meanHi > 0 ? maxHi / meanHi : 0;
  const total = radial.reduce((a, b) => a + b, 0) || 1;
  const highFreqRatio = hiBand.reduce((a, b) => a + b, 0) / total;

  return { peakiness: round(peakiness, 2), highFreqRatio: round(highFreqRatio, 3) };
}

// ---------- Noise residual consistency (face vs. background) ----------
function laplacianResidual(gray, w, h) {
  const out = new Float32Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      out[i] = Math.abs(4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - w] - gray[i + w]);
    }
  }
  return out;
}

function regionStats(residual, w, h, box) {
  const { x0, y0, x1, y1 } = box;
  const vals = [];
  for (let y = Math.max(1, y0); y < Math.min(h - 1, y1); y++) {
    for (let x = Math.max(1, x0); x < Math.min(w - 1, x1); x++) vals.push(residual[y * w + x]);
  }
  if (!vals.length) return { mean: 0, std: 0 };
  const mean = average(vals);
  const variance = vals.reduce((a, v) => a + (v - mean) ** 2, 0) / vals.length;
  return { mean, std: Math.sqrt(variance) };
}

// ---------- Edge / boundary consistency at the face seam ----------
function sobelMagnitude(gray, w, h, x, y) {
  const gx = -gray[(y-1)*w+x-1] + gray[(y-1)*w+x+1] - 2*gray[y*w+x-1] + 2*gray[y*w+x+1] - gray[(y+1)*w+x-1] + gray[(y+1)*w+x+1];
  const gy = -gray[(y-1)*w+x-1] - 2*gray[(y-1)*w+x] - gray[(y-1)*w+x+1] + gray[(y+1)*w+x-1] + 2*gray[(y+1)*w+x] + gray[(y+1)*w+x+1];
  return Math.hypot(gx, gy);
}

function ringStats(gray, w, h, box, ringWidth) {
  const vals = [];
  const { x0, y0, x1, y1 } = box;
  const xs0 = Math.max(1, x0 - ringWidth), xs1 = Math.min(w - 1, x1 + ringWidth);
  const ys0 = Math.max(1, y0 - ringWidth), ys1 = Math.min(h - 1, y1 + ringWidth);
  for (let y = ys0; y < ys1; y++) {
    for (let x = xs0; x < xs1; x++) {
      if (Math.abs(x - x0) <= ringWidth || Math.abs(x - x1) <= ringWidth || Math.abs(y - y0) <= ringWidth || Math.abs(y - y1) <= ringWidth) {
        vals.push(sobelMagnitude(gray, w, h, x, y));
      }
    }
  }
  return vals.length ? average(vals) : 0;
}

// ---------- Orchestration ----------
export async function analyzeImageElement(source) {
  const W = 512, H = 512;
  const { canvas, ctx } = drawToCanvas(source, W, H);
  const grayFull = toGrayscale(ctx.getImageData(0, 0, W, H));

  let faces = [];
  try { faces = await detectFaces(canvas); } catch { faces = []; }

  const signals = [];
  let riskScore = 0;

  signals.push(faces.length
    ? { name: 'Face Detection', severity: 'LOW', detail: `${faces.length} face(s) detected at ${(faces[0].probability * 100).toFixed(0)}% confidence.` }
    : { name: 'Face Detection', severity: 'LOW', detail: 'No face detected — frequency and noise checks ran on the full frame instead.' });

  const face = faces[0];
  const box = face
    ? { x0: Math.max(0, Math.round(face.topLeft[0])), y0: Math.max(0, Math.round(face.topLeft[1])), x1: Math.min(W, Math.round(face.bottomRight[0])), y1: Math.min(H, Math.round(face.bottomRight[1])) }
    : { x0: W * 0.25, y0: H * 0.25, x1: W * 0.75, y1: H * 0.75 };

  // 1. Frequency-domain artifact analysis on the face crop
  const cropSize = 128;
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = cropSize; cropCanvas.height = cropSize;
  const cropCtx = cropCanvas.getContext('2d', { willReadFrequently: true });
  cropCtx.drawImage(canvas, box.x0, box.y0, (box.x1 - box.x0) || 1, (box.y1 - box.y0) || 1, 0, 0, cropSize, cropSize);
  const spectrum = analyzeSpectrum(toGrayscale(cropCtx.getImageData(0, 0, cropSize, cropSize)), cropSize);

  if (spectrum.peakiness > 9) {
    riskScore += 30;
    signals.push({ name: 'Frequency Analysis', severity: 'HIGH', detail: `Sharp periodic spectral peak (peakiness ${spectrum.peakiness}) — consistent with GAN/upsampling artifacts rather than natural camera capture.` });
  } else if (spectrum.peakiness > 5) {
    riskScore += 12;
    signals.push({ name: 'Frequency Analysis', severity: 'MEDIUM', detail: `Elevated spectral peakiness (${spectrum.peakiness}) in the high-frequency band.` });
  } else {
    signals.push({ name: 'Frequency Analysis', severity: 'LOW', detail: `Spectral falloff (peakiness ${spectrum.peakiness}) is consistent with a natural photograph.` });
  }

  // 2. Noise residual consistency — face vs. background
  const residual = laplacianResidual(grayFull, W, H);
  const faceStats = regionStats(residual, W, H, box);
  const bgBox = box.y0 > 40 ? { x0: 0, y0: 0, x1: W, y1: box.y0 - 4 } : { x0: 0, y0: Math.min(H - 4, box.y1 + 4), x1: W, y1: H };
  const bgStats = regionStats(residual, W, H, bgBox);
  const noiseRatio = bgStats.std > 0.01 ? faceStats.std / bgStats.std : 1;

  if (noiseRatio < 0.45) {
    riskScore += 25;
    signals.push({ name: 'Noise Consistency', severity: 'HIGH', detail: `Face region is markedly smoother (ratio ${round(noiseRatio,2)}) than the background — a common signature of a synthetic face composited onto a real photo.` });
  } else if (noiseRatio < 0.7) {
    riskScore += 10;
    signals.push({ name: 'Noise Consistency', severity: 'MEDIUM', detail: `Face region noise is somewhat lower (ratio ${round(noiseRatio,2)}) than the background.` });
  } else {
    signals.push({ name: 'Noise Consistency', severity: 'LOW', detail: `Face and background noise levels are consistent (ratio ${round(noiseRatio,2)}).` });
  }

  // 3. Edge / boundary consistency at the face seam
  const seamGradient = ringStats(grayFull, W, H, box, 3);
  const interiorVals = [];
  for (let y = Math.max(1, box.y0 + 12); y < Math.min(H - 1, box.y1 - 12); y += 2) {
    for (let x = Math.max(1, box.x0 + 12); x < Math.min(W - 1, box.x1 - 12); x += 2) interiorVals.push(sobelMagnitude(grayFull, W, H, x, y));
  }
  const interiorGradient = interiorVals.length ? average(interiorVals) : 0;
  const edgeRatio = interiorGradient > 0.5 ? seamGradient / interiorGradient : 1;

  if (edgeRatio > 2.2) {
    riskScore += 20;
    signals.push({ name: 'Boundary Analysis', severity: 'MEDIUM', detail: `Sharp discontinuity at the face boundary (ratio ${round(edgeRatio,2)}) — can indicate a poorly blended composite.` });
  } else {
    signals.push({ name: 'Boundary Analysis', severity: 'LOW', detail: `Face boundary blends smoothly into the surrounding image (ratio ${round(edgeRatio,2)}).` });
  }

  riskScore = Math.min(100, riskScore);
  const verdict = riskScore >= 55 ? 'SYNTHETIC' : riskScore >= 25 ? 'SUSPICIOUS' : 'AUTHENTIC';

  return { verdict, detectionScore: riskScore, confidence: faces.length ? 78 : 55, signals, faceCount: faces.length };
}

export async function analyzeVideoElement(videoEl, sampleCount = 5) {
  const duration = videoEl.duration || 1;
  const timestamps = Array.from({ length: sampleCount }, (_, i) => (duration * (i + 0.5)) / sampleCount);
  const frameResults = [];

  for (const t of timestamps) {
    await seekTo(videoEl, t);
    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = videoEl.videoWidth || 512;
    frameCanvas.height = videoEl.videoHeight || 512;
    frameCanvas.getContext('2d').drawImage(videoEl, 0, 0, frameCanvas.width, frameCanvas.height);
    frameResults.push(await analyzeImageElement(frameCanvas));
  }

  const scores = frameResults.map(r => r.detectionScore);
  const avgScore = round(average(scores), 1);
  const scoreVariance = round(Math.sqrt(average(scores.map(s => (s - avgScore) ** 2))), 1);
  const facesFoundIn = frameResults.filter(r => r.faceCount > 0).length;

  const signals = [
    { name: 'Frame Sampling', severity: 'LOW', detail: `Analyzed ${sampleCount} frames across the clip; faces detected in ${facesFoundIn}/${sampleCount}.` },
    { name: 'Temporal Consistency', severity: scoreVariance > 22 ? 'MEDIUM' : 'LOW', detail: `Frame-to-frame variance: ${scoreVariance}. ${scoreVariance > 22 ? 'High variance can indicate inconsistent or partially swapped footage.' : 'Stable across sampled frames.'}` },
    ...frameResults[Math.floor(sampleCount / 2)].signals,
  ];

  let riskScore = Math.min(100, Math.round(avgScore + (scoreVariance > 22 ? 15 : 0)));
  const verdict = riskScore >= 55 ? 'SYNTHETIC' : riskScore >= 25 ? 'SUSPICIOUS' : 'AUTHENTIC';

  return { verdict, detectionScore: riskScore, confidence: facesFoundIn === sampleCount ? 76 : 60, signals, frameResults };
}

function seekTo(videoEl, time) {
  return new Promise((resolve) => {
    const onSeeked = () => { videoEl.removeEventListener('seeked', onSeeked); resolve(); };
    videoEl.addEventListener('seeked', onSeeked);
    videoEl.currentTime = time;
  });
}

function average(arr) { return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0; }
function round(n, d) { const f = 10 ** d; return Math.round(n * f) / f; }
