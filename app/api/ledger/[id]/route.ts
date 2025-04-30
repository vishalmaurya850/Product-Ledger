import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if user has permission to view ledger entries
    if (!session.user.permissions?.includes("ledger_view")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    const companyId = session.user.companyId
    const { db } = await connectToDatabase()

    // Get ledger entry by ID and ensure it belongs to the same company
    const entry = await db.collection(collections.ledger).findOne({
      _id: new ObjectId(params.id),
      companyId,
    })

    if (!entry) {
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
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if user has permission to delete ledger entries
    if (!session.user.permissions?.includes("ledger_delete")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    const companyId = session.user.companyId
    const { db } = await connectToDatabase()

    // Delete ledger entry by ID and ensure it belongs to the same company
    const result = await db.collection(collections.ledger).deleteOne({
      _id: new ObjectId(params.id),
      companyId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Ledger entry not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete ledger entry:", error)
    return NextResponse.json({ error: "Failed to delete ledger entry" }, { status: 500 })
  }
}