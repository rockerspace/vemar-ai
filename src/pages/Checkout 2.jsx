import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { showToast } from '../components/UIComponents'

// ─── Plans with monthly + annual pricing ─────────────────────────
const PLANS = {
  FREE: {
    name: 'FREE',
    monthlyUSD: 0, annualUSD: 0,
    monthlyINR: 0, annualINR: 0,
    desc: 'Essential detection for personal use',
    color: 'var(--text3)',
    features: ['10 scans/month', 'Voice clone detection', 'Basic dashboard', 'Email alerts'],
  },
  PRO: {
    name: 'PRO',
    monthlyUSD: 49,  annualUSD: 39,   // $39/mo billed annually = $468/yr (save $120)
    monthlyINR: 4099, annualINR: 3299, // ₹3299/mo billed annually
    desc: 'Full detection suite for professionals',
    color: 'var(--cyan)',
    features: ['Unlimited scans', 'Voice + face + behavioral', 'Live challenge auth', 'Identity graph (3 profiles)', 'Content watermarking', 'AI Analyst access', 'Automated takedowns'],
  },
  ENTERPRISE: {
    name: 'ENTERPRISE',
    monthlyUSD: 299,  annualUSD: 239,
    monthlyINR: 24999, annualINR: 19999,
    desc: 'Org-scale protection with API',
    color: 'var(--amber)',
    features: ['Everything in Pro', 'API access (100k calls/mo)', 'Unlimited profiles', 'Web3 / Blockchain identity', 'Custom integrations', 'Gov & law enforcement API', 'Dedicated account manager'],
  },
}

// ─── Payment gateways ─────────────────────────────────────────────
const GATEWAYS = [
  {
    id: 'razorpay',
    label: 'Razorpay',
    desc: 'UPI · Debit/Credit Cards · Net Banking · Wallets',
    badge: 'RECOMMENDED · INDIA',
    badgeColor: 'var(--cyan)',
    currencies: ['INR'],
    logo: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#2D6FE8"/><path d="M7 16L10.5 8H13L14.5 12.5L16.5 8H19L15 17H12.5L11 12.5L9 17L7 16Z" fill="white"/></svg>,
  },
  {
    id: 'upi',
    label: 'UPI',
    desc: 'GPay · PhonePe · Paytm · BHIM · Any UPI app',
    badge: 'INSTANT · INDIA',
    badgeColor: 'var(--green)',
    currencies: ['INR'],
    logo: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#5F259F"/><path d="M12 4L6 12.5H10.5L8.5 20L18 11.5H13L15 4H12Z" fill="white"/></svg>,
  },
  {
    id: 'paytm',
    label: 'Paytm',
    desc: 'Paytm Wallet · UPI · Paytm Postpaid',
    badge: 'INDIA',
    badgeColor: 'var(--cyan)',
    currencies: ['INR'],
    logo: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#00B9F1"/><rect x="5" y="9" width="6" height="6" rx="1" fill="white"/><rect x="13" y="9" width="6" height="6" rx="1" fill="#002970"/></svg>,
  },
  {
    id: 'card',
    label: 'Debit / Credit Card',
    desc: 'Visa · Mastercard · RuPay · Amex',
    badge: 'ALL CARDS',
    badgeColor: 'var(--text2)',
    currencies: ['INR', 'USD', 'EUR', 'GBP'],
    logo: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#1A1F36"/><rect x="3" y="8" width="18" height="3" fill="#4F566B"/><rect x="3" y="13" width="6" height="2" rx="1" fill="#697386"/><rect x="11" y="13" width="4" height="2" rx="1" fill="#697386"/></svg>,
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    desc: 'SBI · HDFC · ICICI · Axis · Kotak · 50+ banks',
    badge: 'INDIA',
    badgeColor: 'var(--amber)',
    currencies: ['INR'],
    logo: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#1A3A6B"/><rect x="5" y="7" width="14" height="2" fill="white"/><rect x="5" y="11" width="14" height="1" fill="white" opacity="0.6"/><rect x="5" y="14" width="8" height="3" rx="1" fill="white" opacity="0.7"/><rect x="15" y="14" width="4" height="3" rx="1" fill="white"/></svg>,
  },
  {
    id: 'paypal',
    label: 'PayPal',
    desc: 'PayPal Balance · Linked Bank · Card',
    badge: 'INTERNATIONAL',
    badgeColor: 'var(--text2)',
    currencies: ['USD', 'EUR', 'GBP', 'AUD'],
    logo: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="4" fill="#003087"/><path d="M15.5 7H11.5C11.2 7 10.9 7.2 10.8 7.5L9 16.5C9 16.7 9.2 16.9 9.4 16.9H11.4C11.7 16.9 11.9 16.7 12 16.4L12.4 14.2C12.5 13.9 12.7 13.7 13 13.7H14C16.2 13.7 17.6 12.5 18 10.4C18.2 9.5 18 8.7 17.5 8.2C16.9 7.5 16.3 7 15.5 7Z" fill="#009CDE"/><path d="M9.5 9H7.5C7.2 9 6.9 9.2 6.8 9.5L5 18.5C5 18.7 5.2 18.9 5.4 18.9H7.2C7.5 18.9 7.7 18.7 7.8 18.4L8.2 16.2C8.3 15.9 8.5 15.7 8.8 15.7H9.8C12 15.7 13.4 14.5 13.8 12.4C14 11.5 13.8 10.7 13.3 10.2C12.7 9.5 11.3 9 9.5 9Z" fill="white"/></svg>,
  },
]

