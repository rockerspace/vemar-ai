export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  try {
    const body = await req.json();
    const { signals, url, analysisType } = body;

    const prompt = analysisType === 'url' && url
      ? `You are a behavioral AI analyst. Analyze this URL for bot/synthetic activity: ${url}. Respond with ONLY this JSON: {"verdict":"HUMAN","riskScore":15,"confidence":85,"anomalies":[{"type":"Pattern Analysis","severity":"LOW","description":"No bot patterns detected"}],"humanLikelihood":85,"sessionFingerprint":"sf_abc123","recommendation":"No action required"}`
      : `You are a behavioral AI analyst. Analyze these behavioral signals: avgKeyHold=${signals?.avgKeyHold||'N/A'}ms, rhythmVariance=${signals?.rhythmVariance||'N/A'}, typingSpeed=${signals?.typingSpeed||'N/A'}wpm, mouseSpeed=${signals?.mouseSpeed||'N/A'}px/s, linearity=${signals?.linearity||'N/A'}, sessionDuration=${signals?.sessionDuration||'N/A'}s. Respond with ONLY this JSON: {"verdict":"HUMAN","riskScore":15,"confidence":85,"anomalies":[{"type":"Keystroke Dynamics","severity":"LOW","description":"Natural human typing rhythm detected"}],"humanLikelihood":85,"sessionFingerprint":"sf_abc123","recommendation":"No action required"}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://vemar-ai.vercel.app',
        'X-Title': 'VEMAR.AI',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b:free',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(`OpenRouter error ${response.status}`);
    const data = await response.json();
    const text = data.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
