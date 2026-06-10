export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  try {
    const body = await req.json();
    const { identityData } = body;

    const prompt = `You are an identity graph AI analyst. Analyze this identity profile for synthetic/stolen identity signals. Name: ${identityData?.name||'N/A'}, Email: ${identityData?.email||'N/A'}, Phone: ${identityData?.phone||'N/A'}, IP: ${identityData?.ip||'N/A'}, ProfileURL: ${identityData?.profileUrl||'N/A'}, AccountAge: ${identityData?.accountAge||'N/A'} days, ProfileCompleteness: ${identityData?.profileCompleteness||'N/A'}%, Country: ${identityData?.country||'N/A'}, LinkedAccounts: ${identityData?.linkedAccounts||0}, Flags: ${identityData?.previousFlags||0}. Respond with ONLY this JSON: {"verdict":"AUTHENTIC","threatScore":12,"confidence":88,"identityNodes":[{"node":"Email","status":"VERIFIED","detail":"Email domain consistent with profile age"}],"graphConsistency":88,"redFlags":[],"watermarkStatus":"CLEAN","recommendation":"Identity appears authentic"}`;

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
