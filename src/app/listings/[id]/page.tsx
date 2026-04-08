import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MapPin, Bed, Bath, MessageSquare } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles:landlord_id ( id, first_name, last_name, avatar_url )
    `)
    .eq('id', params.id)
    .single()

  if (error || !listing) {
    notFound()
  }

  return (
    <div className="section-sm">
      <div className="container-sm">
        <Link href="/listings" className="btn btn-ghost" style={{ marginBottom: '24px' }}>
          &larr; Back to Listings
        </Link>
        
        <div className="gallery gallery--single" style={{ marginBottom: '32px' }}>
          <div className="gallery__main bg-surface" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '48px' }}>📸</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '48px' }}>
          
          <div className="listing-details">
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
               <span className="badge badge-success">For Rent</span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
              {listing.title}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '15px' }}>
              {listing.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} /> {listing.location}
                </span>
              )}
              {listing.bedrooms && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bed size={16} /> {listing.bedrooms} Beds
                </span>
              )}
              {listing.bathrooms && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bath size={16} /> {listing.bathrooms} Baths
                </span>
              )}
            </div>

            <div className="divider"></div>

            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '16px' }}>Description</h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
              {listing.description}
            </div>
          </div>

          <div className="listing-sidebar">
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px' }}>
                ${listing.price} <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '500' }}>/ month</span>
              </div>
              
              <div className="divider" style={{ marginBlock: '20px' }}></div>
              
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Listed By</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="avatar avatar-lg">
                    {listing.profiles?.avatar_url ? (
                      <img src={listing.profiles.avatar_url} alt="" style={{width: '100%', height:'100%', objectFit: 'cover'}} />
                    ) : (
                      listing.profiles?.first_name?.charAt(0) || 'L'
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {listing.profiles?.first_name} {listing.profiles?.last_name}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Verified Landlord</div>
                  </div>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <MessageSquare size={18} /> Contact Landlord
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
