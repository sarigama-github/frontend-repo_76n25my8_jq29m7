import { useState } from 'react'

export default function Auth({ onAuthed }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = mode === 'login' ? `${baseUrl}/api/login` : `${baseUrl}/api/register`
      const body = mode === 'login' ? { email, password } : { name, email, password, role }
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed')
      const data = await res.json()
      onAuthed(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 text-white max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{mode === 'login' ? 'Login' : 'Create Account'}</h3>
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-emerald-400 hover:text-emerald-300 text-sm">{mode === 'login' ? 'Register' : 'Login'}</button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        {mode === 'register' && (
          <>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2"/>
            <div className="flex gap-2 text-sm">
              <label className="flex items-center gap-2"><input type="radio" checked={role==='student'} onChange={()=>setRole('student')}/> Student</label>
              <label className="flex items-center gap-2"><input type="radio" checked={role==='teacher'} onChange={()=>setRole('teacher')}/> Teacher</label>
              <label className="flex items-center gap-2"><input type="radio" checked={role==='admin'} onChange={()=>setRole('admin')}/> Admin</label>
            </div>
          </>
        )}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-3 py-2"/>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold rounded-lg py-2 transition">{loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}</button>
      </form>
    </div>
  )
}
