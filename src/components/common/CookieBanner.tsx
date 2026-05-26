'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookies-accepted')
    if (!hasAccepted) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookies-accepted', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '16px 24px',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
      }}
    >
      <div style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-primary)', fontWeight: '500' }}>
            We value your privacy
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read more in our <Link href="/privacy" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Privacy Policy</Link>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={() => setIsVisible(false)}
            className="btn btn-ghost btn-sm"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="btn btn-primary btn-sm"
          >
            Accept All
          </button>
          <button
            onClick={() => setIsVisible(false)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
