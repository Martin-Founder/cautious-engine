"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Menu, X, ArrowUpRight, Zap } from "lucide-react"

const links = [
  { label: "O NÁS", href: "#o-nas" },
  { label: "SLUŽBY", href: "#sluzby" },
  { label: "CENÍK", href: "#cenik" },
  { label: "REFERENCE", href: "#reference" },
  { label: "HRA", href: "#game" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 50)
      setVisible(y < 100 || y < lastY.current)
      lastY.current = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong shadow-[0_0_40px_rgba(0,0,0,0.5)]" : "bg-transparent"
      } ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Top edge glow when scrolled */}
      {scrolled && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b6fd4]/40 to-transparent" />}

      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-lg bg-[#3b6fd4]/20 border border-[#3b6fd4]/40 flex items-center justify-center group-hover:border-[#3b6fd4]/70 transition-all duration-300">
            <Zap size={16} className="text-[#6b9de8]" />
            <div className="absolute inset-0 rounded-lg bg-[#3b6fd4]/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            WEBSURE<span className="text-[#3b6fd4]">.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative px-4 py-2 text-white/50 hover:text-white text-[11px] font-black tracking-[0.15em] transition-all duration-300 group"
            >
              {l.label}
              <span className="absolute bottom-0.5 left-4 right-4 h-px w-0 bg-gradient-to-r from-[#3b6fd4] to-[#6b9de8] transition-all duration-300 group-hover:w-[calc(100%-2rem)]" />
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="#kontakt"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#3b6fd4]/40 bg-[#3b6fd4]/10 text-[#6b9de8] text-[11px] font-black tracking-[0.15em] uppercase transition-all duration-300 hover:border-[#3b6fd4]/70 hover:bg-[#3b6fd4]/20 hover:text-white"
          >
            Kontakt
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden w-11 h-11 flex items-center justify-center text-white rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 glass-strong ${open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <nav className="flex flex-col px-6 py-6 gap-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white text-sm font-black tracking-[0.1em] py-3 px-4 rounded-xl hover:bg-white/5 transition-all duration-200"
            >
              {l.label}
            </Link>
          ))}
          <Link href="#kontakt" onClick={() => setOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#3b6fd4] text-white text-xs font-black tracking-[0.1em] uppercase hover:bg-[#4d7ee0] transition-colors"
          >
            Kontakt <ArrowUpRight size={14} />
          </Link>
        </nav>
      </div>
    </header>
  )
}
