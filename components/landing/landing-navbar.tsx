"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      
      // Check which section is currently in view
      const sections = ['features', 'testimonials', 'pricing']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

   const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={handleLogoClick}
        >
          <Package className="h-6 w-6 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" />
          <span className="text-lg font-bold transition-all duration-300 group-hover:text-primary/90">
            Product Ledger
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="#features" 
            className={`text-sm font-medium transition-all duration-300 relative group ${
              activeSection === 'features' 
                ? 'text-primary' 
                : 'hover:text-primary'
            }`}
          >
            <span className="relative z-10">Features</span>
            <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-primary transition-all duration-300 ${
              activeSection === 'features' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}></span>
          </Link>
          <Link 
            href="#testimonials" 
            className={`text-sm font-medium transition-all duration-300 relative group ${
              activeSection === 'testimonials' 
                ? 'text-primary' 
                : 'hover:text-primary'
            }`}
          >
            <span className="relative z-10">Testimonials</span>
            <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-primary transition-all duration-300 ${
              activeSection === 'testimonials' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}></span>
          </Link>
          <Link 
            href="#pricing" 
            className={`text-sm font-medium transition-all duration-300 relative group ${
              activeSection === 'pricing' 
                ? 'text-primary' 
                : 'hover:text-primary'
            }`}
          >
            <span className="relative z-10">Pricing</span>
            <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-primary transition-all duration-300 ${
              activeSection === 'pricing' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}></span>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="transition-all duration-300 hover:scale-110 hover:rotate-3">
            <ThemeToggle />
          </div>
          <Link href="/auth/login" className="group">
            <Button 
              variant="outline" 
              size="sm"
              className="transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
            >
              Log In
            </Button>
          </Link>
          <Link href="/auth/register" className="group">
            <Button 
              size="sm"
              className="transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95 relative overflow-hidden"
            >
              <span className="relative z-10">Sign Up</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}