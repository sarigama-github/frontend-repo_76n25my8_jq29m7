import { useEffect, useRef } from 'react'

export default function Hero({ onCTA }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const c = containerRef.current
    if (!c) return

    const layers = c.querySelectorAll('[data-layer]')
    const sprites = c.querySelectorAll('[data-sprite]')
    const handle = (e) => {
      const rect = c.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      const px = (cx / rect.width - 0.5)
      const py = (cy / rect.height - 0.5)
      layers.forEach((el, i) => {
        const depth = (i + 1) * 10
        el.style.transform = `translate3d(${px * depth}px, ${py * depth}px, 0)`
      })
      sprites.forEach((el) => {
        el.style.transform = `translate3d(${px * 20}px, ${py * 20}px, 0)`
      })
    }
    c.addEventListener('mousemove', handle)
    return () => c.removeEventListener('mousemove', handle)
  }, [])

  return (
    <section ref={containerRef} className="relative overflow-hidden min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="absolute inset-0 pointer-events-none">
        <div data-layer className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.2),transparent_60%)]"></div>
        <div data-layer className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.15),transparent_60%)]"></div>
        <div data-layer className="absolute -left-32 top-10 w-72 h-72 rounded-full bg-fuchsia-600/20 blur-3xl"></div>
        <div data-layer className="absolute -right-24 bottom-10 w-72 h-72 rounded-full bg-cyan-400/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-3xl text-center px-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">Learn Code. Level Up. Become Legend.</h1>
        <p className="text-blue-200/90 mb-6">An adaptive, RPG-style learning world where quests, XP, and smart recommendations guide your journey.</p>
        <button onClick={onCTA} className="relative inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold transition group">
          <span>Start Your Quest</span>
          <span className="absolute inset-0 rounded-xl ring-2 ring-emerald-300/50 opacity-0 group-hover:opacity-100"></span>
        </button>
      </div>

      <img data-sprite alt="HTML Knight" className="hidden sm:block absolute left-10 bottom-8 w-24 drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]" src="https://images.unsplash.com/photo-1599937054672-14f207a40120?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxIVE1MJTIwS25pZ2h0fGVufDB8MHx8fDE3NjM1NjcwOTh8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" />
      <img data-sprite alt="Python Druid" className="hidden sm:block absolute right-16 bottom-10 w-24 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]" src="https://images.unsplash.com/photo-1580192985016-7e15ef081dd8?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxQeXRob24lMjBEcnVpZHxlbnwwfDB8fHwxNzYzNTY3MDk5fDA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80" />
      <img data-sprite alt="JS Mage" className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-8 w-20 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/svg/brand-javascript.svg" />
    </section>
  )
}
