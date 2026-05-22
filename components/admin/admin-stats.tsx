import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, CreditCard, DollarSign, Package } from "lucide-react"
import { auth } from "@/lib/auth"

export async function AdminStats() {
  const session = await auth() as { user: { id: string } }
  if (!session?.user?.id) {
    return <div>Not authenticated</div>
  }
  const companyId = session.user.id

  const revenueResult = await db.ledgerEntry.aggregate({
    where: { type: "Cash In", companyId },
    _sum: { amount: true },
  })
  const totalRevenue = revenueResult._sum.amount || 0

  const pendingResult = await db.ledgerEntry.aggregate({
    where: { status: "Pending", companyId },
    _sum: { amount: true },
  })
  const pendingPayments = pendingResult._sum.amount || 0

  const overdueResult = await db.ledgerEntry.aggregate({
    where: { status: "Overdue", companyId },
    _sum: { amount: true },
  })
  const overdueAmount = overdueResult._sum.amount || 0

  const productsCount = await db.product.count({ where: { companyId } })

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[14px] font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-[var(--accent-cyan)]" />
        </CardHeader>
        <CardContent>
          <div className="text-kpi-sm text-[var(--accent-cyan)]">₹{totalRevenue.toFixed(2)}</div>
          <p className="text-[13px] text-[var(--text-secondary)]">Lifetime cash inflow</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[14px] font-medium">Pending Payments</CardTitle>
          <CreditCard className="h-4 w-4 text-[var(--accent-orange)]" />
        </CardHeader>
        <CardContent>
          <div className="text-kpi-sm text-[var(--ink)]">₹{pendingPayments.toFixed(2)}</div>
          <p className="text-[13px] text-[var(--text-secondary)]">Awaiting payment</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[14px] font-medium">Overdue Amount</CardTitle>
          <BarChart3 className="h-4 w-4 text-[var(--accent-red)]" />
        </CardHeader>
        <CardContent>
          <div className="text-kpi-sm text-[var(--accent-red)]">₹{overdueAmount.toFixed(2)}</div>
          <p className="text-[13px] text-[var(--text-secondary)]">Past due payments</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[14px] font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-[var(--accent-green)]" />
        </CardHeader>
        <CardContent>
          <div className="text-kpi-sm text-[var(--ink)]">{productsCount}</div>
          <p className="text-[13px] text-[var(--text-secondary)]">Products in inventory</p>
        </CardContent>
      </Card>
    </div>
  )
}
