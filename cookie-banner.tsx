"use client"

import { useState, useEffect } from "react"
import { Cookie, Sparkles, X, ChevronRight } from "lucide-react"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      const timer = setTimeout(() => {
        setVisible(true)
        setIsAnimating(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    setIsAnimating(false)
    setTimeout(() => {
      localStorage.setItem("cookie-consent", "accepted")
      setVisible(false)
    }, 300)
  }

  const handleDecline = () => {
    setIsAnimating(false)
    setTimeout(() => {
      localStorage.setItem("cookie-consent", "declined")
      setVisible(false)
    }, 300)
  }

  if (!visible) return null

  return (
    <div 
      className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 transition-all duration-500 ${
        isAnimating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="relative overflow-hidden rounded-3xl border border-[#3b6fd4]/30 bg-[#0a1628]/95 backdrop-blur-xl shadow-2xl shadow-[#3b6fd4]/10">
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: "conic-gradient(from 0deg, transparent, rgba(59,111,212,0.3), transparent, rgba(107,157,232,0.2), transparent)",
              animation: "spin 8s linear infinite",
            }}
          />
        </div>
        
        {/* Content */}
        <div className="relative p-6">
          {/* Close button */}
          <button
            onClick={handleDecline}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Zavřít"
          >
            <X size={14} />
          </button>

          {/* Header with icon */}
          <div className="flex items-start gap-4 mb-5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3b6fd4]/30 to-[#6b9de8]/10 border border-[#3b6fd4]/40 flex items-center justify-center">
                <Cookie size={24} className="text-[#6b9de8]" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#3b6fd4] flex items-center justify-center animate-pulse">
                <Sparkles size={10} className="text-white" />
              </div>
            </div>
            <div className="flex-1 pr-6">
              <h3 className="text-lg font-bold text-white mb-1">
                Chcete lepší zážitek?
              </h3>
              <p className="text-white/40 text-xs tracking-wide">
                Využíváme cookies pro zlepšení služeb
              </p>
            </div>
          </div>

          {/* Marketing copy */}
          <div className="space-y-3 mb-6">
            <p className="text-white/60 text-sm leading-relaxed">
              <span className="text-white font-semibold">Víte, že 73 % firem</span> co s námi spolupracují, zvýšilo svůj online dosah během prvních 3 měsíců?
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              Cookies nám pomáhají pochopit, co vás zajímá, abychom vám mohli ukázat{" "}
              <span className="text-[#6b9de8]">přesně to, co hledáte</span> - žádný spam, jen relevantní obsah.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["Personalizovaný obsah", "Lepší nabídky", "Rychlejší web"].map((feature) => (
              <span 
                key={feature}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3b6fd4]/10 border border-[#3b6fd4]/20 text-[#6b9de8] text-xs font-medium"
              >
                <ChevronRight size={10} />
                {feature}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 group relative overflow-hidden py-4 px-6 rounded-2xl bg-[#3b6fd4] text-white font-bold text-sm tracking-wide transition-all duration-300 hover:bg-[#4d7ee0] hover:shadow-lg hover:shadow-[#3b6fd4]/30 hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Souhlasím
                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
              </span>
            </button>
            <button
              onClick={handleDecline}
              className="py-4 px-5 rounded-2xl border border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20 hover:bg-white/10 font-medium text-sm transition-all duration-200"
            >
              Odmítnout
            </button>
          </div>

          {/* Fine print */}
          <p className="mt-4 text-center text-white/25 text-xs">
            Více info v{" "}
            <a href="/privacy-policy" className="text-[#6b9de8]/60 hover:text-[#6b9de8] underline underline-offset-2 transition-colors">
              zásadách ochrany údajů
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
