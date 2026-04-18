"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Check, ArrowRight, Sparkles, Globe, Palette, Share2, Package } from "lucide-react"

// Webové stránky
const webPackages = [
  {
    name: "VIZITKA",
    tagline: "Landing page, jednoduchý web",
    price: "5 000 – 15 000",
    features: [
      "Landing page nebo vizitka",
      "Responzivní design",
      "Základní SEO optimalizace",
      "Kontaktní formulář",
    ],
  },
  {
    name: "FIREMNÍ WEB",
    tagline: "5–10 stránek, formuláře, SEO",
    price: "15 000 – 40 000",
    highlight: true,
    badge: "Nejčastější volba",
    features: [
      "Web 5–10 stránek",
      "Vlastní design na míru",
      "Pokročilé SEO základy",
      "Kontaktní a poptávkové formuláře",
    ],
  },
]

// Správa sociálních sítí
const socialPackages = [
  {
    name: "ZÁKLAD",
    tagline: "3–8 postů / měsíc",
    price: "3 000 – 8 000",
    period: "měsíc",
    features: [
      "3–8 příspěvků měsíčně",
      "Jednoduchá správa profilu",
      "Základní grafika k postům",
      "Měsíční report",
    ],
  },
  {
    name: "STŘEDNÍ",
    tagline: "8–15 postů + stories + strategie",
    price: "8 000 – 20 000",
    period: "měsíc",
    highlight: true,
    badge: "Doporučujeme",
    features: [
      "8–15 příspěvků měsíčně",
      "Stories a reels",
      "Obsahová strategie",
      "Engagement management",
      "Měsíční reporty a analýza",
    ],
  },
  {
    name: "FULL SERVICE",
    tagline: "Kompletní správa a reklama",
    price: "20 000 – 60 000+",
    period: "měsíc",
    features: [
      "Neomezený obsah",
      "Reels a video content",
      "PPC reklamy a kampaně",
      "Kompletní strategie",
      "Dedikovaný správce",
      "Týdenní reporty",
    ],
  },
]

// Grafika a loga
const graphicsFeatures = [
  "Návrh loga a brand identity",
  "Vizitky a tiskoviny",
  "Grafika pro sociální sítě",
  "Bannery a reklamy",
  "Prezentace a dokumenty",
  "Cena dle rozsahu projektu",
]

// Kompletní balíček
const fullPackage = {
  name: "VŠE V JEDNOM",
  tagline: "Web + sítě + grafika",
  features: [
    "Firemní web na míru",
    "Kompletní brand identita",
    "Správa sociálních sítí",
    "Grafické materiály",
    "Prioritní podpora",
    "Měsíční konzultace",
    "Zvýhodněná cena balíčku",
  ],
}

function ServiceSection({ 
  title, 
  icon: Icon, 
  children,
  id 
}: { 
  title: string
  icon: React.ElementType
  children: React.ReactNode
  id?: string
}) {
  return (
    <div id={id} className="mb-24">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-[#3b6fd4]/20 border border-[#3b6fd4]/30 flex items-center justify-center">
          <Icon size={22} className="text-[#6b9de8]" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function PriceCard({ 
  name, 
  tagline, 
  price, 
  period,
  features, 
  highlight, 
  badge,
  index 
}: { 
  name: string
  tagline: string
  price?: string
  period?: string
  features: string[]
  highlight?: boolean
  badge?: string
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          el.style.opacity = "1"
          el.style.transform = "translateY(0) scale(1)"
        }, index * 100)
        obs.unobserve(el)
      }
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col rounded-3xl border overflow-hidden opacity-0 backdrop-blur-sm ${
        highlight
          ? "border-[#3b6fd4]/50 bg-gradient-to-b from-[#0e2040]/80 to-black/50"
          : "border-white/5 bg-black/30 hover:border-[#3b6fd4]/30"
      }`}
      style={{
        transform: "translateY(40px) scale(0.97)",
        transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: highlight ? "0 0 80px rgba(59,111,212,0.15)" : "none",
      }}
    >
      {/* Shine line */}
      <div className={`absolute top-0 left-0 right-0 h-px ${highlight ? "bg-gradient-to-r from-transparent via-[#3b6fd4] to-transparent" : "bg-gradient-to-r from-transparent via-white/10 to-transparent"}`} />

      {/* Badge */}
      {badge && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#3b6fd4] text-white text-xs font-bold tracking-widest uppercase rounded-b-xl shadow-lg shadow-[#3b6fd4]/40">
            <Sparkles size={10} />
            {badge}
          </div>
        </div>
      )}

      <div className={`flex flex-col gap-6 p-6 md:p-8 flex-1 ${badge ? "pt-12" : ""}`}>
        {/* Name & tagline */}
        <div className="flex flex-col gap-1">
          <h4 className="text-xl md:text-2xl font-bold text-white tracking-wide">{name}</h4>
          <p className="text-sm text-white/40">{tagline}</p>
        </div>

        {/* Price */}
        {price && (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-bold text-white">{price}</span>
            <span className="text-white/40 text-sm">Kč {period ? `/ ${period}` : ""}</span>
          </div>
        )}

        {/* Divider */}
        <div className={`h-px ${highlight ? "bg-gradient-to-r from-[#3b6fd4]/50 via-[#3b6fd4] to-[#3b6fd4]/50" : "bg-white/5"}`} />

        {/* Features */}
        <ul className="flex flex-col gap-3 flex-1">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-white/60">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${highlight ? "bg-[#3b6fd4]" : "bg-white/10"}`}>
                <Check size={12} className="text-white" />
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="#kontakt"
          className={`group/btn w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
            highlight
              ? "bg-[#3b6fd4] hover:bg-[#4d7ee0] text-white hover:shadow-xl hover:shadow-[#3b6fd4]/40 hover:-translate-y-1"
              : "border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10 hover:-translate-y-1"
          }`}
        >
          Mám zájem
          <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  )
}

