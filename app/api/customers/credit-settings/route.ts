import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
export const dynamic = "force-dynamic" // Disable caching
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const companyId = session.user.companyId || session.user.id
    // Get all customers for this company
    const customers = await db.customer.findMany({ where: { companyId } })
    // Get credit settings for each customer
    const customerSettings = await Promise.all(
      customers.map(async (customer) => {
        // Get credit settings
        const settings = await db.customerCreditSettings.findFirst({
          where: {
            customerId: customer.id,
            companyId,
          },
        }) || {
          creditLimit: 10000,
          gracePeriod: 30,
          interestRate: 18,
        }
        // Get ledger entries for this customer to calculate credit used
        const ledgerEntries = await db.ledgerEntry.findMany({
          where: {
            customerId: customer.id,
            companyId,
            status: { not: "Paid" },
          },
        })
        // Calculate credit used
        let creditUsed = 0
        ledgerEntries.forEach((entry) => {
          if (entry.type === "Sell") {
            creditUsed += entry.amount
          } else if (entry.type === "Payment In") {
            creditUsed -= entry.amount
          }
        })
        // Calculate available credit
        const availableCredit = settings.creditLimit - creditUsed
        return {
          customerId: customer.id,
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