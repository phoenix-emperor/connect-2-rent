'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const firstName  = formData.get('firstName') as string
  const lastName   = formData.get('lastName') as string
  const phone      = formData.get('phone') as string
  const avatarFile = formData.get('avatar') as File | null

  if (!firstName || !lastName) return { error: 'First and last name are required.' }

  let avatarUrl: string | undefined = undefined

  if (avatarFile && avatarFile.size > 0) {
    const ext  = avatarFile.name.split('.').pop() ?? 'jpg'
    const path = `${user.id}/avatar.${ext}`

    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, avatarFile, { contentType: avatarFile.type, upsert: true })

    if (upErr) return { error: 'Failed to upload avatar: ' + upErr.message }

    avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${path}?t=${Date.now()}`
  }

  try {
    const updateData: Record<string, unknown> = {
      first_name: firstName,
      last_name:  lastName,
      full_name:  `${firstName} ${lastName}`,
      phone:      phone || null,
    }
    if (avatarUrl) updateData.avatar_url = avatarUrl

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
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
    await supabase.from('profiles').delete().eq('id', user.id)
    const { error } = await supabase.auth.admin?.deleteUser?.(user.id) ?? { error: null }
    if (error) await supabase.auth.signOut()
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
