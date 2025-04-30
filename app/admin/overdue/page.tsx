import { Suspense } from "react"
import Link from "next/link"
import { Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { AdminOverdueTable } from "@/components/admin/admin-overdue-table"

export default function AdminOverduePage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Overdue Management</h2>
        <div className="flex items-center space-x-2">
          <Link href="/admin/settings">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Overdue Settings
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overdue Entries</CardTitle>
          <CardDescription>Manage overdue payments and apply interest charges</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<DashboardSkeleton />}>
            <AdminOverdueTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}