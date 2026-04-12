import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PLANS = [
  { name: 'BASIC', price: '0', desc: 'Essential detection for personal identity protection.', features: ['10 scans per month', 'Voice clone detection', 'Basic threat dashboard', 'Email alerts'], featured: false, cta: 'GET STARTED' },
  { name: 'PRO', price: '49', desc: 'Full detection suite for professionals, creators & public figures.', features: ['Unlimited scans', 'Voice + face + behavioral detection', 'Live challenge authentication', 'AI identity graph (3 profiles)', 'Content watermarking & tracing', 'AI Analyst access', 'Automated takedowns'], featured: true, cta: 'START FREE TRIAL' },
  { name: 'ENTERPRISE', price: '299', desc: 'Org-scale protection with API access & government compliance.', features: ['Everything in Pro', 'API access (100k calls/mo)', 'Unlimited identity profiles', 'Web3 / Blockchain identity', 'Custom integrations', 'Gov & law enforcement API'], featured: false, cta: 'CONTACT SALES' },
]

const CERTS = [
  {
    label: 'SOC 2 TYPE II',
    icon: '🔒',
    status: 'IN PROGRESS',
    statusColor: 'var(--amber)',
    summary: 'Service Organisation Control 2 — the gold standard for SaaS security.',
    detail: 'SOC 2 Type II verifies that VEMAR\'s security controls for data protection, availability, processing integrity, confidentiality, and privacy are not just in place — but have operated effectively over a sustained audit period. Type II is significantly more rigorous than Type I. Our audit is currently in progress with expected certification Q3 2026.',
    url: 'https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2',
    urlLabel: 'AICPA SOC 2 Standard',
  },
  {
    label: 'GDPR COMPLIANT',
    icon: '🇪🇺',
    status: 'ACTIVE',
    statusColor: 'var(--green)',
    summary: 'EU General Data Protection Regulation — full compliance for European users.',
    detail: 'VEMAR\'s Privacy Policy, data processing flows, and sub-processor agreements are designed to meet GDPR requirements. We do not retain submitted media after analysis, honour all data subject access requests within 30 days, and offer a Data Processing Agreement (DPA) with Standard Contractual Clauses (SCCs) for EU enterprise clients. Contact legal@vemar.ai for your DPA.',
    url: 'https://gdpr.eu/',
    urlLabel: 'Official GDPR Resource',
  },
  {
    label: 'HIPAA READY',
    icon: '🏥',
    status: 'ROADMAP',
    statusColor: 'var(--cyan)',
    summary: 'Health Insurance Portability and Accountability Act — for healthcare clients.',
    detail: 'As VEMAR expands into healthcare security (voice authentication for telemedicine, synthetic identity detection for patient onboarding), we are building the technical and administrative safeguards required for HIPAA compliance. This includes Business Associate Agreements (BAAs), audit controls, and minimum-necessary data access policies. HIPAA readiness is expected Q4 2026.',
    url: 'https://www.hhs.gov/hipaa/index.html',
    urlLabel: 'HHS HIPAA Portal',
  },
  {
    label: 'ISO 27001',
    icon: '📋',
    status: 'ROADMAP',
    statusColor: 'var(--cyan)',
    summary: 'International standard for information security management systems.',
    detail: 'ISO 27001 certification demonstrates a systematic and ongoing approach to managing sensitive information, including people, processes, and IT systems. VEMAR is building its ISMS (Information Security Management System) aligned with ISO 27001:2022 controls. Formal certification audit is planned alongside our SOC 2 programme in 2026.',
    url: 'https://www.iso.org/isoiec-27001-information-security.html',
    urlLabel: 'ISO 27001 Standard',
  },
  {
    label: 'CCPA COMPLIANT',
    icon: '🇺🇸',
    status: 'ACTIVE',
    statusColor: 'var(--green)',
    summary: 'California Consumer Privacy Act — rights for California residents.',
    detail: 'California residents using VEMAR.AI have the right to know what personal data we collect, request deletion of their data, and opt out of any sale of their data (VEMAR does not sell data). Our Privacy Policy at vemar.ai/privacy fully reflects CCPA requirements. Requests can be submitted to privacy@vemar.ai and will be fulfilled within 45 days.',
    url: 'https://oag.ca.gov/privacy/ccpa',
    urlLabel: 'CA DOJ CCPA Resource',
  },
  {
    label: 'EU AI ACT',
    icon: '🤖',
    status: 'ALIGNED',
    statusColor: 'var(--green)',
    summary: 'The world\'s first comprehensive legal framework for AI systems.',
    detail: 'The EU AI Act classifies VEMAR\'s detection outputs as a high-transparency AI system — we are required to clearly communicate that results are probabilistic, not legal conclusions. VEMAR is designed in compliance with this: every detection result includes a confidence score and explicit uncertainty disclosure. We are monitoring Article 6 (high-risk AI) obligations as they apply to identity verification use cases.',
    url: 'https://artificialintelligenceact.eu/',
    urlLabel: 'EU AI Act Full Text',
  },
]

