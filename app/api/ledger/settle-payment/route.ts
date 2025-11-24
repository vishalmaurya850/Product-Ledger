import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const { entryId, amount, paymentMethod = "Cash" } = await request.json()
    if (!entryId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid payment data" }, { status: 400 })
    }
    const companyId = session.user.companyId
    const userId = session.user.id
    // Get the original entry
    const originalEntry = await db.ledgerEntry.findUnique({
      where: { id: entryId },
    })
    if (!originalEntry || originalEntry.companyId !== companyId) {
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
    }
    if (isFullyPaid) {
      updateData.settledAt = new Date()
    }
    await db.ledgerEntry.update({
      where: { id: entryId },
      data: updateData,
    })
    // Create payment entry
    await db.ledgerEntry.create({
      data: {
        companyId,
        customerId: originalEntry.customerId,
        type: "Payment In",
        invoiceNumber: `PAY-${Date.now()}`,
        amount: settlementAmount,
        description: `Payment for ${originalEntry.description} (Invoice: ${entryId})`,
        status: "Paid",
        paymentMethod,
        relatedEntryId: entryId,
        date: new Date(),
        createdBy: userId,
      },
    })
    // Update customer credit limit based on payment behavior
    const customer = await db.customer.findUnique({
      where: { id: originalEntry.customerId },
      include: {
        customerCreditSettings: true,
      },
    })
    if (customer?.customerCreditSettings?.[0]) {
      let creditIncrease = 0
      const currentLimit = customer.customerCreditSettings[0].creditLimit
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
        await db.customerCreditSettings.update({
          where: {
            customerId_companyId: {
              customerId: originalEntry.customerId,
              companyId,
            },
          },
          data: {
            creditLimit: Number.parseFloat(newCreditLimit.toFixed(2)),
          },
        })
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
