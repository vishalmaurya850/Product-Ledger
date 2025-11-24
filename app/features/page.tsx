import Link from "next/link"
import { ArrowLeft, CheckCircle2, BarChart3, Users, Package, DollarSign, FileText, TrendingUp, Shield, Clock, RefreshCw, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function FeaturesPage() {
  const features = [
    {
      icon: DollarSign,
      title: "Ledger Management",
      description: "Complete financial transaction tracking with automatic balance calculations and payment status updates.",
      details: [
        "Track sales, purchases, and payments",
        "Automatic balance calculations",
        "Payment status tracking (Paid, Unpaid, Partially Paid)",
        "Transaction history and audit trail"
      ]
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Comprehensive customer database with credit limit tracking and payment history.",
      details: [
        "Store customer details and documents",
        "Credit limit management",
        "Payment history tracking",
        "Customer-wise balance overview"
      ]
    },
    {
      icon: Package,
      title: "Product Inventory",
      description: "Manage your product catalog with real-time stock tracking and pricing.",
      details: [
        "Product catalog management",
        "Stock quantity tracking",
        "Multiple pricing tiers",
        "Category organization"
      ]
    },
    {
      icon: Clock,
      title: "Overdue Management",
      description: "Automated overdue detection and interest calculation based on your settings.",
      details: [
        "Automatic overdue detection",
        "Grace period configuration",
        "Interest rate calculation",
        "Overdue payment reminders"
      ]
    },
    {
      icon: FileText,
      title: "Invoice Generation",
      description: "Professional invoices with your company branding and complete transaction details.",
      details: [
        "Customizable invoice templates",
        "Company branding",
        "PDF export and printing",
        "Payment tracking on invoices"
      ]
    },
    {
      icon: BarChart3,
      title: "Financial Reports",
      description: "Comprehensive reporting tools for revenue, products, overdue amounts, and credit analysis.",
      details: [
        "Revenue reports with filtering",
        "Product-wise sales analysis",
        "Overdue payment reports",
        "Credit utilization analysis"
      ]
    },
    {
      icon: TrendingUp,
      title: "Real-time Dashboard",
      description: "Visual overview of your business metrics with interactive charts and widgets.",
      details: [
        "Revenue tracking and trends",
        "Recent transactions overview",
        "Overdue payment alerts",
        "Quick action buttons"
      ]
    },
    {
      icon: Shield,
      title: "Multi-user Access",
      description: "Role-based access control with admin and user permissions.",
      details: [
        "Admin and user roles",
        "Permission-based access",
        "Activity tracking",
        "Secure authentication"
      ]
    },
    {
      icon: RefreshCw,
      title: "Data Synchronization",
      description: "Real-time data updates across all devices and users.",
      details: [
        "Cloud-based storage",
        "Real-time updates",
        "Cross-device sync",
        "Automatic backups"
      ]
    },
    {
      icon: Bell,
      title: "Notifications & Alerts",
      description: "Stay informed with intelligent notifications for important business events.",
      details: [
        "Payment due reminders",
        "Overdue alerts",
        "Low stock notifications",
        "Custom notification settings"
      ]
    }
  ]

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
                  Powerful Features for Modern Business
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Everything you need to manage your finances, inventory, and customers in one comprehensive platform.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/auth/register">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link href="/#pricing">
                  <Button size="lg" variant="outline">View Pricing</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 mx-auto md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base mt-2">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Business?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Join thousands of businesses already using Product Ledger to streamline their operations.
              </p>
              <div className="flex gap-4">
                <Link href="/auth/register">
                  <Button size="lg">Start Free Trial</Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
