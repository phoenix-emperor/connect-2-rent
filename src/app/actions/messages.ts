'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function sendMessage(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const listing_id = formData.get('listing_id') as string
  const receiver_id = formData.get('receiver_id') as string
  const content = formData.get('content') as string

  if (!listing_id || !receiver_id || !content) {
    throw new Error('Missing required fields')
  }

  const { error } = await supabase
    .from('messages')
    .insert({
      listing_id,
      sender_id: user.id,
      receiver_id,
      content,
    })

  if (error) {
    console.error('Failed to send message:', error)
    throw new Error('Supabase Error: ' + error.message + ' (Code: ' + error.code + ')')
  }

  revalidatePath('/messages')
  // Redirect to messages with the active thread
  redirect(`/messages?thread=${listing_id}_${receiver_id}`)
}
