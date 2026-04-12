import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { showToast } from '../components/UIComponents'

// ─── Plans ────────────────────────────────────────────────────────
const PLANS = {
  BASIC:      { name: 'BASIC',      price: 0,    priceINR: 0,    desc: 'Essential protection',        color: 'var(--text3)' },
  PRO:        { name: 'PRO',        price: 49,   priceINR: 4099, desc: 'Full detection suite',         color: 'var(--cyan)'  },
  ENTERPRISE: { name: 'ENTERPRISE', price: 299,  priceINR: 24999,desc: 'Org-scale protection + API',  color: 'var(--amber)' },
}

// ─── Payment methods ──────────────────────────────────────────────
const GATEWAYS = [
  {
    id: 'razorpay',
    label: 'Razorpay',
    desc: 'UPI · Cards · Net Banking · Wallets · Paytm · GPay · PhonePe',
    badge: 'RECOMMENDED · INDIA',
    badgeColor: 'var(--cyan)',
    currencies: ['INR'],
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#2D6FE8"/>
        <path d="M7 16L10.5 8H13L14.5 12.5L16.5 8H19L15 17H12.5L11 12.5L9 17L7 16Z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'stripe',
    label: 'Stripe',
    desc: 'Visa · Mastercard · Amex · Apple Pay · Google Pay',
    badge: 'GLOBAL',
    badgeColor: 'var(--purple)',
    currencies: ['USD', 'EUR', 'GBP'],
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#635BFF"/>
        <path d="M11.5 9.5C11.5 8.7 12.1 8.2 13.1 8.2C14.4 8.2 15.7 8.8 16.6 9.7L17.8 7.8C16.7 6.8 15.1 6.2 13.2 6.2C10.5 6.2 8.8 7.7 8.8 9.7C8.8 13.5 14 12.8 14 14.6C14 15.5 13.3 16 12.2 16C10.8 16 9.4 15.3 8.4 14.2L7.2 16.1C8.4 17.3 10.2 18 12.2 18C15 18 16.8 16.5 16.8 14.4C16.8 10.5 11.5 11.3 11.5 9.5Z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'paypal',
    label: 'PayPal',
    desc: 'PayPal Balance · Linked Bank · Credit/Debit Card',
    badge: 'INTERNATIONAL',
    badgeColor: 'var(--blue, #1565C0)',
    currencies: ['USD', 'EUR', 'GBP', 'AUD'],
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#003087"/>
        <path d="M15.5 7H11.5C11.2 7 10.9 7.2 10.8 7.5L9 16.5C9 16.7 9.2 16.9 9.4 16.9H11.4C11.7 16.9 11.9 16.7 12 16.4L12.4 14.2C12.5 13.9 12.7 13.7 13 13.7H14C16.2 13.7 17.6 12.5 18 10.4C18.2 9.5 18 8.7 17.5 8.2C16.9 7.5 16.3 7 15.5 7Z" fill="#009CDE"/>
        <path d="M9.5 9H7.5C7.2 9 6.9 9.2 6.8 9.5L5 18.5C5 18.7 5.2 18.9 5.4 18.9H7.2C7.5 18.9 7.7 18.7 7.8 18.4L8.2 16.2C8.3 15.9 8.5 15.7 8.8 15.7H9.8C12 15.7 13.4 14.5 13.8 12.4C14 11.5 13.8 10.7 13.3 10.2C12.7 9.5 11.3 9 9.5 9Z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'upi',
    label: 'UPI Direct',
    desc: 'BHIM UPI · Google Pay · PhonePe · Paytm · Any UPI app',
    badge: 'INDIA · INSTANT',
    badgeColor: 'var(--green)',
    currencies: ['INR'],
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#5F259F"/>
        <path d="M12 4L6 12.5H10.5L8.5 20L18 11.5H13L15 4H12Z" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'netbanking',
    label: 'Net Banking',
    desc: 'SBI · HDFC · ICICI · Axis · Kotak · 50+ banks',
    badge: 'INDIA',
    badgeColor: 'var(--amber)',
    currencies: ['INR'],
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#1A3A6B"/>
        <rect x="5" y="7" width="14" height="2" fill="white"/>
        <rect x="5" y="11" width="14" height="1" fill="white" opacity="0.6"/>
        <rect x="5" y="14" width="9" height="4" rx="1" fill="white" opacity="0.7"/>
        <rect x="16" y="14" width="3" height="4" rx="1" fill="white"/>
      </svg>
    ),
  },
  {
    id: 'paytm',
    label: 'Paytm',
    desc: 'Paytm Wallet · UPI · Cards · Paytm Postpaid',
    badge: 'INDIA',
    badgeColor: 'var(--cyan)',
    currencies: ['INR'],
    logo: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#00B9F1"/>
        <rect x="5" y="9" width="6" height="6" rx="1" fill="white"/>
        <rect x="13" y="9" width="6" height="6" rx="1" fill="#002970"/>
        <text x="5" y="20" fontSize="5" fill="white" fontWeight="bold">PAYTM</text>
      </svg>
    ),
  },
]

