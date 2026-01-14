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
      className="w-full py-12 md:py-24 lg:py-32"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container px-4 mx-auto md:px-6">
  <div className="flex flex-col items-center justify-center space-y-4 text-center">
    <div className="space-y-2">
      <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground mb-4">Pricing</div>
      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
      <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
        Choose the plan that&apos;s right for your business. All plans include all features.
      </p>
    </div>
  </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Starter Plan */}
          <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription>Perfect for small businesses just getting started.</CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">$29</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Up to 500 ledger entries</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Up to 100 products</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Up to 50 customers</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Basic reports</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/register" className="w-full"><Button className="w-full">Get Started</Button></Link>
            </CardFooter>
          </Card>

          {/* Business Plan */}
          <Card className="flex flex-col border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
       <CardHeader>
  <div className="flex items-center justify-between gap-2">
    <CardTitle className="!mt-0">Business</CardTitle>
    <div className="rounded-lg bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
      Popular
    </div>
  </div>
  <CardDescription>For growing businesses with more needs.</CardDescription>
  <div className="mt-4 flex items-baseline">
    <span className="text-4xl font-bold">$79</span>
    <span className="ml-1 text-muted-foreground">/month</span>
  </div>
</CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Unlimited ledger entries</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Up to 1,000 products</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Up to 500 customers</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Advanced reports</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Email notifications</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/register" className="w-full"><Button className="w-full">Get Started</Button></Link>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card className="flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For large businesses with complex requirements.</CardDescription>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">$199</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Unlimited everything</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Priority support</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Custom integrations</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />Dedicated account manager</li>
                <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" />On-premise deployment option</li>
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
