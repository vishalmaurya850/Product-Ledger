"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#pricing", label: "Pricing" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--canvas)]/90 backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-[var(--border-subtle)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex h-[56px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[var(--accent-cyan)]" />
          <span className="text-[20px] font-semibold text-[var(--ink)]">
            Product Ledger
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-normal text-[var(--text-secondary)] hover:text-[var(--ink)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-[var(--ink)] p-1"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--canvas)] border-t border-[var(--border-subtle)] px-6 pb-6 pt-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[15px] text-[var(--ink)] py-1"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
