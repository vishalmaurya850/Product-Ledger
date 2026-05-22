import { NextResponse } from "next/server"
import { db, calculateDaysCount } from "@/lib/db"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic" // Disable caching

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: entryId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId

    // Verify entry exists and belongs to the user's company
    const entry = await db.ledgerEntry.findUnique({
      where: { id: entryId },
      select: { id: true, companyId: true, date: true }
    })

    if (!entry || entry.companyId !== companyId) {
      return NextResponse.json({ error: "Ledger entry not found" }, { status: 404 })
    }

    const paidDate = new Date()
    const daysCount = calculateDaysCount(entry.date, paidDate)

    // Update the ledger entry to mark it as paid
    await db.ledgerEntry.update({
      where: { id: entryId },
      data: {
        status: "Paid",
        paidDate,
        daysCount,
      },
    })

    return NextResponse.json({ success: true, message: "Ledger entry marked as paid" })
  } catch (error) {
    console.error("Error marking ledger entry as paid:", error)
    return NextResponse.json({ error: "Failed to mark ledger entry as paid" }, { status: 500 })
  }
}