import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { startOfMonth, endOfMonth, format, subMonths } from "date-fns"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.id

    try {
      const { db } = await connectToDatabase()

      // Get data for the last 6 months
      const months = []
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i)
        const start = startOfMonth(date)
        const end = endOfMonth(date)

        // Get cash in for this month
        const cashInResult = await db
          .collection(collections.ledger)
          .aggregate([
            {
              $match: {
                companyId,
                type: "Cash In",
                date: { $gte: start, $lte: end },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ])
          .toArray()

        // Get cash out for this month
        const cashOutResult = await db
          .collection(collections.ledger)
          .aggregate([
            {
              $match: {
                companyId,
                type: "Cash Out",
                date: { $gte: start, $lte: end },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ])
          .toArray()

        months.push({
          name: format(date, "MMM yyyy"),
          cashIn: cashInResult.length > 0 ? cashInResult[0].total : 0,
          cashOut: cashOutResult.length > 0 ? cashOutResult[0].total : 0,
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