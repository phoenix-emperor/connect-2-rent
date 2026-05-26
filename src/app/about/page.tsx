import { Metadata } from 'next'
import Link from 'next/link'
import { Home, Users, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Connect-2-Rent',
  description: 'Learn more about Connect-2-Rent and our mission to simplify renting.',
}

export default function AboutPage() {
  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container-sm">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '16px', color: 'var(--text-primary)' }}>
            About Connect-2-Rent
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            We are on a mission to make finding and renting a home as transparent, fair, and seamless as possible for everyone.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '24px' }}>
              <Home size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>Verified Listings</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              We ensure every property listed on our platform is authentic and accurately represented, saving you time and frustration.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'var(--secondary-light)', color: 'var(--secondary)', marginBottom: '24px' }}>
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>Direct Communication</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              No middlemen. Our built-in messaging platform connects renters straight to landlords for fast, reliable communication.
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(217, 154, 64, 0.1)', color: 'var(--warning)', marginBottom: '24px' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>Secure Platform</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Your data is protected. We use industry-standard security measures to keep your personal information safe at all times.
            </p>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>
            Ready to find your next home?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '16px' }}>
            Join thousands of users who have found their perfect rental through Connect-2-Rent.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/listings" className="btn btn-primary btn-lg">Browse Listings</Link>
            <Link href="/register" className="btn btn-outline btn-lg">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
