import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { startOfMonth, endOfMonth, format, subMonths } from "date-fns"
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const companyId = session.user.companyId
    try {
      // Get data for the last 6 months
      const months = []
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i)
        const start = startOfMonth(date)
        const end = endOfMonth(date)
        // Get cash in for this month (Sell entries that are paid)
        const cashInResult = await db.ledgerEntry.aggregate({
          where: {
            companyId,
            type: "Sell",
            status: "Paid",
            date: { gte: start, lte: end },
          },
          _sum: { amount: true },
        })
        // Get cash out for this month (Payment Out entries)
        const cashOutResult = await db.ledgerEntry.aggregate({
          where: {
            companyId,
            type: "Payment Out",
            date: { gte: start, lte: end },
          },
          _sum: { amount: true },
        })
        months.push({
          name: format(date, "MMM yyyy"),
          cashIn: cashInResult._sum.amount || 0,
          cashOut: cashOutResult._sum.amount || 0,
        })
      }
      return NextResponse.json(months)
    } catch (error) {
      console.error("Database error:", error)
      // Return mock data if database connection fails
      const months = []
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i)
        months.push({
          name: format(date, "MMM yyyy"),
          cashIn: 0,
          cashOut: 0,
        })
      }
      return NextResponse.json(months)
    }
  } catch (error) {
    console.error("Failed to fetch revenue report:", error)
    return NextResponse.json({ error: "Failed to fetch revenue report" }, { status: 500 })
  }
}