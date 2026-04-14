import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PLANS = [
  {
    name: 'FREE',
    monthlyUSD: 0, annualUSD: 0,
    monthlyINR: 0, annualINR: 0,
    desc: 'Essential detection for personal identity protection.',
    features: ['10 scans per month', 'Voice clone detection', 'Basic threat dashboard', 'Email alerts'],
    featured: false,
    cta: 'GET STARTED',
    color: 'var(--text2)',
  },
  {
    name: 'PRO',
    monthlyUSD: 49, annualUSD: 39,
    monthlyINR: 4099, annualINR: 3299,
    desc: 'Full detection suite for professionals, creators & public figures.',
    features: ['Unlimited scans', 'Voice + face + behavioral detection', 'Live challenge authentication', 'AI identity graph (3 profiles)', 'Content watermarking & tracing', 'AI Analyst access', 'Automated takedowns'],
    featured: true,
    cta: 'START FREE TRIAL',
    color: 'var(--cyan)',
  },
  {
    name: 'ENTERPRISE',
    monthlyUSD: 299, annualUSD: 239,
    monthlyINR: 24999, annualINR: 19999,
    desc: 'Org-scale protection with API access & government compliance.',
    features: ['Everything in Pro', 'API access (100k calls/mo)', 'Unlimited identity profiles', 'Web3 / Blockchain identity', 'Custom integrations', 'Gov & law enforcement API', 'Dedicated account manager'],
    featured: false,
    cta: 'CONTACT SALES',
    color: 'var(--amber)',
  },
]

const CERTS = [
  { label: 'SOC 2 TYPE II', icon: '🔒', status: 'IN PROGRESS', statusColor: 'var(--amber)', summary: 'Service Organisation Control 2 — the gold standard for SaaS security.', detail: 'SOC 2 Type II verifies that VEMAR\'s security controls have operated effectively over a sustained audit period. Our audit is in progress — expected certification Q3 2026.', url: 'https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2', urlLabel: 'AICPA SOC 2 Standard' },
  { label: 'GDPR COMPLIANT', icon: '🇪🇺', status: 'ACTIVE', statusColor: 'var(--green)', summary: 'Full compliance for European users.', detail: 'VEMAR\'s data processing flows, Privacy Policy, and sub-processor agreements meet GDPR requirements. Data Processing Agreements with SCCs available for EU enterprise clients at legal@vemar.ai.', url: 'https://gdpr.eu/', urlLabel: 'Official GDPR Resource' },
  { label: 'HIPAA READY', icon: '🏥', status: 'ROADMAP', statusColor: 'var(--cyan)', summary: 'For healthcare clients — Q4 2026.', detail: 'As VEMAR expands into healthcare security, we are building the technical and administrative safeguards required for HIPAA compliance, including Business Associate Agreements (BAAs).', url: 'https://www.hhs.gov/hipaa/index.html', urlLabel: 'HHS HIPAA Portal' },
  { label: 'ISO 27001', icon: '📋', status: 'ROADMAP', statusColor: 'var(--cyan)', summary: 'International security management standard.', detail: 'VEMAR is building its ISMS aligned with ISO 27001:2022. Formal certification audit planned alongside our SOC 2 programme in 2026.', url: 'https://www.iso.org/isoiec-27001-information-security.html', urlLabel: 'ISO 27001 Standard' },
  { label: 'CCPA COMPLIANT', icon: '🇺🇸', status: 'ACTIVE', statusColor: 'var(--green)', summary: 'California Consumer Privacy Act.', detail: 'California residents can request data access, deletion, and opt-out of data sale (VEMAR never sells data). Submit requests to privacy@vemar.ai — fulfilled within 45 days.', url: 'https://oag.ca.gov/privacy/ccpa', urlLabel: 'CA DOJ CCPA Resource' },
  { label: 'EU AI ACT', icon: '🤖', status: 'ALIGNED', statusColor: 'var(--green)', summary: 'Aligned with the EU AI Act.', detail: 'VEMAR detection outputs are clearly presented as probabilistic results with confidence scores — not legal conclusions. We monitor Article 6 high-risk AI obligations for identity verification use cases.', url: 'https://artificialintelligenceact.eu/', urlLabel: 'EU AI Act Full Text' },
]

function CertModal({ cert, onClose }) {
  return (
    <div role="dialog" aria-modal="true" onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(4,7,15,.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', maxWidth: 520, width: '100%', padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: 'var(--text3)', fontSize: 18, cursor: 'pointer', fontFamily: 'var(--font)' }}>✕</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
          <span style={{ fontSize: 28 }}>{cert.icon}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>{cert.label}</div>
            <div style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, padding: '2px 8px', letterSpacing: 2, marginTop: 4, border: `1px solid ${cert.statusColor}`, color: cert.statusColor }}>{cert.status}</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--cyan)', marginBottom: '1rem', lineHeight: 1.6, fontStyle: 'italic' }}>{cert.summary}</p>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '1.5rem' }}>{cert.detail}</p>
        <a href={cert.url} target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-block', fontSize: 11, letterSpacing: 2, color: 'var(--cyan)', border: '1px solid var(--cyan3)', padding: '8px 16px', textDecoration: 'none', textTransform: 'uppercase' }}>
          {cert.urlLabel} ↗
        </a>
      </div>
    </div>
  )
}