// ─── Razorpay loader ──────────────────────────────────────────────
function loadRazorpayScript() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return }
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload  = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

// ─── Stripe loader ────────────────────────────────────────────────
function loadStripeScript() {
  return new Promise(resolve => {
    if (window.Stripe) { resolve(true); return }
    const s = document.createElement('script')
    s.src = 'https://js.stripe.com/v3/'
    s.onload  = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

// ─── Currency toggle ──────────────────────────────────────────────
function CurrencyBadge({ cur, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'var(--cyan)' : 'transparent',
        color: active ? 'var(--bg)' : 'var(--text3)',
        border: `1px solid ${active ? 'var(--cyan)' : 'var(--border)'}`,
        padding: '4px 12px', fontSize: 10, letterSpacing: 2,
        fontFamily: 'var(--font)', cursor: 'pointer',
        transition: 'all .2s', fontWeight: 700,
      }}
    >{cur}</button>
  )
}

// ─── Main component ───────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()

  // Read plan from query string e.g. /checkout?plan=PRO
  const params  = new URLSearchParams(location.search)
  const initial = params.get('plan')?.toUpperCase() || 'PRO'
  const validPlan = PLANS[initial] ? initial : 'PRO'

  const [plan,       setPlan]       = useState(validPlan)
  const [gateway,    setGateway]    = useState('razorpay')
  const [currency,   setCurrency]   = useState('INR')
  const [loading,    setLoading]    = useState(false)
  const [step,       setStep]       = useState(1) // 1=plan 2=method 3=confirm
  const [cardNum,    setCardNum]    = useState('')
  const [cardExp,    setCardExp]    = useState('')
  const [cardCVV,    setCardCVV]    = useState('')
  const [upiId,      setUpiId]      = useState('')
  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')

  const selectedPlan    = PLANS[plan]
  const selectedGateway = GATEWAYS.find(g => g.id === gateway)
  const displayPrice    = currency === 'INR' ? selectedPlan.priceINR : selectedPlan.price
  const displaySymbol   = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'

  // Auto-switch currency when gateway changes
  useEffect(() => {
    if (['razorpay','upi','netbanking','paytm'].includes(gateway)) setCurrency('INR')
    else if (gateway === 'paypal') setCurrency('USD')
  }, [gateway])

  // ─── Razorpay handler ───────────────────────────────────────────
  const handleRazorpay = async () => {
    setLoading(true)
    const ok = await loadRazorpayScript()
    if (!ok) {
      showToast('Failed to load Razorpay. Check your connection.', 'error')
      setLoading(false); return
    }
    const options = {
      // ⚠️  Replace with your live Razorpay key ID from dashboard.razorpay.com → Settings → API Keys
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_REPLACE_ME',
      amount: displayPrice * 100, // paise
      currency: 'INR',
      name: 'VEMAR.AI',
      description: `${selectedPlan.name} Plan — Monthly`,
      image: 'https://vemar.ai/logo.png',
      prefill: { name, email, contact: '' },
      theme: { color: '#00E5FF', backdrop_color: '#04070F' },
      modal: { backdropClose: false, escape: true },
      handler: (response) => {
        setLoading(false)
        showToast('Payment successful! Welcome to VEMAR.AI ' + selectedPlan.name, 'success')
        setTimeout(() => navigate('/dashboard'), 1200)
      },
    }
    // For UPI, net banking, Paytm — Razorpay handles all via its unified checkout
    if (gateway === 'upi')        options.method = { upi: true,  card: false, netbanking: false }
    if (gateway === 'netbanking') options.method = { netbanking: true, card: false, upi: false }
    if (gateway === 'paytm')      options.method = { wallet: true, card: false, upi: false }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (resp) => {
      setLoading(false)
      showToast('Payment failed: ' + (resp.error?.description || 'Unknown error'), 'error')
    })
    setLoading(false)
    rzp.open()
  }

  // ─── Stripe handler ─────────────────────────────────────────────
  const handleStripe = async () => {
    setLoading(true)
    const ok = await loadStripeScript()
    if (!ok) {
      showToast('Failed to load Stripe. Check your connection.', 'error')
      setLoading(false); return
    }
    // ⚠️  Replace with your live Stripe publishable key from dashboard.stripe.com → Developers → API Keys
    const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_REPLACE_ME')
    // In production: call your backend to create a Stripe Checkout Session and redirect.
    // For now: redirect to Stripe's hosted checkout (replace price_xxx with your actual Stripe Price ID)
    const priceIds = {
      PRO:        import.meta.env.VITE_STRIPE_PRICE_PRO        || 'price_REPLACE_PRO',
      ENTERPRISE: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE || 'price_REPLACE_ENT',
    }
    try {
      const result = await stripe.redirectToCheckout({
        lineItems: [{ price: priceIds[plan] || priceIds.PRO, quantity: 1 }],
        mode: 'subscription',
        successUrl: window.location.origin + '/dashboard?payment=success',
        cancelUrl:  window.location.origin + '/checkout?plan=' + plan,
        customerEmail: email || undefined,
      })
      if (result.error) {
        showToast(result.error.message, 'error')
        setLoading(false)
      }
    } catch (err) {
      showToast('Stripe error: ' + err.message, 'error')
      setLoading(false)
    }
  }

  // ─── PayPal handler ─────────────────────────────────────────────
  const handlePayPal = () => {
    // ⚠️  Replace with your PayPal hosted button or Checkout SDK link
    // To create: developer.paypal.com → My Apps → REST API Apps → Subscriptions
    const paypalUrl = import.meta.env.VITE_PAYPAL_CHECKOUT_URL
      || `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=billing@vemar.ai&item_name=${encodeURIComponent('VEMAR.AI ' + plan + ' Plan')}&amount=${selectedPlan.price}&currency_code=USD&return=${encodeURIComponent(window.location.origin + '/dashboard?payment=success')}&cancel_return=${encodeURIComponent(window.location.origin + '/checkout?plan=' + plan)}`
    window.open(paypalUrl, '_blank', 'width=600,height=700')
    setLoading(false)
  }

  // ─── Dispatch to gateway ────────────────────────────────────────
  const handlePay = async () => {
    if (!name.trim() || !email.trim()) {
      showToast('Please enter your name and email.', 'error'); return
    }
    if (selectedPlan.price === 0) {
      showToast('BASIC plan is free — no payment required!', 'success')
      setTimeout(() => navigate('/dashboard'), 900); return
    }
    if (gateway === 'stripe')                    await handleStripe()
    else if (gateway === 'paypal')               handlePayPal()
    else /* razorpay, upi, netbanking, paytm */  await handleRazorpay()
  }

  // ─── Step labels ────────────────────────────────────────────────
  const steps = ['Select Plan', 'Payment Method', 'Confirm & Pay']

  return (
    <div className="page-enter" style={{ maxWidth: 740, margin: '2rem auto', padding: '0 1rem 3rem' }}>

      {/* Page header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--cyan)', marginBottom: 6 }}>CHECKOUT</div>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: 2 }}>Secure Payment</h1>
        <p style={{ fontSize: 12, color: 'var(--text3)', letterSpacing: 1, marginTop: 4 }}>
          256-bit TLS encryption · PCI DSS compliant · Never stores card data
        </p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length-1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 700,
                background: step > i+1 ? 'var(--green)' : step === i+1 ? 'var(--cyan)' : 'var(--bg3)',
                color: step >= i+1 ? 'var(--bg)' : 'var(--text3)',
                border: `1px solid ${step >= i+1 ? 'transparent' : 'var(--border)'}`,
                flexShrink: 0,
              }}>
                {step > i+1 ? '✓' : i+1}
              </div>
              <span style={{
                fontSize: 11, letterSpacing: 1,
                color: step === i+1 ? 'var(--text)' : 'var(--text3)',
                fontWeight: step === i+1 ? 700 : 400,
                display: window.innerWidth < 480 ? 'none' : 'inline',
              }}>{s}</span>
            </div>
            {i < steps.length-1 && (
              <div style={{ flex: 1, height: 1, background: step > i+1 ? 'var(--green)' : 'var(--border)', margin: '0 10px' }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left: form steps */}
        <div>

          {/* STEP 1 — Plan */}
          <div style={{ background: 'var(--bg2)', border: `1px solid ${step === 1 ? 'var(--cyan)' : 'var(--border)'}`, marginBottom: '1rem' }}>
            <div
              style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: step !== 1 ? 'pointer' : 'default' }}
              onClick={() => step > 1 && setStep(1)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: step > 1 ? 'var(--green)' : 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--bg)' }}>
                  {step > 1 ? '✓' : '1'}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>SELECT PLAN</span>
              </div>
              {step > 1 && <span style={{ fontSize: 11, color: 'var(--cyan)', letterSpacing: 1 }}>{plan} · {displaySymbol}{displayPrice}/mo · EDIT</span>}
            </div>
            {step === 1 && (
              <div style={{ padding: '0 18px 18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: '1rem' }}>
                  {Object.values(PLANS).map(p => (
                    <button
                      key={p.name}
                      onClick={() => setPlan(p.name)}
                      style={{
                        background: plan === p.name ? 'rgba(0,229,255,.08)' : 'var(--bg3)',
                        border: `1px solid ${plan === p.name ? p.color : 'var(--border)'}`,
                        padding: '12px 8px', cursor: 'pointer', fontFamily: 'var(--font)',
                        transition: 'all .2s', textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: p.color, marginBottom: 4 }}>{p.name}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
                        {p.price === 0 ? 'FREE' : `$${p.price}`}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 3, letterSpacing: 1 }}>{p.desc}</div>
                    </button>
                  ))}
                </div>
                <button className="btn-primary" style={{ width: '100%' }} onClick={() => setStep(2)}>
                  {selectedPlan.price === 0 ? 'CONTINUE WITH FREE PLAN' : 'CONTINUE TO PAYMENT →'}
                </button>
              </div>
            )}
          </div>

          {/* STEP 2 — Payment Method */}
          <div style={{ background: 'var(--bg2)', border: `1px solid ${step === 2 ? 'var(--cyan)' : 'var(--border)'}`, marginBottom: '1rem', opacity: step < 2 ? .5 : 1 }}>
            <div
              style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: step > 2 ? 'pointer' : 'default' }}
              onClick={() => step > 2 && setStep(2)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: step > 2 ? 'var(--green)' : step === 2 ? 'var(--cyan)' : 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: step >= 2 ? 'var(--bg)' : 'var(--text3)', border: step < 2 ? '1px solid var(--border)' : 'none' }}>
                  {step > 2 ? '✓' : '2'}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>PAYMENT METHOD</span>
              </div>
              {step > 2 && <span style={{ fontSize: 11, color: 'var(--cyan)', letterSpacing: 1 }}>{selectedGateway?.label} · EDIT</span>}
            </div>
            {step === 2 && (
              <div style={{ padding: '0 18px 18px' }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <CurrencyBadge cur="INR" active={currency === 'INR'} onClick={() => setCurrency('INR')} />
                  <CurrencyBadge cur="USD" active={currency === 'USD'} onClick={() => setCurrency('USD')} />
                  <CurrencyBadge cur="EUR" active={currency === 'EUR'} onClick={() => setCurrency('EUR')} />
                  <CurrencyBadge cur="GBP" active={currency === 'GBP'} onClick={() => setCurrency('GBP')} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {GATEWAYS.map(g => {
                    const supported = g.currencies.includes(currency)
                    return (
                      <button
                        key={g.id}
                        disabled={!supported}
                        onClick={() => { setGateway(g.id) }}
                        style={{
                          background: gateway === g.id ? 'rgba(0,229,255,.07)' : 'var(--bg3)',
                          border: `1px solid ${gateway === g.id ? 'var(--cyan)' : 'var(--border)'}`,
                          padding: '12px 14px', cursor: supported ? 'pointer' : 'not-allowed',
                          fontFamily: 'var(--font)', display: 'flex', alignItems: 'center',
                          gap: 12, textAlign: 'left', opacity: supported ? 1 : .35,
                          transition: 'all .2s',
                        }}
                      >
                        <div style={{ width: 24, height: 24, flexShrink: 0 }}>{g.logo}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{g.label}</span>
                            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, padding: '1px 6px', border: `1px solid ${g.badgeColor}`, color: g.badgeColor }}>{g.badge}</span>
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: .5 }}>{g.desc}</div>
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

          {/* STEP 3 — Confirm */}
          <div style={{ background: 'var(--bg2)', border: `1px solid ${step === 3 ? 'var(--cyan)' : 'var(--border)'}`, opacity: step < 3 ? .5 : 1 }}>
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: step === 3 ? 'var(--cyan)' : 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: step === 3 ? 'var(--bg)' : 'var(--text3)', border: step < 3 ? '1px solid var(--border)' : 'none' }}>3</div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>CONFIRM & PAY</span>
            </div>
            {step === 3 && (
              <div style={{ padding: '0 18px 18px' }}>
                {/* Contact fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text3)', display: 'block', marginBottom: 5 }}>FULL NAME</label>
                    <input
                      type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Jane Doe"
                      style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 12px', fontFamily: 'var(--font)', fontSize: 13, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor='var(--cyan)'}
                      onBlur={e => e.target.style.borderColor='var(--border)'}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text3)', display: 'block', marginBottom: 5 }}>EMAIL</label>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 12px', fontFamily: 'var(--font)', fontSize: 13, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor='var(--cyan)'}
                      onBlur={e => e.target.style.borderColor='var(--border)'}
                    />
                  </div>
                </div>

                {/* UPI field */}
                {gateway === 'upi' && (
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text3)', display: 'block', marginBottom: 5 }}>UPI ID</label>
                    <input
                      type="text" value={upiId} onChange={e => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      style={{ width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 12px', fontFamily: 'var(--font)', fontSize: 13, outline: 'none' }}
                      onFocus={e => e.target.style.borderColor='var(--cyan)'}
                      onBlur={e => e.target.style.borderColor='var(--border)'}
                    />
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
                      You'll see a payment request in your UPI app to approve.
                    </div>
                  </div>
                )}

                {/* Stripe card fields (shown for Stripe only) */}
                {gateway === 'stripe' && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ background: 'rgba(0,229,255,.04)', border: '1px solid var(--cyan3)', padding: '10px 14px', fontSize: 11, color: 'var(--cyan)', letterSpacing: 1, marginBottom: '0.75rem' }}>
                      You'll be redirected to Stripe's secure hosted checkout to enter card details.
                    </div>
                  </div>
                )}

                {/* PayPal note */}
                {gateway === 'paypal' && (
                  <div style={{ background: 'rgba(0,229,255,.04)', border: '1px solid var(--cyan3)', padding: '10px 14px', fontSize: 11, color: 'var(--text2)', letterSpacing: .5, marginBottom: '1rem' }}>
                    A PayPal checkout window will open. You can pay with your PayPal balance, linked bank account, or card.
                  </div>
                )}

                {/* Net banking note */}
                {gateway === 'netbanking' && (
                  <div style={{ background: 'rgba(255,179,0,.04)', border: '1px solid var(--amber)', padding: '10px 14px', fontSize: 11, color: 'var(--text2)', letterSpacing: .5, marginBottom: '1rem' }}>
                    You'll be redirected to your bank's secure login page via Razorpay's net banking flow.
                  </div>
                )}

                {/* Pay button */}
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', fontSize: 13, padding: '14px', letterSpacing: 3 }}
                  aria-busy={loading}
                >
                  {loading
                    ? 'PROCESSING...'
                    : selectedPlan.price === 0
                      ? 'ACTIVATE FREE PLAN'
                      : `PAY ${displaySymbol}${displayPrice} VIA ${selectedGateway?.label?.toUpperCase()}`
                  }
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: '1rem' }}>
                  <span style={{ fontSize: 18 }}>🔒</span>
                  <span style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 1 }}>256-bit TLS · PCI DSS · No card data stored by VEMAR</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: order summary */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '1.25rem' }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text3)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              ORDER SUMMARY
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>VEMAR.AI {plan} Plan</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: selectedPlan.color }}>
                {selectedPlan.price === 0 ? 'FREE' : `${displaySymbol}${displayPrice}`}
              </span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: '1rem' }}>
              {selectedPlan.price > 0 ? 'Billed monthly · Cancel anytime' : 'No credit card required'}
            </div>

            {selectedGateway && step >= 2 && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, color: 'var(--text3)', marginBottom: 6 }}>PAYMENT VIA</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 20, height: 20 }}>{selectedGateway.logo}</div>
                  <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 700 }}>{selectedGateway.label}</span>
                  <span style={{ fontSize: 9, color: selectedGateway.badgeColor, border: `1px solid ${selectedGateway.badgeColor}`, padding: '1px 5px', letterSpacing: 1 }}>{selectedGateway.badge}</span>
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>TOTAL / MONTH</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--cyan)' }}>
                  {selectedPlan.price === 0 ? 'FREE' : `${displaySymbol}${displayPrice}`}
                </span>
              </div>
              {selectedPlan.price > 0 && currency === 'INR' && (
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3, textAlign: 'right' }}>
                  ≈ ${selectedPlan.price} USD
                </div>
              )}
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: 5 }}>
              {['30-day money-back guarantee', 'Cancel or upgrade anytime', 'Instant activation', 'Secure encrypted checkout'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--green)', fontSize: 12 }}>✓</span>
                  <span style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: .5 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/pricing')}
            style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 11, letterSpacing: 1, cursor: 'pointer', fontFamily: 'var(--font)', marginTop: '0.75rem', width: '100%' }}
          >
            ← BACK TO PRICING
          </button>
        </div>
      </div>
    </div>
  )
}
