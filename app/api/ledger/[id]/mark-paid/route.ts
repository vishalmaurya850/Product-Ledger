import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic" // Disable caching

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const entryId = params.id

    // Update the ledger entry to mark it as paid
    const result = await db.ledgerEntry.updateMany({
      where: { id: entryId },
      data: {
        status: "Paid",
        paidDate: new Date(),
      },
    })

    if (result.count === 0) {
      return NextResponse.json({ error: "Ledger entry not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Ledger entry marked as paid" })
  } catch (error) {
    console.error("Error marking ledger entry as paid:", error)
    return NextResponse.json({ error: "Failed to mark ledger entry as paid" }, { status: 500 })
  }
}