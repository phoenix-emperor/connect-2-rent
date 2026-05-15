import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, Send } from 'lucide-react'

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ thread?: string }> }) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const { thread: activeThread } = await searchParams

  const { data: messages } = await supabase
    .from('messages')
    .select('*, listing:listings(id, title)')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: true })

  const msgs = messages || []

  const profileIds = new Set(msgs.flatMap((m: any) => [m.sender_id, m.receiver_id]))
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .in('id', Array.from(profileIds))
  
  const profiles = Object.fromEntries((profilesData || []).map((p: any) => [p.id, p]))

  // Group by thread: listing_id + '_' + other_user_id
  const threads = new Map<string, { listingId: string, otherUserId: string, title: string, messages: any[] }>()

  for (const m of msgs) {
    const otherUserId = m.sender_id === user.id ? m.receiver_id : m.sender_id
    const threadId = `${m.listing_id}_${otherUserId}`
    if (!threads.has(threadId)) {
      threads.set(threadId, {
        listingId: m.listing_id,
        otherUserId,
        title: m.listing?.title || 'Unknown Property',
        messages: []
      })
    }
    threads.get(threadId)!.messages.push(m)
  }

  const activeThreadData = activeThread ? threads.get(activeThread) : null

  return (
    <div className="dash-grid">
      <aside className="dash-sidebar" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
           <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>Messages</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
           {threads.size === 0 ? (
             <div className="empty-state" style={{ padding: '40px 20px' }}>
                <MessageSquare className="empty-state__icon" size={32} />
                <p className="empty-state__title" style={{ fontSize: '16px' }}>No conversations</p>
             </div>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
               {Array.from(threads.entries()).map(([threadId, thread]) => {
                 const otherP = profiles[thread.otherUserId]
                 const isActive = threadId === activeThread
                 return (
                   <Link 
                     key={threadId} 
                     href={`/messages?thread=${threadId}`}
                     className={`thread-item ${isActive ? 'thread-item--active' : ''}`}
                   >
                     <div className="avatar">
                       {otherP?.avatar_url ? (
                         <img src={otherP.avatar_url} alt="" style={{width: '100%', height:'100%', objectFit: 'cover'}} />
                       ) : (
                         otherP?.first_name?.charAt(0) || 'U'
                       )}
                     </div>
                     <div style={{ overflow: 'hidden' }}>
                       <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                         {otherP?.first_name} {otherP?.last_name}
                       </div>
                       <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                         {thread.title}
                       </div>
                     </div>
                   </Link>
                 )
               })}
             </div>
           )}
        </div>
        
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
          <Link href="/dashboard" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }}>
            &larr; Back to Dashboard
          </Link>
        </div>
      </aside>

      <main className="dash-content" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
        {!activeThreadData ? (
          <div className="empty-state" style={{ margin: 'auto' }}>
             <MessageSquare className="empty-state__icon" size={64} style={{ opacity: 0.1 }} />
             <p className="empty-state__title">Select a conversation</p>
             <p className="empty-state__desc">Choose a message thread from the sidebar to view your conversation.</p>
          </div>
        ) : (
          <>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
               <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>{activeThreadData.title}</h3>
               <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                 Conversation with {profiles[activeThreadData.otherUserId]?.first_name} {profiles[activeThreadData.otherUserId]?.last_name}
               </p>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {activeThreadData.messages.map((msg: any) => {
                 const isSent = msg.sender_id === user.id
                 return (
                   <div key={msg.id} className={`message-bubble ${isSent ? 'message-bubble--sent' : 'message-bubble--recv'}`}>
                     {msg.content}
                     <div className="message-time">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                   </div>
                 )
               })}
            </div>
            
            <div style={{ padding: '20px', borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
               <form 
                  action={async (formData: FormData) => {
                    'use server'
                    const { sendMessage } = await import('@/app/actions/messages')
                    await sendMessage(formData)
                  }}
                  className="search-input-wrap"
               >
                 <input type="hidden" name="listing_id" value={activeThreadData.listingId} />
                 <input type="hidden" name="receiver_id" value={activeThreadData.otherUserId} />
                 <input type="text" name="content" className="search-input" placeholder="Type your message..." required autoComplete="off" />
                 <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '6px' }}><Send size={16} /></button>
               </form>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
