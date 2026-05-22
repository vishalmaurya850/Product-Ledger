'use client'

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import StarRating from "@/components/ui/StarRating"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


export function LandingTestimonials() {
  return (
    <motion.section
      id="testimonials"
      className="w-full py-12 md:py-24 lg:py-32 bg-[var(--canvas)]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-[980px] mx-auto px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-[8px] bg-[var(--accent-cyan)] px-3 py-1 text-[13px] font-medium text-white">
              Testimonials
            </div>
            <h2 className="text-display-lg text-[var(--ink)]">What Our Customers Say</h2>
            <p className="max-w-[700px] text-[16px] text-[var(--text-secondary)] leading-relaxed">
              Don&apos;t just take our word for it. Here&apos;s what businesses using Product Ledger have to say.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "John Doe",
              title: "CEO, TechCorp",
              initials: "JD",
              quote:
                "Product Ledger has transformed how we manage our finances. The overdue management feature alone has saved us thousands.",
              ratings: 4.5,
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
              date: new Date("2024-10-08")
            },
            {
              name: "Jane Smith",
              title: "CFO, Retail Solutions",
              initials: "JS",
              quote:
                "The real-time data management has been a game-changer for our inventory tracking. We always know exactly what we have in stock.",
              ratings: 5.0,
              image: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
              date: new Date("2025-12-02")
            },
            {
              name: "Robert Johnson",
              title: "Owner, Johnson Manufacturing",
              initials: "RJ",
              quote:
                "As a small business owner, I needed something simple yet powerful. Product Ledger is exactly that - easy to use but with all the features I need.",
              ratings: 4.0,
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
              date: new Date("2025-05-06")
            },
          ].sort((a, b) => b.date.getTime() - a.date.getTime()).map((testimonial, index) => (
            <Card
              key={index}
              className="transition-all duration-300 hover:shadow-[var(--product-shadow)] hover:-translate-y-1 group cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="transition-transform duration-300 group-hover:scale-110">
                    <AvatarImage src={testimonial.image} alt="Avatar"/>
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="transition-colors duration-300 group-hover:text-[var(--accent-cyan)] pt-4">
                      {testimonial.name}
                    </CardTitle>
                    <CardDescription className="pt-1">
                      {testimonial.title}
                    </CardDescription>
                    <p className="text-[12px] text-[var(--text-secondary)] mt-1">
                      {testimonial.date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[14px] text-[var(--ink)] leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <div className="mt-3">
                  <StarRating rating={testimonial.ratings}/>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
