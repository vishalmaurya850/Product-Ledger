import { NextResponse } from "next/server"
import { db, isOverdue } from "@/lib/db"

// This route is meant to be called by a cron job to update overdue status
export async function GET(request: Request) {
  try {
    // Check for a secret key to secure the endpoint
    const { searchParams } = new URL(request.url)
    const secretKey = searchParams.get("key")

    if (secretKey !== process.env.CRON_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all unpaid ledger entries
    const unpaidEntries = await db.ledgerEntry.findMany({
      where: {
        status: "Unpaid",
        type: "Sell",
      },
      include: {
        customer: {
          include: {
            customerCreditSettings: true,
          },
        },
      },
    })

    // Default grace period if no settings found
    const defaultGracePeriod = 30

    // Count of updated entries
    let updatedCount = 0

    // Update entries that are overdue
    const updatePromises = unpaidEntries.map(async (entry) => {
      const gracePeriod = entry.customer?.customerCreditSettings?.[0]?.gracePeriod || defaultGracePeriod

      if (isOverdue(entry.date, gracePeriod)) {
        await db.ledgerEntry.update({
          where: { id: entry.id },
          data: { status: "Overdue" },
        })
        updatedCount++
      }
    })

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} entries to overdue status`,
    })
  } catch (error) {
    console.error("Failed to update overdue status:", error)
    return NextResponse.json({ error: "Failed to update overdue status" }, { status: 500 })
  }
}