export default function Packages() {
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity = "1"
        el.style.transform = "translateY(0)"
        obs.unobserve(el)
      }
    }, { threshold: 0.08 })
    obs.observe(el)
  }, [])

  return (
    <section id="cenik" className="relative bg-transparent py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,111,212,0.12) 0%, transparent 60%)" }} />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col items-center text-center gap-6 mb-20 opacity-0"
          style={{ transform: "translateY(30px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <span className="text-xs font-bold tracking-[0.3em] text-[#6b9de8] uppercase">Ceník služeb</span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[0.95]">
            NAŠE
            <br />
            <span className="text-gradient">CENÍKY</span>
          </h2>
          <p className="text-white/40 max-w-lg text-lg leading-relaxed">
            Vyberte si službu nebo kombinujte podle potřeb. Ceny jsou orientační a upřesníme je po konzultaci.
          </p>
        </div>

        {/* Webové stránky */}
        <ServiceSection title="Tvorba webových stránek" icon={Globe}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {webPackages.map((pkg, i) => (
              <PriceCard
                key={pkg.name}
                name={pkg.name}
                tagline={pkg.tagline}
                price={pkg.price}
                features={pkg.features}
                highlight={pkg.highlight}
                badge={pkg.badge}
                index={i}
              />
            ))}
          </div>
        </ServiceSection>

        {/* Správa sociálních sítí */}
        <ServiceSection title="Správa sociálních sítí" icon={Share2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {socialPackages.map((pkg, i) => (
              <PriceCard
                key={pkg.name}
                name={pkg.name}
                tagline={pkg.tagline}
                price={pkg.price}
                period={pkg.period}
                features={pkg.features}
                highlight={pkg.highlight}
                badge={pkg.badge}
                index={i}
              />
            ))}
          </div>
        </ServiceSection>

        {/* Grafika a loga */}
        <ServiceSection title="Grafické prvky a loga" icon={Palette}>
          <div className="rounded-3xl border border-white/5 bg-black/30 backdrop-blur-sm p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {graphicsFeatures.map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-white/60">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Check size={12} className="text-white" />
                  </span>
                  {f}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-white/40 text-sm">Cena se odvíjí od rozsahu a náročnosti projektu.</p>
              <Link
                href="#kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10 font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:-translate-y-1"
              >
                Poptat grafiku
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </ServiceSection>

        {/* Kompletní balíček */}
        <ServiceSection title="Kompletní balíček" icon={Package}>
          <div className="rounded-3xl border border-[#3b6fd4]/50 bg-gradient-to-b from-[#0e2040]/80 to-black/50 backdrop-blur-sm p-6 md:p-10 relative overflow-hidden">
            {/* Shine line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b6fd4] to-transparent" />
            
            {/* Glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#3b6fd4]/20 blur-[100px] pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#3b6fd4]/20 border border-[#3b6fd4]/30 text-[#6b9de8] text-xs font-bold tracking-widest uppercase rounded-full w-fit">
                  <Sparkles size={12} />
                  Nejvýhodnější
                </div>
                <h4 className="text-3xl md:text-4xl font-bold text-white tracking-wide">{fullPackage.name}</h4>
                <p className="text-white/50 text-lg">{fullPackage.tagline} — vše, co potřebujete pro úspěšnou online prezentaci pod jednou střechou.</p>
                <Link
                  href="#kontakt"
                  className="mt-4 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#3b6fd4] hover:bg-[#4d7ee0] text-white font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-xl hover:shadow-[#3b6fd4]/40 hover:-translate-y-1 w-fit"
                >
                  Nezávazná konzultace
                  <ArrowRight size={16} />
                </Link>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fullPackage.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="w-5 h-5 rounded-full bg-[#3b6fd4] flex items-center justify-center shrink-0">
                      <Check size={12} className="text-white" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ServiceSection>

      </div>
    </section>
  )
}
