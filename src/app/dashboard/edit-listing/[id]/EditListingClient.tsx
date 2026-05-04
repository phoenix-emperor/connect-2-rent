'use client'

import { useActionState, useState, useRef } from 'react'
import { updateListing, deleteListingImage } from '@/app/actions/listings'
import Link from 'next/link'
import { ArrowLeft, Home, MapPin, Bed, Bath, FileText, ImagePlus, X, Trash2 } from 'lucide-react'

const initialState = { error: '' }

export default function EditListingClient({ listing, images: initialImages }: { listing: any, images: any[] }) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await updateListing(formData)
      if (res?.error) return { error: res.error }
      return prevState
    },
    initialState
  )

  // ── Existing image removal ───────────────────────────────
  const [images, setImages] = useState(initialImages)
  async function removeExistingImage(imageId: string, url: string) {
    if (!confirm('Are you sure you want to delete this photo?')) return
    // Optimistic UI update
    setImages(prev => prev.filter(img => img.id !== imageId))
    
    // Extract storage path from url
    // URL format: .../listing-images/[listingId]/[filename]
    const parts = url.split('/listing-images/')
    if (parts.length > 1) {
      const path = parts[1]
      await deleteListingImage(imageId, path)
    }
  }

  // ── New image preview state ──────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  function addFiles(incoming: FileList | null) {
    if (!incoming || !fileInputRef.current) return
    const dt = new DataTransfer()
    Array.from(fileInputRef.current.files ?? []).forEach(f => dt.items.add(f))
    Array.from(incoming).forEach(f => dt.items.add(f))
    fileInputRef.current.files = dt.files
    setPreviews(Array.from(dt.files).map(f => URL.createObjectURL(f)))
  }

  function removeNewImage(i: number) {
    if (!fileInputRef.current) return
    const dt = new DataTransfer()
    Array.from(fileInputRef.current.files ?? []).forEach((f, idx) => {
      if (idx !== i) dt.items.add(f)
    })
    fileInputRef.current.files = dt.files
    URL.revokeObjectURL(previews[i])
    setPreviews(Array.from(dt.files).map(f => URL.createObjectURL(f)))
  }

  return (
    <div className="section-sm">
      <div className="container-sm">
        <Link href="/dashboard" className="btn btn-ghost btn-sm" style={{ marginBottom: '24px', paddingLeft: 0 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: 'var(--primary-light)', marginBottom: '16px' }}>
            <Home size={28} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Edit Listing</h1>
          <p style={{ color: 'var(--text-muted)' }}>Update the details for &quot;{listing.title}&quot;.</p>
        </div>

        <div className="card">
          <form action={formAction} className="form-group" style={{ gap: '20px' }}>
            <input type="hidden" name="listingId" value={listing.id} />
            
            {state.error && (
              <div style={{ background: 'var(--error-light)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
                <p className="form-error" style={{ margin: 0 }}>{state.error}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> Listing Title
              </label>
              <input className="form-input" name="title" required defaultValue={listing.title} />
            </div>

            {/* Description */}
            <div>
              <label className="form-label">Description</label>
              <textarea className="form-textarea" name="description" rows={4} defaultValue={listing.description} />
            </div>

            {/* Price & Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">Monthly Rent (₦)</label>
                <input className="form-input" name="price" type="number" min="0" step="0.01" required defaultValue={listing.price} />
              </div>
              <div>
                <label className="form-label">Property Type</label>
                <select className="form-select" name="property_type" defaultValue={listing.property_type || 'APARTMENT'}>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="STUDIO">Studio</option>
                  <option value="ROOM">Room</option>
                  <option value="CONDO">Condo</option>
                  <option value="TOWNHOUSE">Townhouse</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} /> Location / Address
              </label>
              <input className="form-input" name="location" required defaultValue={listing.location} />
            </div>

            {/* Bedrooms & Bathrooms */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bed size={14} /> Bedrooms
                </label>
                <input className="form-input" name="bedrooms" type="number" min="0" defaultValue={listing.bedrooms || ''} />
              </div>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bath size={14} /> Bathrooms
                </label>
                <input className="form-input" name="bathrooms" type="number" min="0" defaultValue={listing.bathrooms || ''} />
              </div>
            </div>

            {/* Existing Images */}
            {images.length > 0 && (
              <div>
                <label className="form-label" style={{ marginBottom: '10px' }}>Current Photos</label>
                <div className="upload-preview">
                  {images.map(img => (
                    <div key={img.id} className="upload-thumb">
                      <img src={img.url} alt="Listing Photo" />
                      <button
                        type="button"
                        className="upload-thumb__remove"
                        onClick={() => removeExistingImage(img.id, img.url)}
                        title="Delete permanently"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Images */}
            <div style={{ marginTop: '8px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <ImagePlus size={14} /> Add New Photos
              </label>

              <input
                ref={fileInputRef}
                type="file"
                name="images"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => addFiles(e.target.files)}
              />

              <div
                className={`upload-zone${isDragging ? ' upload-zone--drag' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files) }}
              >
                <ImagePlus size={32} style={{ opacity: 0.5 }} />
                <p style={{ fontSize: '14px', fontWeight: '600' }}>
                  {isDragging ? 'Drop images here' : 'Click or drag new photos here'}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  JPG, PNG, WEBP — up to 10 images
                </p>
              </div>

              {/* Previews of newly added images */}
              {previews.length > 0 && (
                <div className="upload-preview" style={{ marginTop: '12px' }}>
                  {previews.map((url, i) => (
                    <div key={i} className="upload-thumb">
                      <img src={url} alt={`Preview ${i + 1}`} />
                      <button
                        type="button"
                        className="upload-thumb__remove"
                        onClick={e => { e.stopPropagation(); removeNewImage(i) }}
                        title="Remove"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="divider" style={{ marginBlock: '4px' }} />

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Link href="/dashboard" className="btn btn-outline">Cancel</Link>
              <button type="submit" className="btn btn-primary btn-lg" disabled={isPending} style={{ minWidth: '160px' }}>
                {isPending
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="spinner" /> Saving…</span>
                  : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
