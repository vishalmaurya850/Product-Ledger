import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Customers Say</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Don&apos;t just take our word for it. Here&apos;s what businesses using Product Ledger have to say.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>John Doe</CardTitle>
                  <CardDescription>CEO, TechCorp</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
            &quot;Product Ledger has transformed how we manage our finances. The overdue management feature alone has saved
              us thousands.&quot;
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Jane Smith</CardTitle>
                  <CardDescription>CFO, Retail Solutions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
            &quot;The real-time data management has been a game-changer for our inventory tracking. We always know exactly
              what we have in stock.&quot;
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                  <AvatarFallback>RJ</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Robert Johnson</CardTitle>
                  <CardDescription>Owner, Johnson Manufacturing</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
            &quot;As a small business owner, I needed something simple yet powerful. Product Ledger is exactly that - easy
              to use but with all the features I need.&quot;
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}