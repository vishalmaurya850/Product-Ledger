import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic" // Disable caching

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const entryId = params.id
    const { db } = await connectToDatabase()

    // Update the ledger entry to mark it as paid
    const result = await db.collection(collections.ledger).updateOne(
      { _id: new ObjectId(entryId) },
      {
        $set: {
          status: "Paid",
          paidDate: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Ledger entry not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Ledger entry marked as paid" })
  } catch (error) {
    console.error("Error marking ledger entry as paid:", error)
    return NextResponse.json({ error: "Failed to mark ledger entry as paid" }, { status: 500 })
  }
}