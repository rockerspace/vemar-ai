import { useNavigate } from 'react-router-dom'

const LAST_UPDATED = 'March 27, 2026'
const COMPANY = 'VEMAR AI LLC'
const EMAIL = 'legal@vemar.ai'
const EFFECTIVE = 'March 27, 2026'

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using VEMAR.AI (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. These Terms constitute a legally binding agreement between you and VEMAR AI LLC (Illinois, USA) and VEMAR AI Private Limited (Mumbai, India), collectively referred to as "VEMAR," "we," "us," or "our." If you are using the Service on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms.',
  },
  {
    title: '2. Description of Service',
    body: 'VEMAR.AI provides AI-powered detection tools for identifying voice clones, deepfakes, synthetic identities, and behavioral fraud. The Service includes a Detection Lab, Behavioral AI Verification module, AI Identity Graph analysis, Content Watermarking tools, a Threat Dashboard, and an AI Analyst interface. The Service is provided on an "as is" and "as available" basis. Detection results are probabilistic and should be used as one input in a broader assessment — not as sole legal or forensic evidence.',
  },
  {
    title: '3. Eligibility',
    body: 'You must be at least 18 years old to use the Service. By using the Service you represent and warrant that you meet this requirement. The Service is not available to users who have been suspended or removed from the Service for any reason.',
  },
  {
    title: '4. Account Registration',
    body: 'Certain features require account registration. You agree to: provide accurate, current, and complete registration information; maintain the security of your password and not share it with others; promptly notify us of any unauthorised use of your account; and accept responsibility for all activities that occur under your account. We reserve the right to suspend or terminate accounts that contain inaccurate information or that are used in violation of these Terms.',
  },
  {
    title: '5. Acceptable Use',
    body: 'You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not: use the Service to harass, defame, or harm any individual; submit media content that you do not have the right to share; use detection results to make unsubstantiated public accusations against identifiable individuals without additional corroborating evidence; attempt to reverse-engineer, decompile, or extract the underlying detection models; use automated tools (bots, scrapers) to access the Service in excess of reasonable use; use the Service to create, train, or improve competing AI detection models; or violate any applicable local, national, or international law or regulation.',
  },
  {
    title: '6. Intellectual Property',
    body: 'The Service, including all software, models, algorithms, visual design, text, and trademarks, is the exclusive property of VEMAR AI LLC and is protected by copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable, revocable licence to access and use the Service solely for your personal or internal business purposes in accordance with these Terms. You may not reproduce, distribute, modify, create derivative works of, or commercially exploit any part of the Service without our prior written consent.',
  },
  {
    title: '7. User Content',
    body: 'By submitting media, URLs, or other content to the Service ("User Content"), you represent that you own it or have the right to submit it, and that submitting it does not violate any third-party rights. You grant VEMAR a limited, temporary licence to process your User Content solely for the purpose of providing the detection service you requested. We do not retain User Content after your session ends. You retain all ownership rights to your User Content.',
  },
  {
    title: '8. Subscription Plans and Payment',
    body: 'Certain features of the Service are available only on paid subscription plans. Subscription fees are charged in advance on a monthly or annual basis. All fees are non-refundable except as required by law or as explicitly stated in our refund policy. We reserve the right to modify pricing with 30 days\' notice. Failure to pay may result in suspension of your account. Payments are processed by Stripe and are subject to Stripe\'s terms of service.',
  },
  {
    title: '9. Disclaimers',
    body: 'THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. VEMAR DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY ACCURATE. DETECTION RESULTS ARE PROBABILISTIC ESTIMATES AND NOT LEGAL CONCLUSIONS. VEMAR IS NOT RESPONSIBLE FOR ANY DECISIONS MADE IN RELIANCE ON DETECTION RESULTS WITHOUT INDEPENDENT VERIFICATION.',
  },
  {
    title: '10. Limitation of Liability',
    body: 'TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VEMAR AI LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR YOUR USE OF THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT SHALL VEMAR\'S TOTAL AGGREGATE LIABILITY EXCEED THE AMOUNT YOU PAID TO VEMAR IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR USD $100, WHICHEVER IS GREATER.',
  },
  {
    title: '11. Indemnification',
    body: 'You agree to indemnify, defend, and hold harmless VEMAR AI LLC, its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys\' fees) arising out of or in connection with: your use of the Service; your violation of these Terms; your User Content; or your violation of any third-party rights.',
  },
  {
    title: '12. Termination',
    body: 'You may terminate your account at any time by contacting us at ' + EMAIL + '. We may suspend or terminate your access to the Service immediately, without prior notice, if we determine that you have violated these Terms or that your use poses a risk to other users or to the Service. Upon termination, your right to use the Service ceases immediately. Sections 6, 9, 10, 11, 13, and 14 survive termination.',
  },
  {
    title: '13. Governing Law and Dispute Resolution',
    body: 'These Terms are governed by the laws of the State of Illinois, USA, without regard to its conflict-of-law provisions. Any dispute arising out of or relating to these Terms or the Service that cannot be resolved informally shall be submitted to binding arbitration under the American Arbitration Association Commercial Arbitration Rules, conducted in Chicago, Illinois. Each party waives the right to participate in class-action litigation. Notwithstanding the above, either party may seek injunctive or other equitable relief in any court of competent jurisdiction.',
  },
  {
    title: '14. General Provisions',
    body: 'These Terms, together with the Privacy Policy, constitute the entire agreement between you and VEMAR regarding the Service and supersede all prior agreements. If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force. Our failure to enforce any provision is not a waiver of our right to do so later. You may not assign these Terms without our prior written consent. We may assign these Terms in connection with a merger, acquisition, or sale of assets.',
  },
  {
    title: '15. Changes to These Terms',
    body: 'We may update these Terms from time to time. We will notify you of material changes by email and by posting a notice on the site at least 14 days before the changes take effect. Continued use of the Service after the effective date constitutes acceptance of the updated Terms.',
  },
  {
    title: '16. Contact',
    body: 'For questions about these Terms, contact us at: ' + EMAIL + ' · VEMAR AI LLC · Illinois, USA · VEMAR AI Private Limited · Mumbai, India',
  },
]

