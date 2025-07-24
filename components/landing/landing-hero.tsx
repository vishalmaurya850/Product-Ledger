'use client'
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function LandingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 mx-auto md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4 animate-in fade-in slide-in-from-left duration-700">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl transition-all duration-300 hover:text-primary/90">
                Manage Your Business Finances with Ease
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl transition-all duration-300 hover:text-foreground/80">
                Product Ledger helps you track cash flow, manage inventory, and handle overdue payments all in one
                place.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/auth/register" className="group">
                <Button size="lg" className="bg-primary text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary/90 group-hover:translate-x-1">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#features" className="group">
                <Button size="lg" variant="outline" className="transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-accent/50 hover:border-primary/30">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center animate-in fade-in slide-in-from-right duration-700 delay-300">
            <div className="relative w-full h-[400px] overflow-hidden rounded-lg border bg-background p-2 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Financial Dashboard Interface"
                className="w-full h-full object-cover rounded-md transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-md"></div>
              <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="text-center bg-background/95 backdrop-blur-sm rounded-lg p-4 border">
                  <div className="text-lg font-semibold text-primary">Real-time Dashboard</div>
                  <div className="text-sm text-muted-foreground">Track your business metrics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}