export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { signals } = body;

    const systemPrompt = `You are VEMAR AI's behavioral biometric analysis engine. You detect synthetic identities and bot behavior from behavioral telemetry.

Always respond with ONLY valid JSON in this exact structure:
{
  "verdict": "HUMAN" | "SUSPICIOUS" | "BOT" | "SYNTHETIC_IDENTITY",
  "riskScore": <number 0-100>,
  "confidence": <number 0-100>,
  "anomalies": [
    { "type": "<anomaly type>", "severity": "LOW"|"MEDIUM"|"HIGH", "description": "<detail>" }
  ],
  "humanLikelihood": <number 0-100>,
  "sessionFingerprint": "<short hash-like string>",
  "recommendation": "<action to take>"
}`;

    const userPrompt = `Analyze these behavioral signals for synthetic identity / bot detection:

Keystroke dynamics:
- Average key hold duration: ${signals?.avgKeyHold || 'N/A'} ms
- Keystroke rhythm variance: ${signals?.rhythmVariance || 'N/A'}
- Typing speed: ${signals?.typingSpeed || 'N/A'} WPM

Mouse movement:
- Average movement speed: ${signals?.mouseSpeed || 'N/A'} px/s
- Movement linearity score: ${signals?.linearity || 'N/A'} (0=human curves, 1=bot straight lines)
- Click pattern regularity: ${signals?.clickRegularity || 'N/A'}

Session context:
- Session duration so far: ${signals?.sessionDuration || 'N/A'} seconds
- Actions per minute: ${signals?.actionsPerMinute || 'N/A'}
- User agent: ${signals?.userAgent || 'unknown'}
- Timezone offset: ${signals?.timezoneOffset || 'N/A'} minutes

Analyze these patterns and determine if this is a real human, a bot, or a synthetic identity.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b:free',
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) throw new Error(`Claude API error: ${response.status}`);

    const data = await response.json();
    const text = data.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
