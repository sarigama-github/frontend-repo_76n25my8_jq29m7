import { useEffect, useState } from 'react'
import ModuleFlow from './ModuleFlow'
import Recommendations from './Recommendations'

export default function StudentDashboard({ token }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])
  const [chapters, setChapters] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    fetch(`${baseUrl}/api/me`, { headers }).then(r=>r.json()).then((u)=>{
      setUser(u)
      if (u?._id) {
        fetch(`${baseUrl}/api/analytics/student/${u._id}`).then(r=>r.json()).then(setStats)
      }
    }).catch(()=>{})
    fetch(`${baseUrl}/api/courses`).then(r => r.json()).then(setCourses)
  }, [])

  const fetchChapters = async (lang) => {
    const res = await fetch(`${baseUrl}/api/story_chapters?language_path=${encodeURIComponent(lang)}`)
    const data = await res.json()
    setChapters(data)
  }

  return (
    <div className="min-h-[60vh] text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 animate-pulse"></div>
          <div>
            <h2 className="text-2xl font-bold">Welcome, {user?.name || 'Adventurer'}</h2>
            <p className="text-blue-200/80">Level {stats?.user?.level ?? user?.current_level ?? 1} • XP {stats?.user?.xp ?? user?.xp_points ?? 0} • Completion {stats?.completion_pct ?? 0}%</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => (
            <button key={c._id} onClick={() => fetchChapters(c.category)} className="group relative bg-slate-800/60 border border-slate-700 rounded-2xl p-5 text-left hover:border-emerald-400/60 transition">
              <div className="text-sm text-blue-200/80 mb-1">{c.category}</div>
              <div className="text-xl font-semibold mb-2">{c.title}</div>
              <div className="text-blue-300/70">{c.description}</div>
              <div className="absolute right-5 top-5 w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-150 transition"></div>
            </button>
          ))}
        </div>

        {chapters.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-3">Story</h3>
            <div className="space-y-3">
              {chapters.map(ch => (
                <div key={ch._id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 translate-x-0 animate-[slideIn_0.5s_ease]">
                  <div className="font-semibold">Chapter {ch.chapter_number}: {ch.title}</div>
                  <div className="text-blue-200/80">{ch.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {user && (
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4">Your Quest</h3>
            <ModuleFlow user={user} token={token} />
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-3">Recommendations</h3>
              <Recommendations userId={user._id} />
            </div>
          </div>
        )}

        <style>{`@keyframes slideIn {from{transform:translateX(-10px);opacity:0} to{transform:translateX(0);opacity:1}}`}</style>
      </div>
    </div>
  )
}
