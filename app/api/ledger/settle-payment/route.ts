import { NextResponse } from "next/server"
import { connectToDatabase, collections, logStatusChange } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"
import { handlePaymentCompletion, getCustomerFinancialStatus } from "@/lib/payment-completion"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { entryId, amount, paymentMethod = "Cash" } = await request.json()

    if (!entryId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 })
    }

    const companyId = session.user.companyId
    const { db } = await connectToDatabase()

    // Get the original entry
    const originalEntry = await db.collection(collections.ledger).findOne({
      _id: new ObjectId(entryId),
      companyId,
    })

    if (!originalEntry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    // Calculate current paid amount
    const currentPaidAmount = originalEntry.paidAmount || 0
    const remainingAmount = originalEntry.amount - currentPaidAmount
    const settlementAmount = Math.min(amount, remainingAmount)

    if (settlementAmount <= 0) {
      return NextResponse.json({ error: "Entry is already fully paid" }, { status: 400 })
    }

    const newPaidAmount = currentPaidAmount + settlementAmount
    const isFullyPaid = newPaidAmount >= originalEntry.amount
    const oldStatus = originalEntry.status

    // Store original credit limit in the ledger entry if not already stored
    if (!originalEntry.originalCreditLimit) {
      const customerSettings = await db.collection(collections.customerSettings).findOne({
        customerId: originalEntry.customerId,
        companyId,
      })
      
      const originalCreditLimit = customerSettings?.creditLimit || 10000
      
      await db.collection(collections.ledger).updateOne(
        { _id: new ObjectId(entryId) },
        {
          $set: {
            originalCreditLimit: originalCreditLimit
          }
        }
      )
    }

    // Update the entry with payment
    await db.collection(collections.ledger).updateOne(
      { _id: new ObjectId(entryId) }, 
      { 
        $set: {
          paidAmount: newPaidAmount,
          status: isFullyPaid ? "Paid" : "Partially Paid",
          updatedAt: new Date(),
          ...(isFullyPaid && { paidDate: new Date() })
        }
      }
    )

    // Create payment entry
    const paymentEntry = {
      _id: new ObjectId(),
      companyId,
      customerId: originalEntry.customerId,
      type: "Payment In",
      amount: settlementAmount,
      description: `Payment for ${originalEntry.description} (Invoice: ${originalEntry.invoiceNumber || entryId})`,
      status: "Paid",
      paymentMethod,
      relatedEntryId: entryId,
      date: new Date(),
      paidDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection(collections.ledger).insertOne(paymentEntry)

    // Handle payment completion if fully paid
    let paymentCompletionResult = null
    if (isFullyPaid) {
      paymentCompletionResult = await handlePaymentCompletion(
        originalEntry.customerId,
        companyId,
        entryId,
        settlementAmount,
        session.user.id
      )
    }

    // Get updated customer financial status
    const customerStatus = await getCustomerFinancialStatus(
      originalEntry.customerId,
      companyId
    )

    return NextResponse.json({
      success: true,
      message: isFullyPaid ? "Payment completed successfully - Outstanding balance reset to ₹0" : "Payment settled successfully",
      settlementAmount,
      remainingAmount: originalEntry.amount - newPaidAmount,
      isFullyPaid,
      newStatus: isFullyPaid ? "Paid" : "Partially Paid",
      paymentCompletion: paymentCompletionResult,
      customerFinancialStatus: {
        totalOutstanding: customerStatus.totalOutstanding,
        creditLimit: customerStatus.creditLimit,
        availableCredit: customerStatus.availableCredit,
        creditUsed: customerStatus.creditUsed
      }
    })
  } catch (error) {
    console.error("Failed to settle payment:", error)
    return NextResponse.json({ error: "Failed to settle payment" }, { status: 500 })
  }
}