export default function Terms() {
  const navigate = useNavigate()
  return (
    <div className="page-enter" style={{ maxWidth: 760, margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '.5rem' }}>
          Legal
        </div>
        <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, letterSpacing: 1, marginBottom: '.75rem' }}>
          Terms of Service
        </h1>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: 12, color: 'var(--text3)' }}>
          <span>Effective: {EFFECTIVE}</span>
          <span>Last updated: {LAST_UPDATED}</span>
          <span>{COMPANY}</span>
        </div>
        <p style={{ marginTop: '1rem', fontSize: 13, color: 'var(--text2)', lineHeight: 1.8, padding: '1rem', background: 'rgba(255,179,0,.04)', border: '1px solid var(--border)', borderLeft: '2px solid var(--amber)' }}>
          Please read these Terms carefully before using VEMAR.AI. By using the Service you agree to be bound by these Terms. Detection results are probabilistic and should not be used as sole legal or forensic evidence.
        </p>
      </div>

      {/* Table of Contents */}
      <nav aria-label="Terms sections" style={{ marginBottom: '2rem', padding: '1rem 1.25rem', background: 'var(--bg3)', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text3)', marginBottom: '.75rem', textTransform: 'uppercase' }}>Contents</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 1rem' }}>
          {sections.map((s) => (
            <a
              key={s.title}
              href={`#${s.title.replace(/\s+/g, '-').toLowerCase()}`}
              style={{ fontSize: 11, color: 'var(--text3)', textDecoration: 'none', letterSpacing: .5 }}
              onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
              onMouseLeave={e => e.target.style.color = 'var(--text3)'}
            >
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      {/* Sections */}
      {sections.map((s) => (
        <section
          key={s.title}
          id={s.title.replace(/\s+/g, '-').toLowerCase()}
          style={{ marginBottom: '2rem', scrollMarginTop: '80px' }}
        >
          <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, color: 'var(--text)', marginBottom: '.75rem', paddingBottom: '.5rem', borderBottom: '1px solid var(--border)', textTransform: 'uppercase' }}>
            {s.title}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.85 }}>{s.body}</p>
        </section>
      ))}

      {/* Footer nav */}
      <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/privacy')}
          style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--cyan)', padding: '8px 16px', fontFamily: 'var(--font)', fontSize: 11, letterSpacing: 2, cursor: 'pointer', textTransform: 'uppercase' }}
        >
          Read Privacy Policy →
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
