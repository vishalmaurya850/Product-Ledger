import { Suspense } from "react"
import { BarChart3, FileText, Download, PieChart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { RevenueReport } from "@/components/reports/revenue-report"
import { ProductReport } from "@/components/reports/product-report"
import { OverdueReport } from "@/components/reports/overdue-report"
import { CreditSettingsReport } from "@/components/reports/credit-settings-report"

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">
            <BarChart3 className="mr-2 h-4 w-4 text-blue-500" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="products">
            <PieChart className="mr-2 h-4 w-4 text-green-500" />
            Products
          </TabsTrigger>
          <TabsTrigger value="overdue">
            <FileText className="mr-2 h-4 w-4 text-red-500" />
            Overdue
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4 text-purple-500" />
            Credit Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Report</CardTitle>
              <CardDescription>View your revenue trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<DashboardSkeleton />}>
                <RevenueReport />
              </Suspense>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Revenue Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Report</CardTitle>
              <CardDescription>Analyze your product performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<DashboardSkeleton />}>
                <ProductReport />
              </Suspense>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Product Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Report</CardTitle>
              <CardDescription>Track overdue payments and interest accrued</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<DashboardSkeleton />}>
                <OverdueReport />
              </Suspense>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Overdue Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit Settings Report</CardTitle>
              <CardDescription>Manage company-wide credit settings and view customer credit limits</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<DashboardSkeleton />}>
                <CreditSettingsReport />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
