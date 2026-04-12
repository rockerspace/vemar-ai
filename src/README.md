# VEMAR.AI — AI-Powered Digital Clone Defense

Real-time detection and defense against voice cloning, deepfakes, synthetic identities, and behavioral fraud.

**Live site:** https://vemar.ai  
**Stack:** React 18 · React Router v6 · Vite 5 · Pure CSS

---

## Quick start (local)

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Deploy to Vercel

This repo is connected to Vercel. Every push to `main` auto-deploys.

To deploy manually:
```bash
npm run build
npx vercel --prod
```

---

## Project structure

```
vemar-ai/
├── api/
│   └── chat.js              ← AI Analyst — self-contained KB, no API key needed
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── Logo.jsx
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   └── UIComponents.jsx ← AnimatedCounter, ScanProgress, showToast, etc.
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Detect.jsx
│   │   ├── Behavioral.jsx
│   │   ├── Identity.jsx
│   │   ├── Chat.jsx
│   │   ├── Market.jsx
│   │   ├── Pricing.jsx
│   │   ├── Auth.jsx
│   │   ├── Privacy.jsx
│   │   ├── Terms.jsx
│   │   ├── ApiDocs.jsx
│   │   └── Checkout.jsx     ← Payment page — Razorpay, Stripe, UPI, PayPal
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vercel.json
├── vite.config.js
└── package.json
```

---

## Routes

| Route | Page |
|---|---|
| `/` | Home |
| `/dashboard` | Live threat metrics |
| `/detect` | Voice/face/image detection lab |
| `/behavioral` | Behavioral AI + Live Challenge Auth |
| `/identity` | Identity graph + content watermarking |
| `/chat` | AI Threat Analyst (built-in KB) |
| `/market` | Market data, team, roadmap |
| `/pricing` | 3-tier pricing with compliance badges |
| `/auth` | Login & signup |
| `/privacy` | GDPR/CCPA Privacy Policy |
| `/terms` | Terms of Service |
| `/api-docs` | API reference (7 endpoints) |
| `/checkout` | Payment — Razorpay · Stripe · UPI · PayPal · Net Banking · Paytm |

---

## Environment variables (Vercel Settings → Environment Variables)

```env
# Razorpay — dashboard.razorpay.com → Settings → API Keys
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXX

# Stripe — dashboard.stripe.com → Developers → API Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXX
VITE_STRIPE_PRICE_PRO=price_XXXXXXXX
VITE_STRIPE_PRICE_ENTERPRISE=price_XXXXXXXX

# PayPal (optional)
VITE_PAYPAL_CHECKOUT_URL=
```

---

## Entities

- **VEMAR AI LLC** — Illinois, USA  
- **VEMAR AI Private Limited** — Mumbai, India

## Contact

- General: hello@vemar.ai  
- Support: support@vemar.ai  
- Legal: legal@vemar.ai
