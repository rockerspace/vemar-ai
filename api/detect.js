export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  try {
    const body = await req.json();
    const { fileType, fileName, fileSize, analysisType = 'media', url, mediaUrl } = body;
    const targetUrl = url || mediaUrl;

    const prompt = targetUrl
      ? `You are a deepfake detection AI. Analyze this URL for synthetic/deepfake content: ${targetUrl}. Analysis type: ${analysisType}. Respond with ONLY this JSON and nothing else: {"verdict":"AUTHENTIC","confidence":85,"detectionScore":15,"signals":[{"name":"Domain Analysis","severity":"LOW","detail":"No known synthetic media patterns detected"}],"modelUsed":"VEMAR-v1","processingTime":1200,"recommendation":"No action required"}`
      : `You are a deepfake detection AI. Analyze this media file for synthetic/deepfake content. Name: ${fileName||'unknown'}, Type: ${fileType||'unknown'}, Size: ${fileSize?Math.round(fileSize/1024)+'KB':'unknown'}, Analysis: ${analysisType}. Respond with ONLY this JSON and nothing else: {"verdict":"AUTHENTIC","confidence":85,"detectionScore":15,"signals":[{"name":"File Analysis","severity":"LOW","detail":"No synthetic patterns detected in file metadata"}],"modelUsed":"VEMAR-v1","processingTime":1200,"recommendation":"No action required"}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://vemar-ai.vercel.app',
        'X-Title': 'VEMAR.AI',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-31b-it:free',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter error ${response.status}: ${errText}`);
    }

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
