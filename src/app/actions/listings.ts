'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ─── Helpers ───────────────────────────────────────────────────────────────

async function getLandlordUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  return { supabase, user, isLandlord: profile?.role === 'LANDLORD' }
}

async function uploadImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  listingId: string,
  files: File[],
  startOrder = 0,
) {
  for (const [i, file] of files.entries()) {
    if (file.size === 0) continue
    const ext  = file.name.split('.').pop() ?? 'jpg'
    const path = `${listingId}/${Date.now()}_${i}.${ext}`

    const { error: upErr } = await supabase.storage
      .from('listing-images')
      .upload(path, file, { contentType: file.type })

    if (!upErr) {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${path}`
      await supabase.from('listing_images').insert({
        listing_id: listingId,
        url,
        order: startOrder + i,
      })
    }
  }
}

// ─── Create listing ─────────────────────────────────────────────────────────

export async function createListing(formData: FormData) {
  const { supabase, user, isLandlord } = await getLandlordUser()
  if (!isLandlord) return { error: 'Only landlords can create listings.' }

  const title        = formData.get('title') as string
  const description  = formData.get('description') as string
  const price        = parseFloat(formData.get('price') as string)
  const location     = formData.get('location') as string
  const bedrooms     = parseInt(formData.get('bedrooms') as string, 10)
  const bathrooms    = parseInt(formData.get('bathrooms') as string, 10)
  const propertyType = formData.get('property_type') as string

  if (!title || !price || !location) {
    return { error: 'Title, price and location are required.' }
  }

  try {
    const { data: newListing, error } = await supabase
      .from('listings')
      .insert({
        landlord_id:   user.id,
        title,
        description,
        price,
        location,
        bedrooms:      isNaN(bedrooms)  ? null : bedrooms,
        bathrooms:     isNaN(bathrooms) ? null : bathrooms,
        property_type: propertyType || null,
      })
      .select('id')
      .single()

    if (error) return { error: error.message }

    const images = (formData.getAll('images') as File[]).filter(f => f.size > 0)
    if (images.length) await uploadImages(supabase, newListing.id, images)
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

// ─── Update listing ─────────────────────────────────────────────────────────

export async function updateListing(formData: FormData) {
  const { supabase, user } = await getLandlordUser()

  const listingId    = formData.get('listingId') as string
  const title        = formData.get('title') as string
  const description  = formData.get('description') as string
  const price        = parseFloat(formData.get('price') as string)
  const location     = formData.get('location') as string
  const bedrooms     = parseInt(formData.get('bedrooms') as string, 10)
  const bathrooms    = parseInt(formData.get('bathrooms') as string, 10)
  const propertyType = formData.get('property_type') as string

  if (!listingId || !title || !price || !location) {
    return { error: 'Title, price and location are required.' }
  }

  // Verify ownership
  const { data: existing } = await supabase
    .from('listings').select('landlord_id').eq('id', listingId).single()
  if (!existing || existing.landlord_id !== user.id) {
    return { error: 'You do not have permission to edit this listing.' }
  }

  try {
    const { error } = await supabase
      .from('listings')
      .update({
        title,
        description,
        price,
        location,
        bedrooms:      isNaN(bedrooms)  ? null : bedrooms,
        bathrooms:     isNaN(bathrooms) ? null : bathrooms,
        property_type: propertyType || null,
      })
      .eq('id', listingId)

    if (error) return { error: error.message }

    // Upload any new images
    const images = (formData.getAll('images') as File[]).filter(f => f.size > 0)
    if (images.length) {
      const { data: current } = await supabase
        .from('listing_images').select('"order"').eq('listing_id', listingId)
        .order('order', { ascending: false }).limit(1)
      const startOrder = (current?.[0]?.order ?? -1) + 1
      await uploadImages(supabase, listingId, images, startOrder)
    }
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/listings/${listingId}`)
  redirect('/dashboard')
}

// ─── Delete listing image ────────────────────────────────────────────────────

export async function deleteListingImage(imageId: string, storagePath: string) {
  const { supabase, user } = await getLandlordUser()

  // Verify ownership via listing
  const { data: img } = await supabase
    .from('listing_images').select('listing_id').eq('id', imageId).single()
  if (!img) return { error: 'Image not found.' }

  const { data: listing } = await supabase
    .from('listings').select('landlord_id').eq('id', img.listing_id).single()
  if (!listing || listing.landlord_id !== user.id) {
    return { error: 'Unauthorized.' }
  }

  await supabase.storage.from('listing-images').remove([storagePath])
  await supabase.from('listing_images').delete().eq('id', imageId)
  revalidatePath(`/dashboard/edit-listing/${img.listing_id}`)
}
