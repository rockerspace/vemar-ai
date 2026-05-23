export const config = { runtime: 'edge' };

const MODEL = 'deepseek/deepseek-v4-flash:free';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  try {
    const body = await req.json();
    const { fileType, fileName, fileSize, analysisType = 'media', url, mediaUrl } = body;
    const targetUrl = url || mediaUrl;

    const systemPrompt = `You are VEMAR AI deepfake detection engine. Respond ONLY with valid JSON, no other text:
{"verdict":"AUTHENTIC","confidence":85,"detectionScore":15,"signals":[{"name":"signal name","severity":"LOW","detail":"detail here"}],"modelUsed":"VEMAR-v1","processingTime":1200,"recommendation":"action here"}`;

    const userPrompt = targetUrl
      ? `Analyze for deepfakes: URL=${targetUrl}, type=${analysisType}. Return realistic JSON result.`
      : `Analyze for deepfakes: file=${fileName||'unknown'}, type=${fileType||'unknown'}, size=${fileSize?Math.round(fileSize/1024)+'KB':'unknown'}, analysis=${analysisType}. Return realistic JSON result.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://vemar-ai.vercel.app',
        'X-Title': 'VEMAR.AI',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
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
