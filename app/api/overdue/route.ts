import { NextResponse } from "next/server"
import { connectToDatabase, collections, calculateDaysElapsed, calculateDaysOverdue, calculateInterest } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic" // Disable caching


interface LedgerEntry {
  _id: string | object; // Adjust based on your database schema
  dueDate: string | Date;
  status: string;
  amount: number;
}

export async function GET(request: Request) {
  try {
    console.log("Overdue API route called")
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      console.log("Not authenticated")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get limit from query params if it exists
    const url = new URL(request.url)
    const limitParam = url.searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined

    const companyId = session.user.companyId || session.user.id
    console.log("Fetching overdue settings for company:", companyId)

    const { db } = await connectToDatabase()

    // Get overdue settings for this company
    const settings = (await db.collection(collections.overdueSettings).findOne({ companyId })) || {
      gracePeriod: 7,
      interestRate: 0.15, // 15% annual interest rate
      compoundingPeriod: "daily",
      minimumFee: 5,
      companyId,
    }

    console.log("Overdue settings:", settings)

    // Find all "Sell" entries that are unpaid (matching dashboard logic)
    const today = new Date()

    // Query for unpaid "Sell" entries (using entry date logic, not due date)
    const query = {
      companyId,
      type: "Sell",
      status: { $ne: "Paid" },
    }

    const allUnpaidEntries = await db
      .collection(collections.ledger)
      .find(query)
      .sort({ date: 1 })
      .toArray()

    console.log("All unpaid sell entries fetched:", allUnpaidEntries.length)

    // Filter and calculate for truly overdue entries (past grace period)
    const overdueEntries = []
    
    for (const entry of allUnpaidEntries) {
      // Get customer-specific settings
      const customerSettings = await db.collection(collections.customerSettings).findOne({
        customerId: entry.customerId,
        companyId,
      })

      const customerGracePeriod = customerSettings?.gracePeriod || settings.gracePeriod
      const customerInterestRate = customerSettings?.interestRate || settings.interestRate

      // Calculate days since entry date (matching dashboard and ledger logic)
      const daysCount = Math.floor((today.getTime() - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24))
      
      // Only include if truly overdue (past grace period)
      if (daysCount > customerGracePeriod) {
        // Calculate interest for overdue days
        const daysWithInterest = daysCount - customerGracePeriod
        const dailyRate = customerInterestRate / 365 / 100
        const interest = entry.amount * dailyRate * daysWithInterest
        
        overdueEntries.push({
          ...entry,
          daysElapsed: daysCount,
          daysOverdue: daysWithInterest,
          interest,
          totalDue: entry.amount + interest - (entry.partialPaymentAmount || 0),
          gracePeriod: customerGracePeriod,
          interestRate: customerInterestRate,
          dueDate: entry.dueDate || entry.date, // Use dueDate if available, otherwise use entry date
          overdueStartDate: (() => {
            const start = new Date(entry.date)
            start.setDate(start.getDate() + customerGracePeriod)
            return start
          })(),
          _id: entry._id.toString(),
        })
      }
    }
    
    // Apply limit if specified
    const limitedOverdueEntries = limit ? overdueEntries.slice(0, limit) : overdueEntries

    console.log("Filtered overdue entries:", limitedOverdueEntries.length)

    return NextResponse.json(limitedOverdueEntries)
  } catch (error) {
    console.error("Failed to fetch overdue entries:", error)
    return NextResponse.json({ error: "Failed to fetch overdue entries" }, { status: 500 })
  }
}