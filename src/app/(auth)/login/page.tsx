'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { Key } from 'lucide-react'

const initialState = { error: '' }

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await login(formData)
      if (res?.error) return { error: res.error }
      return prevState
    },
    initialState
  )

  return (
    <div className="section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: 'var(--bg-surface)', marginBottom: '16px' }}>
            <Key size={32} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>Welcome Back</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Sign in to your account to continue</p>
        </div>

        <form action={formAction} className="form-group">
          {state.error && <p className="form-error" style={{ textAlign: 'center', marginBottom: '16px' }}>{state.error}</p>}
          
          <label className="form-label">Email</label>
          <input className="form-input" name="email" type="email" required placeholder="you@example.com" />

          <label className="form-label" style={{ marginTop: '8px' }}>Password</label>
          <input className="form-input" name="password" type="password" required placeholder="••••••••" />

          <button className="btn btn-primary btn-lg" type="submit" disabled={isPending} style={{ marginTop: '24px', width: '100%' }}>
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Don't have an account? <Link href="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}
