import { NextResponse } from "next/server"
import { connectToDatabase, collections, Customer } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic" // Disable caching

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId || session.user.id
    const { db } = await connectToDatabase()

    // Get all customers for this company
    const customers = await db.collection(collections.customers).find({ companyId }).toArray()

    // Get credit settings for each customer
    const customerSettings = await Promise.all(
      customers.map(async (customer:Customer) => {
        // Get credit settings
        const settings = (await db.collection(collections.customerSettings).findOne({
          customerId: customer._id,
          companyId,
        })) || {
          creditLimit: 10000,
          gracePeriod: 30,
          interestRate: 18,
        }

        // Get ledger entries for this customer to calculate credit used
        const ledgerEntries = await db
          .collection(collections.ledger)
          .find({
            customerId: customer._id,
            companyId,
            status: { $ne: "Paid" },
          })
          .toArray()

        // Calculate credit used
        let creditUsed = 0
        ledgerEntries.forEach((entry: { type: string; amount: number }) => {
          if (entry.type === "Sell") {
            creditUsed += entry.amount
          } else if (entry.type === "Payment In") {
            creditUsed -= entry.amount
          }
        })

        // Calculate available credit
        const availableCredit = settings.creditLimit - creditUsed

        return {
          customerId: customer._id ? customer._id.toString() : "",
          customerName: customer.name,
          creditLimit: settings.creditLimit,
          gracePeriod: settings.gracePeriod,
          interestRate: settings.interestRate,
          creditUsed,
          availableCredit,
        }
      }),
    )

    return NextResponse.json(customerSettings)
  } catch (error) {
    console.error("Failed to fetch customer credit settings:", error)
    return NextResponse.json({ error: "Failed to fetch customer credit settings" }, { status: 500 })
  }
}