import { useEffect, useState } from 'react'

export default function TeacherDashboard() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [overview, setOverview] = useState(null)
  const [students, setStudents] = useState([])
  const [granting, setGranting] = useState({})
  const [newContent, setNewContent] = useState({ title: '', course_category: 'HTML', content_type: 'text', difficulty_level: 1, xp_reward: 50, topic: '' })
  const [quizRows, setQuizRows] = useState([])

  const load = async ()=>{
    const o = await fetch(`${baseUrl}/api/analytics/teacher/overview`).then(r=>r.json())
    setOverview(o)
    const s = await fetch(`${baseUrl}/api/teacher/students`).then(r=>r.json())
    setStudents(s)
    const q = await fetch(`${baseUrl}/api/teacher/quiz_results`).then(r=>r.json()).catch(()=>[])
    setQuizRows(q || [])
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

  const addContent = async ()=>{
    await fetch(`${baseUrl}/api/teacher/new_content`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(newContent) })
    setNewContent({ title: '', course_category: newContent.course_category, content_type: 'text', difficulty_level: 1, xp_reward: 50, topic: '' })
    await load()
  }

  return (
    <div className="min-h-[50vh] px-6 py-10" style={{background: 'linear-gradient(180deg,#0d9488,#0ea5e9)'}}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white mb-6">Teacher Hub</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/15 rounded-xl p-4 text-white">Students: {overview?.students ?? '...'}</div>
          <div className="bg-white/15 rounded-xl p-4 text-white">Attempts: {overview?.attempts ?? '...'}</div>
          <div className="bg-white/15 rounded-xl p-4 text-white">Quiz Avg: {overview?.quiz_average ?? '...'}</div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-2xl p-4 text-white">
            <h3 className="font-semibold mb-3">Student Progress</h3>
            <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
              {students.map(s => (
                <div key={s._id} className="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-center bg-white/5 rounded-xl p-3">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-sm opacity-80">Level {s.level} • XP {s.xp} • Attempts {s.attempts} • Avg {s.avg_score}</div>
                  </div>
                  <input type="number" placeholder="XP" className="px-3 py-2 rounded-lg text-slate-900" id={`xp_${s._id}`} />
                  <button disabled={!!granting[s._id]} onClick={()=> grantXP(s._id, document.getElementById(`xp_${s._id}`).value || 0)} className="px-4 py-2 rounded-lg bg-emerald-400 text-slate-900 font-semibold">{granting[s._id] ? 'Granting...' : 'Grant XP'}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-4 text-white">
            <h3 className="font-semibold mb-3">Add New Content</h3>
            <div className="grid gap-2">
              <input value={newContent.title} onChange={e=>setNewContent(v=>({...v, title:e.target.value}))} placeholder="Title" className="px-3 py-2 rounded bg-white text-slate-900" />
              <div className="grid grid-cols-2 gap-2">
                <select value={newContent.course_category} onChange={e=>setNewContent(v=>({...v, course_category:e.target.value}))} className="px-3 py-2 rounded bg-white text-slate-900">
                  {['HTML','Python','Java','C++','JavaScript','PHP'].map(x=> <option key={x} value={x}>{x}</option>)}
                </select>
                <select value={newContent.content_type} onChange={e=>setNewContent(v=>({...v, content_type:e.target.value}))} className="px-3 py-2 rounded bg-white text-slate-900">
                  {['text','video','quiz','game'].map(x=> <option key={x} value={x}>{x}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={newContent.difficulty_level} onChange={e=>setNewContent(v=>({...v, difficulty_level:Number(e.target.value)}))} placeholder="Difficulty" className="px-3 py-2 rounded bg-white text-slate-900" />
                <input type="number" value={newContent.xp_reward} onChange={e=>setNewContent(v=>({...v, xp_reward:Number(e.target.value)}))} placeholder="XP Reward" className="px-3 py-2 rounded bg-white text-slate-900" />
              </div>
              <input value={newContent.topic} onChange={e=>setNewContent(v=>({...v, topic:e.target.value}))} placeholder="Topic" className="px-3 py-2 rounded bg-white text-slate-900" />
              <button onClick={addContent} className="px-4 py-2 rounded-lg bg-emerald-400 text-slate-900 font-semibold">Create</button>
            </div>

            <h3 className="font-semibold mt-6 mb-2">Recent Quiz Results</h3>
            <div className="max-h-48 overflow-auto space-y-2">
              {quizRows.map((q,i)=> (
                <div key={i} className="bg-white/5 rounded p-2 text-sm flex justify-between">
                  <span className="opacity-90">{q.user}</span>
                  <span className="opacity-80">{q.module}</span>
                  <span className="font-semibold">{q.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
