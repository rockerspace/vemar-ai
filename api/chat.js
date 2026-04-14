export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'KEY_MISSING', keys: Object.keys(process.env).join(',') })
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { message } = body || {}
    if (!message) return res.status(400).json({ error: 'Message required' })
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: "You are VEMAR's AI Threat Analyst. Expert in AI voice cloning, deepfakes, behavioral fraud, identity graphs, watermarking.", messages: [{ role: 'user', content: message }] }),
    })
    const data = await response.json()
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || 'Claude API error' })
    const text = data.content.filter(b => b.type === 'text').map(b => b.text).join('')
    return res.status(200).json({ text })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
