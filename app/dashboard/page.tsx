import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase, collections } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { OverdueWidget } from "@/components/dashboard/overdue-widget"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Users, Package, AlertTriangle } from "lucide-react"
import { autoUpdateStatuses } from "@/lib/auto-status-update"

export default async function DashboardPage() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  // Run automatic status updates when dashboard loads
  try {
    const autoUpdateResult = await autoUpdateStatuses()
    if (autoUpdateResult.success && (autoUpdateResult.updatedCount || 0) > 0) {
      console.log(`🔄 Dashboard Auto-Update: ${autoUpdateResult.updatedCount || 0} entries updated automatically`)
    }
  } catch (error) {
    console.error("Auto-update on dashboard load failed:", error)
  }

  // Get company data
  const { db } = await connectToDatabase()
  const companyId = session.user.companyId || session.user.id

  // Get total customers
  const totalCustomers = await db.collection(collections.customers).countDocuments({ companyId })

  // Get total products
  const totalProducts = await db.collection(collections.products).countDocuments({ companyId })

  // Get total ledger entries
  const totalLedgerEntries = await db.collection(collections.ledger).countDocuments({ companyId })

  // Get total sales amount
  const salesResult = await db
    .collection(collections.ledger)
    .aggregate([{ $match: { companyId, type: "Sell" } }, { $group: { _id: null, total: { $sum: "$amount" } } }])
    .toArray()

  const totalSales = salesResult.length > 0 ? salesResult[0].total : 0

  // Get total payments received
  const paymentsResult = await db
    .collection(collections.ledger)
    .aggregate([{ $match: { companyId, type: "Payment In" } }, { $group: { _id: null, total: { $sum: "$amount" } } }])
    .toArray()

  const totalPayments = paymentsResult.length > 0 ? paymentsResult[0].total : 0

  // Get total outstanding amount
  const outstandingResult = await db
    .collection(collections.ledger)
    .aggregate([
      { $match: { companyId, type: "Sell", status: { $ne: "Paid" } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])
    .toArray()

  const totalOutstanding = outstandingResult.length > 0 ? outstandingResult[0].total : 0

  // Get total overdue amount using ledger logic (days since entry date)
  const overdueSettings = (await db.collection(collections.overdueSettings).findOne({ companyId })) || {
    gracePeriod: 30,
    interestRate: 18, // 18% annual interest rate
    minimumFee: 5,
  }

  // Get all "Sell" entries that are unpaid (matching ledger logic)
  const today = new Date()
  const potentialOverdueEntries = await db
    .collection(collections.ledger)
    .find({ 
      companyId, 
      type: "Sell",
      status: { $ne: "Paid" } 
    })
    .toArray()

  let totalOverdue = 0
  let overdueCount = 0

  // Calculate overdue using same logic as ledger table
  for (const entry of potentialOverdueEntries) {
    // Get customer-specific settings if available
    const customerSettings = await db.collection(collections.customerSettings).findOne({
      customerId: entry.customerId,
      companyId,
    })

    const gracePeriod = customerSettings?.gracePeriod || overdueSettings.gracePeriod
    const interestRate = customerSettings?.interestRate || overdueSettings.interestRate

    // Calculate days since entry date (not due date)
    const daysCount = Math.floor((today.getTime() - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24))
    
    // Check if truly overdue (past grace period)
    if (daysCount > gracePeriod) {
      // Calculate interest for overdue days
      const daysWithInterest = daysCount - gracePeriod
      const dailyRate = interestRate / 365 / 100
      const interest = entry.amount * dailyRate * daysWithInterest
      
      // Add to overdue amount (original amount + interest - any partial payments)
      const entryOverdueAmount = entry.amount + interest - (entry.partialPaymentAmount || 0)
      totalOverdue += entryOverdueAmount
      overdueCount++
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{totalLedgerEntries} transactions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers}</div>
                <p className="text-xs text-muted-foreground">{totalPayments.toFixed(2)} in payments</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground">In inventory</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">₹{totalOverdue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{overdueCount} overdue entries</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales and payment trends</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview companyId={companyId} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales companyId={companyId} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Payments</CardTitle>
              <CardDescription>Manage overdue payments and credit settings</CardDescription>
            </CardHeader>
            <CardContent>
              <OverdueWidget companyId={companyId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}