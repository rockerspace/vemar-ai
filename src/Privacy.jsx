import { useNavigate } from 'react-router-dom'

const LAST_UPDATED = 'March 27, 2026'
const COMPANY = 'VEMAR AI LLC'
const EMAIL = 'privacy@vemar.ai'
const EFFECTIVE = 'March 27, 2026'

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      {
        sub: '1.1 Information you provide directly',
        body: 'When you create an account, subscribe to a plan, or contact us, we collect: name, email address, password (hashed and salted — never stored in plaintext), company name (optional), and billing information (processed by Stripe — we never store raw card data).',
      },
      {
        sub: '1.2 Media you submit for analysis',
        body: 'URLs and media content submitted to the VEMAR Detection Lab are processed transiently for analysis and are not retained after your session ends. We do not store, share, or use your submitted media for any purpose other than providing the detection result you requested.',
      },
      {
        sub: '1.3 Usage and technical data',
        body: 'We automatically collect: IP address, browser type and version, operating system, pages visited and time spent, referring URLs, and error logs. This data is used solely to maintain service reliability and improve performance.',
      },
      {
        sub: '1.4 Cookies and similar technologies',
        body: 'We use strictly necessary cookies to maintain your session and remember your authentication state. We do not use advertising cookies or sell data to third-party ad networks. You may disable cookies in your browser settings; doing so will require you to log in on each visit.',
      },
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      {
        sub: null,
        body: 'We use your information to: provide and operate the VEMAR.AI detection and identity defense services; process payments and send billing receipts; send service-critical notifications (security alerts, downtime notices, policy changes); respond to support requests; improve and debug the platform; and comply with legal obligations. We do not sell your personal data to any third party, ever.',
      },
    ],
  },
  {
    title: '3. Data Sharing and Disclosure',
    content: [
      {
        sub: '3.1 Service providers',
        body: 'We share data with trusted sub-processors who help us deliver the service: Vercel (hosting and infrastructure), Stripe (payment processing), Anthropic (AI analysis — subject to Anthropic\'s data handling policies), and Sentry (error monitoring). Each sub-processor is bound by a data processing agreement and may not use your data for their own purposes.',
      },
      {
        sub: '3.2 Legal requirements',
        body: 'We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect the rights, property, or safety of VEMAR AI LLC, our users, or the public.',
      },
      {
        sub: '3.3 Business transfers',
        body: 'If VEMAR AI LLC is acquired, merges with another company, or transfers its assets, your data may be transferred as part of that transaction. We will notify you via email and prominent notice on the site before your data becomes subject to a different privacy policy.',
      },
    ],
  },
  {
    title: '4. Data Retention',
    content: [
      {
        sub: null,
        body: 'Account data is retained for as long as your account is active. If you delete your account, we delete your personal data within 30 days, except where we are required to retain it for legal compliance (e.g. billing records, which we retain for 7 years per US tax law). Media submitted for analysis is not retained beyond your active session.',
      },
    ],
  },
  {
    title: '5. Your Rights',
    content: [
      {
        sub: null,
        body: 'Depending on your jurisdiction, you may have the right to: access the personal data we hold about you; correct inaccurate data; request deletion of your data (right to erasure); object to or restrict certain processing; receive a machine-readable copy of your data (data portability); and withdraw consent at any time where processing is based on consent. To exercise any of these rights, email us at ' + EMAIL + '. We will respond within 30 days. EU/UK residents may also lodge a complaint with their local supervisory authority.',
      },
    ],
  },
  {
    title: '6. Security',
    content: [
      {
        sub: null,
        body: 'We implement industry-standard security measures including TLS 1.3 encryption in transit, AES-256 encryption at rest for stored data, hashed and salted passwords, rate limiting on authentication endpoints, and regular security audits. No method of electronic storage or transmission is 100% secure; we cannot guarantee absolute security but commit to notifying you promptly in the event of a breach affecting your data.',
      },
    ],
  },
  {
    title: '7. International Transfers',
    content: [
      {
        sub: null,
        body: 'VEMAR AI LLC is incorporated in Illinois, USA, and operates servers in the United States. If you access the service from outside the US — including from India where our Mumbai entity operates — your data will be transferred to and processed in the United States. By using the service you consent to this transfer. For EU/UK users, transfers are covered by Standard Contractual Clauses.',
      },
    ],
  },
  {
    title: '8. Children\'s Privacy',
    content: [
      {
        sub: null,
        body: 'VEMAR.AI is not directed at children under the age of 13 (or 16 in the EU). We do not knowingly collect personal data from children. If you believe we have inadvertently collected such data, please contact us immediately at ' + EMAIL + ' and we will delete it promptly.',
      },
    ],
  },
  {
    title: '9. Changes to This Policy',
    content: [
      {
        sub: null,
        body: 'We may update this Privacy Policy from time to time. We will notify you of material changes by email and by posting a notice on the site at least 14 days before the changes take effect. Continued use of the service after the effective date constitutes acceptance of the updated policy.',
      },
    ],
  },
  {
    title: '10. Contact Us',
    content: [
      {
        sub: null,
        body: 'For privacy-related questions, data requests, or concerns, contact our privacy team at: ' + EMAIL + ' · VEMAR AI LLC · Illinois, USA · VEMAR AI Private Limited · Mumbai, India',
      },
    ],
  },
]

export default function Privacy() {
  const navigate = useNavigate()
  return (
    <div className="page-enter" style={{ maxWidth: 760, margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '.5rem' }}>
          Legal
        </div>
        <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, letterSpacing: 1, marginBottom: '.75rem' }}>
          Privacy Policy
        </h1>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: 12, color: 'var(--text3)' }}>
          <span>Effective: {EFFECTIVE}</span>
          <span>Last updated: {LAST_UPDATED}</span>
          <span>{COMPANY}</span>
        </div>
        <p style={{ marginTop: '1rem', fontSize: 13, color: 'var(--text2)', lineHeight: 1.8, padding: '1rem', background: 'rgba(0,229,255,.04)', border: '1px solid var(--border)', borderLeft: '2px solid var(--cyan)' }}>
          VEMAR.AI is committed to protecting your privacy. This policy explains what data we collect, why we collect it, how we use it, and your rights regarding it. We do not sell your data. Ever.
        </p>
      </div>

      {/* Sections */}
      {sections.map((s) => (
        <section key={s.title} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, color: 'var(--text)', marginBottom: '1rem', paddingBottom: '.5rem', borderBottom: '1px solid var(--border)', textTransform: 'uppercase' }}>
            {s.title}
          </h2>
          {s.content.map((c, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              {c.sub && (
                <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--cyan)', letterSpacing: 1, marginBottom: '.4rem', textTransform: 'uppercase' }}>
                  {c.sub}
                </h3>
              )}
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.85 }}>{c.body}</p>
            </div>
          ))}
        </section>
      ))}

      {/* Footer nav */}
      <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/terms')}
          style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--cyan)', padding: '8px 16px', fontFamily: 'var(--font)', fontSize: 11, letterSpacing: 2, cursor: 'pointer', textTransform: 'uppercase' }}
        >
          Read Terms of Service →
        </button>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: 'var(--text3)', padding: '8px 0', fontFamily: 'var(--font)', fontSize: 11, letterSpacing: 1, cursor: 'pointer' }}
        >
          ← Back to VEMAR.AI
        </button>
      </div>
    </div>
  )
}
