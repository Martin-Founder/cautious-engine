"use client"

import Link from "next/link"
import { Linkedin, Facebook, Instagram, Mail, Phone, MapPin, ArrowUpRight, Zap } from "lucide-react"

const navLinks = [
  { label: "O NÁS", href: "#o-nas" },
  { label: "SLUŽBY", href: "#sluzby" },
  { label: "CENÍK", href: "#cenik" },
  { label: "REFERENCE", href: "#reference" },
  { label: "KONTAKT", href: "#kontakt" },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: "rgba(0,3,12,0.95)", borderTop: "1px solid rgba(59,111,212,0.12)" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,111,212,0.10) 0%, transparent 70%)" }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#3b6fd4]/20 border border-[#3b6fd4]/40 flex items-center justify-center">
                <Zap size={16} className="text-[#6b9de8]" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                WEBSURE<span className="text-[#3b6fd4]">.</span>
              </span>
            </div>
            <p className="text-white/25 text-sm leading-relaxed max-w-xs">
              Digitální agentura pro firmy, které myslí na budoucnost.
            </p>
            <div className="flex gap-2 mt-1">
              {[
                { Icon: Linkedin, href: "#", label: "LinkedIn" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Instagram, href: "#", label: "Instagram" },
              ].map(({ Icon, href, label }) => (
                <Link key={label} href={href} aria-label={label}
                  className="w-10 h-10 rounded-xl border border-white/8 bg-white/3 flex items-center justify-center text-white/25 hover:text-[#6b9de8] hover:border-[#3b6fd4]/40 hover:bg-[#3b6fd4]/15 transition-all duration-300"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white/30 text-[10px] font-black tracking-[0.3em] mb-3">NAVIGACE</h4>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className="text-white/25 hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 w-fit group flex items-center gap-1.5"
              >
                {l.label}
                <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          {/* Services */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white/30 text-[10px] font-black tracking-[0.3em] mb-3">SLUŽBY</h4>
            {["Webové stránky", "Soc. sítě", "Branding", "Grafický design"].map((s) => (
              <span key={s} className="text-white/25 text-sm font-medium tracking-wide">{s}</span>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white/30 text-[10px] font-black tracking-[0.3em] mb-3">KONTAKT</h4>
            <a href="mailto:websure.cz@gmail.com" className="flex items-center gap-2.5 text-white/25 hover:text-white text-sm transition-colors duration-200">
              <Mail size={13} className="text-[#3b6fd4]/50" />
              websure.cz@gmail.com
            </a>
            <a href="tel:+420725768171" className="flex items-center gap-2.5 text-white/25 hover:text-white text-sm transition-colors duration-200">
              <Phone size={13} className="text-[#3b6fd4]/50" />
              +420 725 768 171
            </a>
            <div className="flex items-center gap-2.5 text-white/25 text-sm">
              <MapPin size={13} className="text-[#3b6fd4]/50" />
              Litoměřice
            </div>
            <div className="flex items-center gap-2.5 text-white/25 text-sm mt-2">
              <span className="text-[#3b6fd4]/40 text-[10px] font-black tracking-widest">IČO</span>
              24332704
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="section-sep mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/15 text-xs tracking-wide">
            &copy; {new Date().getFullYear()} WEBSURE &mdash; Všechna práva vyhrazena
          </p>
          <div className="flex gap-6">
            {[
              { label: "Ochrana údajů", href: "/privacy-policy" },
              { label: "Podmínky", href: "/terms" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="text-white/15 hover:text-white/40 text-xs tracking-wide transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
