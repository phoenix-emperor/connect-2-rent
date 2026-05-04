'use client'

import { useActionState } from 'react'
import { signup } from '@/app/actions/auth'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'

const initialState = { error: '' }

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const res = await signup(formData)
      if (res?.error) return { error: res.error }
      return prevState
    },
    initialState
  )

  return (
    <div className="section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: 'var(--bg-surface)', marginBottom: '16px' }}>
            <UserPlus size={32} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>Create an Account</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Join Connect-2-Rent today</p>
        </div>

        <form action={formAction} className="form-group">
          {state.error && (
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <p className="form-error">{state.error}</p>
              {state.error.includes('already exists') && (
                <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in instead →</Link>
                </p>
              )}
            </div>
          )}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">First Name</label>
              <input className="form-input" name="firstName" required placeholder="John" />
            </div>
            <div>
              <label className="form-label">Last Name</label>
              <input className="form-input" name="lastName" required placeholder="Doe" />
            </div>
          </div>
          
          <label className="form-label" style={{ marginTop: '8px' }}>Phone Number (Optional)</label>
          <input className="form-input" name="phone" type="tel" placeholder="e.g. 08012345678" />

          <label className="form-label" style={{ marginTop: '8px' }}>Email</label>
          <input className="form-input" name="email" type="email" required placeholder="you@example.com" />

          <label className="form-label" style={{ marginTop: '8px' }}>Password</label>
          <input className="form-input" name="password" type="password" required placeholder="••••••••" minLength={6} />

          <label className="form-label" style={{ marginTop: '8px' }}>I am a...</label>
          <select className="form-select" name="role" required defaultValue="RENTER">
            <option value="RENTER">Renter (Looking for a home)</option>
            <option value="LANDLORD">Landlord (Listing a property)</option>
          </select>

          <button className="btn btn-primary btn-lg" type="submit" disabled={isPending} style={{ marginTop: '24px', width: '100%' }}>
            {isPending ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
