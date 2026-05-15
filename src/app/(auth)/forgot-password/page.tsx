'use client'

import { useActionState } from 'react'
import { forgotPassword } from '@/app/actions/profile'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

type ForgotState = { error?: string; success?: string }
const initialState: ForgotState = {}

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: ForgotState, formData: FormData): Promise<ForgotState> => {
      const res = await forgotPassword(formData)
      return res ?? {}
    },
    initialState
  )

  return (
    <div className="section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>

        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'var(--primary-light)', marginBottom: '16px' }}>
            <Mail size={32} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Forgot Password?
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {state.success ? (
          /* Success state */
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: 'rgba(52,211,153,0.12)', marginBottom: '16px' }}>
              <CheckCircle size={32} color="var(--success)" />
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '8px' }}>
              Email sent!
            </p>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
              {state.success}
            </p>
            <Link href="/login" className="btn btn-outline" style={{ width: '100%' }}>
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        ) : (
          /* Form */
          <form action={formAction} className="form-group">
            {state.error && (
              <div style={{ background: 'var(--error-light)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
                <p className="form-error" style={{ margin: 0 }}>{state.error}</p>
              </div>
            )}

            <div>
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <button
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={isPending}
              style={{ width: '100%', marginTop: '8px' }}
            >
              {isPending ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="spinner" /> Sending…
                </span>
              ) : 'Send Reset Link'}
            </button>

            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginTop: '8px' }}>
              <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
