import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import type { Metadata } from "next"

import { LandingHero } from "@/components/landing/landing-hero"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingTestimonials } from "@/components/landing/landing-testimonials"
import { LandingPricing } from "@/components/landing/landing-pricing"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingNavbar } from "@/components/landing/landing-navbar"

export const metadata: Metadata = {
  title: "Product Ledger - Complete Business Financial Management",
  description: "Track cash flow, manage inventory, handle overdue payments, and generate invoices. The all-in-one financial management system for product-selling businesses.",
}

export default async function HomePage() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Product Ledger",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "A complete financial management system for product-selling businesses. Track cash flow, manage inventory, handle overdue payments, and generate invoices.",
    url: "https://product-ledger.vercel.app",
    author: {
      "@type": "Organization",
      name: "BONSOI Systems",
      url: "https://bonsoi.vercel.app",
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "29",
      highPrice: "199",
      priceCurrency: "USD",
      offerCount: "3",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      ratingCount: "3",
      bestRating: "5",
      worstRating: "1",
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--canvas)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingTestimonials />
        <LandingPricing />
      </main>
      <LandingFooter />
    </div>
  )
}
