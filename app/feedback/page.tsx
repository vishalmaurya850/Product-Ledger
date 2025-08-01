import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp, MessageSquare, Star, ThumbsUp, AlertCircle, Download } from "lucide-react"

export default async function FeedbackDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  // Mock data - in a real app, this would come from your database
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

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Feedback Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackData.totalSubmissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackData.averageRating}/5.0</div>
            <p className="text-xs text-muted-foreground">
              +0.2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbackData.responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              -5 from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Trends and Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Submission Trends */}
        <Card>
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
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.month}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(item.submissions / 250) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {item.submissions}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Type Breakdown */}
        <Card>
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
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{type.type}</span>
                    <span className="text-sm text-muted-foreground">{type.count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${type.color}`}
                        style={{ width: `${type.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {type.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback Activity</CardTitle>
          <CardDescription>Latest user feedback submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbackData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 