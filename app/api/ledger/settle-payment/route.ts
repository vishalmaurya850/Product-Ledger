import { NextResponse } from "next/server"
import { connectToDatabase, collections, logStatusChange } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

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

    // Get customer credit settings for credit limit restoration
    const customerSettings = await db.collection(collections.customerSettings).findOne({
      customerId: originalEntry.customerId,
      companyId,
    })

    const defaultSettings = {
      creditLimit: 10000,
      gracePeriod: 30,
      interestRate: 18,
    }

    const settings = customerSettings || defaultSettings

    // Update the original entry with enhanced payment tracking
    const updateData: any = {
      paidAmount: newPaidAmount,
      status: isFullyPaid ? "Paid" : "Partially Paid",
      updatedAt: new Date(),
      daysElapsed: 0, // Reset days elapsed when paid
      accruedInterest: 0, // Reset accrued interest when paid
    }

    if (isFullyPaid) {
      updateData.paidDate = new Date()
      updateData.overdueStartDate = null // Clear overdue start date
    }

    await db.collection(collections.ledger).updateOne(
      { _id: new ObjectId(entryId) }, 
      { $set: updateData }
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

    // Handle credit limit restoration on full payment
    let creditLimitChange = 0
    if (isFullyPaid) {
      // Restore credit limit to original value if stored, or increase based on payment behavior
      if (originalEntry.originalCreditLimit && originalEntry.originalCreditLimit > settings.creditLimit) {
        // Restore to original credit limit before the transaction
        creditLimitChange = originalEntry.originalCreditLimit - settings.creditLimit
        
        await db.collection(collections.customerSettings).updateOne(
          { customerId: originalEntry.customerId, companyId },
          {
            $set: {
              creditLimit: originalEntry.originalCreditLimit,
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        )
      } else {
        // Apply credit increase based on payment behavior
        const currentLimit = settings.creditLimit
        let creditIncrease = 0

        if (oldStatus === "Overdue") {
          // Overdue payment settled - moderate increase
          creditIncrease = currentLimit * 0.02 // 2% increase
        } else {
          // On-time payment - good increase  
          creditIncrease = currentLimit * 0.05 // 5% increase
        }

        if (creditIncrease > 0) {
          const newCreditLimit = currentLimit + creditIncrease
          creditLimitChange = creditIncrease

          await db.collection(collections.customerSettings).updateOne(
            { customerId: originalEntry.customerId, companyId },
            {
              $set: {
                creditLimit: Number.parseFloat(newCreditLimit.toFixed(2)),
                updatedAt: new Date(),
              },
            },
            { upsert: true }
          )
        }
      }
    }

    // Log status change
    if (isFullyPaid) {
      await logStatusChange(
        db,
        new ObjectId(entryId),
        originalEntry.customerId,
        oldStatus,
        "Paid",
        `Full payment of ₹${settlementAmount} via ${paymentMethod}`,
        companyId,
        session.user.id,
        0, // No interest when paid
        creditLimitChange
      )
    }

    return NextResponse.json({
      success: true,
      message: "Payment settled successfully",
      settlementAmount,
      remainingAmount: originalEntry.amount - newPaidAmount,
      isFullyPaid,
      creditLimitChange,
      newStatus: isFullyPaid ? "Paid" : "Partially Paid",
    })
  } catch (error) {
    console.error("Failed to settle payment:", error)
    return NextResponse.json({ error: "Failed to settle payment" }, { status: 500 })
  }
}
