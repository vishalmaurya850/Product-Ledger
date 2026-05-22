import Link from "next/link"
import { Suspense } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { ProductsTable } from "@/components/products/products-table"

export default function ProductsPage() {
  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display-lg text-[var(--ink)]">Products</h1>
          <p className="text-[17px] tracking-[-0.374px] text-[var(--body-muted)] mt-1">
            Manage your product inventory and stock levels.
          </p>
        </div>
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Suspense fallback={<DashboardSkeleton />}>
            <ProductsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
