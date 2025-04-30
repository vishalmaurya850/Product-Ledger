import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLedgerTable } from "@/components/admin/admin-ledger-table"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

export default async function AdminLedgerPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Ledger Management</h2>
        <div className="flex items-center space-x-2">
          <Link href="/admin/ledger/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Ledger Entries</CardTitle>
          <CardDescription>Manage all financial transactions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<DashboardSkeleton />}>
            <AdminLedgerTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
