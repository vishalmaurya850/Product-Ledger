import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CustomersTable } from "@/components/customers/customers-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function CustomersPage() {
  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display-lg text-[var(--ink)]">Customers</h1>
          <p className="text-[17px] tracking-[-0.374px] text-[var(--body-muted)] mt-1">
            View and manage your customer database.
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
          <Suspense fallback={<CustomersTableSkeleton />}>
            <CustomersTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

function CustomersTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-[11px] border border-[var(--hairline)]">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
        ))}
    </div>
  )
}
