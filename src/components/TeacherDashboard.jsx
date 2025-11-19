import { useEffect, useState } from 'react'

export default function TeacherDashboard() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [overview, setOverview] = useState(null)

  useEffect(() => {
    fetch(`${baseUrl}/api/analytics/teacher/overview`).then(r=>r.json()).then(setOverview)
  }, [])

  return (
    <div className="min-h-[50vh] px-6 py-10" style={{background: 'linear-gradient(180deg,#0d9488,#0ea5e9)'}}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white mb-6">Teacher Hub</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white/15 rounded-xl p-4 text-white">Students: {overview?.students ?? '...'}</div>
          <div className="bg-white/15 rounded-xl p-4 text-white">Attempts: {overview?.attempts ?? '...'}</div>
          <div className="bg-white/15 rounded-xl p-4 text-white">Actions: Grant XP, View Progress</div>
        </div>
      </div>
    </div>
  )
}
