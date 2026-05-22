import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

import { LandingHero } from "@/components/landing/landing-hero"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingTestimonials } from "@/components/landing/landing-testimonials"
import { LandingPricing } from "@/components/landing/landing-pricing"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingNavbar } from "@/components/landing/landing-navbar"

export default async function HomePage() {
  const session = await auth()

  // If user is logged in, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  // If user is not logged in, show landing page
  return (
    <div className="flex min-h-screen flex-col bg-[var(--canvas)]">
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
