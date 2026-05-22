"use client"

import Link from "next/link"
import { Package } from "lucide-react"

const footerLinks = {
  Product: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/changelog", label: "Changelog" },
    { href: "/roadmap", label: "Roadmap" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookie", label: "Cookie Policy" },
  ],
}

export function LandingFooter() {
  return (
    <footer className="w-full bg-[var(--surface-card)] py-16">
      <div className="max-w-[980px] mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-[var(--accent-cyan)]" />
              <span className="text-[15px] font-semibold text-[var(--ink)]">
                Product Ledger
              </span>
            </div>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.5]">
              A complete financial management system for businesses of all sizes.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-[13px] font-semibold text-[var(--ink)] mb-3">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[var(--border-subtle)] text-center">
          <p className="text-[13px] text-[var(--text-secondary)]">
            <a href="https://bonsoi.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-cyan)] transition-colors">BONSOI Systems</a> © {new Date().getFullYear()} Product Ledger. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
