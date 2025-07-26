import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic" // Disable caching

// GET credit settings for a customer
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId || session.user.id
    const customerId = resolvedParams.id

    const { db } = await connectToDatabase()

    // Validate customerId is a valid ObjectId
    let customerObjectId
    try {
      customerObjectId = new ObjectId(customerId)
    } catch {
      return NextResponse.json({ error: "Invalid customer ID format" }, { status: 400 })
    }

    // Get customer credit settings
    const creditSettings = await db.collection(collections.customerSettings).findOne({
      customerId: customerObjectId,
      companyId,
    })

    // Return default settings if none found
    if (!creditSettings) {
      return NextResponse.json({
        creditLimit: 10000,
        gracePeriod: 30,
        interestRate: 18,
      })
    }

    return NextResponse.json({
      creditLimit: creditSettings.creditLimit || 10000,
      gracePeriod: creditSettings.gracePeriod || 30,
      interestRate: creditSettings.interestRate || 18,
    })
  } catch (error) {
    console.error("Failed to fetch customer credit settings:", error)
    return NextResponse.json({ error: "Failed to fetch credit settings" }, { status: 500 })
  }
}

// PUT update credit settings for a customer
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId || session.user.id
    const customerId = resolvedParams.id

    // Validate customerId is a valid ObjectId
    let customerObjectId
    try {
      customerObjectId = new ObjectId(customerId)
    } catch {
      return NextResponse.json({ error: "Invalid customer ID format" }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (body.creditLimit === undefined || body.gracePeriod === undefined || body.interestRate === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // const { db } = await connectToDatabase()

    // Update or create credit settings
    // const result = await db.collection(collections.customerSettings).updateOne(
    //   {
    //     customerId: customerObjectId,
    //     companyId,
    //   },
    //   {
    //     $set: {
    //       creditLimit: Number(body.creditLimit),
    //       gracePeriod: Number(body.gracePeriod),
    //       interestRate: Number(body.interestRate),
    //       updatedAt: new Date(),
    //     },
    //     $setOnInsert: {
    //       customerId: customerObjectId,
    //       companyId,
    //       createdAt: new Date(),
    //     },
    //   },
    //   { upsert: true },
    // )

    // Return updated settings
    return NextResponse.json({
      creditLimit: Number(body.creditLimit),
      gracePeriod: Number(body.gracePeriod),
      interestRate: Number(body.interestRate),
    })
  } catch (error) {
    console.error("Failed to update customer credit settings:", error)
    return NextResponse.json({ error: "Failed to update credit settings" }, { status: 500 })
  }
}

// POST recalculate credit for a customer
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId || session.user.id
    const customerId = resolvedParams.id

    // Validate customerId is a valid ObjectId
    let customerObjectId
    try {
      customerObjectId = new ObjectId(customerId)
    } catch {
      return NextResponse.json({ error: "Invalid customer ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    
    console.log(`🔄 Recalculating credit for customer ${customerId}`)

    // Get current customer credit settings
    const customerSettings = await db.collection(collections.customerSettings).findOne({
      customerId: customerObjectId,
      companyId,
    })

    if (!customerSettings) {
      return NextResponse.json({ error: "Customer credit settings not found" }, { status: 404 })
    }

    // Get all ledger entries for proper calculation
    const allEntries = await db.collection(collections.ledger).find({
      customerId: customerObjectId,
      companyId,
    }).toArray()

    // Calculate total sells and total payments
    let totalSells = 0
    let totalPayments = 0
    let totalOutstanding = 0

    for (const entry of allEntries) {
      if (entry.type === "Sell") {
        const entryBalance = entry.amount - (entry.paidAmount || 0)
        totalSells += entry.amount
        totalOutstanding += Math.max(0, entryBalance + (entry.accruedInterest || 0))
      } else if (entry.type === "Payment In") {
        totalPayments += entry.amount
      }
    }

    // Credit used is total sells minus total payments (but not below 0)
    const totalCreditUsed = Math.max(0, totalSells - totalPayments)
    const newAvailableCredit = customerSettings.creditLimit - totalCreditUsed

    // Update the credit settings
    await db.collection(collections.customerSettings).updateOne(
      { customerId: customerObjectId, companyId },
      {
        $set: {
          creditUsed: totalCreditUsed,
          availableCredit: newAvailableCredit,
          totalOutstandingBalance: totalOutstanding,
          updatedAt: new Date(),
        }
      }
    )

    console.log(`Credit recalculated: Sells ₹${totalSells}, Payments ₹${totalPayments}, Used ₹${totalCreditUsed}, Available ₹${newAvailableCredit}`)

    return NextResponse.json({
      creditLimit: customerSettings.creditLimit,
      creditUsed: totalCreditUsed,
      availableCredit: newAvailableCredit,
      totalOutstandingBalance: totalOutstanding,
      totalSells,
      totalPayments,
    })
  } catch (error) {
    console.error("Failed to recalculate customer credit:", error)
    return NextResponse.json({ error: "Failed to recalculate credit" }, { status: 500 })
  }
}
