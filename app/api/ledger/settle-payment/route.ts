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

    const companyId = session.user.companyId || session.user.id
    const data = await request.json()

    const { paymentEntryId, unpaidEntryId, settlementAmount, remainingCredit, isFullPayment } = data

    if (!paymentEntryId || !unpaidEntryId || !settlementAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log(
      `Processing payment settlement: Payment ID ${paymentEntryId}, Unpaid ID ${unpaidEntryId}, Amount ${settlementAmount}, Full Payment: ${isFullPayment}`,
    )

    const { db } = await connectToDatabase()

    // Get the unpaid entry
    const unpaidEntry = await db.collection(collections.ledger).findOne({
      _id: new ObjectId(unpaidEntryId),
      companyId,
    })

    if (!unpaidEntry) {
      return NextResponse.json({ error: "Unpaid entry not found" }, { status: 404 })
    }

    // Get the payment entry
    const paymentEntry = await db.collection(collections.ledger).findOne({
      _id: new ObjectId(paymentEntryId),
      companyId,
    })

    if (!paymentEntry) {
      return NextResponse.json({ error: "Payment entry not found" }, { status: 404 })
    }

    // Calculate the total amount due for the unpaid entry
    let totalDue = unpaidEntry.amount
    let interest = 0

    if (unpaidEntry.status === "Overdue") {
      // Get customer settings for interest calculation
      const customerSettings = (await db.collection(collections.customerSettings).findOne({
        customerId: new ObjectId(unpaidEntry.customerId),
        companyId,
      })) || { gracePeriod: 30, interestRate: 18 }

      const today = new Date()
      const entryDate = new Date(unpaidEntry.date)
      const daysDifference = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      const daysOverdue = Math.max(0, daysDifference - customerSettings.gracePeriod)

      if (daysOverdue > 0) {
        const dailyRate = customerSettings.interestRate / 365 / 100
        interest = unpaidEntry.amount * dailyRate * daysOverdue
        totalDue += interest
      }
    }

    // Check if settlement amount covers the full amount
    const isFullSettlement = settlementAmount >= totalDue

    if (isFullSettlement || isFullPayment) {
      // Mark the unpaid entry as paid
      await db.collection(collections.ledger).updateOne(
        { _id: new ObjectId(unpaidEntryId) },
        {
          $set: {
            status: "Paid",
            paidDate: new Date(),
            updatedAt: new Date(),
            paidAmount: totalDue,
            interest: interest,
          },
        },
      )

      console.log(`Marked entry ${unpaidEntryId} as fully paid`)

      // If there's remaining credit, update customer's credit limit
      if (remainingCredit > 0) {
        // Get customer settings
        const customerSettings = await db.collection(collections.customerSettings).findOne({
          customerId: new ObjectId(unpaidEntry.customerId),
          companyId,
        })

        if (customerSettings) {
          await db.collection(collections.customerSettings).updateOne(
            { customerId: new ObjectId(unpaidEntry.customerId), companyId },
            {
              $set: {
                creditLimit: customerSettings.creditLimit + remainingCredit,
                updatedAt: new Date(),
              },
            },
          )

          console.log(`Updated credit limit for customer ${unpaidEntry.customerId} by adding ${remainingCredit}`)
        }
      }

      return NextResponse.json({
        success: true,
        message: "Payment fully settled",
        remainingCredit: remainingCredit,
      })
    } else {
      // Handle partial payment
      console.log(`Processing partial payment of ${settlementAmount} for entry ${unpaidEntryId}`)

      // Create a partial payment record
      const partialPaymentRecord = {
        customerId: new ObjectId(unpaidEntry.customerId),
        type: "Partial Payment",
        invoiceNumber: `PP-${unpaidEntry.invoiceNumber}`,
        amount: settlementAmount,
        date: new Date(),
        description: `Partial payment for invoice #${unpaidEntry.invoiceNumber}`,
        status: "Paid",
        paidDate: new Date(),
        relatedEntryId: new ObjectId(unpaidEntryId),
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: companyId,
        createdBy: session.user.id,
      }

      const result = await db.collection(collections.ledger).insertOne(partialPaymentRecord)
      console.log(`Created partial payment record with ID ${result.insertedId}`)

      // Update the original entry to reflect the partial payment
      const remainingDue = totalDue - settlementAmount

      // Calculate how much of the payment went to principal vs interest
      let principalPayment = settlementAmount
      let interestPayment = 0

      if (interest > 0) {
        // Pay interest first
        interestPayment = Math.min(interest, settlementAmount)
        principalPayment = settlementAmount - interestPayment
      }

      // Calculate the new principal amount
      const newPrincipal = unpaidEntry.amount - principalPayment

      await db.collection(collections.ledger).updateOne(
        { _id: new ObjectId(unpaidEntryId) },
        {
          $set: {
            partiallyPaid: true,
            partialPaymentAmount: settlementAmount,
            partialPaymentDate: new Date(),
            remainingAmount: newPrincipal,
            paidInterest: interestPayment,
            updatedAt: new Date(),
          },
        },
      )

      console.log(`Updated entry ${unpaidEntryId} with partial payment information`)

      // Update the payment entry to link it to the partial payment
      await db.collection(collections.ledger).updateOne(
        { _id: new ObjectId(paymentEntryId) },
        {
          $set: {
            partialPaymentId: result.insertedId,
            updatedAt: new Date(),
          },
        },
      )

      return NextResponse.json({
        success: true,
        message: "Partial payment recorded",
        remainingDue: remainingDue,
        partialPaymentId: result.insertedId.toString(),
      })
    }
  } catch (error) {
    console.error("Failed to settle payment:", error)
    return NextResponse.json({ error: "Failed to settle payment" }, { status: 500 })
  }
}