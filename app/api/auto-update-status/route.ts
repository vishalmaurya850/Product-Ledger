import { NextResponse } from "next/server"
import { connectToDatabase, collections, logStatusChange } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // This endpoint runs without authentication for automatic triggers
    // We'll process all companies to ensure system-wide automatic updates

    // Get all companies that have overdue settings
    const companies = await db.collection(collections.overdueSettings).find({}).toArray()
    
    // If no companies have settings, use default settings for all companies
    const allCompanies = companies.length > 0 
      ? companies.map((c: any) => ({ companyId: c.companyId, ...c }))
      : [{ companyId: null, gracePeriod: 30, interestRate: 18 }]

    let totalUpdated = 0
    const updateResults = []
    const today = new Date()

    for (const companySettings of allCompanies) {
      const companyId = companySettings.companyId

      // Find all unpaid "Sell" entries for this company
      const query = companyId 
        ? { companyId, type: "Sell", status: { $in: ["Unpaid", "Overdue"] }, date: { $exists: true, $ne: null } }
        : { type: "Sell", status: { $in: ["Unpaid", "Overdue"] }, date: { $exists: true, $ne: null } }

      const entriesToUpdate = await db.collection(collections.ledger).find(query).toArray()

      for (const entry of entriesToUpdate) {
        const oldStatus = entry.status
        
        // Get customer-specific settings if available
        const customerSettings = await db.collection(collections.customerSettings).findOne({
          customerId: entry.customerId,
          companyId: entry.companyId,
        })

        const gracePeriod = customerSettings?.gracePeriod || companySettings.gracePeriod || 30
        const interestRate = customerSettings?.interestRate || companySettings.interestRate || 18

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
            const dailyRate = interestRate / 365 / 100
            accruedInterest = entry.amount * dailyRate * daysOverdue
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
            autoUpdated: true, // Mark as automatically updated
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
              entry.companyId,
              "system-auto", // System user for automatic updates
              accruedInterest
            )
          }

          totalUpdated++
          updateResults.push({
            entryId: entry._id.toString(),
            companyId: entry.companyId,
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
    }

    return NextResponse.json({
      success: true,
      message: `Automatic update completed: ${totalUpdated} entries processed`,
      updatedCount: totalUpdated,
      timestamp: today.toISOString(),
      updates: updateResults.slice(0, 10) // Limit response size, only show first 10
    })

  } catch (error) {
    console.error("Automatic status update failed:", error)
    return NextResponse.json({ 
      error: "Automatic status update failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
