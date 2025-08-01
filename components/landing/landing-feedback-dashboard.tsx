'use client'

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, MessageSquare, Star, ThumbsUp, AlertCircle } from "lucide-react"

// Mock data for feedback analytics
const feedbackData = {
  totalSubmissions: 1247,
  monthlyTrend: [
    { month: 'Jan', submissions: 89 },
    { month: 'Feb', submissions: 112 },
    { month: 'Mar', submissions: 156 },
    { month: 'Apr', submissions: 134 },
    { month: 'May', submissions: 178 },
    { month: 'Jun', submissions: 203 },
    { month: 'Jul', submissions: 189 },
    { month: 'Aug', submissions: 166 }
  ],
  feedbackTypes: [
    { type: 'Feature Request', count: 456, percentage: 36.6, color: 'bg-blue-500' },
    { type: 'Bug Report', count: 234, percentage: 18.8, color: 'bg-red-500' },
    { type: 'General Feedback', count: 345, percentage: 27.7, color: 'bg-green-500' },
    { type: 'Complaint', count: 89, percentage: 7.1, color: 'bg-yellow-500' },
    { type: 'Praise', count: 123, percentage: 9.9, color: 'bg-purple-500' }
  ],
  averageRating: 4.3,
  responseRate: 94.2,
  recentActivity: [
    { type: 'Feature Request', user: 'Sarah M.', time: '2 hours ago', status: 'Under Review' },
    { type: 'Bug Report', user: 'Mike R.', time: '4 hours ago', status: 'In Progress' },
    { type: 'Praise', user: 'Lisa K.', time: '6 hours ago', status: 'Resolved' },
    { type: 'General Feedback', user: 'David L.', time: '1 day ago', status: 'Under Review' }
  ]
}

export function LandingFeedbackDashboard() {
  return (
    <motion.section
      id="feedback-dashboard"
      className="w-full py-12 md:py-24 lg:py-32 bg-background"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container px-4 mx-auto md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Feedback Analytics
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">User Feedback Dashboard</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Track and analyze user feedback to continuously improve Product Ledger
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Submissions", value: feedbackData.totalSubmissions.toLocaleString(), change: "+12% from last month", icon: MessageSquare, delay: 0.1 },
            { title: "Average Rating", value: `${feedbackData.averageRating}/5.0`, change: "+0.2 from last month", icon: Star, delay: 0.2 },
            { title: "Response Rate", value: `${feedbackData.responseRate}%`, change: "+2.1% from last month", icon: ThumbsUp, delay: 0.3 },
            { title: "Active Issues", value: "23", change: "-5 from last week", icon: AlertCircle, delay: 0.4 }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: metric.delay, ease: "easeOut" }}
            >
              <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  <metric.icon className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:scale-110" />
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: metric.delay + 0.2 }}
                  >
                    {metric.value}
                  </motion.div>
                  <motion.p 
                    className="text-xs text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: metric.delay + 0.3 }}
                  >
                    {metric.change}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Feedback Trends and Breakdown */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-8 lg:grid-cols-2">
          {/* Submission Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Submission Trends
                </CardTitle>
                <CardDescription>Monthly feedback submission volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbackData.monthlyTrend.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                    >
                      <span className="text-sm font-medium">{item.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <motion.div 
                            className="bg-primary h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.submissions / 250) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.7 + (index * 0.1) }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {item.submissions}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feedback Type Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          >
            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Feedback Types
                </CardTitle>
                <CardDescription>Breakdown of feedback categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbackData.feedbackTypes.map((type, index) => (
                    <motion.div 
                      key={index} 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + (index * 0.1) }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{type.type}</span>
                        <span className="text-sm text-muted-foreground">{type.count}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div 
                            className={`h-2 rounded-full ${type.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${type.percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.9 + (index * 0.1) }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {type.percentage}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div 
          className="mx-auto max-w-5xl py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
        >
          <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
            <CardHeader>
              <CardTitle>Recent Feedback Activity</CardTitle>
              <CardDescription>Latest user feedback submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackData.recentActivity.map((activity, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg border"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 1.1 + (index * 0.1) }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        {activity.type}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{activity.user}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={activity.status === 'Resolved' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {activity.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  )
} 