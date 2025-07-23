import { NextResponse } from "next/server"
import { connectToDatabase, collections, logStatusChange, updateEntryStatus, calculateInterest, calculateDaysOverdue } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId
    const { db } = await connectToDatabase()

    // Get company overdue settings
    const overdueSettings = (await db.collection(collections.overdueSettings).findOne({ companyId })) || {
      gracePeriod: 30,
      interestRate: 18,
    }

    // Find all unpaid and overdue entries that may need status updates
    const entriesToUpdate = await db.collection(collections.ledger).find({
      companyId,
      status: { $in: ["Unpaid", "Overdue"] },
      dueDate: { $exists: true, $ne: null }
    }).toArray()

    let updatedCount = 0
    const updateResults = []

    for (const entry of entriesToUpdate) {
      const oldStatus = entry.status
      
      // Get customer settings for this entry
      const customerSettings = await db.collection(collections.customerSettings).findOne({
        customerId: entry.customerId,
        companyId,
      })

      const gracePeriod = customerSettings?.gracePeriod || overdueSettings.gracePeriod
      const interestRate = customerSettings?.interestRate || overdueSettings.interestRate

      // Calculate updated status and metrics
      const statusUpdate = updateEntryStatus({
        ...entry,
        dueDate: new Date(entry.dueDate)
      }, gracePeriod)

      // Apply interest rate from settings
      const daysOverdue = calculateDaysOverdue(new Date(entry.dueDate), gracePeriod)
      const accruedInterest = calculateInterest(entry.amount, daysOverdue, interestRate)
      statusUpdate.accruedInterest = accruedInterest

      // Check if status actually changed or if we need to update metrics
      const needsUpdate = oldStatus !== statusUpdate.status || 
                         entry.daysElapsed !== statusUpdate.daysElapsed ||
                         (entry.accruedInterest || 0) !== statusUpdate.accruedInterest ||
                         (statusUpdate.status === "Overdue" && !entry.overdueStartDate)

      if (needsUpdate) {
        // Update the entry
        const updateData = {
          status: statusUpdate.status,
          daysElapsed: statusUpdate.daysElapsed,
          accruedInterest: statusUpdate.accruedInterest,
          updatedAt: new Date(),
        }

        if (statusUpdate.overdueStartDate && !entry.overdueStartDate) {
          updateData.overdueStartDate = statusUpdate.overdueStartDate
        }

        await db.collection(collections.ledger).updateOne(
          { _id: entry._id },
          { $set: updateData }
        )

        // Log status change if status actually changed
        if (oldStatus !== statusUpdate.status) {
          await logStatusChange(
            db,
            entry._id,
            entry.customerId,
            oldStatus,
            statusUpdate.status,
            `Automatic status update: ${statusUpdate.daysElapsed} days elapsed, ${daysOverdue} days overdue`,
            companyId,
            session.user.id,
            statusUpdate.accruedInterest
          )
        }

        updatedCount++
        updateResults.push({
          entryId: entry._id.toString(),
          invoiceNumber: entry.invoiceNumber,
          oldStatus,
          newStatus: statusUpdate.status,
          daysElapsed: statusUpdate.daysElapsed,
          accruedInterest: statusUpdate.accruedInterest
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} entries`,
      updatedCount,
      totalProcessed: entriesToUpdate.length,
      updates: updateResults
    })

  } catch (error) {
    console.error("Failed to update payment statuses:", error)
    return NextResponse.json({ error: "Failed to update payment statuses" }, { status: 500 })
  }
}

// GET endpoint to check entries that need status updates
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId
    const { db } = await connectToDatabase()

    // Get company overdue settings
    const overdueSettings = (await db.collection(collections.overdueSettings).findOne({ companyId })) || {
      gracePeriod: 30,
      interestRate: 18,
    }

    // Find entries that may need updates
    const entriesToCheck = await db.collection(collections.ledger).find({
      companyId,
      status: { $in: ["Unpaid", "Overdue"] },
      dueDate: { $exists: true, $ne: null }
    }).toArray()

    const pendingUpdates = []
    
    for (const entry of entriesToCheck) {
      const customerSettings = await db.collection(collections.customerSettings).findOne({
        customerId: entry.customerId,
        companyId,
      })

      const gracePeriod = customerSettings?.gracePeriod || overdueSettings.gracePeriod
      const statusUpdate = updateEntryStatus({
        ...entry,
        dueDate: new Date(entry.dueDate)
      }, gracePeriod)

      const needsUpdate = entry.status !== statusUpdate.status || 
                         entry.daysElapsed !== statusUpdate.daysElapsed ||
                         (entry.accruedInterest || 0) !== statusUpdate.accruedInterest

      if (needsUpdate) {
        pendingUpdates.push({
          entryId: entry._id.toString(),
          invoiceNumber: entry.invoiceNumber,
          currentStatus: entry.status,
          suggestedStatus: statusUpdate.status,
          daysElapsed: statusUpdate.daysElapsed,
          accruedInterest: statusUpdate.accruedInterest
        })
      }
    }

    return NextResponse.json({
      pendingUpdates,
      totalChecked: entriesToCheck.length,
      needsUpdate: pendingUpdates.length
    })

  } catch (error) {
    console.error("Failed to check payment statuses:", error)
    return NextResponse.json({ error: "Failed to check payment statuses" }, { status: 500 })
  }
}