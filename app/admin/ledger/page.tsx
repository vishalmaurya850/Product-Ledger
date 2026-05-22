import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AdminLedgerTable } from "@/components/admin/admin-ledger-table"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

export default async function AdminLedgerPage() {
  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display-md text-[var(--ink)]">Ledger</h1>
          <p className="text-[15px] text-[var(--text-secondary)] mt-1">
            Manage all financial transactions.
          </p>
        </div>
        <Link href="/admin/ledger/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<DashboardSkeleton />}>
            <AdminLedgerTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
