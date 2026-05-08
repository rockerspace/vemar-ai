export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,  // env var in Vercel dashboard
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: req.body.message }],
      system: 'You are VEMAR AI, an expert in deepfake detection and digital identity security.',
    }),
  });

  const data = await response.json();
  res.json({ text: data.content[0].text });
}
