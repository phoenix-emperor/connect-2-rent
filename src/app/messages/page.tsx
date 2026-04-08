import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, MessageSquare, Settings, LogOut, Send } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default async function MessagesPage() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // In a real app we'd fetch threads where `sender_id = user.id OR receiver_id = user.id`.
  // Here we'll just mock the structure based on the CSS we have.
  
  return (
    <div className="dash-grid">
      <aside className="dash-sidebar" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
           <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>Messages</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
           {/* Mock empty state for messages inbox side panel */}
           <div className="empty-state" style={{ padding: '40px 20px' }}>
              <MessageSquare className="empty-state__icon" size={32} />
              <p className="empty-state__title" style={{ fontSize: '16px' }}>No conversations</p>
           </div>
        </div>
        
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
          <Link href="/dashboard" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }}>
            &larr; Back to Dashboard
          </Link>
        </div>
      </aside>

      <main className="dash-content" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
        <div className="empty-state" style={{ margin: 'auto' }}>
           <MessageSquare className="empty-state__icon" size={64} style={{ opacity: 0.1 }} />
           <p className="empty-state__title">Select a conversation</p>
           <p className="empty-state__desc">Choose a message thread from the sidebar to view your conversation.</p>
        </div>
        
        {/* If a thread was selected, the UI would look like this: 
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
           <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>Inquiry about Modern Apartment</h3>
           <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Conversation with John Doe</p>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
           <div className="message-bubble message-bubble--recv">
             Hi, is this still available?
             <div className="message-time">10:42 AM</div>
           </div>
           <div className="message-bubble message-bubble--sent">
             Yes, would you like to schedule a viewing?
             <div className="message-time">10:45 AM</div>
           </div>
        </div>
        
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
           <form className="search-input-wrap">
             <input type="text" className="search-input" placeholder="Type your message..." />
             <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '6px' }}><Send size={16} /></button>
           </form>
        </div>
        */}
      </main>
    </div>
  )
}
