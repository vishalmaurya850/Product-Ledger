import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ArrowRight, BarChart3, CreditCard, DollarSign, Package, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingTestimonials } from "@/components/landing/landing-testimonials"
import { LandingPricing } from "@/components/landing/landing-pricing"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingNavbar } from "@/components/landing/landing-navbar"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // If user is not logged in, show landing page
  if (!session) {
    return (
      <div className="flex min-h-screen flex-col">
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

  // If user is logged in, redirect to dashboard
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Link href="/ledger/new-entry">
            <Button>Add Ledger Entry</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/ledger">
          <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ledger Management</CardTitle>
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p>Manage all financial transactions and cash flow</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/products">
          <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Product Inventory</CardTitle>
              <Package className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <p>Track and manage your product inventory</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/customers">
          <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Management</CardTitle>
              <CreditCard className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <p>Manage customer information and transactions</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/overdue">
          <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
              <BarChart3 className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <p>Track and manage overdue payments</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/reports">
          <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate financial and inventory reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access detailed reports on your business performance</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                View Reports
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </Link>

        <Link href="/admin">
          <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
            <CardHeader>
              <CardTitle>Admin Portal</CardTitle>
              <CardDescription>Access administrative functions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Configure system settings and manage users</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                Admin Portal
                <ShieldCheck className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  )
}