export default function Pricing() {
  const navigate = useNavigate()
  const [billing,    setBilling]    = useState('monthly')
  const [currency,   setCurrency]   = useState('USD')
  const [activeCert, setActiveCert] = useState(null)

  const isAnnual = billing === 'annual'

  function getPrice(p) {
    if (currency === 'INR') return isAnnual ? p.annualINR : p.monthlyINR
    return isAnnual ? p.annualUSD : p.monthlyUSD
  }
  function getSymbol() { return currency === 'INR' ? '₹' : '$' }

  return (
    <div className="section page-enter">
      <div className="container">
        <div className="section-tag" style={{ textAlign: 'center' }}>PRICING</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Choose Your Defense Level</h2>

        {/* Billing + Currency toggles */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', margin: '1.5rem 0 2rem', flexWrap: 'wrap' }}>

          {/* Billing toggle */}
          <div style={{ display: 'flex', background: 'var(--bg3)', padding: 4, borderRadius: 4 }}>
            {['monthly', 'annual'].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: '7px 18px', background: billing === b ? 'var(--cyan)' : 'transparent',
                border: 'none', color: billing === b ? 'var(--bg)' : 'var(--text3)',
                fontFamily: 'var(--font)', fontSize: 11, fontWeight: 700, letterSpacing: 2,
                textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, transition: 'all .2s',
              }}>
                {b === 'annual' ? (
                  <span>{b.toUpperCase()} <span style={{ fontSize: 9, background: billing === 'annual' ? 'var(--bg)' : 'var(--green)', color: billing === 'annual' ? 'var(--cyan)' : 'var(--bg)', padding: '1px 5px', borderRadius: 10, marginLeft: 4 }}>SAVE 20%</span></span>
                ) : b.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Currency toggle */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['USD', 'INR'].map(c => (
              <button key={c} onClick={() => setCurrency(c)} style={{
                background: currency === c ? 'var(--cyan)' : 'transparent',
                color: currency === c ? 'var(--bg)' : 'var(--text3)',
                border: `1px solid ${currency === c ? 'var(--cyan)' : 'var(--border)'}`,
                padding: '5px 14px', fontSize: 10, letterSpacing: 2, fontWeight: 700,
                fontFamily: 'var(--font)', cursor: 'pointer', transition: 'all .2s',
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Annual savings banner */}
        {isAnnual && (
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--green)', marginBottom: '1.5rem', letterSpacing: 1 }}>
            ✓ Annual billing saves you {currency === 'INR' ? '₹9,600/yr on Pro · ₹60,000/yr on Enterprise' : '$120/yr on Pro · $720/yr on Enterprise'}
          </div>
        )}

        {/* Plan cards */}
        <div className="pricing-grid">
          {PLANS.map(p => {
            const price = getPrice(p)
            const sym = getSymbol()
            return (
              <div key={p.name} className={`pricing-card ${p.featured ? 'featured' : ''}`}>
                {p.featured && <div className="featured-badge">MOST POPULAR</div>}
                <div className="plan-name" style={{ color: p.color }}>{p.name}</div>

                {/* Price display */}
                <div className="plan-price">
                  {price === 0 ? (
                    <span style={{ fontSize: '2rem', fontWeight: 700 }}>FREE</span>
                  ) : (
                    <>
                      <sup>{sym}</sup>{price}<span>/mo</span>
                    </>
                  )}
                </div>

                {/* Annual note */}
                {isAnnual && price > 0 && (
                  <div style={{ fontSize: 11, color: 'var(--green)', marginTop: -8, marginBottom: 8, letterSpacing: 1 }}>
                    Billed {sym}{price * 12}/year
                  </div>
                )}
                {!isAnnual && price > 0 && (
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: -8, marginBottom: 8, letterSpacing: 1 }}>
                    or {sym}{isAnnual ? price : (currency === 'INR' ? p.annualINR : p.annualUSD)}/mo billed annually
                  </div>
                )}

                <div className="plan-desc">{p.desc}</div>
                {p.features.map(f => <div key={f} className="plan-feature">{f}</div>)}
                <button className="plan-btn" onClick={() => navigate(`/checkout?plan=${p.name}`)}>
                  {p.cta}
                </button>
              </div>
            )
          })}
        </div>

        {/* Compliance section */}
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <div className="section-tag">COMPLIANCE</div>
          <h2 className="section-title">Built for Regulated Industries</h2>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: '.5rem', marginBottom: '2rem', letterSpacing: 1 }}>
            Click any badge to see full compliance details.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {CERTS.map(cert => (
              <button key={cert.label} onClick={() => setActiveCert(cert)}
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', padding: '14px 20px', cursor: 'pointer', fontFamily: 'var(--font)', textAlign: 'left', transition: 'border-color .2s, background .2s', minWidth: 160 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.background = 'rgba(0,229,255,.05)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)' }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{cert.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'var(--text)', marginBottom: 5 }}>{cert.label}</div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: cert.statusColor }}>{cert.status}</div>
                <div style={{ fontSize: 10, color: 'var(--cyan)', marginTop: 6, letterSpacing: 1 }}>VIEW DETAILS →</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeCert && <CertModal cert={activeCert} onClose={() => setActiveCert(null)} />}
    </div>
  )
}
