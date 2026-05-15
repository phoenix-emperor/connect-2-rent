import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import EditListingClient from './EditListingClient'

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('landlord_id', user.id)  // ensure ownership
    .single()

  if (!listing) notFound()

  const { data: images } = await supabase
    .from('listing_images')
    .select('*')
    .eq('listing_id', id)

  return <EditListingClient listing={listing} images={images ?? []} />
}
