import { NextResponse } from "next/server"
import { connectToDatabase, collections, logStatusChange } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Validate companyId to ensure it is a valid ObjectId string and belongs to the authenticated user
    let companyId = session.user.companyId || session.user.id
    if (!companyId || typeof companyId !== 'string' || !companyId.match(/^[a-fA-F0-9]{24}$/)) {
      return NextResponse.json({ error: "Invalid company context" }, { status: 403 })
    }
    const { db } = await connectToDatabase()

    // Get company overdue settings
    const overdueSettings = (await db.collection(collections.overdueSettings).findOne({ companyId })) || {
      gracePeriod: 30,
      interestRate: 18,
    }

    // Find all unpaid "Sell" entries that may need status updates (using entry date logic)
    const entriesToUpdate = await db.collection(collections.ledger).find({
      companyId,
      type: "Sell",
      status: { $in: ["Unpaid", "Overdue"] },
      date: { $exists: true, $ne: null }
    }).toArray()

    let updatedCount = 0
    const updateResults = []
    const today = new Date()

    for (const entry of entriesToUpdate) {
      const oldStatus = entry.status
      
      // Get customer settings for this entry
      const customerSettings = await db.collection(collections.customerSettings).findOne({
        customerId: entry.customerId,
        companyId,
      })

      const gracePeriod = customerSettings?.gracePeriod || overdueSettings.gracePeriod
      const interestRate = customerSettings?.interestRate || overdueSettings.interestRate

      // Calculate days since entry date
      const entryDate = new Date(entry.date)
      const daysElapsed = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      
      let newStatus = oldStatus
      let accruedInterest = entry.accruedInterest || 0
      let overdueStartDate = entry.overdueStartDate || null

      // Determine new status based on days elapsed
      if (daysElapsed > gracePeriod && oldStatus === "Unpaid") {
        // Transition from Unpaid to Overdue
        newStatus = "Overdue"
        
        // Set overdue start date (grace period end date)
        if (!overdueStartDate) {
          overdueStartDate = new Date(entryDate)
          overdueStartDate.setDate(overdueStartDate.getDate() + gracePeriod)
        }
      }

      // Calculate interest for overdue entries
      if (newStatus === "Overdue" && overdueStartDate) {
        const daysOverdue = Math.floor((today.getTime() - overdueStartDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysOverdue > 0) {
          accruedInterest += entry.amount * dailyRate * daysOverdue
        }
      }

      // Check if update is needed
      const needsUpdate = 
        oldStatus !== newStatus || 
        entry.daysElapsed !== daysElapsed ||
        Math.abs((entry.accruedInterest || 0) - accruedInterest) > 0.01 ||
        (!entry.overdueStartDate && overdueStartDate)

      if (needsUpdate) {
        // Prepare update data
        const updateData: any = {
          status: newStatus,
          daysElapsed,
          accruedInterest: Number(accruedInterest.toFixed(2)),
          updatedAt: new Date(),
        }

        // Add overdue start date if transitioning to overdue
        if (overdueStartDate && !entry.overdueStartDate) {
          updateData.overdueStartDate = overdueStartDate
        }

        // Update the entry in database
        await db.collection(collections.ledger).updateOne(
          { _id: entry._id },
          { $set: updateData }
        )

        // Log status change if status actually changed
        if (oldStatus !== newStatus) {
          await logStatusChange(
            db,
            entry._id,
            entry.customerId,
            oldStatus,
            newStatus,
            `Automatic status transition: ${daysElapsed} days elapsed, grace period: ${gracePeriod} days. Interest applied: ₹${accruedInterest.toFixed(2)}`,
            companyId,
            session.user.id,
            accruedInterest
          )
        }

        updatedCount++
        updateResults.push({
          entryId: entry._id.toString(),
          invoiceNumber: entry.invoiceNumber,
          oldStatus,
          newStatus,
          daysElapsed,
          accruedInterest: Number(accruedInterest.toFixed(2)),
          overdueStartDate,
          gracePeriod,
          interestRate
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

    const companyId = session.user.companyId || session.user.id
    const { db } = await connectToDatabase()

    // Get company overdue settings
    const overdueSettings = (await db.collection(collections.overdueSettings).findOne({ companyId })) || {
      gracePeriod: 30,
      interestRate: 18,
    }

    // Find entries that may need updates
    const entriesToCheck = await db.collection(collections.ledger).find({
      companyId,
      type: "Sell",
      status: { $in: ["Unpaid", "Overdue"] },
      date: { $exists: true, $ne: null }
    }).toArray()

    const pendingUpdates = []
    const today = new Date()
    
    for (const entry of entriesToCheck) {
      const customerSettings = await db.collection(collections.customerSettings).findOne({
        customerId: entry.customerId,
        companyId,
      })

      const gracePeriod = customerSettings?.gracePeriod || overdueSettings.gracePeriod
      const interestRate = customerSettings?.interestRate || overdueSettings.interestRate

      // Calculate days since entry date
      const entryDate = new Date(entry.date)
      const daysElapsed = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      
      let suggestedStatus = entry.status
      let suggestedInterest = entry.accruedInterest || 0

      // Check if should be overdue
      if (daysElapsed > gracePeriod && entry.status === "Unpaid") {
        suggestedStatus = "Overdue"
      }

      // Calculate interest for overdue entries
      if (suggestedStatus === "Overdue") {
        const daysOverdue = Math.max(0, daysElapsed - gracePeriod)
        if (daysOverdue > 0) {
          const dailyRate = interestRate / 365 / 100
          suggestedInterest = entry.amount * dailyRate * daysOverdue
        }
      }

      const needsUpdate = 
        entry.status !== suggestedStatus || 
        entry.daysElapsed !== daysElapsed ||
        Math.abs((entry.accruedInterest || 0) - suggestedInterest) > 0.01

      if (needsUpdate) {
        pendingUpdates.push({
          entryId: entry._id.toString(),
          invoiceNumber: entry.invoiceNumber,
          currentStatus: entry.status,
          suggestedStatus,
          currentDaysElapsed: entry.daysElapsed || 0,
          suggestedDaysElapsed: daysElapsed,
          currentInterest: entry.accruedInterest || 0,
          suggestedInterest: Number(suggestedInterest.toFixed(2)),
          gracePeriod,
          daysOverdue: Math.max(0, daysElapsed - gracePeriod)
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