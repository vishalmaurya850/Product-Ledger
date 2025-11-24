import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, CreditCard, DollarSign, Package } from "lucide-react"
import { auth } from "@/lib/auth"
export async function AdminStats() {
  // Get user session
  const session = await auth() as { user: { id: string } }
  if (!session?.user?.id) {
    return <div>Not authenticated</div>
  }
  const companyId = session.user.id
  // Get total revenue (sum of all Cash In entries)
  const revenueResult = await db.ledgerEntry.aggregate({
    where: { type: "Cash In", companyId },
    _sum: { amount: true },
  })
  const totalRevenue = revenueResult._sum.amount || 0
  // Get pending payments (sum of all entries with status Pending)
  const pendingResult = await db.ledgerEntry.aggregate({
    where: { status: "Pending", companyId },
    _sum: { amount: true },
  })
  const pendingPayments = pendingResult._sum.amount || 0
  // Get overdue payments (sum of all entries with status Overdue)
  const overdueResult = await db.ledgerEntry.aggregate({
    where: { status: "Overdue", companyId },
    _sum: { amount: true },
  })
  const overdueAmount = overdueResult._sum.amount || 0
  // Get total products count
  const productsCount = await db.product.count({ where: { companyId } })
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Lifetime cash inflow</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{pendingPayments.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Awaiting payment</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{overdueAmount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Past due payments</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{productsCount}</div>
          <p className="text-xs text-muted-foreground">Products in inventory</p>
        </CardContent>
      </Card>
    </div>
  )
}
