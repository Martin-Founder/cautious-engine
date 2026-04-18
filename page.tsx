import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Services from "@/components/services"
import Packages from "@/components/packages"
import About from "@/components/about"
import Testimonials from "@/components/testimonials"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import BreathingBackground from "@/components/breathing-background"
import CookieBanner from "@/components/cookie-banner"
import Game from "@/components/game"

export default function Page() {
  return (
    <main className="bg-black min-h-screen relative">
      <BreathingBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <div className="section-sep mx-auto max-w-7xl" />
        <About />
        <div className="section-sep mx-auto max-w-7xl" />
        <Services />
        <div className="section-sep mx-auto max-w-7xl" />
        <Packages />
        <div className="section-sep mx-auto max-w-7xl" />
        <Game />
        <div className="section-sep mx-auto max-w-7xl" />
        <Testimonials />
        <div className="section-sep mx-auto max-w-7xl" />
        <Contact />
        <Footer />
      </div>
      <CookieBanner />
    </main>
  )
}
