import { useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import StudentDashboard from './components/StudentDashboard'
import TeacherDashboard from './components/TeacherDashboard'
import AdminDashboard from './components/AdminDashboard'
import Notifications from './components/Notifications'

function App() {
  const [auth, setAuth] = useState(null)

  const onAuthed = (data) => {
    setAuth(data)
  }

  const startQuest = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  const logout = async ()=>{
    try{
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      await fetch(`${baseUrl}/api/logout`, { method:'POST', headers: { 'Authorization': `Bearer ${auth?.token}` }})
    } catch {}
    setAuth(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex justify-end p-4">
        {auth && (
          <div className="flex items-center gap-3">
            <Notifications role={auth.role} token={auth.token} />
            <button onClick={logout} className="px-3 py-2 rounded-xl bg-red-500/90 text-white text-sm hover:bg-red-400">Logout</button>
          </div>
        )}
      </div>

      <Hero onCTA={startQuest} />

      <div className="relative flex items-center justify-center py-14">
        {!auth ? (
          <Auth onAuthed={onAuthed} />
        ) : (
          <div className="w-full">
            {auth.role === 'student' && <StudentDashboard token={auth.token} />}
            {auth.role === 'teacher' && <TeacherDashboard />}
            {auth.role === 'admin' && <AdminDashboard />}
          </div>
        )}
      </div>

      <footer className="py-10 text-center text-blue-200/70 text-sm">Adaptive LMS RPG • Rule-based AI v1 • RL-ready</footer>
    </div>
  )
}

export default App
