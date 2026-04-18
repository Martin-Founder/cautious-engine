"use client"

import { useEffect, useRef, useState, useCallback } from "react"

type Particle = {
  x: number; y: number; vx: number; vy: number
  life: number; maxLife: number; size: number; hue: number
}

type Enemy = {
  x: number; y: number; vx: number; vy: number
  hp: number; maxHp: number; size: number; type: number; angle: number
}

type Bullet = {
  x: number; y: number; vx: number; vy: number; size: number; power: number
}

type PowerUp = {
  x: number; y: number; vy: number; type: "shield" | "multi" | "speed"; angle: number
}

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    player: { x: 400, y: 500, vx: 0, vy: 0, hp: 3, maxHp: 3, shield: 0, multi: 1, speed: 5, invincible: 0 },
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    particles: [] as Particle[],
    powerUps: [] as PowerUp[],
    keys: {} as Record<string, boolean>,
    score: 0,
    wave: 1,
    waveTimer: 0,
    shootTimer: 0,
    enemySpawnTimer: 0,
    gameState: "idle" as "idle" | "playing" | "dead",
    frame: 0,
    animId: 0,
    combo: 0,
    comboTimer: 0,
    highScore: 0,
  })
  const [displayState, setDisplayState] = useState<"idle" | "playing" | "dead">("idle")
  const [score, setScore] = useState(0)
  const [hp, setHp] = useState(3)
  const [wave, setWave] = useState(1)
  const [combo, setCombo] = useState(0)
  const [highScore, setHighScore] = useState(0)

  const spawnParticles = useCallback((x: number, y: number, n: number, hue = 210) => {
    const s = stateRef.current
    for (let i = 0; i < n; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 5
      s.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, maxLife: 1,
        size: 1.5 + Math.random() * 3,
        hue: hue + (Math.random() - 0.5) * 40,
      })
    }
  }, [])

  const spawnEnemy = useCallback((W: number, H: number) => {
    const s = stateRef.current
    const type = Math.floor(Math.random() * 3)
    const side = Math.floor(Math.random() * 4)
    let x = 0, y = 0
    if (side === 0) { x = Math.random() * W; y = -30 }
    else if (side === 1) { x = W + 30; y = Math.random() * H * 0.7 }
    else if (side === 2) { x = -30; y = Math.random() * H * 0.7 }
    else { x = Math.random() * W; y = -50 }

    const hp = (1 + s.wave * 0.3) * (type === 2 ? 4 : type === 1 ? 2 : 1)
    s.enemies.push({
      x, y, vx: 0, vy: 0,
      hp, maxHp: hp,
      size: type === 2 ? 22 : type === 1 ? 16 : 12,
      type,
      angle: Math.random() * Math.PI * 2,
    })
  }, [])

  const startGame = useCallback(() => {
    const s = stateRef.current
    const canvas = canvasRef.current
    if (!canvas) return
    s.player = { x: canvas.width / 2, y: canvas.height * 0.75, vx: 0, vy: 0, hp: 3, maxHp: 3, shield: 0, multi: 1, speed: 5, invincible: 0 }
    s.bullets = []
    s.enemies = []
    s.particles = []
    s.powerUps = []
    s.score = 0
    s.wave = 1
    s.waveTimer = 0
    s.shootTimer = 0
    s.enemySpawnTimer = 0
    s.gameState = "playing"
    s.frame = 0
    s.combo = 0
    s.comboTimer = 0
    setDisplayState("playing")
    setScore(0)
    setHp(3)
    setWave(1)
    setCombo(0)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      canvas.width = rect?.width || 800
      canvas.height = rect?.height || 500
    }
    resize()
    window.addEventListener("resize", resize)

    const onKey = (e: KeyboardEvent, down: boolean) => {
      stateRef.current.keys[e.key] = down
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault()
    }
    window.addEventListener("keydown", e => onKey(e, true))
    window.addEventListener("keyup", e => onKey(e, false))

    // Touch / mouse support
    const onMove = (e: MouseEvent | TouchEvent) => {
      const s = stateRef.current
      if (s.gameState !== "playing") return
      const rect = canvas.getBoundingClientRect()
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY
      s.player.x = ((clientX - rect.left) / rect.width) * canvas.width
      s.player.y = ((clientY - rect.top) / rect.height) * canvas.height
    }
    canvas.addEventListener("mousemove", onMove)
    canvas.addEventListener("touchmove", onMove, { passive: true })

    const loop = () => {
      const s = stateRef.current
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Background
      ctx.fillStyle = "#000610"
      ctx.fillRect(0, 0, W, H)

      // Grid
      ctx.strokeStyle = "rgba(59,111,212,0.06)"
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      if (s.gameState === "idle") {
        // Title screen
        ctx.save()
        ctx.font = "bold 36px 'Space Grotesk', monospace"
        ctx.textAlign = "center"
        const grad = ctx.createLinearGradient(W/2-100, 0, W/2+100, 0)
        grad.addColorStop(0, "#6b9de8")
        grad.addColorStop(1, "#ffffff")
        ctx.fillStyle = grad
        ctx.fillText("WEBSURE DEFENDER", W/2, H/2 - 60)
        ctx.font = "14px monospace"
        ctx.fillStyle = "rgba(255,255,255,0.4)"
        ctx.fillText("Pohyb: WASD / šipky nebo myš", W/2, H/2 - 10)
        ctx.fillText("Střelba: automatická", W/2, H/2 + 20)
        ctx.fillStyle = "rgba(107,157,232,0.8)"
        ctx.font = "bold 16px monospace"
        const blink = Math.sin(Date.now() * 0.003) > 0
        if (blink) ctx.fillText("[ KLIKNI PRO START ]", W/2, H/2 + 70)
        if (s.highScore > 0) {
          ctx.fillStyle = "rgba(255,255,255,0.3)"
          ctx.font = "13px monospace"
          ctx.fillText(`REKORD: ${s.highScore}`, W/2, H/2 + 100)
        }
        ctx.restore()
        s.animId = requestAnimationFrame(loop)
        return
      }

      if (s.gameState === "dead") {
        ctx.save()
        ctx.font = "bold 40px monospace"
        ctx.textAlign = "center"
        ctx.fillStyle = "rgba(255,80,80,0.9)"
        ctx.fillText("GAME OVER", W/2, H/2 - 50)
        ctx.font = "bold 24px monospace"
        ctx.fillStyle = "rgba(255,255,255,0.8)"
        ctx.fillText(`SKÓRE: ${s.score}`, W/2, H/2)
        ctx.fillStyle = "rgba(107,157,232,0.7)"
        ctx.font = "bold 16px monospace"
        const blink = Math.sin(Date.now() * 0.004) > 0
        if (blink) ctx.fillText("[ ZNOVU ]", W/2, H/2 + 55)
        if (s.score >= s.highScore) {
          ctx.fillStyle = "rgba(255,215,0,0.8)"
          ctx.font = "bold 14px monospace"
          ctx.fillText("★ NOVÝ REKORD! ★", W/2, H/2 + 85)
        }
        ctx.restore()
        s.animId = requestAnimationFrame(loop)
        return
      }

      s.frame++
      s.shootTimer++
      s.enemySpawnTimer++
      s.waveTimer++
      if (s.player.invincible > 0) s.player.invincible--
      if (s.comboTimer > 0) s.comboTimer--
      else if (s.combo > 0) { s.combo = 0; setCombo(0) }

      // Wave progression
      const spawnRate = Math.max(20, 80 - s.wave * 8)
      if (s.enemySpawnTimer >= spawnRate) {
        spawnEnemy(W, H)
        s.enemySpawnTimer = 0
      }
      if (s.waveTimer > 600) {
        s.wave++
        s.waveTimer = 0
        setWave(s.wave)
        spawnParticles(W/2, H/2, 30, 60)
      }

      // Player movement (keyboard)
      const speed = s.player.speed
      if (s.keys["ArrowLeft"] || s.keys["a"] || s.keys["A"]) s.player.x -= speed
      if (s.keys["ArrowRight"] || s.keys["d"] || s.keys["D"]) s.player.x += speed
      if (s.keys["ArrowUp"] || s.keys["w"] || s.keys["W"]) s.player.y -= speed
      if (s.keys["ArrowDown"] || s.keys["s"] || s.keys["S"]) s.player.y += speed
      s.player.x = Math.max(20, Math.min(W - 20, s.player.x))
      s.player.y = Math.max(20, Math.min(H - 20, s.player.y))

      // Auto shoot
      const shootDelay = s.player.speed > 7 ? 8 : 12
      if (s.shootTimer >= shootDelay) {
        s.shootTimer = 0
        for (let m = 0; m < s.player.multi; m++) {
          const spread = (m - (s.player.multi - 1) / 2) * 0.25
          s.bullets.push({ x: s.player.x, y: s.player.y - 20, vx: Math.sin(spread) * 8, vy: -10, size: 4, power: 1 })
        }
      }

      // Spawn powerups
      if (Math.random() < 0.002) {
        const types: PowerUp["type"][] = ["shield", "multi", "speed"]
        s.powerUps.push({ x: Math.random() * (W - 80) + 40, y: -20, vy: 1.5, type: types[Math.floor(Math.random() * 3)], angle: 0 })
      }

      // Update powerups
      s.powerUps = s.powerUps.filter(p => {
        p.y += p.vy
        p.angle += 0.05
        if (p.y > H + 40) return false
        const dx = p.x - s.player.x, dy = p.y - s.player.y
        if (Math.sqrt(dx*dx+dy*dy) < 30) {
          spawnParticles(p.x, p.y, 20, p.type === "shield" ? 160 : p.type === "speed" ? 60 : 40)
          if (p.type === "shield") { s.player.hp = Math.min(s.player.maxHp + 1, s.player.hp + 1); setHp(s.player.hp) }
          if (p.type === "multi") { s.player.multi = Math.min(5, s.player.multi + 1) }
          if (p.type === "speed") { s.player.speed = Math.min(9, s.player.speed + 1) }
          return false
        }
        return true
      })

      // Update bullets
      s.bullets = s.bullets.filter(b => {
        b.x += b.vx; b.y += b.vy
        return b.y > -10 && b.y < H + 10 && b.x > -10 && b.x < W + 10
      })

      // Update enemies
      s.enemies = s.enemies.filter(e => {
        // Move toward player
        const dx = s.player.x - e.x, dy = s.player.y - e.y
        const dist = Math.sqrt(dx*dx+dy*dy)
        const eSpeed = (0.8 + s.wave * 0.1) * (e.type === 2 ? 0.6 : e.type === 1 ? 0.9 : 1.2)
        e.vx += (dx / dist) * eSpeed * 0.08
        e.vy += (dy / dist) * eSpeed * 0.08
        const maxSpd = eSpeed
        const spd = Math.sqrt(e.vx*e.vx+e.vy*e.vy)
        if (spd > maxSpd) { e.vx = e.vx/spd*maxSpd; e.vy = e.vy/spd*maxSpd }
        e.x += e.vx; e.y += e.vy
        e.angle += 0.03

        // Bullet collision
        for (let i = s.bullets.length - 1; i >= 0; i--) {
          const b = s.bullets[i]
          const bDx = b.x - e.x, bDy = b.y - e.y
          if (Math.sqrt(bDx*bDx+bDy*bDy) < e.size + b.size) {
            e.hp -= b.power
            s.bullets.splice(i, 1)
            spawnParticles(b.x, b.y, 5, 210)
            if (e.hp <= 0) {
              const points = (e.type + 1) * 10 * s.wave
              s.combo++
              s.comboTimer = 120
              s.score += points * s.combo
              setScore(s.score)
              setCombo(s.combo)
              spawnParticles(e.x, e.y, 20 + e.type * 10, 200 + e.type * 20)
              return false
            }
          }
        }

        // Player collision
        if (s.player.invincible <= 0) {
          const pDx = e.x - s.player.x, pDy = e.y - s.player.y
          if (Math.sqrt(pDx*pDx+pDy*pDy) < e.size + 16) {
            s.player.hp--
            s.player.invincible = 90
            s.combo = 0; s.comboTimer = 0; setCombo(0)
            setHp(s.player.hp)
            spawnParticles(s.player.x, s.player.y, 25, 0)
            if (s.player.hp <= 0) {
              s.gameState = "dead"
              if (s.score > s.highScore) { s.highScore = s.score; setHighScore(s.score) }
              setDisplayState("dead")
              spawnParticles(s.player.x, s.player.y, 60, 0)
            }
          }
        }

        return e.y < H + 60 && e.x > -60 && e.x < W + 60
      })

      // Update particles
      s.particles = s.particles.filter(p => {
        p.x += p.vx; p.y += p.vy
        p.vx *= 0.95; p.vy *= 0.95
        p.life -= 0.025
        return p.life > 0
      })

      // === DRAW ===

      // Draw particles
      s.particles.forEach(p => {
        ctx.save()
        ctx.globalAlpha = p.life
        ctx.fillStyle = `hsl(${p.hue}, 90%, 70%)`
        ctx.shadowColor = `hsl(${p.hue}, 90%, 70%)`
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw powerups
      s.powerUps.forEach(p => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        const colors: Record<string, string> = { shield: "#22c55e", multi: "#f59e0b", speed: "#3b82f6" }
        const labels: Record<string, string> = { shield: "❤", multi: "✦", speed: "⚡" }
        ctx.strokeStyle = colors[p.type]
        ctx.lineWidth = 2
        ctx.shadowColor = colors[p.type]
        ctx.shadowBlur = 12
        ctx.strokeRect(-12, -12, 24, 24)
        ctx.fillStyle = colors[p.type]
        ctx.font = "bold 14px monospace"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(labels[p.type], 0, 0)
        ctx.restore()
      })

      // Draw bullets
      s.bullets.forEach(b => {
        ctx.save()
        ctx.shadowColor = "#3b6fd4"
        ctx.shadowBlur = 15
        ctx.fillStyle = "#a8d0ff"
        ctx.beginPath()
        ctx.ellipse(b.x, b.y, b.size, b.size * 2.5, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Draw enemies
      s.enemies.forEach(e => {
        ctx.save()
        ctx.translate(e.x, e.y)
        ctx.rotate(e.angle)
        const hpRatio = e.hp / e.maxHp
        const eColor = e.type === 2 ? `hsl(0, 80%, ${40 + hpRatio * 20}%)` : e.type === 1 ? `hsl(30, 80%, ${40 + hpRatio * 20}%)` : `hsl(300, 70%, ${40 + hpRatio * 20}%)`
        ctx.strokeStyle = eColor
        ctx.lineWidth = 2
        ctx.shadowColor = eColor
        ctx.shadowBlur = 15

        if (e.type === 0) {
          // Diamond
          ctx.beginPath()
          ctx.moveTo(0, -e.size)
          ctx.lineTo(e.size, 0)
          ctx.lineTo(0, e.size)
          ctx.lineTo(-e.size, 0)
          ctx.closePath()
          ctx.stroke()
        } else if (e.type === 1) {
          // Hexagon
          ctx.beginPath()
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2
            if (i === 0) ctx.moveTo(Math.cos(a) * e.size, Math.sin(a) * e.size)
            else ctx.lineTo(Math.cos(a) * e.size, Math.sin(a) * e.size)
          }
          ctx.closePath()
          ctx.stroke()
          // HP bar inside
          ctx.fillStyle = eColor
          ctx.globalAlpha = 0.3 * hpRatio
          ctx.fill()
          ctx.globalAlpha = 1
        } else {
          // Boss circle with inner cross
          ctx.beginPath()
          ctx.arc(0, 0, e.size, 0, Math.PI * 2)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(-e.size * 0.6, 0); ctx.lineTo(e.size * 0.6, 0)
          ctx.moveTo(0, -e.size * 0.6); ctx.lineTo(0, e.size * 0.6)
          ctx.stroke()
        }
        ctx.restore()
      })

      // Draw player
      if (s.gameState === "playing") {
        const p = s.player
        const blink = s.player.invincible > 0 && Math.floor(s.frame / 5) % 2 === 0
        if (!blink) {
          ctx.save()
          ctx.translate(p.x, p.y)
          // Engine glow
          ctx.shadowColor = "#3b6fd4"
          ctx.shadowBlur = 20 + 10 * Math.sin(s.frame * 0.2)
          // Ship body
          ctx.strokeStyle = "#6b9de8"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(0, -20)
          ctx.lineTo(14, 12)
          ctx.lineTo(7, 6)
          ctx.lineTo(-7, 6)
          ctx.lineTo(-14, 12)
          ctx.closePath()
          ctx.stroke()
          // Cockpit
          ctx.fillStyle = "rgba(107,157,232,0.3)"
          ctx.beginPath()
          ctx.ellipse(0, -6, 5, 8, 0, 0, Math.PI * 2)
          ctx.fill()
          // Thruster
          ctx.strokeStyle = `rgba(100,180,255,${0.6 + 0.4 * Math.sin(s.frame * 0.3)})`
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(-5, 8)
          ctx.lineTo(0, 8 + 8 + Math.random() * 8)
          ctx.lineTo(5, 8)
          ctx.stroke()
          ctx.restore()
        }
      }

      // HUD
      ctx.save()
      ctx.textAlign = "left"
      ctx.font = "bold 13px monospace"
      // HP hearts
      for (let i = 0; i < s.player.maxHp; i++) {
        ctx.fillStyle = i < s.player.hp ? "#ff4466" : "rgba(255,255,255,0.15)"
        ctx.fillText("♥", 16 + i * 22, 28)
      }
      ctx.fillStyle = "rgba(107,157,232,0.8)"
      ctx.textAlign = "right"
      ctx.fillText(`VLNA ${s.wave}`, W - 16, 28)
      if (s.combo > 1) {
        ctx.fillStyle = "rgba(255,200,0,0.9)"
        ctx.textAlign = "center"
        ctx.font = `bold ${14 + Math.min(s.combo, 10)}px monospace`
        ctx.fillText(`COMBO x${s.combo}`, W/2, 30)
      }
      ctx.restore()

      s.animId = requestAnimationFrame(loop)
    }

    stateRef.current.animId = requestAnimationFrame(loop)

    const onClick = () => {
      const s = stateRef.current
      if (s.gameState === "idle" || s.gameState === "dead") startGame()
    }
    canvas.addEventListener("click", onClick)
    canvas.addEventListener("touchstart", onClick, { passive: true })

    return () => {
      cancelAnimationFrame(stateRef.current.animId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("keydown", e => e)
      window.removeEventListener("keyup", e => e)
      canvas.removeEventListener("click", onClick)
      canvas.removeEventListener("touchstart", onClick)
      canvas.removeEventListener("mousemove", onMove)
      canvas.removeEventListener("touchmove", onMove)
    }
  }, [startGame, spawnParticles, spawnEnemy])

  return (
    <section id="game" className="relative bg-transparent py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-12">
          <span className="text-xs font-bold tracking-[0.3em] text-[#6b9de8] uppercase">Mini-hra</span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[0.95]">
            WEBSURE<br /><span className="text-gradient">DEFENDER</span>
          </h2>
          <p className="text-white/35 max-w-md">Chraňte digitální svět před útočníky. Pohyb myší nebo WASD.</p>
        </div>

        {/* Game canvas */}
        <div className="relative rounded-3xl border border-[#3b6fd4]/30 overflow-hidden" style={{ height: "480px", background: "rgba(0,4,16,0.8)" }}>
          <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
          {/* Score overlay */}
          {displayState === "playing" && (
            <div className="absolute top-0 left-0 right-0 flex justify-center pt-3 pointer-events-none">
              <div className="px-6 py-1.5 rounded-full bg-black/50 border border-[#3b6fd4]/20 backdrop-blur-md">
                <span className="text-white font-black text-lg tracking-widest">{score.toLocaleString()}</span>
              </div>
            </div>
          )}
          {/* Shine line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b6fd4]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b6fd4]/30 to-transparent" />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs text-white/30">
          <span>♦ = základní nepřítel</span>
          <span>⬡ = střední nepřítel</span>
          <span>⊕ = boss</span>
          <span className="text-green-400/50">❤ = zdraví</span>
          <span className="text-yellow-400/50">✦ = multi-střelba</span>
          <span className="text-blue-400/50">⚡ = rychlost</span>
        </div>
      </div>
    </section>
  )
}
