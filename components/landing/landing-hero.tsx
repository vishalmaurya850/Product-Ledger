import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 mx-auto md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Manage Your Business Finances with Ease
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Product Ledger helps you track cash flow, manage inventory, and handle overdue payments all in one
                place.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="bg-primary text-primary-foreground">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[400px] overflow-hidden rounded-lg border bg-background p-2 shadow-xl">
              <div className="bg-primary/10 absolute inset-0 z-10 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">Product Ledger</div>
                  <div className="mt-2 text-lg text-muted-foreground">Financial Management System</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}