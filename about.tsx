"use client"

import { useEffect, useRef, useState } from "react"
import { Shield, TrendingUp, Users, Award, Cpu, Globe2 } from "lucide-react"

const pillars = [
  { icon: Shield, title: "SPOLEHLIVOST", desc: "Termíny jsou pro nás závazky, ne odhady.", color: "#3b6fd4" },
  { icon: TrendingUp, title: "VÝSLEDKY", desc: "Každý projekt měříme daty, ne dojmy.", color: "#6b9de8" },
  { icon: Users, title: "PARTNERSTVÍ", desc: "Myslíme dlouhodobě, ne na jeden projekt.", color: "#3b6fd4" },
  { icon: Award, title: "EXCELENCE", desc: "150+ projektů. Každý lepší než předchozí.", color: "#6b9de8" },
  { icon: Cpu, title: "TECHNOLOGIE", desc: "Nejmodernější stack, nejrychlejší výsledky.", color: "#3b6fd4" },
  { icon: Globe2, title: "DOSAH", desc: "Lokálně zakořenění, globálně myslící.", color: "#6b9de8" },
]

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1800
        const start = performance.now()
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          setCount(Math.floor((1 - Math.pow(1-p, 3)) * target))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{count}{suffix}</span>
}

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => { el.style.opacity = "1"; el.style.transform = "none" }, delay)
        obs.unobserve(el)
      }
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

export default function About() {
  const leftRef = useReveal(0)

  return (
    <section id="o-nas" className="relative bg-transparent py-36 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-[#3b6fd4]/4 blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[#6b9de8]/4 blur-[100px] pointer-events-none translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">

          {/* Left */}
          <div
            ref={leftRef}
            className="flex flex-col gap-10 opacity-0"
            style={{ transform: "translateX(-40px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)" }}
          >
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black tracking-[0.4em] text-[#6b9de8] uppercase neon-text">// O NÁS</span>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[0.9]">
                VÁŠ DIGITÁLNÍ
                <br />
                <span className="text-gradient">PARTNER</span>
                <br />
                <span className="text-white/10 text-[0.5em] tracking-[0.3em] font-light uppercase">pro rok 2050</span>
              </h2>
            </div>

            <p className="text-white/45 leading-relaxed text-lg max-w-md border-l-2 border-[#3b6fd4]/30 pl-6">
              Jsme digitální agentura, která nevytváří jen weby —{" "}
              <span className="text-white/70">vytváříme digitální přítomnost</span>, která přivádí zákazníky a buduje značky.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-px bg-[#3b6fd4]/10 rounded-3xl overflow-hidden border border-[#3b6fd4]/10">
              {[
                { n: 150, s: "+", l: "PROJEKTŮ" },
                { n: 8, s: "", l: "LET NA TRHU" },
                { n: 98, s: "%", l: "SPOKOJENOST" },
              ].map((stat, i) => (
                <div key={stat.l} className="flex flex-col gap-2 p-6 bg-black/40 hover:bg-[#0e2040]/60 transition-colors duration-300">
                  <span className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tighter">
                    <AnimatedCounter target={stat.n} suffix={stat.s} />
                  </span>
                  <span className="text-[9px] text-white/25 tracking-[0.25em] font-bold">{stat.l}</span>
                </div>
              ))}
            </div>

            {/* Timeline bar */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs text-white/25 tracking-wider">
                <span>2016</span><span>2019</span><span>2022</span><span>2025+</span>
              </div>
              <div className="relative h-1 rounded-full bg-white/5">
                <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#3b6fd4] to-[#6b9de8]" style={{ width: "100%", animation: "type-in 2s ease-out forwards" }} />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#6b9de8] shadow-[0_0_12px_rgba(107,157,232,0.8)]" />
              </div>
            </div>
          </div>

          {/* Right — pillars grid */}
          <div className="grid grid-cols-2 gap-4">
            {pillars.map((p, i) => {
              const ref = useReveal(i * 80 + 100)
              const Icon = p.icon
              return (
                <div
                  key={p.title}
                  ref={ref}
                  className="group flex flex-col gap-4 p-6 rounded-2xl holo-card cyber-border cursor-default opacity-0"
                  style={{ transform: "translateY(25px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${p.color}18`, border: `1px solid ${p.color}30` }}>
                    <Icon size={20} style={{ color: p.color }} className="group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm tracking-wider mb-1.5">{p.title}</h4>
                    <p className="text-xs text-white/35 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="h-px bg-gradient-to-r from-[#3b6fd4]/0 via-[#3b6fd4]/20 to-[#3b6fd4]/0 group-hover:via-[#3b6fd4]/50 transition-all duration-500" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
