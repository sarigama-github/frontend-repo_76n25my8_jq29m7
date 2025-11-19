import { useEffect, useState } from 'react'

export default function Recommendations({ userId }){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [recs, setRecs] = useState([])

  const load = async ()=>{
    const r = await fetch(`${baseUrl}/api/recommendations?user_id=${userId}&status=Ready`)
    const d = await r.json()
    setRecs(d)
  }

  useEffect(()=>{ if(userId){ load() } },[userId])

  return (
    <div className="space-y-3">
      {recs.map((r)=> (
        <div key={r._id} className="p-3 rounded-xl border border-slate-700 bg-slate-800/60">
          <div className="text-sm text-blue-200/80">Confidence {Math.round((r.confidence_score||0)*100)}%</div>
          <div className="font-semibold text-white">Suggested format: {r.suggested_format || 'text'}</div>
          <div className="text-blue-300/80">{r.reason}</div>
        </div>
      ))}
      {recs.length===0 && <div className="text-blue-300/80">No recommendations yet. Submit an attempt to get one.</div>}
    </div>
  )
}
