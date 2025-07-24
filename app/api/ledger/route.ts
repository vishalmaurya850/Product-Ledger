import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic" // Disable caching for this route

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Use companyId from session if available, otherwise fall back to user.id
    const companyId = session.user.companyId
    console.log("Using companyId for ledger query:", companyId)

    const { db } = await connectToDatabase()

    const ledgerEntries = await db.collection(collections.ledger).find({ companyId }).sort({ date: -1 }).toArray()

    // Convert ObjectIds to strings in the response
    interface LedgerEntry {
      _id: string;
      customerId: string;
      [key: string]: unknown; // Add additional fields as needed
    }

    const serializedEntries = ledgerEntries.map((entry: LedgerEntry) => ({
      ...entry,
      _id: entry._id.toString(),
      customerId: entry.customerId.toString(),
    }))

    console.log(`Fetched ${ledgerEntries.length} ledger entries for company ${companyId}`)

    return NextResponse.json(serializedEntries, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
      },
    })
  } catch (error) {
    console.error("Failed to fetch ledger entries:", error)
    return NextResponse.json({ error: "Failed to fetch ledger entries" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId || session.user.id
    const { db } = await connectToDatabase()
    const data = await request.json()

    // Get customer credit settings to store original credit limit
    let originalCreditLimit = null
    if (data.type === "Sell" && data.customerId) {
      const customerSettings = await db.collection(collections.customerSettings).findOne({
        customerId: new ObjectId(data.customerId),
        companyId,
      })
      if (customerSettings) {
        originalCreditLimit = customerSettings.creditLimit
      }
    }

    // Set due date if not provided - default to 30 days for sales
    let dueDate = data.dueDate ? new Date(data.dueDate) : null
    if (!dueDate && data.type === "Sell") {
      const entryDate = new Date(data.date)
      dueDate = new Date(entryDate)
      dueDate.setDate(dueDate.getDate() + 30) // Default 30 days payment term
    }

    // Initialize new fields for enhanced tracking
    const enhancedData = {
      ...data,
      date: new Date(data.date),
      dueDate,
      originalCreditLimit,
      daysElapsed: 0,
      accruedInterest: 0,
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.id,
    }

    const result = await db.collection(collections.ledger).insertOne(enhancedData)

    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      entry: {
        ...enhancedData,
        _id: result.insertedId.toString(),
        customerId: enhancedData.customerId.toString(),
      },
    })
  } catch (error) {
    console.error("Failed to create ledger entry:", error)
    return NextResponse.json({ error: "Failed to create ledger entry" }, { status: 500 })
  }
}