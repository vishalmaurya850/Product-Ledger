'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, CheckCircle } from "lucide-react"
import StarRating from "@/components/ui/StarRating"

export function LandingFeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: '',
    rating: 0,
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedbackId, setFeedbackId] = useState<string | null>(null)

  const feedbackTypes = [
    { value: 'feature-request', label: 'Feature Request', description: 'Suggest a new feature' },
    { value: 'bug-report', label: 'Bug Report', description: 'Report an issue or bug' },
    { value: 'general-feedback', label: 'General Feedback', description: 'General comments or suggestions' },
    { value: 'complaint', label: 'Complaint', description: 'Report a problem or concern' },
    { value: 'praise', label: 'Praise', description: 'Share positive feedback' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit feedback')
      }

      const result = await response.json()
      console.log('Feedback submitted successfully:', result)
      
      // Get the real feedback ID from server response
      setFeedbackId(result.id || result.feedbackId || null)
      setIsSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFeedbackId(null)
        setFormData({
          name: '',
          email: '',
          feedbackType: '',
          rating: 0,
          message: ''
        })
      }, 3000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    }
  }

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }))
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full py-12 md:py-24 lg:py-32 bg-muted"
      >
        <div className="container px-4 mx-auto md:px-6">
          <div className="max-w-md mx-auto text-center">
            <Card className="p-8">
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <CardTitle className="text-2xl">Thank You!</CardTitle>
                <CardDescription>
                  Your feedback has been submitted successfully. We appreciate your input and will review it carefully.
                </CardDescription>
                {feedbackId && (
                  <Badge variant="secondary" className="mt-4">
                    Feedback ID: #{feedbackId}
                  </Badge>
                )}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.section
      id="feedback-form"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container px-4 mx-auto md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Share Your Feedback
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Help Us Improve</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Your feedback is invaluable to us. Share your thoughts, suggestions, or report issues to help us make Product Ledger even better.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl py-12">
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Submit Feedback
              </CardTitle>
              <CardDescription>
                Fill out the form below to share your feedback with us
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="feedbackType" className="text-sm font-medium">
                    Feedback Type
                  </label>
                  <Select
                    value={formData.feedbackType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, feedbackType: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      {feedbackTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{type.label}</span>
                            <span className="text-xs text-muted-foreground">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Rating (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <StarRating 
                      rating={formData.rating} 
                      onRatingChange={handleRatingChange}
                      size="lg"
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.rating > 0 ? `${formData.rating}/5 stars` : 'Click to rate'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Your Feedback
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Please share your detailed feedback, suggestions, or describe any issues you've encountered..."
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.section>
  )
} 