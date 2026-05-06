export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { identityData } = body;

    const systemPrompt = `You are VEMAR AI's identity graph analysis engine. You detect synthetic identities, stolen credentials, and AI-generated personas from identity signals.

Always respond with ONLY valid JSON in this exact structure:
{
  "verdict": "AUTHENTIC" | "SYNTHETIC" | "STOLEN" | "SUSPICIOUS",
  "threatScore": <number 0-100>,
  "confidence": <number 0-100>,
  "identityNodes": [
    { "node": "<node name>", "status": "VERIFIED"|"UNVERIFIED"|"ANOMALOUS", "detail": "<detail>" }
  ],
  "graphConsistency": <number 0-100>,
  "redFlags": ["<flag 1>", "<flag 2>"],
  "watermarkStatus": "CLEAN" | "FLAGGED" | "UNKNOWN",
  "recommendation": "<action>"
}`;

    const userPrompt = `Analyze this identity profile for synthetic/stolen identity signals:

Name: ${identityData?.name || 'Not provided'}
Email: ${identityData?.email || 'Not provided'}
Phone: ${identityData?.phone || 'Not provided'}
IP Address: ${identityData?.ip || 'Not provided'}
Account age: ${identityData?.accountAge || 'Unknown'}
Profile completeness: ${identityData?.profileCompleteness || 'Unknown'}%
Linked accounts: ${identityData?.linkedAccounts || 0}
Previous flags: ${identityData?.previousFlags || 0}
Country: ${identityData?.country || 'Unknown'}
Device fingerprint: ${identityData?.deviceFingerprint || 'Unknown'}

Build an identity graph analysis and determine if this is a real person, a synthetic AI-generated identity, or a stolen real identity being used fraudulently.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 700,
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
