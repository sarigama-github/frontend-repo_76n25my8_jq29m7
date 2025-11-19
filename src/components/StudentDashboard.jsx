import { useEffect, useState } from 'react'

export default function StudentDashboard({ token }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])
  const [chapters, setChapters] = useState([])

  useEffect(() => {
    // Minimal fake profile from token not implemented; show sample content
    fetch(`${baseUrl}/api/courses`)
      .then(r => r.json()).then(setCourses)
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
            <h2 className="text-2xl font-bold">Welcome, Adventurer</h2>
            <p className="text-blue-200/80">Choose a realm and begin your quest.</p>
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

        <style>{`@keyframes slideIn {from{transform:translateX(-10px);opacity:0} to{transform:translateX(0);opacity:1}}`}</style>
      </div>
    </div>
  )
}
