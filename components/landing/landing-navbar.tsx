"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Product Ledger</span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary">
            Features
          </Link>
          <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
            Testimonials
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}