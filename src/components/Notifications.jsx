import { useEffect, useState } from 'react'

export default function Notifications({ role = 'student', token }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)

  const audience = role === 'admin' ? 'admins' : role === 'teacher' ? 'teachers' : 'students'

  const load = async ()=>{
    try {
      const r = await fetch(`${baseUrl}/api/notifications?audience=${audience}`)
      const d = await r.json()
      setItems(d)
    } catch {}
  }

  useEffect(()=>{ load() }, [role])

  const unreadCount = items.filter(n => !(n.read_by || []).includes('me')).length // simple client-side, backend read_by handled via explicit call

  const markRead = async (id)=>{
    try{
      await fetch(`${baseUrl}/api/notifications/read`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ notification_id: id, user_id: 'me' }) })
      setItems(prev => prev.map(n => n._id === id ? { ...n, read_by: [ ...(n.read_by||[]), 'me' ] } : n))
    } catch {}
  }

  return (
    <div className="relative">
      <button onClick={()=> setOpen(v=>!v)} className="relative px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-white text-sm hover:bg-white/15">
        Notifications
        {unreadCount > 0 && (
          <span className="ml-2 inline-flex items-center justify-center text-xs bg-emerald-400 text-slate-900 rounded-full px-2 py-0.5">{unreadCount}</span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[85vw] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-xl p-3 z-20">
          <div className="text-xs text-blue-200/80 mb-2">Recent updates</div>
          <div className="max-h-72 overflow-auto space-y-2">
            {items.length === 0 && <div className="text-sm text-blue-200/70">No notifications yet.</div>}
            {items.map(n => (
              <div key={n._id} className="bg-slate-800/60 border border-slate-700 rounded-lg p-3">
                <div className="text-sm font-semibold text-white">{n.title}</div>
                <div className="text-sm text-blue-200/80">{n.message}</div>
                <div className="flex justify-end">
                  <button onClick={()=>markRead(n._id)} className="mt-2 text-xs text-emerald-300 hover:text-emerald-200">Mark read</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