function CertModal({ cert, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={cert.label + ' compliance details'}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(4,7,15,.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '1rem',
      }}
    >
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        maxWidth: 520, width: '100%', padding: '2rem',
        position: 'relative',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 14,
            background: 'none', border: 'none', color: 'var(--text3)',
            fontSize: 18, cursor: 'pointer', fontFamily: 'var(--font)', lineHeight: 1,
          }}
        >✕</button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
          <span style={{ fontSize: 28 }}>{cert.icon}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: 'var(--text)' }}>
              {cert.label}
            </div>
            <div style={{
              display: 'inline-block', fontSize: 9, fontWeight: 700,
              padding: '2px 8px', letterSpacing: 2, marginTop: 4,
              border: `1px solid ${cert.statusColor}`, color: cert.statusColor,
            }}>
              {cert.status}
            </div>
          </div>
        </div>

        {/* Summary */}
        <p style={{ fontSize: 13, color: 'var(--cyan)', marginBottom: '1rem', lineHeight: 1.6, fontStyle: 'italic' }}>
          {cert.summary}
        </p>

        {/* Detail */}
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
          {cert.detail}
        </p>

        {/* Official link */}
        <a
          href={cert.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block', fontSize: 11, letterSpacing: 2,
            color: 'var(--cyan)', border: '1px solid var(--cyan3)',
            padding: '8px 16px', textDecoration: 'none', textTransform: 'uppercase',
            transition: 'background .2s',
          }}
          onMouseEnter={e => e.target.style.background = 'rgba(0,229,255,.08)'}
          onMouseLeave={e => e.target.style.background = 'transparent'}
        >
          {cert.urlLabel} ↗
        </a>
      </div>
    </div>
  )
}

export default function Pricing() {
  const navigate = useNavigate()
  const [activeCert, setActiveCert] = useState(null)

  return (
    <div className="section page-enter">
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
              <button className="plan-btn" onClick={() => navigate(`/checkout?plan=${p.name}`)}>{p.cta}</button>
            </div>
          ))}
        </div>

        {/* Compliance section */}
        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
          <div className="section-tag">COMPLIANCE</div>
          <h2 className="section-title">Built for Regulated Industries</h2>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: '.5rem', marginBottom: '2rem', letterSpacing: 1 }}>
            Click any badge to see full compliance details and official standard links.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {CERTS.map(cert => (
              <button
                key={cert.label}
                onClick={() => setActiveCert(cert)}
                aria-label={`View ${cert.label} compliance details`}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  padding: '14px 20px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font)',
                  textAlign: 'left',
                  transition: 'border-color .2s, background .2s',
                  minWidth: 160,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--cyan)'
                  e.currentTarget.style.background = 'rgba(0,229,255,.05)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'var(--bg2)'
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 6 }}>{cert.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: 'var(--text)', marginBottom: 5 }}>
                  {cert.label}
                </div>
                <div style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                  color: cert.statusColor, padding: '1px 0',
                }}>
                  {cert.status}
                </div>
                <div style={{ fontSize: 10, color: 'var(--cyan)', marginTop: 6, letterSpacing: 1 }}>
                  VIEW DETAILS →
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {activeCert && (
        <CertModal
          cert={activeCert}
          onClose={() => setActiveCert(null)}
        />
      )}
    </div>
  )
}
