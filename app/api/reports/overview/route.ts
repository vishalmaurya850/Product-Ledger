import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    // Check if user has permission to view reports
    if (!session.user.permissions?.includes("reports_view")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }
    // Try to get companyId from session, fallback to query param
    let companyId = session.user.companyId
    if (!companyId) {
      const { searchParams } = new URL(request.url)
      companyId = searchParams.get("companyId") || ""
    }
    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }
    // Get data for the last 6 months
    const months = 6
    const chartData = []
    for (let i = 0; i < months; i++) {
      const date = subMonths(new Date(), i)
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)
      const monthName = format(date, "MMM")
      // Get sales for the month
      const salesResult = await db.ledgerEntry.aggregate({
        where: {
          companyId,
          type: "Sell",
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      })
      const sales = salesResult._sum.amount || 0
      // Get payments for the month
      const paymentsResult = await db.ledgerEntry.aggregate({
        where: {
          companyId,
          type: "Payment In",
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      })
      const payments = paymentsResult._sum.amount || 0
      // Get outstanding amount for the month
      const outstandingResult = await db.ledgerEntry.aggregate({
        where: {
          companyId,
          type: "Sell",
          status: { not: "Paid" },
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      })
      const outstanding = outstandingResult._sum.amount || 0
      chartData.unshift({
        name: monthName,
        sales,
        payments,
        outstanding,
      })
    }
    return NextResponse.json(chartData)
  } catch (error) {
    console.error("Failed to fetch overview data:", error)
    return NextResponse.json({ error: "Failed to fetch overview data" }, { status: 500 })
  }
}