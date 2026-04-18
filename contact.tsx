"use client"

import { useEffect, useRef, useState } from "react"
import { Mail, Phone, MapPin, Send, ArrowUpRight, CheckCircle, AlertCircle, MessageSquare } from "lucide-react"

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; obs.unobserve(el) }
    }, { threshold: 0.05 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error("Chyba při odesílání emailu")
      setSent(true)
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setSent(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Neznámá chyba")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (id: string) =>
    `w-full px-5 py-4 rounded-2xl border text-white placeholder:text-white/20 text-base focus:outline-none transition-all duration-300 font-medium ${
      focused === id
        ? "border-[#3b6fd4]/60 bg-[#3b6fd4]/8 shadow-[0_0_0_3px_rgba(59,111,212,0.12)]"
        : "border-white/8 bg-white/3 hover:border-white/15"
    }`

  const contactItems = [
    { icon: Mail, label: "EMAIL", value: "websure.cz@gmail.com", href: "mailto:websure.cz@gmail.com" },
    { icon: Phone, label: "TELEFON", value: "+420 725 768 171", href: "tel:+420725768171" },
    { icon: MapPin, label: "LOKACE", value: "Litoměřice, CZ", href: null },
  ]

  return (
    <section id="kontakt" className="relative bg-transparent py-36 overflow-hidden">
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-25" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(59,111,212,0.12) 0%, transparent 60%)" }} />

      <div
        ref={ref}
        className="relative max-w-6xl mx-auto px-6 lg:px-10 opacity-0"
        style={{ transform: "translateY(40px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-20">
          <span className="text-xs font-black tracking-[0.4em] text-[#6b9de8] uppercase neon-text">// KONTAKT</span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.92]">
            POJĎME
            <br />
            <span className="text-gradient">SPOLUPRACOVAT</span>
          </h2>
          <p className="text-white/35 max-w-md text-lg leading-relaxed">
            Odpovídáme do <span className="text-white/60 font-bold">24 hodin</span>. Konzultace je zdarma.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: contact + quick info */}
          <div className="flex flex-col gap-5">
            {contactItems.map((c) => {
              const Icon = c.icon
              const inner = (
                <div className="group flex items-center gap-5 p-6 rounded-2xl holo-card transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#3b6fd4]/15 border border-[#3b6fd4]/25 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-[#3b6fd4]/50 transition-all duration-300">
                    <Icon size={20} className="text-[#6b9de8]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/25 text-[10px] tracking-[0.25em] font-black mb-1">{c.label}</p>
                    <p className="text-white font-bold tracking-wide">{c.value}</p>
                  </div>
                  {c.href && <ArrowUpRight size={16} className="text-white/15 group-hover:text-[#3b6fd4] transition-colors" />}
                </div>
              )
              return c.href ? (
                <a key={c.label} href={c.href} className="block">{inner}</a>
              ) : (
                <div key={c.label}>{inner}</div>
              )
            })}

            {/* Response time card */}
            <div className="flex items-center gap-4 p-6 rounded-2xl border border-[#3b6fd4]/15 bg-[#3b6fd4]/5 mt-2">
              <div className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)] animate-pulse shrink-0" />
              <div>
                <p className="text-white font-bold text-sm">Aktuálně dostupní</p>
                <p className="text-white/30 text-xs mt-0.5">Průměrná odpověď: &lt; 4 hodiny</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="rounded-3xl border border-white/8 bg-black/40 p-8 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b6fd4]/25 to-transparent" />

            {sent ? (
              <div className="flex flex-col items-center justify-center gap-6 h-full py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-[#3b6fd4]/15 border border-[#3b6fd4]/30 flex items-center justify-center" style={{ boxShadow: "0 0 40px rgba(59,111,212,0.2)" }}>
                  <CheckCircle size={36} className="text-[#3b6fd4]" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Zpráva odeslána!</h3>
                  <p className="text-white/35">Ozveme se do 24 hodin.</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-6 h-full py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                  <AlertCircle size={36} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white mb-2">Chyba</h3>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare size={18} className="text-[#6b9de8]/60" />
                  <span className="text-white/50 text-sm font-bold tracking-wide">Napište nám</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] text-white/25 font-black tracking-[0.25em]">JMÉNO</label>
                  <input id="name" type="text" placeholder="Jan Novák" required value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                    className={inputClass("name")} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-[10px] text-white/25 font-black tracking-[0.25em]">EMAIL</label>
                  <input id="email" type="email" placeholder="jan@firma.cz" required value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                    className={inputClass("email")} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-[10px] text-white/25 font-black tracking-[0.25em]">ZPRÁVA</label>
                  <textarea id="message" rows={4} placeholder="Jak vám můžeme pomoct?" required value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
                    className={`${inputClass("message")} resize-none`} />
                </div>
                <button type="submit" disabled={loading}
                  className="group inline-flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-[#2455c0] to-[#3b6fd4] hover:from-[#3b6fd4] hover:to-[#5585e0] disabled:opacity-50 text-white font-black text-sm tracking-[0.15em] uppercase transition-all duration-400 hover:shadow-[0_0_50px_rgba(59,111,212,0.4)] hover:-translate-y-1 mt-1 relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2.5">
                    <Send size={16} />
                    {loading ? "Odesílám..." : "Poslat zprávu"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
