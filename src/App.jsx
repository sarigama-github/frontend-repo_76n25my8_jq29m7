import { useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import StudentDashboard from './components/StudentDashboard'
import TeacherDashboard from './components/TeacherDashboard'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [auth, setAuth] = useState(null)

  const onAuthed = (data) => {
    setAuth(data)
  }

  const startQuest = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
