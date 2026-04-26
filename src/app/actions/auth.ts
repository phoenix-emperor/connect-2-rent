'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('fetch failed')) {
      return { error: 'Network error: Unable to reach the server. Please check your internet connection and try again.' }
    }
    return { error: error.message }
  }

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

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
         // Custom data for trigger or client-side reading maybe?
         // In a robust implementation, we might do this within a SQL trigger on auth.users insert.
         // Let's pass the role here just in case.
         role,
         first_name: firstName,
         last_name: lastName
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

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
