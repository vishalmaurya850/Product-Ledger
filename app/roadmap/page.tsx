import Link from "next/link"
import { ArrowLeft, Circle, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function RoadmapPage() {
  const roadmapItems = [
    {
      status: "completed",
      quarter: "Q3 2025",
      title: "Foundation & Core Features",
      items: [
        "User authentication and authorization",
        "Ledger management system",
        "Customer management",
        "Product inventory",
        "Basic reporting"
      ]
    },
    {
      status: "completed",
      quarter: "Q4 2025",
      title: "Advanced Features",
      items: [
        "Multi-user support with roles",
        "Credit limit management",
        "Automatic interest calculation",
        "Advanced reporting with exports",
        "Real-time notifications"
      ]
    },
    {
      status: "in-progress",
      quarter: "Q1 2026",
      title: "Integration & Automation",
      items: [
        "Payment gateway integration",
        "Automated email reminders",
        "WhatsApp notification integration",
        "Bank statement import",
        "GST invoice generation"
      ]
    },
    {
      status: "planned",
      quarter: "Q2 2026",
      title: "Mobile & Analytics",
      items: [
        "Mobile app for iOS and Android",
        "Advanced analytics dashboard",
        "Predictive cash flow analysis",
        "AI-powered insights",
        "Custom report builder"
      ]
    },
    {
      status: "planned",
      quarter: "Q3 2026",
      title: "Enterprise Features",
      items: [
        "Multi-company management",
        "API access for integrations",
        "Custom workflow automation",
        "Advanced user permissions",
        "Audit logs and compliance"
      ]
    },
    {
      status: "planned",
      quarter: "Q4 2026",
      title: "Global Expansion",
      items: [
        "Multi-currency support",
        "Multi-language interface",
        "Regional tax compliance",
        "International payment gateways",
        "Global customer support"
      ]
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />
      case "in-progress":
        return <Clock className="h-6 w-6 text-blue-500" />
      default:
        return <Circle className="h-6 w-6 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>
      default:
        return <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">Planned</Badge>
    }
  }

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
                  Product Roadmap
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  See what we're working on and what's coming next. Your feedback shapes our future.
                </p>
              </div>
              <Link href="/contact">
                <Button size="lg">Request a Feature</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Roadmap Timeline */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 mx-auto md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

                <div className="space-y-8">
                  {roadmapItems.map((item, index) => (
                    <Card key={index} className="relative hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="relative z-10 bg-background p-2 rounded-full border-2">
                            {getStatusIcon(item.status)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                              <div>
                                <CardTitle className="text-2xl">{item.title}</CardTitle>
                                <CardDescription className="text-base mt-1">
                                  {item.quarter}
                                </CardDescription>
                              </div>
                              {getStatusBadge(item.status)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="ml-14">
                        <ul className="space-y-2">
                          {item.items.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="mt-16 text-center bg-muted rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Have a Feature Request?</h2>
              <p className="text-muted-foreground mb-6">
                We'd love to hear from you! Your feedback helps us prioritize our roadmap and build features that matter most to you.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/contact">
                  <Button size="lg">Contact Us</Button>
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
