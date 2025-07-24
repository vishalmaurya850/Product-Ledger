import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase, collections } from "@/lib/db"
import { ObjectId } from "mongodb"
import { handlePaymentCompletion, getCustomerFinancialStatus } from "@/lib/payment-completion"

// API to handle bulk payment completion and credit restoration
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { customerId, forceFullReset = false } = await request.json()
    const companyId = session.user.companyId
    const { db } = await connectToDatabase()

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    const customerObjectId = new ObjectId(customerId)

    // Get all unpaid entries for this customer
    const unpaidEntries = await db.collection(collections.ledger).find({
      customerId: customerObjectId,
      companyId,
      type: "Sell",
      status: { $ne: "Paid" }
    }).toArray()

    if (unpaidEntries.length === 0) {
      // No unpaid entries, ensure credit limit is restored to original
      const customerSettings = await db.collection(collections.customerSettings).findOne({
        customerId: customerObjectId,
        companyId,
      })

      if (customerSettings && forceFullReset) {
        const originalCreditLimit = customerSettings.originalCreditLimit || 10000
        
        await db.collection(collections.customerSettings).updateOne(
          { customerId: customerObjectId, companyId },
          {
            $set: {
              creditLimit: originalCreditLimit,
              creditUsed: 0,
              availableCredit: originalCreditLimit,
              totalOutstandingBalance: 0,
              updatedAt: new Date(),
            }
          }
        )

        return NextResponse.json({
          success: true,
          message: "Customer account fully reset - Outstanding balance: ₹0, Credit limit restored",
          customerStatus: {
            totalOutstanding: 0,
            creditLimit: originalCreditLimit,
            availableCredit: originalCreditLimit,
            creditUsed: 0
          }
        })
      }

      return NextResponse.json({
        success: true,
        message: "No unpaid entries found for customer",
        customerStatus: await getCustomerFinancialStatus(customerObjectId, companyId)
      })
    }

    // Process each unpaid entry for completion
    const results = []
    for (const entry of unpaidEntries) {
      const remainingAmount = entry.amount - (entry.paidAmount || 0)
      
      if (remainingAmount > 0) {
        const result = await handlePaymentCompletion(
          customerObjectId,
          companyId,
          entry._id,
          remainingAmount,
          session.user.id
        )
        results.push({
          entryId: entry._id,
          amount: remainingAmount,
          result
        })
      }
    }

    // Get final customer status
    const finalStatus = await getCustomerFinancialStatus(customerObjectId, companyId)

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} entries - Outstanding balance reset to ₹${finalStatus.totalOutstanding}`,
      processedEntries: results,
      customerStatus: finalStatus
    })

  } catch (error) {
    console.error("Bulk payment completion failed:", error)
    return NextResponse.json({ error: "Failed to process bulk payment completion" }, { status: 500 })
  }
}

// API to get customer financial status
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const url = new URL(request.url)
    const customerId = url.searchParams.get("customerId")
    const companyId = session.user.companyId

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 })
    }

    const status = await getCustomerFinancialStatus(customerId, companyId)

    return NextResponse.json({
      success: true,
      customerStatus: status
    })

  } catch (error) {
    console.error("Failed to get customer status:", error)
    return NextResponse.json({ error: "Failed to get customer status" }, { status: 500 })
  }
}
