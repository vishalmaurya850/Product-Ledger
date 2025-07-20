import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
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

    // First try with companyId filter
    const query = {
      dueDate: { $lt: today },
      status: { $ne: "Paid" },
    }

    const overdueEntries = await db
      .collection(collections.ledger)
      .find(query)
      .sort({ dueDate: 1 })
      .limit(limit || 0) // Apply limit if provided
      .toArray()

    console.log("Overdue entries fetched:", overdueEntries.length)

    // Calculate interest for each overdue entry
    const entriesWithInterest = overdueEntries.map((entry:LedgerEntry) => {
      const dueDate = new Date(entry.dueDate)
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

      // Only apply interest after grace period
      if (daysOverdue <= settings.gracePeriod) {
        return {
          ...entry,
          daysOverdue,
          interest: 0,
          totalDue: entry.amount,
          _id: entry._id.toString(), // Convert ObjectId to string
        }
      }

      // Calculate interest based on settings
      const effectiveDaysOverdue = daysOverdue - settings.gracePeriod
      const dailyRate = settings.interestRate / 365

      let interest = 0
      if (settings.compoundingPeriod === "daily") {
        interest = entry.amount * (Math.pow(1 + dailyRate, effectiveDaysOverdue) - 1)
      } else if (settings.compoundingPeriod === "weekly") {
        const weeks = Math.floor(effectiveDaysOverdue / 7)
        const remainingDays = effectiveDaysOverdue % 7
        const weeklyRate = dailyRate * 7
        interest = entry.amount * (Math.pow(1 + weeklyRate, weeks) * (1 + dailyRate * remainingDays) - 1)
      } else {
        // monthly
        const months = Math.floor(effectiveDaysOverdue / 30)
        const remainingDays = effectiveDaysOverdue % 30
        const monthlyRate = dailyRate * 30
        interest = entry.amount * (Math.pow(1 + monthlyRate, months) * (1 + dailyRate * remainingDays) - 1)
      }

      // Apply minimum fee if needed
      interest = Math.max(interest, settings.minimumFee)

      return {
        ...entry,
        daysOverdue,
        interest,
        totalDue: entry.amount + interest,
        _id: entry._id.toString(), // Convert ObjectId to string
      }
    })

    console.log("Entries with interest calculated:", entriesWithInterest.length)

    return NextResponse.json(entriesWithInterest)
  } catch (error) {
    console.error("Failed to fetch overdue entries:", error)
    return NextResponse.json({ error: "Failed to fetch overdue entries" }, { status: 500 })
  }
}