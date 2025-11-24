import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingPricing } from "@/components/landing/landing-pricing"

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Simple, Transparent Pricing
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Choose the perfect plan for your business. All plans include a 14-day free trial.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <LandingPricing />

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 mx-auto md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can also pay via bank transfer.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Can I change plans later?</h3>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  Yes, all plans come with a 14-day free trial. No credit card required to start.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">What happens after the trial?</h3>
                <p className="text-muted-foreground">
                  After your trial ends, you'll be automatically enrolled in the plan you selected. You can cancel anytime before the trial ends.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Do you offer refunds?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Absolutely. We use bank-level encryption and security measures to protect your data. All data is backed up daily.
                </p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Link href="/">
                <Button size="lg" variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
