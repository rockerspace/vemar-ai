# VEMAR.AI — AI-Powered Digital Clone Defense

Multi-page React + Vite app for detecting and defending against AI voice cloning, deepfakes, synthetic identities, and behavioral fraud.

## ✅ QUICK START (Local)

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## 🚀 DEPLOY TO VERCEL (Step by Step)

### Option A — Drag & Drop (Easiest, No CLI needed)

1. Run `npm run build` inside the `vemar-ai` folder
2. Go to **https://vercel.com** → Sign up / Log in
3. Click **"Add New Project"** → **"Deploy without Git"**
4. Drag the **`dist`** folder into the browser window
5. Done — your site goes live at a `*.vercel.app` URL instantly!

### Option B — GitHub + Vercel (Recommended for updates)

1. Push this folder to a GitHub repo
2. Go to **https://vercel.com/new**
3. Import your GitHub repo
4. Framework: **Vite** (auto-detected)
5. Click **Deploy** — done!

### Option C — Vercel CLI

```bash
# Requires Node 20+
node --version   # must be v20+

npm run build
npx vercel --prod
# Follow the prompts — login, confirm project name
```

## 📁 Project Structure

```
vemar-ai/
├── public/
│   └── logo.png          ← Logo file (served as static asset)
├── src/
│   ├── components/
│   │   ├── Logo.jsx      ← Logo embedded as base64 (always works!)
│   │   ├── Navbar.jsx
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Detect.jsx
│   │   ├── Behavioral.jsx
│   │   ├── Identity.jsx
│   │   ├── Chat.jsx
│   │   ├── Market.jsx
│   │   ├── Pricing.jsx
│   │   └── Auth.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## 🤖 Claude AI Analyst

The AI Analyst page calls the Anthropic Claude API. In production, proxy through a backend:

```js
// Backend (Node/Express):
const Anthropic = require('@anthropic-ai/sdk')
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.post('/api/chat', async (req, res) => {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: req.body.message }],
  })
  res.json({ text: msg.content[0].text })
})
```

## 🛠 Tech Stack

- **React 18** + **React Router v6**
- **Vite 5** — build tool
- **Claude API** — AI Analyst
- **Pure CSS** — custom design system (no Tailwind)

## 📄 Pages

| Route | Page |
|-------|------|
| `/` | Home — hero, features, stats, roadmap |
| `/dashboard` | Live threat metrics & monitoring |
| `/detect` | Voice/face media detection lab |
| `/behavioral` | Behavioral AI + Live Challenge Auth |
| `/identity` | Identity graph + watermarking |
| `/chat` | Claude AI Analyst |
| `/market` | Market data, team, funding |
| `/pricing` | 3-tier pricing (Free/Pro/Enterprise) |
| `/auth` | Login & signup |
