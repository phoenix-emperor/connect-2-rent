'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  let signInError: string | null = null
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      signInError = error.message.toLowerCase().includes('fetch') || error.message.toLowerCase().includes('network')
        ? 'Network error: Unable to reach the server. Please check your internet connection and try again.'
        : error.message
    }
  } catch {
    signInError = 'Network error: Unable to reach the server. Please check your internet connection and try again.'
  }

  if (signInError) return { error: signInError }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  if (!email || !password || !role || !firstName || !lastName) {
    return { error: 'Please fill out all fields.' }
  }

  let signUpError: string | null = null
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          first_name: firstName,
          last_name: lastName,
        },
      },
    })
    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('email address is invalid')) {
        signUpError = 'An account with this email already exists. Try signing in instead.'
      } else {
        signUpError = error.message
      }
    }
  } catch {
    signUpError = 'Network error: Unable to reach the server. Please check your internet connection and try again.'
  }

  if (signUpError) return { error: signUpError }

  // Profile creation is now safely handled by a Postgres trigger to bypass RLS restrictions and cookie delays.

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
