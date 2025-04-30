import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomersTable } from "@/components/customers/customers-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function CustomersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <div className="flex items-center space-x-2">
          <Link href="/customers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>View and manage your customers</CardDescription>
        </CardHeader>
        <CardContent>
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
    <div className="rounded-md border">
      <div className="p-4 border-b">
        <Skeleton className="h-10 w-full max-w-sm" />
      </div>
      <div className="divide-y">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="ml-auto">
                  <Skeleton className="h-10 w-20" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}