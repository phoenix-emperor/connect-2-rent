import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { Home, MessageSquare, Plus, Settings, LogOut } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch user profile to see if they are a landlord or renter
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isLandlord = profile?.role === 'LANDLORD'

  // Fetch listings if landlord
  let myListings: any[] = []
  if (isLandlord) {
    const { data: listings } = await supabase
      .from('listings')
      .select('*, images:listing_images(url)')
      .eq('landlord_id', user.id)
      .order('created_at', { ascending: false })
    if (listings) {
      myListings = listings
    }
  }

  return (
    <div className="dash-grid">
      <aside className="dash-sidebar">
        <div style={{ marginBottom: '32px' }}>
          <div className="avatar avatar-xl" style={{ marginBottom: '16px' }}>
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" style={{width: '100%', height:'100%', objectFit: 'cover'}} />
            ) : (
              profile?.first_name?.charAt(0) || 'U'
            )}
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {profile?.first_name} {profile?.last_name}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user.email}</p>
          <div style={{ marginTop: '16px', background: 'var(--action-primary)', color: 'white', padding: '12px 16px', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8, marginBottom: '2px' }}>Account Status</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{profile?.role === 'LANDLORD' ? 'Landlord' : 'Renter'}</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Link href="/dashboard" className="dash-nav-link dash-nav-link--active">
            <Home size={18} /> Overview
          </Link>
          <Link href="/messages" className="dash-nav-link">
            <MessageSquare size={18} /> Messages
          </Link>
          <Link href="/settings" className="dash-nav-link">
            <Settings size={18} /> Settings
          </Link>
          
          <div className="divider" style={{ marginBlock: '12px' }}></div>
          
          <form action={logout}>
            <button type="submit" className="dash-nav-link" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--error)' }}>
              <LogOut size={18} /> Sign Out
            </button>
          </form>
        </nav>
      </aside>

      <main className="dash-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>
            Welcome back, {profile?.first_name}
          </h1>
          {isLandlord && (
            <Link href="/dashboard/create-listing" className="btn btn-primary">
              <Plus size={18} /> New Listing
            </Link>
          )}
        </div>

        {isLandlord ? (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Your Properties
            </h2>
            {myListings.length === 0 ? (
              <div className="empty-state card-glass">
                 <Home className="empty-state__icon" size={48} />
                 <p className="empty-state__title">No listings yet</p>
                 <p className="empty-state__desc">Create your first listing to start receiving inquiries from renters.</p>
                 <Link href="/dashboard/create-listing" className="btn btn-primary" style={{ marginTop: '16px' }}>
                   Create Listing
                 </Link>
              </div>
            ) : (
              <div className="listings-grid">
                {/* Reusing Listing Card logic similar to listings/page.tsx, but potentially with edit/delete buttons */}
                {myListings.map(listing => (
                  <div key={listing.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--bg-surface)', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                       <Home size={32} />
                    </div>
                    <div style={{ padding: '16px' }}>
                       <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{listing.title}</h3>
                       <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>₦{listing.price} / mo &middot; {listing.status}</p>
                       <div style={{ display: 'flex', gap: '8px' }}>
                         <Link href={`/listings/${listing.id}`} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>View</Link>
                         <Link href={`/dashboard/edit-listing/${listing.id}`} className="btn btn-outline btn-sm" style={{ flex: 1, textAlign: 'center' }}>Edit</Link>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '16px' }}>
              Saved Properties
            </h2>
            <div className="empty-state card-glass">
              <Home className="empty-state__icon" size={48} />
              <p className="empty-state__title">No saved properties</p>
              <p className="empty-state__desc">Browse listings and save your favorites to compare them later.</p>
              <Link href="/listings" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Browse Rentals
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
