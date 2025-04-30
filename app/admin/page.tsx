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
        <h2 className="text-3xl font-bold tracking-tight">Admin Portal</h2>
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
            {/* <Link href="/admin/ledger">
              <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Ledger Management</CardTitle>
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                  </div>
                  <CardDescription>Manage all financial transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>View, add, edit, and delete ledger entries. Track cash flow and manage payments.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/products">
              <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Product Management</CardTitle>
                    <Package className="h-5 w-5 text-green-500" />
                  </div>
                  <CardDescription>Manage your product inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Add new products, update stock levels, and manage product information.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/customers">
              <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Customer Management</CardTitle>
                    <Users className="h-5 w-5 text-purple-500" />
                  </div>
                  <CardDescription>Manage your customer database</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Add, edit, and manage customer information and track customer transactions.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/overdue">
              <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Overdue Management</CardTitle>
                    <CreditCard className="h-5 w-5 text-red-500" />
                  </div>
                  <CardDescription>Manage overdue payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Track overdue payments, apply interest charges, and send payment reminders.</p>
                </CardContent>
              </Card>
            </Link> */}

            <Link href="/admin/settings">
              <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>System Settings</CardTitle>
                    <Settings className="h-5 w-5 text-amber-500" />
                  </div>
                  <CardDescription>Configure system parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Configure overdue interest rates, payment terms, and other system settings.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/users">
              <Card className="h-full transition-all hover:bg-accent hover:text-accent-foreground">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  </div>
                  <CardDescription>Manage system users</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Add, edit, and manage user accounts and permissions.</p>
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