import Link from "next/link"
import { ArrowLeft, Target, Users, Zap, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To empower businesses of all sizes with simple, powerful financial management tools that help them grow and succeed."
    },
    {
      icon: Users,
      title: "Customer First",
      description: "We build features based on real customer feedback and needs. Your success is our success."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We continuously innovate and improve our platform to provide the best experience and latest features."
    },
    {
      icon: Heart,
      title: "Reliability",
      description: "We're committed to providing a secure, stable platform you can depend on for your business operations."
    }
  ]

  const team = [
    {
      name: "Leadership Team",
      description: "Experienced professionals from finance and technology sectors committed to building the best financial management platform."
    },
    {
      name: "Engineering",
      description: "World-class developers focused on creating secure, scalable, and user-friendly solutions."
    },
    {
      name: "Customer Success",
      description: "Dedicated support team ensuring every customer gets the help they need to succeed."
    },
    {
      name: "Product",
      description: "Passionate product managers who listen to customers and shape the future of Product Ledger."
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
                  About Product Ledger
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  We're on a mission to simplify financial management for businesses worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 mx-auto md:px-6">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">Our Story</h2>
                <p className="text-muted-foreground text-lg">
                  Product Ledger was born from a simple observation: small and medium businesses struggle with complex, expensive financial management software that's either too basic or overwhelmingly complicated.
                </p>
                <p className="text-muted-foreground text-lg">
                  We set out to create a solution that combines simplicity with power—a platform that anyone can use, yet sophisticated enough to handle complex business needs. From tracking cash flow to managing inventory and handling overdue payments, we've built everything a modern business needs in one place.
                </p>
                <p className="text-muted-foreground text-lg">
                  Today, thousands of businesses trust Product Ledger to manage their finances, and we're just getting started. Our team is constantly working on new features and improvements to make your financial management even easier.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-12 md:py-24 bg-muted">
          <div className="container px-4 mx-auto md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Values</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                These principles guide everything we do at Product Ledger.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-4">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 mx-auto md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Team</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Meet the people behind Product Ledger.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {team.map((dept, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl">{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{dept.description}</p>
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Join Us on This Journey
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Be part of thousands of businesses transforming their financial management.
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <Link href="/auth/register">
                  <Button size="lg">Get Started Free</Button>
                </Link>
                <Link href="/careers">
                  <Button size="lg" variant="outline">View Careers</Button>
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
