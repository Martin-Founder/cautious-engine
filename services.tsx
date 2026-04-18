"use client"

import { useEffect, useRef } from "react"
import { Monitor, Share2, PenTool, Image, ArrowUpRight } from "lucide-react"

const services = [
  {
    icon: Monitor,
    num: "01",
    title: "WEBOVÉ STRÁNKY",
    short: "Weby, které prodávají 24/7",
    desc: "Rychlé, responzivní stránky optimalizované pro konverze a vyhledávače. Každý pixel má svůj účel.",
    tags: ["Next.js", "SEO", "Konverze"],
  },
  {
    icon: Share2,
    num: "02",
    title: "SOCIÁLNÍ SÍTĚ",
    short: "Obsah s algoritmickým dosahem",
    desc: "Strategie, příspěvky, reels a měřitelné výsledky. Data-driven přístup k organickému růstu.",
    tags: ["Instagram", "Facebook", "Analytics"],
  },
  {
    icon: PenTool,
    num: "03",
    title: "BRANDING",
    short: "Identita, kterou si zapamatují",
    desc: "Logo a vizuální systém, který zákazníci poznají na první pohled. Konzistentní přes všechny kanály.",
    tags: ["Logo", "Brand Book", "Tonalita"],
  },
  {
    icon: Image,
    num: "04",
    title: "GRAFICKÝ DESIGN",
    short: "Vizuály, které zaujmou",
    desc: "Od příspěvků na sítě po tiskoviny. Profesionální grafika pro každou situaci.",
    tags: ["Print", "Digital", "Motion"],
  },
]

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)" }, delay)
        obs.unobserve(el)
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

export default function Services() {
  const headerRef = useReveal()

  return (
    <section id="sluzby" className="relative bg-transparent py-36 overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(59,111,212,0.07) 0%, transparent 70%)" }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center gap-5 mb-24 opacity-0"
          style={{ transform: "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <span className="text-xs font-black tracking-[0.4em] text-[#6b9de8] uppercase neon-text">// CO DĚLÁME</span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.92]">
            NAŠE
            <br />
            <span className="text-gradient">SLUŽBY</span>
          </h2>
          <p className="text-white/35 max-w-md text-lg leading-relaxed">
            Čtyři specializace. Jeden tým. Kompletní digitální řešení.
          </p>
        </div>

        {/* Large feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((s, i) => {
            const ref = useReveal(i * 120)
            const Icon = s.icon
            return (
              <div
                key={s.title}
                ref={ref}
                className="group relative flex flex-col gap-6 p-8 md:p-10 rounded-3xl overflow-hidden holo-card opacity-0"
                style={{ transform: "translateY(40px)", transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)" }}
              >
                {/* Background number */}
                <span className="absolute top-6 right-8 text-[7rem] font-black text-white/[0.025] select-none leading-none tracking-tighter">{s.num}</span>

                {/* Top glow bar */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3b6fd4]/0 to-transparent group-hover:via-[#6b9de8] transition-all duration-700" />

                {/* Icon */}
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3b6fd4]/20 to-[#3b6fd4]/5 border border-[#3b6fd4]/25 flex items-center justify-center group-hover:scale-110 group-hover:border-[#3b6fd4]/50 transition-all duration-400">
                  <Icon size={26} className="text-[#6b9de8]" />
                  <div className="absolute inset-0 rounded-2xl bg-[#3b6fd4]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-2xl font-black text-white tracking-wide">{s.title}</h3>
                    <ArrowUpRight size={18} className="text-white/20 group-hover:text-[#6b9de8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 mt-1 shrink-0" />
                  </div>
                  <p className="text-sm font-bold text-[#6b9de8]/70 tracking-wide uppercase">{s.short}</p>
                </div>

                <p className="text-white/45 leading-relaxed">{s.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                  {s.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-[#6b9de8]/60 border border-[#3b6fd4]/15 bg-[#3b6fd4]/5 group-hover:border-[#3b6fd4]/30 group-hover:text-[#6b9de8]/80 transition-all duration-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
