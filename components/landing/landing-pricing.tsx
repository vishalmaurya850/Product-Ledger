'use client'

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function LandingPricing() {
  return (
    <motion.section
      id="pricing"
      className="w-full py-12 md:py-24 lg:py-32 bg-[var(--surface-card)]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-[980px] mx-auto px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-[8px] bg-[var(--accent-cyan)] px-3 py-1 text-[13px] font-medium text-white">
              Pricing
            </div>
            <h2 className="text-display-lg text-[var(--ink)]">Simple, Transparent Pricing</h2>
            <p className="max-w-[700px] text-[16px] text-[var(--text-secondary)] leading-relaxed">
              Choose the plan that&apos;s right for your business. All plans include all features.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Starter Plan */}
          <Card className="flex flex-col transition-all duration-300 hover:shadow-[var(--product-shadow)] hover:-translate-y-1 bg-[var(--canvas)]">
            <CardHeader>
              <CardTitle className="text-[18px]">Starter</CardTitle>
              <CardDescription>Perfect for small businesses just getting started.</CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-kpi-sm text-[var(--ink)]">$29</span>
                <span className="ml-1 text-[14px] text-[var(--text-secondary)]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-[14px]">
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Up to 500 ledger entries</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Up to 100 products</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Up to 50 customers</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Basic reports</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/register" className="w-full"><Button className="w-full">Get Started</Button></Link>
            </CardFooter>
          </Card>

          {/* Business Plan */}
          <Card className="flex flex-col border-[var(--accent-cyan)] transition-all duration-300 hover:shadow-[var(--product-shadow)] hover:-translate-y-1 bg-[var(--canvas)]">
            <CardHeader>
              <div className="inline-block rounded-[8px] bg-[var(--accent-cyan)] px-3 py-1 text-[13px] font-medium text-white w-fit">Popular</div>
              <CardTitle className="mt-4 text-[18px]">Business</CardTitle>
              <CardDescription>For growing businesses with more needs.</CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-kpi-sm text-[var(--accent-cyan)]">$79</span>
                <span className="ml-1 text-[14px] text-[var(--text-secondary)]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-[14px]">
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Unlimited ledger entries</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Up to 1,000 products</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Up to 500 customers</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Advanced reports</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Email notifications</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/register" className="w-full"><Button className="w-full">Get Started</Button></Link>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="flex flex-col transition-all duration-300 hover:shadow-[var(--product-shadow)] hover:-translate-y-1 bg-[var(--canvas)]">
            <CardHeader>
              <CardTitle className="text-[18px]">Enterprise</CardTitle>
              <CardDescription>For large businesses with complex requirements.</CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-kpi-sm text-[var(--ink)]">$199</span>
                <span className="ml-1 text-[14px] text-[var(--text-secondary)]">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2 text-[14px]">
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Unlimited everything</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Priority support</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Custom integrations</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />Dedicated account manager</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-[var(--accent-green)]" />On-premise deployment option</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/register" className="w-full"><Button className="w-full">Contact Sales</Button></Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </motion.section>
  )
}
