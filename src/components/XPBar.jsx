import React from 'react'

export default function XPBar({ xp = 0, level = 1, levels = [], highlight = false }) {
  // find current and next thresholds
  const currentLevel = levels.find(l => l.level_number === level) || { xp_threshold: 0, level_color: '#22c55e', badge_title: 'Novice' }
  const nextLevel = levels.find(l => l.level_number === level + 1)
  const start = currentLevel.xp_threshold || 0
  const end = nextLevel ? nextLevel.xp_threshold : Math.max(start + 500, xp + 500)
  const progress = Math.max(0, Math.min(1, (xp - start) / (end - start)))

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1 text-sm text-blue-200/80">
        <span>Level {level} • {currentLevel.badge_title || 'Adventurer'}</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
      <div className={`relative h-4 rounded-full overflow-hidden bg-slate-700/70 border border-slate-600 ${highlight ? 'ring-2 ring-emerald-400/50 animate-pulse' : ''}`}>
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${currentLevel.level_color || '#22c55e'}, #06b6d4)` }}
        />
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40 bg-[radial-gradient(circle_at_10%_50%,white,transparent_30%),radial-gradient(circle_at_90%_50%,white,transparent_30%)]" />
      </div>
      <div className="mt-1 text-xs text-blue-300/70">XP {xp} / {end}</div>
    </div>
  )
}
