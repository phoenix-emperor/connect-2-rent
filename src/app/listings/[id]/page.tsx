import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MapPin, Bed, Bath, MessageSquare } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      profiles ( id, first_name, last_name, avatar_url ),
      listing_images ( id, url )
    `)
    .eq('id', id)
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
        
        <div style={{ marginBottom: '32px' }}>
          <div className="gallery gallery--single">
            <div className="gallery__main bg-surface" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              {listing.listing_images && listing.listing_images.length > 0 ? (
                <img src={listing.listing_images[0].url} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '48px' }}>📸</span>
              )}
            </div>
          </div>
          {listing.listing_images && listing.listing_images.length > 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '16px', marginTop: '16px' }}>
              {listing.listing_images.slice(1).map((img: any) => (
                 <div key={img.id} style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 </div>
              ))}
            </div>
          )}
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
                ₦{listing.price} <span style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '500' }}>/ month</span>
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

              <div style={{ marginTop: '24px' }}>
                <form action={async (formData: FormData) => {
                  'use server'
                  const { sendMessage } = await import('@/app/actions/messages')
                  await sendMessage(formData)
                }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="hidden" name="listing_id" value={listing.id} />
                  <input type="hidden" name="receiver_id" value={listing.landlord_id} />
                  
                  <textarea 
                    name="content" 
                    className="form-textarea" 
                    placeholder="Hi, I am interested in this property..." 
                    required 
                    rows={3}
                    style={{ minHeight: '80px', fontSize: '14px' }}
                  ></textarea>
                  
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <MessageSquare size={18} /> Contact Landlord
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
