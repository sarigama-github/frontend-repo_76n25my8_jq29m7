import { useEffect, useState } from 'react'

export default function AdminDashboard(){
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [metrics, setMetrics] = useState(null)
  const [csvType, setCsvType] = useState('users')
  const [csvText, setCsvText] = useState('')
  const [exported, setExported] = useState('')

  const load = async ()=>{
    const data = await fetch(`${baseUrl}/api/analytics/admin/system`).then(r=>r.json())
    setMetrics(data)
  }
  useEffect(()=>{ load() },[])

  const doExport = async ()=>{
    const r = await fetch(`${baseUrl}/api/admin/export?type=${csvType}`)
    const d = await r.json()
    setExported(d.csv)
  }
  const doImport = async ()=>{
    await fetch(`${baseUrl}/api/admin/import`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type: csvType, csv: csvText }) })
    setCsvText('')
    await load()
  }

  return (
    <div className="min-h-[40vh] bg-slate-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="bg-[#0f172a] rounded-2xl p-6 border border-slate-800">
          <h3 className="text-purple-400 font-bold mb-2">System Metrics</h3>
          <div className="text-slate-300">Users: {metrics?.users ?? '...'} • Active sessions: {metrics?.active_sessions ?? '...'} • Courses: {metrics?.courses ?? '...'} • Modules: {metrics?.modules ?? '...'} • Attempts: {metrics?.attempts ?? '...'}</div>
        </div>
        <div className="bg-[#1e293b] rounded-2xl p-6 border border-slate-800">
          <h3 className="text-red-400 font-bold mb-2">Bulk Tools</h3>
          <div className="grid gap-3">
            <div className="flex gap-2 items-center">
              <label>Type</label>
              <select value={csvType} onChange={e=>setCsvType(e.target.value)} className="text-slate-900 rounded px-2 py-1">
                <option value="users">Users</option>
                <option value="modules">Modules</option>
              </select>
              <button onClick={doExport} className="px-3 py-1 rounded bg-emerald-500 text-slate-900 font-semibold">Export CSV</button>
            </div>
            <textarea value={exported} readOnly rows={6} className="w-full rounded bg-slate-800 border border-slate-700 p-2 text-blue-200/90" placeholder="Exported CSV will appear here" />
            <textarea value={csvText} onChange={e=>setCsvText(e.target.value)} rows={6} className="w-full rounded bg-slate-800 border border-slate-700 p-2" placeholder="Paste CSV to import" />
            <button onClick={doImport} className="px-3 py-2 rounded bg-sky-400 text-slate-900 font-semibold">Import CSV</button>
          </div>
        </div>
      </div>
    </div>
  )
}
