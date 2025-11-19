export default function SkillTree({ skills = { agility: 5, logic: 5, creativity: 5 } }){
  const entries = Object.entries(skills)
  return (
    <div className="space-y-3">
      {entries.map(([k,v])=> (
        <div key={k}>
          <div className="flex justify-between text-sm text-blue-200/80"><span className="capitalize">{k}</span><span>{v}/10</span></div>
          <div className="h-2 bg-slate-700/70 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" style={{width: `${Math.min(100, (v/10)*100)}%`}}/>
          </div>
        </div>
      ))}
    </div>
  )
}
