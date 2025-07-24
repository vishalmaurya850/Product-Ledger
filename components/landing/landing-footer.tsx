'use client';

import Link from "next/link"
import { Package } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-12">
      <div className="container px-4 mx-auto md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 group">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Package className="h-6 w-6 text-primary transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" />
              <span className="text-lg font-bold transition-all duration-300 group-hover:text-primary/90">
                Product Ledger
              </span>
            </div>
            <p className="text-sm text-muted-foreground transition-all duration-300 group-hover:text-muted-foreground/80">
              A complete financial management system for businesses of all sizes.
            </p>
          </div>
          
          <div className="space-y-4 group">
            <h3 className="text-lg font-semibold transition-all duration-300 group-hover:text-primary/90">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="#features" 
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 relative inline-block hover:scale-105 hover:-translate-y-0.5"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="#pricing" 
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 relative inline-block hover:scale-105 hover:-translate-y-0.5"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 relative inline-block hover:scale-105 hover:-translate-y-0.5"
                >
                  Changelog
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 relative inline-block hover:scale-105 hover:-translate-y-0.5"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4 group">
            <h3 className="text-lg font-semibold transition-all duration-300 group-hover:text-primary/90">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 relative inline-block hover:scale-105 hover:-translate-y-0.5"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 relative inline-block hover:scale-105 hover:-translate-y-0.5"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 relative inline-block hover:scale-105 hover:-translate-y-0.5"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 relative inline-block hover:scale-105 hover:-translate-y-0.5"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4 group">
            <h3 className="text-lg font-semibold transition-all duration-300 group-hover:text-primary/90">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/policy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookie" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <span className="transition-all duration-300 hover:text-primary/80 cursor-default">
            BONSOI Systems © {new Date().getFullYear()} Product Ledger. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}