'use client'

import { useActionState, useState, useRef } from 'react'
import { createListing } from '@/app/actions/listings'
import Link from 'next/link'
import { ArrowLeft, Home, MapPin, Bed, Bath, FileText, ImagePlus, X } from 'lucide-react'

const initialState = { error: '' }

export default function CreateListingPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await createListing(formData)
      if (res?.error) return { error: res.error }
      return prevState
    },
    initialState
  )

  // ── Image preview state ──────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  function addFiles(incoming: FileList | null) {
    if (!incoming || !fileInputRef.current) return
    const dt = new DataTransfer()
    // Keep existing files
    Array.from(fileInputRef.current.files ?? []).forEach(f => dt.items.add(f))
    // Add new files
    Array.from(incoming).forEach(f => dt.items.add(f))
    fileInputRef.current.files = dt.files
    setPreviews(Array.from(dt.files).map(f => URL.createObjectURL(f)))
  }

  function removeImage(i: number) {
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
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>Create New Listing</h1>
          <p style={{ color: 'var(--text-muted)' }}>Fill in the details below to publish your property.</p>
        </div>

        <div className="card">
          <form action={formAction} className="form-group" style={{ gap: '20px' }}>
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
              <input className="form-input" name="title" required placeholder="e.g. Modern 2-Bed Apartment in City Centre" />
            </div>

            {/* Description */}
            <div>
              <label className="form-label">Description</label>
              <textarea className="form-textarea" name="description" placeholder="Describe the property — amenities, nearby transport, conditions, etc." rows={4} />
            </div>

            {/* Price & Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">Monthly Rent (₦)</label>
                <input className="form-input" name="price" type="number" min="0" step="0.01" required placeholder="e.g. 150000" />
              </div>
              <div>
                <label className="form-label">Property Type</label>
                <select className="form-select" name="property_type" defaultValue="APARTMENT">
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
              <input className="form-input" name="location" required placeholder="e.g. 14 Oak Street, Lagos" />
            </div>

            {/* Bedrooms & Bathrooms */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bed size={14} /> Bedrooms
                </label>
                <input className="form-input" name="bedrooms" type="number" min="0" placeholder="e.g. 2" />
              </div>
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bath size={14} /> Bathrooms
                </label>
                <input className="form-input" name="bathrooms" type="number" min="0" placeholder="e.g. 1" />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <ImagePlus size={14} /> Property Photos
              </label>

              {/* Hidden actual file input */}
              <input
                ref={fileInputRef}
                type="file"
                name="images"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => addFiles(e.target.files)}
              />

              {/* Drop zone */}
              <div
                className={`upload-zone${isDragging ? ' upload-zone--drag' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files) }}
                style={{ cursor: 'pointer' }}
              >
                <ImagePlus size={32} style={{ opacity: 0.5 }} />
                <p style={{ fontSize: '14px', fontWeight: '600' }}>
                  {isDragging ? 'Drop images here' : 'Click or drag photos here'}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  JPG, PNG, WEBP — up to 10 images
                </p>
              </div>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="upload-preview" style={{ marginTop: '12px' }}>
                  {previews.map((url, i) => (
                    <div key={i} className="upload-thumb">
                      <img src={url} alt={`Preview ${i + 1}`} />
                      <button
                        type="button"
                        className="upload-thumb__remove"
                        onClick={e => { e.stopPropagation(); removeImage(i) }}
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
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span className="spinner" /> Publishing…</span>
                  : 'Publish Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
