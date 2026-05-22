"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-[var(--canvas)]">
      <div className="max-w-[980px] mx-auto px-6 text-center">
        {/* Headline */}
        <h1 className="text-hero-display text-[var(--ink)] max-w-[800px] mx-auto">
          Manage your business finances with clarity.
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-lead-airy text-[var(--text-secondary)] max-w-[600px] mx-auto">
          Track cash flow, manage inventory, handle overdue payments — all in one place.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/auth/register">
            <Button size="lg">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="mt-16 relative">
          <div className="rounded-[16px] overflow-hidden border border-[var(--border-subtle)] shadow-[var(--product-shadow)]">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Product Ledger Dashboard"
              className="w-full h-auto object-cover aspect-[16/9]"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
