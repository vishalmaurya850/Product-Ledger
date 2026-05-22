"use client"

import { BarChart3, CreditCard, DollarSign, Package, Settings, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: DollarSign,
    title: "Ledger Management",
    description: "Track all your cash inflows and outflows with detailed ledger entries.",
  },
  {
    icon: Package,
    title: "Inventory Tracking",
    description: "Manage your product inventory with real-time stock updates and alerts.",
  },
  {
    icon: BarChart3,
    title: "Overdue Management",
    description: "Automatically calculate interest on overdue payments based on your rules.",
  },
  {
    icon: CreditCard,
    title: "Customer Management",
    description: "Keep track of all your customers and their transaction history.",
  },
  {
    icon: Settings,
    title: "Customizable Settings",
    description: "Configure interest rates, grace periods, and other system parameters.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Admin Portal",
    description: "Manage your entire system from a secure, role-based admin portal.",
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="w-full py-20 md:py-32 bg-[var(--surface-card)]">
      <div className="max-w-[980px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-lg text-[var(--ink)]">
            Everything you need.
          </h2>
          <p className="mt-3 text-lead-airy text-[var(--text-secondary)] max-w-[600px] mx-auto">
            All the tools to manage your business finances effectively.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[16px] border border-[var(--border-subtle)] bg-[var(--canvas)] p-6 transition-all hover:shadow-[var(--product-shadow)]"
            >
              <div className="h-10 w-10 rounded-full bg-[var(--accent-cyan-glow)] flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5 text-[var(--accent-cyan)]" />
              </div>
              <h3 className="text-[16px] font-semibold text-[var(--ink)] mb-2">
                {feature.title}
              </h3>
              <p className="text-[14px] text-[var(--text-secondary)] leading-[1.5]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
