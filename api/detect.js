export const config = { runtime: 'edge' };

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const rateLimitMap = new Map();

const SSRF_BLOCKED = [
  /^https?:\/\/localhost/i,
  /^https?:\/\/127\./,
  /^https?:\/\/10\./,
  /^https?:\/\/192\.168\./,
  /^https?:\/\/172\.(1[6-9]|2[0-9]|3[01])\./,
  /^https?:\/\/169\.254\./,
  /^https?:\/\/0\./,
];

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  rateLimitMap.set(ip, { count: entry.count + 1, start: entry.start });
  return false;
}

function isSafeUrl(url) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    if (!parsed.hostname.includes('.')) return false;
    for (const pattern of SSRF_BLOCKED) {
      if (pattern.test(url)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function parseHiveResponse(data) {
  const output = data?.status?.[0]?.response?.output?.[0];
  if (!output) throw new Error('Unexpected response from detection service.');
  const classes = output.classes || [];
  const deepfakeScore = classes.find(c => c.class === 'yes_deepfake')?.score ?? 0;
  const syntheticScore = classes.find(c => c.class === 'yes_ai_generated')?.score ?? 0;
  const realScore = classes.find(c => c.class === 'no_deepfake')?.score ?? 1;
  const manipulationScore = Math.round(Math.max(deepfakeScore, syntheticScore) * 100);
  let verdict, confidence, explanation;
  if (manipulationScore >= 80) {
    verdict = 'DEEPFAKE_DETECTED'; confidence = 'HIGH';
    explanation = 'Strong indicators of synthetic face manipulation detected.';
  } else if (manipulationScore >= 50) {
    verdict = 'SUSPICIOUS'; confidence = 'MEDIUM';
    explanation = 'Some signs of manipulation detected. Manual review recommended.';
  } else if (manipulationScore >= 20) {
    verdict = 'LOW_RISK'; confidence = 'MEDIUM';
    explanation = 'Minor anomalies detected but likely authentic.';
  } else {
    verdict = 'AUTHENTIC'; confidence = 'HIGH';
    explanation = 'No significant signs of deepfake manipulation detected.';
  }
  return {
    verdict, confidence, manipulationScore, explanation,
    breakdown: {
      deepfake: Math.round(deepfakeScore * 100),
      aiGenerated: Math.round(syntheticScore * 100),
      authentic: Math.round(realScore * 100),
    },
    analyzedAt: new Date().toISOString(),
    model: 'hive-deepfake-v2',
  };
}

async function callHive(mediaUrl, fileData) {
  const apiKey = process.env.HIVE_API_KEY;
  if (!apiKey) throw new Error('HIVE_API_KEY is not configured in environment variables.');
  const payload = mediaUrl ? { url: mediaUrl } : { image: fileData };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch('https://api.thehive.ai/api/v2/task/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const msg = await res.text().catch(() => 'unknown');
      throw new Error(`Hive API error ${res.status}: ${msg}`);
    }
    return parseHiveResponse(await res.json());
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('Detection timed out. Try a smaller file.');
    throw err;
  }
}

export default async function handler(req) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
  }
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Wait 1 minute.', retryable: true }),
      { status: 429, headers: { ...headers, 'Retry-After': '60' } }
    );
  }
  let body;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers }); }
  const { mediaUrl, fileData, fileType } = body;
  if (!mediaUrl && !fileData) {
    return new Response(JSON.stringify({ error: 'Provide mediaUrl or fileData' }), { status: 400, headers });
  }
  if (mediaUrl && !isSafeUrl(mediaUrl)) {
    return new Response(
      JSON.stringify({ error: 'mediaUrl must be a public https URL. Internal IPs are blocked.' }),
      { status: 400, headers }
    );
  }
  try {
    const result = await callHive(mediaUrl, fileData);
    return new Response(JSON.stringify({ success: true, result }), { status: 200, headers });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || 'Detection failed', retryable: true }),
      { status: 500, headers }
    );
  }
}
