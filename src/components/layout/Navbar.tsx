import Link from 'next/link'
import { Home, User, LogOut, MessageSquare, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
// Ensure to import your auth actions or client-side utilities if logout needs to be interactive.

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar__inner">
          <Link href="/" className="navbar__logo">
            <Home className="navbar__logo-icon navbar__logo-accent" />
            <span>Connect <span className="navbar__logo-accent">2</span> Rent</span>
          </Link>

          <nav className="navbar__nav">
            <Link href="/listings" className="navbar__link">Browse Listings</Link>
            <Link href="/about" className="navbar__link">How It Works</Link>
          </nav>

          <div className="navbar__actions">
            {user ? (
              <>
                <Link href="/messages" className="navbar__link" title="Messages">
                  <MessageSquare size={20} />
                </Link>
                <Link href="/dashboard" className="navbar__user">
                  <span className="avatar avatar-sm">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                  <span className="navbar__user-name">Dashboard</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
