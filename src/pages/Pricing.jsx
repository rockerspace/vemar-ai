import { useNavigate } from 'react-router-dom'
const PLANS = [
  { name: 'BASIC', price: '0', desc: 'Essential detection for personal identity protection.', features: ['10 scans per month', 'Voice clone detection', 'Basic threat dashboard', 'Email alerts'], featured: false, cta: 'GET STARTED' },
  { name: 'PRO', price: '49', desc: 'Full detection suite for professionals, creators & public figures.', features: ['Unlimited scans', 'Voice + face + behavioral detection', 'Live challenge authentication', 'AI identity graph (3 profiles)', 'Content watermarking & tracing', 'Claude AI Analyst access', 'Automated takedowns'], featured: true, cta: 'START FREE TRIAL' },
  { name: 'ENTERPRISE', price: '299', desc: 'Org-scale protection with API access & government compliance.', features: ['Everything in Pro', 'API access (100k calls/mo)', 'Unlimited identity profiles', 'Web3 / Blockchain identity', 'Custom integrations', 'Gov & law enforcement API'], featured: false, cta: 'CONTACT SALES' },
]
export default function Pricing() {
  const navigate = useNavigate()
  return (
    <div className="section">
      <div className="container">
        <div className="section-tag" style={{ textAlign: 'center' }}>PRICING</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Choose Your Defense Level</h2>
        <div className="pricing-grid">
          {PLANS.map(p => (
            <div key={p.name} className={`pricing-card ${p.featured ? 'featured' : ''}`}>
              {p.featured && <div className="featured-badge">MOST POPULAR</div>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price"><sup>$</sup>{p.price}<span>/mo</span></div>
              <div className="plan-desc">{p.desc}</div>
              {p.features.map(f => <div key={f} className="plan-feature">{f}</div>)}
              <button className="plan-btn" onClick={() => navigate('/auth')}>{p.cta}</button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <div className="section-tag">COMPLIANCE</div>
          <h2 className="section-title">Built for Regulated Industries</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {['SOC 2 TYPE II', 'GDPR COMPLIANT', 'HIPAA READY', 'ISO 27001', 'CCPA COMPLIANT', 'EU AI ACT'].map(b => (
              <div key={b} style={{ border: '1px solid var(--border)', padding: '10px 18px', fontSize: 11, letterSpacing: 2, color: 'var(--text2)' }}>{b}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
