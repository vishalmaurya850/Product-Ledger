import { NextResponse } from "next/server"
import { connectToDatabase, collections, calculateDaysElapsed, calculateDaysOverdue, calculateInterest } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic" // Disable caching


interface LedgerEntry {
  _id: string | Object; // Adjust based on your database schema
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

    // Find all entries that are past due date and not paid for this company
    const today = new Date()

    // Query for unpaid and overdue entries with due dates
    const query = {
      companyId,
      dueDate: { $lt: today },
      status: { $ne: "Paid" },
    }

    const overdueEntries = await db
      .collection(collections.ledger)
      .find(query)
      .sort({ dueDate: 1 })
      .limit(limit || 0)
      .toArray()

    console.log("Overdue entries fetched:", overdueEntries.length)

    // Calculate enhanced metrics for each overdue entry
    const entriesWithEnhancedData = await Promise.all(overdueEntries.map(async (entry: LedgerEntry) => {
      if (!entry.dueDate) {
        return {
          ...entry,
          daysElapsed: 0,
          daysOverdue: 0,
          interest: 0,
          totalDue: entry.amount,
          _id: entry._id.toString(),
        }
      }

      // Get customer-specific settings
      const customerSettings = await db.collection(collections.customerSettings).findOne({
        customerId: entry.customerId,
        companyId,
      })

      const customerGracePeriod = customerSettings?.gracePeriod || settings.gracePeriod
      const customerInterestRate = customerSettings?.interestRate || settings.interestRate

      const dueDate = new Date(entry.dueDate)
      const daysElapsed = calculateDaysElapsed(dueDate)
      const daysOverdue = calculateDaysOverdue(dueDate, customerGracePeriod)
      
      // Calculate interest only if actually overdue (past grace period)
      let interest = 0
      if (daysOverdue > 0) {
        interest = calculateInterest(entry.amount, daysOverdue, customerInterestRate)
        // Apply minimum fee if configured
        interest = Math.max(interest, settings.minimumFee || 0)
      }

      return {
        ...entry,
        daysElapsed,
        daysOverdue,
        interest,
        totalDue: entry.amount + interest,
        gracePeriod: customerGracePeriod,
        interestRate: customerInterestRate,
        overdueStartDate: daysOverdue > 0 && !entry.overdueStartDate ? 
          (() => {
            const start = new Date(dueDate)
            start.setDate(start.getDate() + customerGracePeriod)
            return start
          })() : entry.overdueStartDate,
        _id: entry._id.toString(),
      }
    }))

    console.log("Entries with enhanced data calculated:", entriesWithEnhancedData.length)

    return NextResponse.json(entriesWithEnhancedData)
  } catch (error) {
    console.error("Failed to fetch overdue entries:", error)
    return NextResponse.json({ error: "Failed to fetch overdue entries" }, { status: 500 })
  }
}