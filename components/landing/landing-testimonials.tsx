"use client";

import {motion} from "framer-motion";
import {useEffect, useState} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import StarRating from "@/components/ui/StarRating";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const testimonials = [
  {
    name: "Jane Smith",
    title: "CFO, Retail Solutions",
    initials: "JS",
    quote:
      "The real-time data management has been a game-changer for our inventory tracking. We always know exactly what we have in stock.",
    ratings: 5.0,
    image:
      "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000",
    date: new Date("12-02-2025"),
  },
  {
    name: "Robert Johnson",
    title: "Owner, Johnson Manufacturing",
    initials: "RJ",
    quote:
      "As a small business owner, I needed something simple yet powerful. Product Ledger is exactly that - easy to use but with all the features I need.",
    ratings: 4.0,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    date: new Date("05-06-2025"),
  },
  {
    name: "John Doe",
    title: "CEO, TechCorp",
    initials: "JD",
    quote:
      "Product Ledger has transformed how we manage our finances. The overdue management feature alone has saved us thousands.",
    ratings: 4.5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    date: new Date("10-08-2024"),
  },
].sort((a, b) => b.date.getTime() - a.date.getTime());

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

export function LandingTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const currentTestimonials = [
    testimonials[
      (currentIndex + testimonials.length - 1) % testimonials.length
    ],
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      id="testimonials"
      className="w-full py-16 md:py-24 lg:py-32 bg-muted relative overflow-hidden"
      initial={{opacity: 0, y: 40}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.6, ease: "easeOut"}}
    >
      <div className="container mx-auto text-center">
        <div className="space-y-4">
          <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            What Our Customers Say
          </h2>
          <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl">
            Don&apos;t just take our word for it. Here&apos;s what businesses
            using Product Ledger have to say.
          </p>
        </div>

        <div className="relative mt-16 flex justify-center items-center px-6 md:px-12 lg:px-20 xl:px-28 2xl:px-32 overflow-visible">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-background/70 hover:bg-primary/20 backdrop-blur-md p-3 rounded-full shadow-md transition duration-300 border border-primary/30 hover:scale-110"
          >
            <ChevronLeft />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-background/70 hover:bg-primary/20 backdrop-blur-md p-3 rounded-full shadow-md transition duration-300 border border-primary/30 hover:scale-110"
          >
            <ChevronRight />
          </button>

          {/* Cards Container */}
          <div className="flex gap-6 transition-transform duration-700">
            {currentTestimonials.map((testimonial, index) => {
              const isCenter = index === 1;
              return (
                <motion.div
                  key={index}
                  className={`flex-shrink-0 w-[90vw] md:w-[400px] transition-all duration-500 ${
                    isCenter ? "z-20" : "opacity-60"
                  }`}
                >
                  <Card
                    className={`h-full group border border-border/60 transition-all duration-300 ${
                      isCenter
                        ? "bg-background border-primary/30 shadow-lg hover:shadow-[0_15px_35px_rgba(99,102,241,0.4),0_0_40px_rgba(139,92,246,0.5),0_0_60px_rgba(236,72,153,0.4)] hover:scale-[1.06]"
                        : "pointer-events-none"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="transition-transform duration-300 group-hover:scale-110">
                          <AvatarImage src={testimonial.image} alt="Avatar" />
                          <AvatarFallback>
                            {testimonial.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="group-hover:text-primary pt-4">
                            {testimonial.name}
                          </CardTitle>
                          <CardDescription className="group-hover:text-primary/70 pt-1">
                            {testimonial.title}
                          </CardDescription>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(testimonial.date)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      &quot;{testimonial.quote}&quot;
                      <StarRating rating={testimonial.ratings} />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
