import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if user has permission to view ledger entries
    if (!session.user.permissions?.includes("ledger_view")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    const companyId = session.user.companyId

    // Get ledger entry by ID and ensure it belongs to the same company
    const entry = await db.ledgerEntry.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    if (!entry || entry.companyId !== companyId) {
      return NextResponse.json({ error: "Ledger entry not found" }, { status: 404 })
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Failed to fetch ledger entry:", error)
    return NextResponse.json({ error: "Failed to fetch ledger entry" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if user has permission to delete ledger entries
    if (!session.user.permissions?.includes("ledger_delete")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    const companyId = session.user.companyId

    // Verify entry belongs to company before deleting
    const existing = await db.ledgerEntry.findUnique({
      where: { id: params.id },
      select: { companyId: true }
    })

    if (!existing || existing.companyId !== companyId) {
      return NextResponse.json({ error: "Ledger entry not found" }, { status: 404 })
    }

    await db.ledgerEntry.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete ledger entry:", error)
    return NextResponse.json({ error: "Failed to delete ledger entry" }, { status: 500 })
  }
}