import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
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

    // Update the original entry
    const updateData: any = {
      paidAmount: newPaidAmount,
      status: isFullyPaid ? "Paid" : "Partially Paid",
      updatedAt: new Date(),
    }

    if (isFullyPaid) {
      updateData.settledAt = new Date()
    }

    await db.collection(collections.ledger).updateOne({ _id: new ObjectId(entryId) }, { $set: updateData })

    // Create payment entry
    const paymentEntry = {
      _id: new ObjectId(),
      companyId,
      customerId: originalEntry.customerId,
      type: "Payment In",
      amount: settlementAmount,
      description: `Payment for ${originalEntry.description} (Invoice: ${entryId})`,
      status: "Paid",
      paymentMethod,
      relatedEntryId: entryId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection(collections.ledger).insertOne(paymentEntry)

    // Update customer credit limit based on payment behavior
    const customer = await db.collection(collections.customers).findOne({
      _id: new ObjectId(originalEntry.customerId),
      companyId,
    })

    if (customer && customer.creditSettings) {
      let creditIncrease = 0
      const currentLimit = customer.creditSettings.creditLimit

      // Determine credit increase based on payment behavior
      if (isFullyPaid) {
        if (originalEntry.status === "Overdue") {
          // Overdue payment settled - moderate increase
          creditIncrease = currentLimit * 0.02 // 2% increase
        } else {
          // On-time payment - good increase
          creditIncrease = currentLimit * 0.05 // 5% increase
        }
      } else {
        // Partial payment - small increase
        creditIncrease = currentLimit * 0.01 // 1% increase
      }

      if (creditIncrease > 0) {
        const newCreditLimit = currentLimit + creditIncrease

        await db.collection(collections.customers).updateOne(
          { _id: new ObjectId(originalEntry.customerId) },
          {
            $set: {
              "creditSettings.creditLimit": Number.parseFloat(newCreditLimit.toFixed(2)),
              updatedAt: new Date(),
            },
          },
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment settled successfully",
      settlementAmount,
      remainingAmount: originalEntry.amount - newPaidAmount,
      isFullyPaid,
    })
  } catch (error) {
    console.error("Failed to settle payment:", error)
    return NextResponse.json({ error: "Failed to settle payment" }, { status: 500 })
  }
}
