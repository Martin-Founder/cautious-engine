"use client"

import { useEffect, useRef, useState } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    text: "Nový web nám přinesl 3× více poptávek první měsíc. Nejlepší investice za posledních 5 let.",
    name: "Marek Horák",
    role: "CEO, TechServis s.r.o.",
    initials: "MH",
    metric: "+300%",
    metricLabel: "více poptávek",
  },
  {
    text: "Engagement na sociálních sítích vzrostl o 210 %. Profesionální přístup, měřitelné výsledky.",
    name: "Jana Kovářková",
    role: "Marketing Director, BioFresh",
    initials: "JK",
    metric: "+210%",
    metricLabel: "engagement",
  },
  {
    text: "Rychlá komunikace, precizní provedení. Web spustili 2 týdny před termínem. Vřele doporučuji.",
    name: "Tomáš Bláha",
    role: "CEO, Logistic Pro",
    initials: "TB",
    metric: "2 týdny",
    metricLabel: "před termínem",
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const goTo = (index: number) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => { setActive(index); setAnimating(false) }, 250)
  }

  const prev = () => goTo((active - 1 + testimonials.length) % testimonials.length)
  const next = () => goTo((active + 1) % testimonials.length)

  useEffect(() => {
    const iv = setInterval(next, 5500)
    return () => clearInterval(iv)
  })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.unobserve(el) }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const t = testimonials[active]

  return (
    <section id="reference" className="relative bg-transparent py-36 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full" style={{ background: "radial-gradient(circle, rgba(59,111,212,0.08) 0%, transparent 65%)" }} />
      </div>

      <div
        ref={sectionRef}
        className="relative max-w-5xl mx-auto px-6 flex flex-col items-center gap-14 opacity-0"
        style={{ transform: "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <span className="text-xs font-black tracking-[0.4em] text-[#6b9de8] uppercase neon-text">// REFERENCE</span>

        {/* Stars */}
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={22} className="text-[#3b6fd4] fill-[#3b6fd4]" style={{ filter: "drop-shadow(0 0 6px rgba(59,111,212,0.6))" }} />
          ))}
        </div>

        {/* Quote card */}
        <div className="relative w-full max-w-3xl">
          {/* Quote icon */}
          <Quote size={48} className="absolute -top-6 -left-4 text-[#3b6fd4]/15 rotate-180" />

          <div
            className="relative rounded-3xl p-10 md:p-14 holo-card text-center transition-all duration-250"
            style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(12px)" : "translateY(0)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b6fd4]/30 to-transparent" />

            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight tracking-tight mb-8">
              &ldquo;{t.text}&rdquo;
            </blockquote>

            {/* Metric highlight */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-[#3b6fd4]/25 bg-[#3b6fd4]/8 mb-8">
              <span className="text-2xl font-black text-gradient">{t.metric}</span>
              <span className="text-white/40 text-sm">{t.metricLabel}</span>
            </div>

            {/* Author */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full border-2 border-[#3b6fd4]/40 bg-gradient-to-br from-[#0e2040] to-[#1a3a72] flex items-center justify-center" style={{ boxShadow: "0 0 20px rgba(59,111,212,0.2)" }}>
                <span className="text-base font-black text-[#6b9de8]">{t.initials}</span>
              </div>
              <div>
                <p className="text-white font-black tracking-wide">{t.name}</p>
                <p className="text-white/30 text-xs tracking-[0.2em] uppercase mt-1">{t.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button onClick={prev} className="w-12 h-12 rounded-full border border-white/8 bg-white/3 flex items-center justify-center text-white/40 hover:text-white hover:border-[#3b6fd4]/40 hover:bg-[#3b6fd4]/15 transition-all duration-300" aria-label="Předchozí">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-3">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className={`h-1.5 rounded-full transition-all duration-400 ${i === active ? "w-10 bg-[#3b6fd4] shadow-[0_0_8px_rgba(59,111,212,0.6)]" : "w-4 bg-white/15 hover:bg-white/30"}`} aria-label={`Reference ${i + 1}`} />
            ))}
          </div>
          <button onClick={next} className="w-12 h-12 rounded-full border border-white/8 bg-white/3 flex items-center justify-center text-white/40 hover:text-white hover:border-[#3b6fd4]/40 hover:bg-[#3b6fd4]/15 transition-all duration-300" aria-label="Další">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
