import Link from "next/link"
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function CareersPage() {
  const openings = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "5+ years",
      description: "Join our engineering team to build scalable financial management solutions using Next.js, React, and PostgreSQL."
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote / Hybrid",
      type: "Full-time",
      experience: "3+ years",
      description: "Lead product strategy and roadmap for our financial management platform, working closely with customers and engineering."
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      experience: "2+ years",
      description: "Help our customers succeed by providing exceptional support and guidance in using Product Ledger."
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      description: "Design beautiful, intuitive interfaces that make complex financial management simple and enjoyable."
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      experience: "4+ years",
      description: "Build and maintain our infrastructure, ensuring high availability, security, and performance."
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote / Hybrid",
      type: "Full-time",
      experience: "3+ years",
      description: "Drive growth through content marketing, SEO, social media, and strategic partnerships."
    }
  ]

  const benefits = [
    {
      title: "Competitive Salary",
      description: "Industry-leading compensation packages with equity options"
    },
    {
      title: "Remote Work",
      description: "Work from anywhere with flexible hours"
    },
    {
      title: "Health Benefits",
      description: "Comprehensive health, dental, and vision insurance"
    },
    {
      title: "Learning Budget",
      description: "Annual budget for courses, conferences, and books"
    },
    {
      title: "Paid Time Off",
      description: "Generous PTO policy including holidays and sick leave"
    },
    {
      title: "Equipment",
      description: "Latest laptops and equipment for optimal productivity"
    },
    {
      title: "Team Events",
      description: "Regular virtual and in-person team building activities"
    },
    {
      title: "Growth Opportunities",
      description: "Clear career paths and promotion opportunities"
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
                  Join Our Team
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Help us build the future of financial management. Work with talented people on meaningful problems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 mx-auto md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Why Work at Product Ledger?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We offer more than just a job. Join a team that values innovation, collaboration, and personal growth.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 mx-auto md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Open Positions</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Find your next opportunity and help us shape the future of business finance.
              </p>
            </div>
            <div className="grid gap-6 max-w-4xl mx-auto">
              {openings.map((job, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="text-base">
                          {job.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {job.department}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.experience}</span>
                      </div>
                    </div>
                    <Link href="/contact">
                      <Button>Apply Now</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center bg-muted rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold">Don't See a Perfect Fit?</h2>
              <p className="text-muted-foreground">
                We're always looking for talented people. Send us your resume and let us know what role you're interested in.
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <Link href="/contact">
                  <Button size="lg">Get in Touch</Button>
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
