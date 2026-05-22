import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { AdminCustomersTable } from "@/components/admin/admin-customers-table"

export default function AdminCustomersPage() {
  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display-lg text-[var(--ink)]">Customers</h1>
          <p className="text-[17px] tracking-[-0.374px] text-[var(--body-muted)] mt-1">
            Manage your customer database.
          </p>
        </div>
        <Link href="/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<DashboardSkeleton />}>
            <AdminCustomersTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}