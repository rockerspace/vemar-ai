code = open('api/chat.js').read()
new_code = """export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured' })
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const msg = (body || {}).message
    if (!msg) return res.status(400).json({ error: 'Message required' })
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', max_tokens: 1000, messages: [{ role: 'system', content: 'You are VEMAR AI Threat Analyst. Expert in voice cloning, deepfakes, behavioral fraud.' }, { role: 'user', content: msg }] }),
    })
    const d = await r.json()
    if (!r.ok) return res.status(r.status).json({ error: 'API error' })
    return res.status(200).json({ text: d.choices[0].message.content })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}"""
open('api/chat.js', 'w').write(new_code)
print('Done')
