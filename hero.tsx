"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"

// MASSIVE EPIC ORB
function EpicOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let W = 0, H = 0

    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const NUM_POINTS = 12
    type Pt = { angle: number; r: number; rTarget: number; speed: number }
    const pts: Pt[] = Array.from({ length: NUM_POINTS }, (_, i) => ({
      angle: (i / NUM_POINTS) * Math.PI * 2,
      r: 0.30 + Math.random() * 0.08,
      rTarget: 0.30 + Math.random() * 0.08,
      speed: 0.002 + Math.random() * 0.003,
    }))
    const pts2: Pt[] = Array.from({ length: NUM_POINTS }, (_, i) => ({
      angle: (i / NUM_POINTS) * Math.PI * 2,
      r: 0.28 + Math.random() * 0.07,
      rTarget: 0.28 + Math.random() * 0.07,
      speed: 0.003 + Math.random() * 0.002,
    }))

    // Plasma rings
    const rings = Array.from({ length: 6 }, (_, i) => ({
      radius: 0.32 + i * 0.06,
      angle: Math.random() * Math.PI * 2,
      speed: (0.0003 + Math.random() * 0.0004) * (i % 2 === 0 ? 1 : -1),
      alpha: 0.15 - i * 0.02,
    }))

    // Energy particles orbiting the orb
    const orbParticles = Array.from({ length: 60 }, (_, i) => ({
      angle: (i / 60) * Math.PI * 2,
      radius: 0.33 + Math.random() * 0.15,
      speed: 0.001 + Math.random() * 0.002,
      size: 1 + Math.random() * 2.5,
      alpha: 0.3 + Math.random() * 0.7,
      hue: 200 + Math.random() * 40,
    }))

    const getBlob = (pts: Pt[], cx: number, cy: number, scale: number, t: number, waveAmp = 12) => {
      return pts.map((p, i) => {
        const wave = Math.sin(t * 0.002 + i * 0.5) * waveAmp
        const wave2 = Math.cos(t * 0.0015 + i * 0.8) * waveAmp * 0.6
        return {
          x: cx + Math.cos(p.angle) * (p.r * scale) + wave,
          y: cy + Math.sin(p.angle) * (p.r * scale * 0.92) + wave2,
        }
      })
    }

    const drawBlob = (verts: { x: number; y: number }[], gradient: CanvasGradient | string, blur: number) => {
      ctx.save()
      ctx.filter = `blur(${blur}px)`
      ctx.beginPath()
      const n = verts.length
      for (let i = 0; i < n; i++) {
        const curr = verts[i]
        const next = verts[(i + 1) % n]
        const cpX = (curr.x + next.x) / 2
        const cpY = (curr.y + next.y) / 2
        if (i === 0) ctx.moveTo(cpX, cpY)
        else ctx.quadraticCurveTo(curr.x, curr.y, cpX, cpY)
      }
      const last = verts[n - 1]
      const first = verts[0]
      ctx.quadraticCurveTo(last.x, last.y, (last.x + first.x) / 2, (last.y + first.y) / 2)
      ctx.fillStyle = gradient
      ctx.fill()
      ctx.restore()
    }

    let t = 0
    const draw = (ts: number) => {
      ctx.clearRect(0, 0, W, H)
      t = ts

      const breathe = 1 + 0.06 * Math.sin(ts * 0.0005)
      const scale = Math.min(W, H) * breathe

      // Morph
      ;[pts, pts2].forEach(arr => {
        arr.forEach(p => {
          p.r += (p.rTarget - p.r) * p.speed * 2
          if (Math.abs(p.r - p.rTarget) < 0.001) {
            p.rTarget = 0.22 + Math.random() * 0.14
          }
        })
      })

      const cx = W * 0.5 + Math.sin(ts * 0.0003) * 20
      const cy = H * 0.52 + Math.cos(ts * 0.00025) * 15

      // === OUTER GLOW HALO ===
      const haloR = scale * 0.55
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR)
      halo.addColorStop(0, "rgba(0, 80, 255, 0)")
      halo.addColorStop(0.5, "rgba(0, 60, 200, 0.08)")
      halo.addColorStop(0.75, "rgba(0, 100, 255, 0.12)")
      halo.addColorStop(0.88, "rgba(30, 120, 255, 0.18)")
      halo.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.save()
      ctx.filter = "blur(40px)"
      ctx.beginPath()
      ctx.arc(cx, cy, haloR, 0, Math.PI * 2)
      ctx.fillStyle = halo
      ctx.fill()
      ctx.restore()

      // === PLASMA RINGS ===
      rings.forEach(ring => {
        ring.angle += ring.speed
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(ring.angle)
        ctx.filter = `blur(${8 + ring.radius * 10}px)`
        ctx.beginPath()
        ctx.ellipse(0, 0, scale * ring.radius, scale * ring.radius * 0.3, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(50, 150, 255, ${ring.alpha})`
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.restore()
      })

      // === MAIN BIG ORB LAYERS ===
      // Deep core
      const verts1 = getBlob(pts, cx, cy, scale, ts, 10)
      const coreR = scale * 0.34
      const g1 = ctx.createRadialGradient(cx - scale * 0.05, cy - scale * 0.08, 0, cx, cy, coreR)
      g1.addColorStop(0, "rgba(150, 210, 255, 0.70)")
      g1.addColorStop(0.15, "rgba(80, 160, 255, 0.80)")
      g1.addColorStop(0.35, "rgba(30, 100, 255, 0.70)")
      g1.addColorStop(0.60, "rgba(10, 60, 200, 0.55)")
      g1.addColorStop(0.80, "rgba(5, 30, 120, 0.35)")
      g1.addColorStop(1, "rgba(0, 0, 0, 0.00)")
      drawBlob(verts1, g1, 20)

      // Second layer — electric
      const verts2 = getBlob(pts2, cx, cy, scale * 0.98, ts + 500, 14)
      const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 0.9)
      g2.addColorStop(0, "rgba(200, 230, 255, 0.50)")
      g2.addColorStop(0.3, "rgba(80, 170, 255, 0.40)")
      g2.addColorStop(0.6, "rgba(20, 80, 220, 0.20)")
      g2.addColorStop(1, "rgba(0, 0, 0, 0.00)")
      drawBlob(verts2, g2, 35)

      // Bright inner corona
      const coronaR = scale * 0.18
      const corona = ctx.createRadialGradient(cx, cy - scale * 0.06, 0, cx, cy, coronaR)
      corona.addColorStop(0, "rgba(255, 255, 255, 0.90)")
      corona.addColorStop(0.2, "rgba(180, 220, 255, 0.60)")
      corona.addColorStop(0.5, "rgba(80, 160, 255, 0.30)")
      corona.addColorStop(1, "rgba(0, 0, 0, 0.00)")
      ctx.save()
      ctx.filter = "blur(15px)"
      ctx.beginPath()
      ctx.arc(cx, cy, coronaR, 0, Math.PI * 2)
      ctx.fillStyle = corona
      ctx.fill()
      ctx.restore()

      // Super bright specular highlight
      const spec = ctx.createRadialGradient(cx - scale * 0.08, cy - scale * 0.12, 0, cx - scale * 0.08, cy - scale * 0.12, scale * 0.1)
      spec.addColorStop(0, `rgba(255, 255, 255, ${0.7 + 0.3 * Math.sin(ts * 0.001)})`)
      spec.addColorStop(0.4, "rgba(200, 230, 255, 0.30)")
      spec.addColorStop(1, "rgba(0, 0, 0, 0.00)")
      ctx.save()
      ctx.filter = "blur(8px)"
      ctx.beginPath()
      ctx.arc(cx - scale * 0.08, cy - scale * 0.12, scale * 0.1, 0, Math.PI * 2)
      ctx.fillStyle = spec
      ctx.fill()
      ctx.restore()

      // === NEON EDGE RIM ===
      ctx.save()
      ctx.filter = "blur(4px)"
      ctx.beginPath()
      const n = verts1.length
      for (let i = 0; i < n; i++) {
        const curr = verts1[i], next = verts1[(i + 1) % n]
        const cpX = (curr.x + next.x) / 2, cpY = (curr.y + next.y) / 2
        if (i === 0) ctx.moveTo(cpX, cpY)
        else ctx.quadraticCurveTo(curr.x, curr.y, cpX, cpY)
      }
      ctx.quadraticCurveTo(verts1[n-1].x, verts1[n-1].y, (verts1[n-1].x + verts1[0].x)/2, (verts1[n-1].y + verts1[0].y)/2)
      ctx.strokeStyle = `rgba(100, 180, 255, ${0.5 + 0.3 * Math.sin(ts * 0.001)})`
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.restore()

      // === ORBITING ENERGY PARTICLES ===
      orbParticles.forEach(p => {
        p.angle += p.speed
        const r = scale * p.radius * breathe
        const px = cx + Math.cos(p.angle) * r
        const py = cy + Math.sin(p.angle) * r * 0.4
        const distFromCenter = Math.sqrt((px-cx)**2 + (py-cy)**2) / (scale * 0.4)
        const fadeAlpha = p.alpha * Math.max(0, 1 - Math.max(0, distFromCenter - 0.7) * 3)
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 90%, 80%, ${fadeAlpha})`
        ctx.fill()
      })

      // === ELECTRIC TENDRILS ===
      if (Math.random() < 0.3) {
        const numTendrils = 2 + Math.floor(Math.random() * 3)
        for (let t2 = 0; t2 < numTendrils; t2++) {
          const startAngle = Math.random() * Math.PI * 2
          const startR = scale * 0.25
          let sx = cx + Math.cos(startAngle) * startR
          let sy = cy + Math.sin(startAngle) * startR * 0.9
          ctx.save()
          ctx.filter = "blur(2px)"
          ctx.beginPath()
          ctx.moveTo(sx, sy)
          const steps = 8
          for (let s = 0; s < steps; s++) {
            sx += (Math.random() - 0.5) * 30
            sy += (Math.random() - 0.5) * 30
            ctx.lineTo(sx, sy)
          }
          ctx.strokeStyle = `rgba(150, 200, 255, ${0.1 + Math.random() * 0.2})`
          ctx.lineWidth = 1
          ctx.stroke()
          ctx.restore()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

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
        const duration = 2200
        const start = performance.now()
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 4)
          setCount(Math.floor(ease * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{count}{suffix}</span>
}

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLElement>(null)
  const [glitching, setGlitching] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePos({
          x: (e.clientX - rect.left - rect.width / 2) / 60,
          y: (e.clientY - rect.top - rect.height / 2) / 60,
        })
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Random glitch effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        setGlitching(true)
        setTimeout(() => setGlitching(false), 150)
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    { value: 150, suffix: "+", label: "Projektů dokončeno" },
    { value: 8, suffix: "", label: "Let inovací" },
    { value: 98, suffix: "%", label: "Klientů se vrátí" },
  ]

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-transparent">
      {/* THE ORB */}
      <div className="absolute inset-0 pointer-events-none">
        <EpicOrb />
      </div>

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,80,255,0.015) 2px, rgba(0,80,255,0.015) 4px)",
        zIndex: 1,
      }} />

      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" style={{ zIndex: 1 }} />

      {/* Floating geometric elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
        {/* Top-right corner accent */}
        <div className="absolute top-32 right-16 w-32 h-32 border border-[#3b6fd4]/15 rotate-45 animate-spin-slow" style={{ animationDuration: "30s" }} />
        <div className="absolute top-36 right-20 w-24 h-24 border border-[#6b9de8]/10 rotate-45 animate-spin-slow" style={{ animationDuration: "20s", animationDirection: "reverse" }} />
        {/* Bottom-left */}
        <div className="absolute bottom-40 left-16 w-20 h-20 border border-[#3b6fd4]/10 rotate-12 animate-float" />
        {/* Floating data nodes */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#3b6fd4]/40"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${5 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
        {/* Horizontal data lines */}
        <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b6fd4]/10 to-transparent" />
        <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6b9de8]/8 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-24 flex flex-col items-center text-center gap-10" style={{ zIndex: 10 }}>

        {/* System badge */}
        <div
          className="opacity-0 animate-fade-in-up animation-delay-100 inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#3b6fd4]/30 bg-[#3b6fd4]/8 backdrop-blur-xl hover:border-[#3b6fd4]/60 transition-all duration-500 cursor-default group"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <div className="w-2 h-2 rounded-full bg-[#3b6fd4] animate-pulse" />
          <span className="text-[#a8c4f0] text-xs font-bold tracking-[0.3em] uppercase">WEBSURE SYSTEM v2.0 · ONLINE</span>
          <Zap size={12} className="text-[#6b9de8]" />
        </div>

        {/* Headline */}
        <div
          className="transition-transform duration-500 ease-out"
          style={{ transform: `translate(${mousePos.x * -0.4}px, ${mousePos.y * -0.4}px)` }}
        >
          <h1 className={`opacity-0 animate-fade-in-up animation-delay-200 font-black leading-[0.82] tracking-[-0.05em] ${glitching ? "glitch-effect" : ""}`}
            style={{ fontSize: "clamp(4rem, 13vw, 14rem)" }}>
            <span className="block text-white">POSOUVÁME</span>
            <span className="block text-gradient-shine mt-1">BYZNYS</span>
            <span className="block text-white/10 text-[0.35em] tracking-[0.5em] uppercase font-light mt-2">
              do budoucnosti
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <p className="opacity-0 animate-fade-in-up animation-delay-400 text-xl md:text-2xl text-white/35 max-w-2xl leading-relaxed font-light tracking-wide">
          Weby a digitální identita navržené pro rok 2050.
          <br />
          <span className="text-[#6b9de8]/70">Rychlé. Čisté. Nezapomenutelné.</span>
        </p>

        {/* CTAs */}
        <div className="opacity-0 animate-fade-in-up animation-delay-500 flex flex-wrap justify-center gap-4 mt-4">
          <Link
            href="#kontakt"
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#2455c0] to-[#3b6fd4] text-white font-bold text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_80px_rgba(59,111,212,0.6)] hover:-translate-y-2 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Spolupracujme
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
          <Link
            href="#sluzby"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full border border-white/10 bg-white/3 backdrop-blur-md text-white/60 hover:text-white hover:border-[#3b6fd4]/50 hover:bg-[#3b6fd4]/10 font-bold text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:-translate-y-2"
          >
            Prozkoumejte
          </Link>
        </div>

        {/* Stats */}
        <div className="opacity-0 animate-fade-in-up animation-delay-700 mt-16 flex flex-wrap justify-center gap-14 md:gap-20">
          {stats.map((s) => (
            <div key={s.label} className="group flex flex-col items-center gap-2 cursor-default">
              <div className="relative">
                <span className="text-5xl md:text-6xl lg:text-7xl font-black text-white tabular-nums tracking-tighter group-hover:text-gradient transition-all duration-300">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </span>
                <div className="absolute -inset-3 bg-[#3b6fd4]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              </div>
              <span className="text-[10px] text-white/25 uppercase tracking-[0.35em] font-semibold group-hover:text-[#6b9de8]/60 transition-colors">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <Link
        href="#o-nas"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/15 hover:text-[#3b6fd4]/60 transition-all duration-500 group"
        style={{ zIndex: 10 }}
      >
        <span className="text-[9px] tracking-[0.4em] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">Scroll</span>
        <div className="w-6 h-10 rounded-full border border-current flex items-start justify-center pt-2">
          <div className="w-1 h-2.5 rounded-full bg-current animate-bounce" />
        </div>
      </Link>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b6fd4]/20 to-transparent" />
    </section>
  )
}
