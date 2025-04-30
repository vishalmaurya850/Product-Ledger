import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { differenceInDays } from "date-fns"

interface LedgerEntry {
  amount: number;
  dueDate: string;
  status: string;
  [key: string]: unknown; // Add additional fields if necessary
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.id
    const { db } = await connectToDatabase()

    // Get overdue settings
    const settings = (await db.collection(collections.overdueSettings).findOne({ companyId })) || {
      gracePeriod: 7,
      interestRate: 0.15, // 15% annual interest rate
      compoundingPeriod: "daily",
      minimumFee: 5,
      companyId,
    }

    // Find all entries that are past due date and not paid
    const today = new Date()
    const overdueEntries = (await db
      .collection(collections.ledger)
      .find({
        companyId,
        dueDate: { $lt: today },
        status: { $ne: "Paid" },
      })
      .sort({ dueDate: 1 })
      .toArray())
      .map((doc: { amount: number; dueDate: string; status: string; [key: string]: unknown }) => ({
        ...doc,
      })) as LedgerEntry[]

    // Group by days overdue ranges
    const ranges = [
      { name: "1-7 days", min: 1, max: 7, amount: 0, interest: 0 },
      { name: "15-30 days", min: 15, max: 30, amount: 0, interest: 0 },
      { name: "31-60 days", min: 31, max: 60, amount: 0, interest: 0 },
      { name: "60+ days", min: 61, max: Number.POSITIVE_INFINITY, amount: 0, interest: 0 },
    ]

    // Calculate interest for each overdue entry and add to appropriate range
    overdueEntries.forEach((entry: LedgerEntry) => {
      const dueDate = new Date(entry.dueDate)
      const daysOverdue = differenceInDays(today, dueDate)

      // Calculate interest
      const effectiveDaysOverdue = Math.max(0, daysOverdue - settings.gracePeriod)
      const dailyRate = settings.interestRate / 365

      let interest = 0
      if (effectiveDaysOverdue > 0) {
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
      }

      // Add to appropriate range
      for (const range of ranges) {
        if (daysOverdue >= range.min && daysOverdue <= range.max) {
          range.amount += entry.amount
          range.interest += interest
          break
        }
      }
    })

    return NextResponse.json(ranges)
  } catch (error) {
    console.error("Failed to fetch overdue report:", error)
    return NextResponse.json({ error: "Failed to fetch overdue report" }, { status: 500 })
  }
}