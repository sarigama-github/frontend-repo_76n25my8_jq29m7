import { useEffect, useState } from 'react'

export default function TeacherDashboard() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [overview, setOverview] = useState(null)
  const [students, setStudents] = useState([])
  const [granting, setGranting] = useState({})

  const load = async ()=>{
    const o = await fetch(`${baseUrl}/api/analytics/teacher/overview`).then(r=>r.json())
    setOverview(o)
    const s = await fetch(`${baseUrl}/api/teacher/students`).then(r=>r.json())
    setStudents(s)
  }

  useEffect(() => { load() }, [])

  const grantXP = async (id, xp)=>{
    setGranting(prev=>({...prev, [id]: true}))
    try{
      const res = await fetch(`${baseUrl}/api/teacher/grant_xp`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ user_id: id, xp: Number(xp) }) })
      await res.json()
      await load()
    } finally{
      setGranting(prev=>({...prev, [id]: false}))
    }
  }

  return (
    <div className="min-h-[50vh] px-6 py-10" style={{background: 'linear-gradient(180deg,#0d9488,#0ea5e9)'}}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white mb-6">Teacher Hub</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/15 rounded-xl p-4 text-white">Students: {overview?.students ?? '...'}</div>
          <div className="bg-white/15 rounded-xl p-4 text-white">Attempts: {overview?.attempts ?? '...'}</div>
          <div className="bg-white/15 rounded-xl p-4 text-white">Actions: Grant XP, View Progress</div>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 text-white">
          <h3 className="font-semibold mb-3">Student Progress</h3>
          <div className="space-y-3">
            {students.map(s => (
              <div key={s._id} className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-center bg-white/5 rounded-xl p-3">
                <div>
                  <div className="font-semibold">{s.name}</div>
                  <div className="text-sm opacity-80">Level {s.level} • XP {s.xp} • Attempts {s.attempts}</div>
                </div>
                <input type="number" placeholder="XP" className="px-3 py-2 rounded-lg text-slate-900" id={`xp_${s._id}`} />
                <button disabled={!!granting[s._id]} onClick={()=> grantXP(s._id, document.getElementById(`xp_${s._id}`).value || 0)} className="px-4 py-2 rounded-lg bg-emerald-400 text-slate-900 font-semibold">{granting[s._id] ? 'Granting...' : 'Grant XP'}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
