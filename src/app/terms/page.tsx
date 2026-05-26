import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Connect-2-Rent',
  description: 'Terms and conditions for using the Connect-2-Rent platform.',
}

export default function TermsPage() {
  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container-sm">
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: '1.6' }}>
          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
              1. Acceptance of Terms
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              By accessing and using Connect-2-Rent, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
              2. Description of Service
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Connect-2-Rent provides a platform connecting renters and landlords. We do not own, manage, or operate any of the properties listed on the site. All leasing agreements are strictly between the landlord and the renter.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
              3. User Conduct
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              You agree to use our services only for lawful purposes. You are solely responsible for the knowledge and adherence to any and all laws, rules, and regulations pertaining to your use of the services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
              4. Property Listings
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Landlords are responsible for the accuracy of their property listings. Connect-2-Rent reserves the right to remove any listing that is found to be false, misleading, or in violation of these terms without preliminary warning.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
