import Link from "next/link"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminActivity } from "@/components/admin/admin-activity"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { Settings, ShieldCheck } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-display-md text-[var(--ink)]">Admin Portal</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<DashboardSkeleton />}>
            <AdminStats />
          </Suspense>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/settings">
              <Card className="h-full transition-all hover:shadow-[var(--product-shadow)]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>System Settings</CardTitle>
                    <Settings className="h-5 w-5 text-[var(--accent-orange)]" />
                  </div>
                  <CardDescription>Configure system parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-[14px] text-[var(--text-secondary)]">Configure overdue interest rates, payment terms, and other system settings.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/users">
              <Card className="h-full transition-all hover:shadow-[var(--product-shadow)]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <ShieldCheck className="h-5 w-5 text-[var(--accent-green)]" />
                  </div>
                  <CardDescription>Manage system users</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-[14px] text-[var(--text-secondary)]">Add, edit, and manage user accounts and permissions.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
              <CardDescription>Recent actions performed in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<DashboardSkeleton />}>
                <AdminActivity />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
