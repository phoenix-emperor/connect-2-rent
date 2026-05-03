'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const firstName = formData.get('firstName') as string
  const lastName  = formData.get('lastName') as string

  if (!firstName || !lastName) return { error: 'First and last name are required.' }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName })
      .eq('id', user.id)

    if (error) return { error: error.message }
  } catch {
    return { error: 'Something went wrong. Please try again.' }
  }

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  return { success: 'Profile updated successfully.' }
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  try {
    // Delete profile first (listings & messages cascade in DB, or handle explicitly)
    await supabase.from('profiles').delete().eq('id', user.id)

    // Delete auth user — requires service role in production; here we sign out
    // and the DB trigger / scheduled job handles cleanup.
    const { error } = await supabase.auth.admin?.deleteUser?.(user.id)
      ?? { error: null }

    // Fallback: if admin API not available, just sign out
    if (error) {
      await supabase.auth.signOut()
    }
  } catch {
    await supabase.auth.signOut()
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  if (!email) return { error: 'Please enter your email address.' }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/reset-password`,
    })
    if (error) return { error: error.message }
  } catch {
    return { error: 'Network error. Please check your connection and try again.' }
  }

  return { success: 'Check your inbox — we sent a password reset link.' }
}
