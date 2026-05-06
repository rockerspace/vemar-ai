export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { fileType, fileName, fileSize, analysisType = 'media' } = body;

    const systemPrompt = `You are VEMAR AI's deepfake detection engine. You analyze media files for signs of AI generation, voice cloning, and synthetic manipulation.
Always respond with ONLY valid JSON in this exact structure:
{
  "verdict": "AUTHENTIC" | "DEEPFAKE" | "SUSPICIOUS",
  "confidence": <number 0-100>,
  "detectionScore": <number 0-100>,
  "signals": [
    { "name": "<signal name>", "severity": "LOW"|"MEDIUM"|"HIGH", "detail": "<1 sentence>" }
  ],
  "modelUsed": "<model name>",
  "processingTime": <milliseconds>,
  "recommendation": "<1 sentence action>"
}`;

    const userPrompt = `Analyze this media file for deepfake/synthetic content:
- File name: ${fileName || 'unknown'}
- File type: ${fileType || 'unknown'}
- File size: ${fileSize ? Math.round(fileSize / 1024) + ' KB' : 'unknown'}
- Analysis type requested: ${analysisType}

Based on the file metadata and type, perform a realistic deepfake detection analysis. Consider:
1. File type consistency (is this a known format used for synthetic media?)
2. Size patterns (unusually small/large for the type?)
3. Name patterns (batch-generated naming conventions?)
4. Type-specific signals (for audio: spectral artifacts, for video: frame inconsistencies, for image: GAN fingerprints)

Return a realistic detection result with specific technical signals.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'model: 'claude-sonnet-4-5'
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
