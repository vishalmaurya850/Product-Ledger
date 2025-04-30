import { connectToDatabase, collections } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, CreditCard, DollarSign, Package } from "lucide-react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function AdminStats() {
  // Get user session
  const session = await getServerSession(authOptions) as { user: { id: string } }
  if (!session?.user?.id) {
    return <div>Not authenticated</div>
  }

  const companyId = session.user.id

  // Fetch real data from MongoDB
  const { db } = await connectToDatabase()

  // Get total revenue (sum of all Cash In entries)
  const revenueResult = await db
    .collection(collections.ledger)
    .aggregate([{ $match: { type: "Cash In", companyId } }, { $group: { _id: null, total: { $sum: "$amount" } } }])
    .toArray()
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0

  // Get total expenses (sum of all Cash Out entries)
  // const expensesResult = await db
  //   .collection(collections.ledger)
  //   .aggregate([{ $match: { type: "Cash Out", companyId } }, { $group: { _id: null, total: { $sum: "$amount" } } }])
  //   .toArray()
  // const totalExpenses = expensesResult.length > 0 ? expensesResult[0].total : 0

  // Get pending payments (sum of all entries with status Pending)
  const pendingResult = await db
    .collection(collections.ledger)
    .aggregate([{ $match: { status: "Pending", companyId } }, { $group: { _id: null, total: { $sum: "$amount" } } }])
    .toArray()
  const pendingPayments = pendingResult.length > 0 ? pendingResult[0].total : 0

  // Get overdue payments (sum of all entries with status Overdue)
  const overdueResult = await db
    .collection(collections.ledger)
    .aggregate([{ $match: { status: "Overdue", companyId } }, { $group: { _id: null, total: { $sum: "$amount" } } }])
    .toArray()
  const overdueAmount = overdueResult.length > 0 ? overdueResult[0].total : 0

  // Get total products count
  const productsCount = await db.collection(collections.products).countDocuments({ companyId })

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
