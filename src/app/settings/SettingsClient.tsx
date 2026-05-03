'use client'

import { useActionState, useState } from 'react'
import { updateProfile, deleteAccount } from '@/app/actions/profile'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'
import { ArrowLeft, User, ShieldAlert, CheckCircle, Trash2, AlertTriangle } from 'lucide-react'

type ProfileState = { error?: string; success?: string }
const profileInitial: ProfileState = {}

export default function SettingsClient({
  user,
  profile,
}: {
  user: { id: string; email?: string }
  profile: any
}) {
  // ── Profile form ──────────────────────────────────────────
  const [profileState, profileAction, profilePending] = useActionState(
    async (_prevState: ProfileState, formData: FormData): Promise<ProfileState> => {
      const res = await updateProfile(formData)
      return res ?? {}
    },
    profileInitial
  )

  // ── Delete account ─────────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  async function handleDeleteAccount() {
    if (deleteConfirmText !== 'DELETE') return
    setDeleting(true)
    await deleteAccount()
  }

  return (
    <div className="section-sm">
      <div className="container-sm">
        {/* Back */}
        <Link
          href="/dashboard"
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '24px', paddingLeft: 0 }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Account Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
          Manage your profile and account preferences.
        </p>

        {/* ── Profile section ───────────────────────────── */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--primary-light)' }}>
              <User size={20} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Profile Information</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Update your name and personal details</p>
            </div>
          </div>

          <form action={profileAction} className="form-group" style={{ gap: '16px' }}>
            {profileState.error && (
              <div style={{ background: 'var(--error-light)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
                <p className="form-error" style={{ margin: 0 }}>{profileState.error}</p>
              </div>
            )}
            {profileState.success && (
              <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--success)" />
                <p style={{ fontSize: '14px', color: 'var(--success)', margin: 0 }}>{profileState.success}</p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">First Name</label>
                <input
                  className="form-input"
                  name="firstName"
                  required
                  defaultValue={profile?.first_name ?? ''}
                  placeholder="John"
                />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input
                  className="form-input"
                  name="lastName"
                  required
                  defaultValue={profile?.last_name ?? ''}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                value={user.email ?? ''}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <p className="form-hint" style={{ marginTop: '4px' }}>Email cannot be changed here. Contact support if needed.</p>
            </div>

            <div>
              <label className="form-label">Account Role</label>
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: '700',
                  background: profile?.role === 'LANDLORD' ? 'var(--primary-light)' : 'var(--secondary-light)',
                  color: profile?.role === 'LANDLORD' ? '#818CF8' : '#34D399',
                  border: `1px solid ${profile?.role === 'LANDLORD' ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.2)'}`,
                }}>
                  {profile?.role === 'LANDLORD' ? 'Landlord' : 'Renter'}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Role is set at registration and cannot be changed.</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={profilePending}
                style={{ minWidth: '140px' }}
              >
                {profilePending ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="spinner" /> Saving…
                  </span>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Danger zone ───────────────────────────────── */}
        <div className="card" style={{ borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--error-light)' }}>
              <ShieldAlert size={20} color="var(--error)" />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--error)' }}>Danger Zone</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Irreversible actions — proceed with caution</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Delete Account</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
            </div>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setShowDeleteConfirm(true)}
              style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete confirmation modal ─────────────────────── */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => { if (!deleting) setShowDeleteConfirm(false) }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal__header" style={{ borderColor: 'rgba(248,113,113,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={20} color="var(--error)" />
                <span className="modal__title" style={{ color: 'var(--error)' }}>Delete Account</span>
              </div>
              <button className="modal__close" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>✕</button>
            </div>

            <div className="modal__body">
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.6' }}>
                This will <strong style={{ color: 'var(--text-primary)' }}>permanently delete</strong> your account,
                all your listings, messages, and profile data. This action <strong style={{ color: 'var(--error)' }}>cannot be undone</strong>.
              </p>

              <div>
                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                  Type <strong style={{ color: 'var(--error)', fontFamily: 'monospace' }}>DELETE</strong> to confirm
                </label>
                <input
                  className="form-input"
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  disabled={deleting}
                  style={{ borderColor: deleteConfirmText === 'DELETE' ? 'rgba(248,113,113,0.5)' : undefined }}
                />
              </div>
            </div>

            <div className="modal__footer">
              <button
                className="btn btn-ghost"
                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deleting}
                style={{ minWidth: '140px' }}
              >
                {deleting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="spinner" /> Deleting…
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Trash2 size={14} /> Confirm Delete
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
