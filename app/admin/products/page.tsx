import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminProductsTable } from "@/components/admin/admin-products-table"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

export default function AdminProductsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Product Management</h2>
        <div className="flex items-center space-x-2">
          <Link href="/admin/products/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>Manage your product inventory and stock levels</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<DashboardSkeleton />}>
            <AdminProductsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
