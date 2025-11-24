import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LandingNavbar } from "@/components/landing/landing-navbar"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function BlogPage() {
  const posts = [
    {
      title: "10 Tips for Managing Cash Flow in Small Business",
      excerpt: "Learn essential strategies to maintain healthy cash flow and avoid common pitfalls that can hurt your business.",
      category: "Finance",
      author: "BONSOI Team",
      date: "Nov 20, 2025",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80"
    },
    {
      title: "How to Handle Overdue Payments Professionally",
      excerpt: "Discover effective communication strategies and systems to manage overdue payments while maintaining customer relationships.",
      category: "Business",
      author: "BONSOI Team",
      date: "Nov 15, 2025",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
    },
    {
      title: "The Complete Guide to Inventory Management",
      excerpt: "Master inventory management with proven techniques to reduce costs, prevent stockouts, and optimize your supply chain.",
      category: "Operations",
      author: "BONSOI Team",
      date: "Nov 10, 2025",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80"
    },
    {
      title: "Understanding Credit Limits and Risk Management",
      excerpt: "Learn how to set appropriate credit limits and manage customer credit risk effectively in your business.",
      category: "Finance",
      author: "BONSOI Team",
      date: "Nov 5, 2025",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
    },
    {
      title: "Automating Your Financial Workflows",
      excerpt: "Discover how automation can save time, reduce errors, and improve efficiency in your financial operations.",
      category: "Technology",
      author: "BONSOI Team",
      date: "Oct 30, 2025",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
    },
    {
      title: "Best Practices for Invoice Management",
      excerpt: "Essential tips for creating, sending, and tracking invoices to ensure faster payments and better cash flow.",
      category: "Finance",
      author: "BONSOI Team",
      date: "Oct 25, 2025",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80"
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
                  Blog & Resources
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Learn best practices, tips, and insights for managing your business finances effectively.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 mx-auto md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-primary">
                      {post.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm mt-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Coming Soon */}
            <div className="mt-16 text-center bg-muted rounded-lg p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">More Articles Coming Soon</h2>
              <p className="text-muted-foreground mb-6">
                We're constantly creating new content to help you manage your business better. Subscribe to our newsletter to get notified when new articles are published.
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
