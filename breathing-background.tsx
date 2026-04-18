"use client"

import { useEffect, useRef } from "react"

export default function BreathingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let W = 0, H = 0

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = document.body.scrollHeight || 5000
    }
    resize()
    window.addEventListener("resize", resize)

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number }[] = []
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * 1920,
        y: Math.random() * 5000,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -Math.random() * 0.3 - 0.05,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.4 + 0.05,
        hue: 200 + Math.random() * 50,
      })
    }

    const draw = (ts: number) => {
      ctx.clearRect(0, 0, W, H)

      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, "#000000")
      bg.addColorStop(0.5, "#00040d")
      bg.addColorStop(1, "#000000")
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W }
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.9 }}
      aria-hidden="true"
    />
  )
}
