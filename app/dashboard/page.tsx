import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { OverdueWidget } from "@/components/dashboard/overdue-widget"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  const companyId = session.user.companyId

  // Get stats
  const totalCustomers = await db.customer.count({ where: { companyId } })
  const totalProducts = await db.product.count({ where: { companyId } })
  const totalLedgerEntries = await db.ledgerEntry.count({ where: { companyId } })

  const salesResult = await db.ledgerEntry.aggregate({
    where: { companyId, type: "Sell" },
    _sum: { amount: true },
  })
  const totalSales = salesResult._sum.amount || 0

  const paymentsResult = await db.ledgerEntry.aggregate({
    where: { companyId, type: "Payment In" },
    _sum: { amount: true },
  })
  const totalPayments = paymentsResult._sum.amount || 0

  const overdueResult = await db.ledgerEntry.aggregate({
    where: { companyId, status: "Overdue" },
    _sum: { amount: true },
  })
  const totalOverdue = overdueResult._sum.amount || 0
  const overdueCount = await db.ledgerEntry.count({ where: { companyId, status: "Overdue" } })

  return (
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-display-lg text-[var(--ink)]">Dashboard</h1>
        <p className="text-[17px] tracking-[-0.374px] text-[var(--body-muted)] mt-1">
          Business overview at a glance.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Sales"
              value={`₹${totalSales.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
              subtitle={`${totalLedgerEntries} transactions`}
            />
            <StatCard
              title="Customers"
              value={totalCustomers.toString()}
              subtitle={`₹${totalPayments.toLocaleString("en-IN", { minimumFractionDigits: 2 })} in payments`}
            />
            <StatCard
              title="Products"
              value={totalProducts.toString()}
              subtitle="In inventory"
            />
            <StatCard
              title="Overdue"
              value={`₹${totalOverdue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
              subtitle={`${overdueCount} overdue entries`}
              accent
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales and payment trends</CardDescription>
              </CardHeader>
              <CardContent>
                <Overview companyId={companyId} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
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

function StatCard({
  title,
  value,
  subtitle,
  accent = false,
}: {
  title: string
  value: string
  subtitle: string
  accent?: boolean
}) {
  return (
    <div className="rounded-[18px] border border-[var(--hairline)] bg-[var(--canvas)] p-5">
      <p className="text-[12px] font-semibold tracking-[-0.12px] text-[var(--ink-muted-48)] uppercase">
        {title}
      </p>
      <p className={`mt-2 text-[28px] font-semibold tracking-[-0.28px] leading-[1.14] ${accent ? "text-[#ff3b30]" : "text-[var(--ink)]"}`}>
        {value}
      </p>
      <p className="mt-1 text-[12px] tracking-[-0.12px] text-[var(--ink-muted-48)]">
        {subtitle}
      </p>
    </div>
  )
}
