import Link from 'next/link'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__logo">Connect <span>2</span> Rent</div>
            <p className="footer__desc">
              The premier platform connecting renters with great landlords. Find your perfect home with confidence and transparency.
            </p>
          </div>
          
          <div>
            <div className="footer__col-title">For Renters</div>
            <div className="footer__links">
              <Link href="/listings" className="footer__link">Browse Active Listings</Link>
              <Link href="/saved" className="footer__link">Saved Homes</Link>
              <Link href="/resources/renters" className="footer__link">Renter Guide</Link>
            </div>
          </div>
          
          <div>
            <div className="footer__col-title">For Landlords</div>
            <div className="footer__links">
              <Link href="/dashboard/create-listing" className="footer__link">Post a Listing</Link>
              <Link href="/pricing" className="footer__link">Pricing Plans</Link>
              <Link href="/resources/landlords" className="footer__link">Landlord Best Practices</Link>
            </div>
          </div>
          
          <div>
            <div className="footer__col-title">Company</div>
            <div className="footer__links">
              <Link href="/about" className="footer__link">About Us</Link>
              <Link href="/support" className="footer__link">Help Center</Link>
              <Link href="/contact" className="footer__link">Contact</Link>
            </div>
          </div>
        </div>
        
        <div className="footer__bottom">
          <div>&copy; {new Date().getFullYear()} Connect-2-Rent. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/privacy" className="footer__link">Privacy Policy</Link>
            <Link href="/terms" className="footer__link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
