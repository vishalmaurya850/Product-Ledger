import Link from "next/link"
import { ArrowLeft, GitCommit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function ChangelogPage() {
  const releases = [
    {
      version: "2.1.0",
      date: "November 2025",
      type: "Feature Release",
      items: [
        { type: "new", text: "Added credit limit settings per customer" },
        { type: "new", text: "Automatic interest calculation for overdue payments" },
        { type: "new", text: "Enhanced invoice generation with company branding" },
        { type: "improvement", text: "Improved dashboard performance and loading times" },
        { type: "fix", text: "Fixed timezone issues in date calculations" }
      ]
    },
    {
      version: "2.0.0",
      date: "October 2025",
      type: "Major Release",
      items: [
        { type: "new", text: "Complete UI redesign with modern interface" },
        { type: "new", text: "Multi-user support with role-based access control" },
        { type: "new", text: "Advanced reporting system with filters and exports" },
        { type: "new", text: "Real-time notifications and alerts" },
        { type: "improvement", text: "Migrated to PostgreSQL for better performance" },
        { type: "improvement", text: "Enhanced security with NextAuth v5" }
      ]
    },
    {
      version: "1.5.0",
      date: "September 2025",
      type: "Feature Release",
      items: [
        { type: "new", text: "Product inventory management" },
        { type: "new", text: "Customer document storage (PAN, Aadhar)" },
        { type: "new", text: "Payment tracking with partial payments" },
        { type: "improvement", text: "Better mobile responsiveness" },
        { type: "fix", text: "Fixed balance calculation edge cases" }
      ]
    },
    {
      version: "1.0.0",
      date: "August 2025",
      type: "Initial Release",
      items: [
        { type: "new", text: "Basic ledger management" },
        { type: "new", text: "Customer management" },
        { type: "new", text: "Invoice generation" },
        { type: "new", text: "Basic reporting" },
        { type: "new", text: "User authentication" }
      ]
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "new":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "improvement":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "fix":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "new":
        return "New"
      case "improvement":
        return "Improved"
      case "fix":
        return "Fixed"
      default:
        return "Changed"
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
                  Changelog
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Keep track of all the new features, improvements, and bug fixes in Product Ledger.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Changelog Timeline */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 mx-auto md:px-6">
            <div className="max-w-3xl mx-auto space-y-8">
              {releases.map((release, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <GitCommit className="h-6 w-6" />
                          Version {release.version}
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          {release.date}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {release.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {release.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Badge 
                            variant="outline" 
                            className={`mt-0.5 ${getTypeColor(item.type)}`}
                          >
                            {getTypeLabel(item.type)}
                          </Badge>
                          <span className="text-muted-foreground flex-1">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
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
