import { useEffect, useMemo, useState } from 'react'
import XPBar from './XPBar'
import Badges from './Badges'
import SkillTree from './SkillTree'

export default function ModuleFlow({ user, token }){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [levels, setLevels] = useState([])
  const [courses, setCourses] = useState([])
  const [modules, setModules] = useState([])
  const [activeCourse, setActiveCourse] = useState(null)
  const [activeModule, setActiveModule] = useState(null)
  const [score, setScore] = useState(80)
  const [timeSpent, setTimeSpent] = useState(300)
  const [formatUsed, setFormatUsed] = useState('video')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(()=>{
    fetch(`${baseUrl}/api/levels`).then(r=>r.json()).then(setLevels)
    fetch(`${baseUrl}/api/courses?selected_language=${encodeURIComponent(user?.selected_language || '')}`).then(r=>r.json()).then((cs)=>{
      setCourses(cs)
      if (cs?.length){
        setActiveCourse(cs[0])
      }
    })
  },[])

  useEffect(()=>{
    if (!activeCourse) return
    fetch(`${baseUrl}/api/modules?course_id=${activeCourse._id}`).then(r=>r.json()).then((mods)=>{
      setModules(mods)
      setActiveModule(mods[0] || null)
    })
  },[activeCourse])

  const onSubmitAttempt = async ()=>{
    if (!activeModule || !user) return
    setSubmitting(true)
    setResult(null)
    const controller = new AbortController()
    const timeout = setTimeout(()=>controller.abort(), 500)
    try{
      const res = await fetch(`${baseUrl}/api/recommend`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ user_id: user._id, recent_attempts: [], skill_tree: {} }),
        signal: controller.signal
      })
      const data = await res.json()
      if (data?.suggested_module_id){
        // if RL returns, we could use it; but for now continue to rule-based by submitting attempt
      }
    }catch(e){
      // timeout or error -> fallback
    } finally{
      clearTimeout(timeout)
    }

    try{
      const res2 = await fetch(`${baseUrl}/api/attempts`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          user_id: user._id,
          module_id: activeModule._id,
          score: Number(score),
          time_spent: Number(timeSpent),
          format_used: formatUsed,
          device_type: 'web'
        })
      })
      const out = await res2.json()
      setResult(out)
      if (out?.next_module_id){
        const next = modules.find(m=>m._id === out.next_module_id)
        if (next) setActiveModule(next)
      }
    }catch(err){
      setResult({ error: err.message })
    } finally{
      setSubmitting(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
      <div>
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {courses.map(c => (
              <button key={c._id} onClick={()=>setActiveCourse(c)} className={`px-4 py-2 rounded-full border ${activeCourse?._id===c._id?'bg-emerald-500 text-slate-900 border-emerald-400':'bg-slate-800/60 text-white border-slate-700'}`}>{c.title}</button>
            ))}
          </div>
        </div>

        {activeModule && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 mb-6">
            <div className="text-sm text-blue-300/70 mb-1">Difficulty {activeModule.difficulty_level} • {activeModule.content_type}</div>
            <h3 className="text-2xl font-bold mb-2">{activeModule.title}</h3>
            <p className="text-blue-200/80 mb-3">{activeModule.narrative_text}</p>
            {activeModule.content_url && (
              <a href={activeModule.content_url} target="_blank" className="inline-block text-emerald-400 hover:text-emerald-300 underline">Open learning resource</a>
            )}
          </div>
        )}

        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
          <h4 className="font-semibold mb-3">Submit Attempt</h4>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-blue-200/80">Score</label>
              <input type="number" value={score} onChange={e=>setScore(e.target.value)} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-blue-200/80">Time Spent (sec)</label>
              <input type="number" value={timeSpent} onChange={e=>setTimeSpent(e.target.value)} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-blue-200/80">Format Used</label>
              <select value={formatUsed} onChange={e=>setFormatUsed(e.target.value)} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2">
                <option value="video">Video</option>
                <option value="text">Text</option>
                <option value="quiz">Quiz</option>
                <option value="game">Game</option>
              </select>
            </div>
          </div>
          <button disabled={submitting || !activeModule} onClick={onSubmitAttempt} className="mt-4 px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold">{submitting? 'Submitting...':'Submit'}</button>
          {result && (
            <div className="mt-4 p-3 rounded-lg bg-slate-900/60 border border-slate-700 text-blue-200/90">
              {!result.error ? (
                <>
                  <div>XP gained: <span className="text-white font-semibold">{result.xp_gained}</span></div>
                  <div>New XP: <span className="text-white font-semibold">{result.new_xp}</span></div>
                  <div>Mastery: <span className="text-white font-semibold">{result.mastery?.toFixed(1)}%</span></div>
                  {result.leveled_up && <div className="text-emerald-400 font-semibold">Level up!</div>}
                </>
              ) : (
                <div className="text-red-400">{result.error}</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
          <h4 className="font-semibold mb-3">Your Progress</h4>
          <XPBar xp={user?.xp_points || 0} level={user?.current_level || 1} levels={levels} highlight={!!result?.leveled_up} />
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
          <h4 className="font-semibold mb-3">Badges</h4>
          <Badges />
        </div>
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
          <h4 className="font-semibold mb-3">Skill Tree</h4>
          <SkillTree />
        </div>
      </div>
    </div>
  )
}
