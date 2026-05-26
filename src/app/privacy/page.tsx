import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Connect-2-Rent',
  description: 'Learn how Connect-2-Rent collects, uses, and protects your personal data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container-sm">
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: '1.6' }}>
          
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
              1. Information We Collect
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              We collect information that you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email address, phone number, profile picture, and any other information you choose to provide.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
              2. How We Use Your Information
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              We may use the information we collect about you to:
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <li>Provide, maintain, and improve our services (such as property listings and messaging);</li>
              <li>Send you technical notices, updates, security alerts, and support messages;</li>
              <li>Respond to your comments, questions, and requests, and provide customer service;</li>
              <li>Communicate with you about products, services, offers, and events offered by Connect-2-Rent.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
              3. Sharing of Information
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              We may share the information we collect about you as described in this privacy policy or as described at the time of collection or sharing, including as follows:
            </p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              <li>With landlords/renters to facilitate your property inquiries;</li>
              <li>With third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf;</li>
              <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law, regulation, or legal process.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
              4. Cookies and Similar Technologies
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              We use cookies, web beacons, and other tracking technologies to automatically collect information about your interactions with our platform. You have the choice to accept or decline the use of cookies via our cookie banner.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
              5. Security
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
              6. Contact Us
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@connect2rent.com" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>privacy@connect2rent.com</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
