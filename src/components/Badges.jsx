export default function Badges({ badges = [] }){
  const list = badges.length ? badges : [
    { name: 'First Quest', desc: 'Completed your first module', color: '#22c55e' },
    { name: 'HTML Apprentice', desc: 'Learned the basics of HTML', color: '#eab308' },
    { name: 'Problem Solver', desc: 'Scored 80%+ on a quiz', color: '#38bdf8' },
  ]
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {list.map((b,i)=> (
        <div key={i} className="p-3 rounded-xl border border-slate-700 bg-slate-800/60">
          <div className="font-semibold" style={{color: b.color}}>{b.name}</div>
          <div className="text-sm text-blue-200/80">{b.desc}</div>
        </div>
      ))}
    </div>
  )
}
