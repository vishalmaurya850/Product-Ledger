import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase, collections } from "@/lib/db"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const customerId = params.id
    const companyId = session.user.companyId
    const { db } = await connectToDatabase()

    // Get all ledger entries for this customer
    const ledgerEntries = await db
      .collection(collections.ledger)
      .find({
        companyId,
        customerId,
        status: { $ne: "Cancelled" },
      })
      .toArray()

    let balance = 0

    // Calculate balance based on transaction types
    for (const entry of ledgerEntries) {
      switch (entry.type) {
        case "Sell":
          // Customer owes money (positive balance)
          if (entry.status === "Paid") {
            // Already paid, no effect on balance
            balance += 0
          } else if (entry.status === "Partially Paid") {
            // Add remaining amount
            const paidAmount = entry.paidAmount || 0
            balance += entry.amount - paidAmount
          } else {
            // Full amount owed
            balance += entry.amount
          }
          break

        case "Buy":
          // Company owes customer money (negative balance)
          if (entry.status === "Paid") {
            balance -= 0
          } else if (entry.status === "Partially Paid") {
            const paidAmount = entry.paidAmount || 0
            balance -= entry.amount - paidAmount
          } else {
            balance -= entry.amount
          }
          break

        case "Payment In":
          // Customer paid money (reduces positive balance)
          balance -= entry.amount
          break

        case "Payment Out":
          // Company paid customer (increases negative balance)
          balance += entry.amount
          break

        default:
          break
      }
    }

    // Get customer's credit settings
    const customer = await db.collection(collections.customers).findOne({
      _id: new ObjectId(customerId),
      companyId,
    })

    const creditLimit = customer?.creditSettings?.creditLimit || 0
    const availableCredit = Math.max(0, creditLimit - Math.max(0, balance))

    return NextResponse.json({
      balance: Number.parseFloat(balance.toFixed(2)),
      creditLimit,
      availableCredit: Number.parseFloat(availableCredit.toFixed(2)),
      creditUtilization:
        creditLimit > 0 ? Number.parseFloat(((Math.max(0, balance) / creditLimit) * 100).toFixed(2)) : 0,
    })
  } catch (error) {
    console.error("Failed to calculate customer balance:", error)
    return NextResponse.json({ error: "Failed to calculate balance" }, { status: 500 })
  }
}