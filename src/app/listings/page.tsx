import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Search, MapPin, Bed, Bath } from 'lucide-react'
import fs from 'fs'

export default async function ListingsPage() {
  const supabase = await createClient()
  
  // Fetch active listings from Supabase
  // We'll also fetch the landlord profile to display their avatar/name.
  const { data: listings, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles ( first_name, last_name, avatar_url ),
      listing_images ( id, url )
    `)
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1 className="page-title">Browse Rentals</h1>
          <p className="page-desc">Find your next home from our verified listings.</p>
        </div>
      </div>

      <div className="section-sm">
        <div className="container">
          
          <div className="listings-filters">
            <div className="search-input-wrap" style={{ maxWidth: '400px' }}>
              <Search size={18} color="var(--text-muted)" />
              <input type="text" className="search-input" placeholder="Search by location or keywords..." />
            </div>
            
            <button className="filter-pill filter-pill--active">All</button>
            <button className="filter-pill">Houses</button>
            <button className="filter-pill">Apartments</button>
          </div>

          {error ? (
            <div className="empty-state">
              <p className="empty-state__title">Error loading listings</p>
              <p className="empty-state__desc">{error.message}</p>
            </div>
          ) : !listings || listings.length === 0 ? (
            <div className="empty-state">
              <Search className="empty-state__icon" />
              <p className="empty-state__title">No listings found</p>
              <p className="empty-state__desc">There are currently no active properties matching your criteria.</p>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing: any) => (
                <Link href={`/listings/${listing.id}`} key={listing.id} className="listing-card">
                  <div className="listing-card__img-wrap">
                    {listing.listing_images && listing.listing_images.length > 0 ? (
                      <img src={listing.listing_images[0].url} alt={listing.title} className="listing-card__img" />
                    ) : (
                      <div className="listing-card__placeholder">
                        <Home size={48} />
                      </div>
                    )}
                    <div className="listing-card__price">₦{listing.price}/mo</div>
                    <div className="listing-card__status-badge badge badge-success">New</div>
                  </div>
                  
                  <div className="listing-card__body">
                    <h3 className="listing-card__title">{listing.title}</h3>
                    {listing.location && (
                      <div className="listing-card__location">
                        <MapPin size={14} /> {listing.location}
                      </div>
                    )}
                    
                    <div className="listing-card__meta">
                      {listing.bedrooms && (
                        <div className="listing-card__meta-item">
                          <Bed size={14} /> {listing.bedrooms} Beds
                        </div>
                      )}
                      {listing.bathrooms && (
                        <div className="listing-card__meta-item">
                          <Bath size={14} /> {listing.bathrooms} Baths
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="listing-card__footer">
                    <div className="listing-card__landlord">
                      <div className="avatar avatar-sm">
                        {listing.profiles?.avatar_url ? (
                           <img src={listing.profiles.avatar_url} alt="" style={{width: '100%', height:'100%', objectFit: 'cover'}} />
                        ) : (
                           listing.profiles?.first_name?.charAt(0) || 'L'
                        )}
                      </div>
                      <span>{listing.profiles?.first_name} {listing.profiles?.last_name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function Home(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}
