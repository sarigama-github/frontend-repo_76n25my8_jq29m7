import { useEffect, useRef } from 'react'
import { Sparkles, Zap } from 'lucide-react'

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
        const depth = (i + 1) * 8
        el.style.transform = `translate3d(${px * depth}px, ${py * depth}px, 0)`
      })
      sprites.forEach((el) => {
        el.style.transform = `translate3d(${px * 16}px, ${py * 16}px, 0)`
      })
    }
    c.addEventListener('mousemove', handle)
    return () => c.removeEventListener('mousemove', handle)
  }, [])

  return (
    <header ref={containerRef} className="relative overflow-hidden min-h-[88vh] flex items-center justify-center text-white bg-animated-space">
      {/* floating orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div data-layer className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-cyan-400/25 orb" />
        <div data-layer className="absolute -right-24 -bottom-24 w-[28rem] h-[28rem] rounded-full bg-teal-300/20 orb" style={{ animationDelay: '1s' }} />

        {/* subtle grid + vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0)_40%,rgba(2,6,23,0.6))]" />
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,transparent_49%,rgba(255,255,255,0.15)_50%,transparent_51%),linear-gradient(to_bottom,transparent_49%,rgba(255,255,255,0.15)_50%,transparent_51%)] bg-[length:40px_40px]" />
      </div>

      {/* top nav / logo */}
      <div className="absolute top-6 left-6 flex items-center gap-3 px-3 py-2 rounded-xl backdrop-blur-md bg-white/5 ring-1 ring-white/10 fade-in-up">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400 grid place-items-center shadow-[0_0_30px_rgba(34,197,94,0.35)]">
          <Zap className="w-5 h-5 text-slate-950" />
        </div>
        <span className="text-sm font-semibold tracking-wide text-cyan-200">EduaiHub</span>
      </div>

      {/* center content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
        <p className="fade-in-up [animation-delay:120ms] text-cyan-200/80">Modern RPG learning platform</p>
        <h1 className="fade-in-up [animation-delay:220ms] mt-3 font-extrabold leading-tight tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="block">Learn Code.</span>
          <span className="block">Level Up.</span>
          <span className="block text-gradient-animate">Become Legend.</span>
        </h1>
        <p className="fade-in-up [animation-delay:320ms] mt-5 text-base sm:text-lg md:text-xl text-cyan-100/85 max-w-3xl mx-auto">
          An adaptive, quest-driven journey where you master coding through challenges, earn XP, unlock badges, and follow smart recommendations tailored to your style.
        </p>

        <div className="fade-in-up [animation-delay:420ms] mt-8 flex items-center justify-center">
          <button onClick={onCTA} className="group relative inline-flex items-center gap-3 px-7 py-4 rounded-2xl bg-teal-400 text-slate-900 font-semibold transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:scale-[1.05] glow-cta">
            <Sparkles className="w-5 h-5" />
            <span>Start Your Quest</span>
            <span className="pointer-events-none absolute -inset-0.5 rounded-2xl ring-2 ring-teal-300/60 blur-sm opacity-0 group-hover:opacity-100 transition" />
          </button>
        </div>
      </div>

      {/* character cards */}
      <div className="pointer-events-none absolute bottom-6 left-6 sm:left-8">
        <div data-sprite className="pointer-events-auto group w-36 sm:w-44 md:w-52 aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 backdrop-blur-md opacity-70 hover:opacity-100 scale-95 hover:scale-100 transition duration-300 ease-[cubic-bezier(.2,.8,.2,1)] shadow-[0_10px_60px_rgba(45,212,191,0.18)]">
          <img alt="HTML Knight" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1599937054672-14f207a40120?auto=format&fit=crop&q=80&w=1200" />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-6 right-6 sm:right-8">
        <div data-sprite className="pointer-events-auto group w-36 sm:w-44 md:w-52 aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 backdrop-blur-md opacity-70 hover:opacity-100 scale-95 hover:scale-100 transition duration-300 ease-[cubic-bezier(.2,.8,.2,1)] shadow-[0_10px_60px_rgba(56,189,248,0.18)]">
          <img alt="Python Druid" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1580192985016-7e15ef081dd8?auto=format&fit=crop&q=80&w=1200" />
        </div>
      </div>

      {/* center floating icon (JS Mage renamed) */}
      <img data-sprite alt="EduaiHub" className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-10 w-16 drop-shadow-[0_0_28px_rgba(250,204,21,0.5)]" src="https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/svg/brand-javascript.svg" />
    </header>
  )
}
