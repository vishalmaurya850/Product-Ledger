import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic" // Disable caching

interface LedgerEntry {
  _id: ObjectId;
  customerId: ObjectId;
  type: "Sell" | "Payment In" | "Payment Out";
  amount: number;
  date: string;
  status: "Paid" | "Unpaid" | "Overdue";
  paidDate?: string;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId || session.user.id
    const customerId = resolvedParams.id

    console.log(`Fetching ledger entries for customer ${customerId} and company ${companyId}`)

    const { db } = await connectToDatabase()

    // Validate customerId is a valid ObjectId
    let customerObjectId
    try {
      customerObjectId = new ObjectId(customerId)
    } catch {
      return NextResponse.json({ error: "Invalid customer ID format" }, { status: 400 })
    }

    // Get customer credit settings
    const creditSettings = (await db.collection(collections.customerSettings).findOne({
      customerId: customerObjectId,
      companyId,
    })) || { creditLimit: 10000, gracePeriod: 30, interestRate: 18 }

    console.log(`Credit settings for customer ${customerId}:`, creditSettings)

    // Get all ledger entries for this customer
    const ledgerEntries = await db
      .collection(collections.ledger)
      .find({
        customerId: customerObjectId,
        companyId,
      })
      .sort({ date: -1 })
      .toArray()

    console.log(`Found ${ledgerEntries.length} ledger entries for customer ${customerId}`)

    // Process entries to calculate balances, days count, and interest
    const today = new Date()
    // Removed unused variable 'runningBalance'

    const processedEntries = ledgerEntries.map((entry:LedgerEntry) => {
      // // Update running balance based on entry type
      // if (entry.type === "Sell") {
      //   runningBalance += entry.amount
      // } else if (entry.type === "Payment In") {
      //   runningBalance -= entry.amount
      // } else if (entry.type === "Payment Out") {
      //   runningBalance += entry.amount
      // }

      // Calculate days count based on status
      let daysCount = 0
      let interest = 0
      let status = entry.status

      if (entry.status === "Paid" && entry.paidDate) {
        // For paid entries: days between paidDate and date (fixed count)
        const paidDate = new Date(entry.paidDate)
        const entryDate = new Date(entry.date)
        daysCount = Math.floor((paidDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      } else {
        // For unpaid/overdue entries: days between today and date (ongoing count)
        const entryDate = new Date(entry.date)
        daysCount = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

        // Update status to Overdue if past grace period
        if (daysCount > creditSettings.gracePeriod) {
          status = "Overdue"

          // Calculate interest for overdue entries
          const daysWithInterest = daysCount - creditSettings.gracePeriod
          const dailyRate = creditSettings.interestRate / 365 / 100
          interest = entry.amount * dailyRate * daysWithInterest
        }
      }

      // Calculate balance based on status
      const balance = status === "Paid" ? 0 : entry.type === "Sell" ? entry.amount + interest : 0

      return {
        ...entry,
        _id: entry._id.toString(),
        customerId: entry.customerId.toString(),
        daysCount,
        interest,
        status,
        balance,
      }
    })

    return NextResponse.json(processedEntries, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
      },
    })
  } catch (error) {
    console.error("Failed to fetch customer ledger entries:", error)
    return NextResponse.json({ error: "Failed to fetch customer ledger entries" }, { status: 500 })
  }
}