// ─── Load Razorpay SDK ────────────────────────────────────────────
function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

// ─── Main component ───────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const initialPlan = params.get('plan')?.toUpperCase()
  const validPlan = PLANS[initialPlan] ? initialPlan : 'PRO'

  const [plan,     setPlan]     = useState(validPlan)
  const [billing,  setBilling]  = useState('monthly')   // 'monthly' | 'annual'
  const [gateway,  setGateway]  = useState('razorpay')
  const [currency, setCurrency] = useState('INR')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [upiId,    setUpiId]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [step,     setStep]     = useState(1)

  const p = PLANS[plan]
  const isAnnual = billing === 'annual'

  // Price based on billing period + currency
  const priceUSD = isAnnual ? p.annualUSD  : p.monthlyUSD
  const priceINR = isAnnual ? p.annualINR  : p.monthlyINR
  const displayPrice  = currency === 'INR' ? priceINR : priceUSD
  const displaySymbol = currency === 'INR' ? '₹' : '$'

  // Annual savings
  const savingsUSD = (p.monthlyUSD - p.annualUSD) * 12
  const savingsINR = (p.monthlyINR - p.annualINR) * 12

  // Switch currency when gateway changes
  useEffect(() => {
    if (['razorpay', 'upi', 'paytm', 'netbanking'].includes(gateway)) setCurrency('INR')
    else if (gateway === 'paypal') setCurrency('USD')
    // card supports both — keep current
  }, [gateway])

  // ─── Razorpay handler (covers Razorpay, UPI, Paytm, Netbanking, Card) ──
  const handleRazorpay = async () => {
    const ok = await loadRazorpay()
    if (!ok) { showToast('Could not load Razorpay. Check connection.', 'error'); return }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_REPLACE_ME',
      amount: priceINR * 100, // paise
      currency: 'INR',
      name: 'VEMAR.AI',
      description: `${p.name} Plan — ${isAnnual ? 'Annual' : 'Monthly'}`,
      image: 'https://vemar.ai/logo.png',
      prefill: { name, email },
      notes: { plan, billing },
      theme: { color: '#00E5FF' },
      modal: { escape: true, backdropClose: false },
      handler: () => {
        showToast(`Payment successful! Welcome to VEMAR.AI ${p.name} 🎉`, 'success')
        setTimeout(() => navigate('/dashboard'), 1200)
      },
    }

    // Pre-select payment method based on gateway choice
    if (gateway === 'upi')        options.method = { upi: true, card: false, netbanking: false, wallet: false }
    if (gateway === 'paytm')      options.method = { wallet: true, upi: false, card: false, netbanking: false }
    if (gateway === 'netbanking') options.method = { netbanking: true, upi: false, card: false, wallet: false }
    if (gateway === 'card')       options.method = { card: true, upi: false, netbanking: false, wallet: false }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', e => {
      showToast('Payment failed: ' + (e.error?.description || 'Please try again'), 'error')
      setLoading(false)
    })
    rzp.open()
    setLoading(false)
  }

  // ─── PayPal handler ───────────────────────────────────────────
  const handlePayPal = () => {
    const url = import.meta.env.VITE_PAYPAL_CHECKOUT_URL ||
      `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=billing@vemar.ai` +
      `&item_name=${encodeURIComponent('VEMAR.AI ' + p.name + ' ' + (isAnnual ? 'Annual' : 'Monthly'))}` +
      `&amount=${isAnnual ? priceUSD * 12 : priceUSD}&currency_code=USD` +
      `&return=${encodeURIComponent(window.location.origin + '/dashboard?payment=success')}` +
      `&cancel_return=${encodeURIComponent(window.location.origin + '/checkout?plan=' + plan)}`
    window.open(url, '_blank', 'width=620,height=700')
    setLoading(false)
  }

  // ─── Main pay dispatcher ──────────────────────────────────────
  const handlePay = async () => {
    if (!name.trim()) { showToast('Please enter your full name', 'error'); return }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { showToast('Please enter a valid email', 'error'); return }
    if (gateway === 'upi' && !upiId.trim()) { showToast('Please enter your UPI ID', 'error'); return }
    if (p.monthlyUSD === 0) {
      showToast('Free plan activated! Redirecting...', 'success')
      setTimeout(() => navigate('/dashboard'), 900)
      return
    }
    setLoading(true)
    if (gateway === 'paypal') handlePayPal()
    else await handleRazorpay()
  }

  const selectedGateway = GATEWAYS.find(g => g.id === gateway)

  const inputStyle = {
    width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)',
    color: 'var(--text)', padding: '11px 13px', fontFamily: 'var(--font)',
    fontSize: 13, outline: 'none', transition: 'border-color .2s',
  }

  return (
    <div className="page-enter" style={{ maxWidth: 780, margin: '2rem auto', padding: '0 1rem 4rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--cyan)', marginBottom: 4 }}>CHECKOUT</div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>Secure Payment</h1>
        <p style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 1 }}>
          256-bit TLS · PCI DSS · No card data stored by VEMAR.AI
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 270px', gap: '1.25rem', alignItems: 'start' }}>

        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div>

          {/* STEP 1 — Plan + Billing */}
          <div style={{ background: 'var(--bg2)', border: `1px solid ${step === 1 ? 'var(--cyan)' : 'var(--border)'}`, marginBottom: '1rem' }}>
            <div style={{ padding: '13px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: step > 1 ? 'pointer' : 'default' }}
              onClick={() => step > 1 && setStep(1)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: step > 1 ? 'var(--green)' : 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--bg)' }}>
                  {step > 1 ? '✓' : '1'}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>SELECT PLAN & BILLING</span>
              </div>
              {step > 1 && <span style={{ fontSize: 11, color: 'var(--cyan)', letterSpacing: 1 }}>
                {plan} · {billing} · EDIT
              </span>}
            </div>

            {step === 1 && (
              <div style={{ padding: '0 16px 16px' }}>

                {/* Billing toggle */}
                <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', background: 'var(--bg3)', padding: 4, borderRadius: 4 }}>
                  {['monthly', 'annual'].map(b => (
                    <button key={b} onClick={() => setBilling(b)} style={{
                      flex: 1, padding: '8px 0', background: billing === b ? 'var(--cyan)' : 'transparent',
                      border: 'none', color: billing === b ? 'var(--bg)' : 'var(--text3)',
                      fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, letterSpacing: 2,
                      textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, transition: 'all .2s',
                      position: 'relative',
                    }}>
                      {b === 'annual' ? 'ANNUAL' : 'MONTHLY'}
                      {b === 'annual' && <span style={{ marginLeft: 6, fontSize: 9, background: billing === 'annual' ? 'var(--bg)' : 'var(--green)', color: billing === 'annual' ? 'var(--cyan)' : 'var(--bg)', padding: '1px 5px', borderRadius: 10 }}>SAVE 20%</span>}
                    </button>
                  ))}
                </div>

                {/* Plan cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: '1rem' }}>
                  {Object.values(PLANS).map(pl => {
                    const price = currency === 'INR'
                      ? (isAnnual ? pl.annualINR : pl.monthlyINR)
                      : (isAnnual ? pl.annualUSD : pl.monthlyUSD)
                    return (
                      <button key={pl.name} onClick={() => setPlan(pl.name)} style={{
                        background: plan === pl.name ? 'rgba(0,229,255,.08)' : 'var(--bg3)',
                        border: `1px solid ${plan === pl.name ? pl.color : 'var(--border)'}`,
                        padding: '12px 8px', cursor: 'pointer', fontFamily: 'var(--font)',
                        textAlign: 'center', transition: 'all .2s',
                      }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: pl.color, marginBottom: 5 }}>{pl.name}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>
                          {price === 0 ? 'FREE' : `${currency === 'INR' ? '₹' : '$'}${price}`}
                        </div>
                        <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 2, letterSpacing: 1 }}>
                          {price === 0 ? 'forever' : isAnnual ? 'per month' : 'per month'}
                        </div>
                        {isAnnual && price > 0 && (
                          <div style={{ fontSize: 9, color: 'var(--green)', marginTop: 4 }}>
                            Billed {currency === 'INR' ? `₹${pl.annualINR * 12}/yr` : `$${pl.annualUSD * 12}/yr`}
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>

                <button className="btn-primary" style={{ width: '100%' }} onClick={() => setStep(2)}>
                  {p.monthlyUSD === 0 ? 'CONTINUE WITH FREE →' : 'CONTINUE TO PAYMENT →'}
                </button>
              </div>
            )}
          </div>

          {/* STEP 2 — Payment method */}
          <div style={{ background: 'var(--bg2)', border: `1px solid ${step === 2 ? 'var(--cyan)' : 'var(--border)'}`, marginBottom: '1rem', opacity: step < 2 ? .45 : 1 }}>
            <div style={{ padding: '13px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: step > 2 ? 'pointer' : 'default' }}
              onClick={() => step > 2 && setStep(2)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: step > 2 ? 'var(--green)' : step === 2 ? 'var(--cyan)' : 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: step >= 2 ? 'var(--bg)' : 'var(--text3)', border: step < 2 ? '1px solid var(--border)' : 'none' }}>
                  {step > 2 ? '✓' : '2'}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>PAYMENT METHOD</span>
              </div>
              {step > 2 && <span style={{ fontSize: 11, color: 'var(--cyan)' }}>{selectedGateway?.label} · EDIT</span>}
            </div>

            {step === 2 && (
              <div style={{ padding: '0 16px 16px' }}>

                {/* Currency toggle */}
                <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {['INR', 'USD', 'EUR', 'GBP'].map(c => (
                    <button key={c} onClick={() => setCurrency(c)} style={{
                      background: currency === c ? 'var(--cyan)' : 'transparent',
                      color: currency === c ? 'var(--bg)' : 'var(--text3)',
                      border: `1px solid ${currency === c ? 'var(--cyan)' : 'var(--border)'}`,
                      padding: '4px 12px', fontSize: 10, letterSpacing: 2, fontWeight: 700,
                      fontFamily: 'var(--font)', cursor: 'pointer', transition: 'all .2s',
                    }}>{c}</button>
                  ))}
                </div>

                {/* Gateway list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {GATEWAYS.map(g => {
                    const supported = g.currencies.includes(currency)
                    return (
                      <button key={g.id} disabled={!supported} onClick={() => setGateway(g.id)} style={{
                        background: gateway === g.id ? 'rgba(0,229,255,.06)' : 'var(--bg3)',
                        border: `1px solid ${gateway === g.id ? 'var(--cyan)' : 'var(--border)'}`,
                        padding: '11px 13px', cursor: supported ? 'pointer' : 'not-allowed',
                        fontFamily: 'var(--font)', display: 'flex', alignItems: 'center',
                        gap: 12, opacity: supported ? 1 : .3, transition: 'all .2s',
                      }}>
                        <div style={{ width: 22, height: 22, flexShrink: 0 }}>{g.logo}</div>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{g.label}</span>
                            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, padding: '1px 6px', border: `1px solid ${g.badgeColor}`, color: g.badgeColor }}>{g.badge}</span>
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text3)' }}>{g.desc}</div>
                        </div>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${gateway === g.id ? 'var(--cyan)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {gateway === g.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--cyan)' }} />}
                        </div>
                      </button>
                    )
                  })}
                </div>

                <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setStep(3)}>
                  CONTINUE →
                </button>
              </div>
            )}
          </div>

          {/* STEP 3 — Confirm & Pay */}
          <div style={{ background: 'var(--bg2)', border: `1px solid ${step === 3 ? 'var(--cyan)' : 'var(--border)'}`, opacity: step < 3 ? .45 : 1 }}>
            <div style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: step === 3 ? 'var(--cyan)' : 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: step === 3 ? 'var(--bg)' : 'var(--text3)', border: step < 3 ? '1px solid var(--border)' : 'none' }}>3</div>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>CONFIRM & PAY</span>
            </div>

            {step === 3 && (
              <div style={{ padding: '0 16px 16px' }}>

                {/* Name + Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text3)', display: 'block', marginBottom: 5 }}>FULL NAME *</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Narendra Venkatesan" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text3)', display: 'block', marginBottom: 5 }}>EMAIL *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  </div>
                </div>

                {/* UPI ID field */}
                {gateway === 'upi' && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text3)', display: 'block', marginBottom: 5 }}>UPI ID *</label>
                    <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
                      onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                    <p style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>A payment request will appear in your UPI app to approve.</p>
                  </div>
                )}

                {/* Gateway context notes */}
                {['razorpay', 'card'].includes(gateway) && (
                  <div style={{ background: 'rgba(0,229,255,.05)', border: '1px solid var(--cyan3)', padding: '10px 13px', fontSize: 11, color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>
                    {gateway === 'card' ? 'Enter your card details securely in the Razorpay checkout popup.' : 'Razorpay popup will open — choose UPI, card, net banking, or wallet.'}
                  </div>
                )}
                {gateway === 'netbanking' && (
                  <div style={{ background: 'rgba(255,179,0,.05)', border: '1px solid var(--amber)', padding: '10px 13px', fontSize: 11, color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>
                    You'll be redirected to your bank's secure login page via Razorpay.
                  </div>
                )}
                {gateway === 'paytm' && (
                  <div style={{ background: 'rgba(0,229,255,.05)', border: '1px solid var(--cyan3)', padding: '10px 13px', fontSize: 11, color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>
                    Paytm Wallet, UPI, and Postpaid are all available in the next step.
                  </div>
                )}
                {gateway === 'paypal' && (
                  <div style={{ background: 'rgba(0,0,128,.08)', border: '1px solid #1a3a8f', padding: '10px 13px', fontSize: 11, color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>
                    A PayPal window will open. Pay with your PayPal balance, linked bank, or card.
                  </div>
                )}

                {/* PAY button */}
                <button onClick={handlePay} disabled={loading} className="btn-primary"
                  style={{ width: '100%', fontSize: 13, padding: '14px', letterSpacing: 3 }}>
                  {loading ? 'OPENING PAYMENT...' :
                    p.monthlyUSD === 0 ? 'ACTIVATE FREE PLAN' :
                    `PAY ${displaySymbol}${displayPrice}${isAnnual ? '/mo' : '/mo'} VIA ${selectedGateway?.label?.toUpperCase()}`
                  }
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: '0.75rem' }}>
                  <span style={{ fontSize: 16 }}>🔒</span>
                  <span style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 1 }}>
                    256-bit TLS · PCI DSS · VEMAR never stores card data
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: ORDER SUMMARY ─────────────────────────────── */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '1.25rem' }}>

            <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text3)', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
              ORDER SUMMARY
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>VEMAR.AI {plan}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>
                  {displayPrice === 0 ? 'FREE' : `${displaySymbol}${displayPrice}/mo`}
                </span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)' }}>
                {billing === 'annual' ? `Billed annually — ${displaySymbol}${displayPrice * 12}/year` : 'Billed monthly'}
              </div>
            </div>

            {/* Savings callout */}
            {billing === 'annual' && p.monthlyUSD > 0 && (
              <div style={{ background: 'rgba(0,230,118,.08)', border: '1px solid var(--green2)', padding: '8px 12px', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: 11, color: 'var(--green)', fontWeight: 700 }}>
                  You save {currency === 'INR' ? `₹${savingsINR}` : `$${savingsUSD}`}/year
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>vs monthly billing</div>
              </div>
            )}

            {/* Gateway */}
            {step >= 2 && selectedGateway && (
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, color: 'var(--text3)', marginBottom: 6 }}>PAYING VIA</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 18, height: 18 }}>{selectedGateway.logo}</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{selectedGateway.label}</span>
                </div>
              </div>
            )}

            {/* Total */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>TOTAL TODAY</span>
              <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--cyan)' }}>
                {displayPrice === 0 ? 'FREE' : `${displaySymbol}${billing === 'annual' ? displayPrice * 12 : displayPrice}`}
              </span>
            </div>
            {billing === 'annual' && displayPrice > 0 && (
              <div style={{ fontSize: 10, color: 'var(--text3)', textAlign: 'right', marginTop: 2 }}>
                then {displaySymbol}{displayPrice * 12}/year
              </div>
            )}

            {/* Trust signals */}
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {['30-day money-back guarantee', 'Cancel or upgrade anytime', 'Instant activation after payment', 'Encrypted & PCI DSS compliant'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--green)', fontSize: 11 }}>✓</span>
                  <span style={{ fontSize: 10, color: 'var(--text3)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => navigate('/pricing')} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font)', marginTop: '0.75rem', width: '100%', letterSpacing: 1 }}>
            ← BACK TO PRICING
          </button>
        </div>
      </div>
    </div>
  )
}
