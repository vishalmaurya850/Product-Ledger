import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic" // Disable caching

// GET credit settings for a customer
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId || session.user.id
    const customerId = params.id

    // Validate ObjectId
    let customerObjectId
    try {
      customerObjectId = new ObjectId(customerId)
    } catch {
      return NextResponse.json({ error: "Invalid customer ID format" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const creditSettings = await db.collection(collections.customerSettings).findOne({
      customerId: customerObjectId,
      companyId,
    })

    if (!creditSettings) {
      return NextResponse.json({
        creditLimit: 10000,
        gracePeriod: 30,
        interestRate: 18,
        fineAmount: 0,
      })
    }

    return NextResponse.json({
      creditLimit: creditSettings.creditLimit ?? 10000,
      gracePeriod: creditSettings.gracePeriod ?? 30,
      interestRate: creditSettings.interestRate ?? 18,
      fineAmount: creditSettings.fineAmount ?? 0,
    })
  } catch (error) {
    console.error("Failed to fetch customer credit settings:", error)
    return NextResponse.json({ error: "Failed to fetch credit settings" }, { status: 500 })
  }
}

// PUT update credit settings for a customer
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId || session.user.id
    const customerId = params.id

    // Validate ObjectId
    let customerObjectId
    try {
      customerObjectId = new ObjectId(customerId)
    } catch {
      return NextResponse.json({ error: "Invalid customer ID format" }, { status: 400 })
    }

    const body = await request.json()

    // Validate required fields
    const { creditLimit, gracePeriod, interestRate, fineAmount } = body
    if (
      creditLimit === undefined ||
      gracePeriod === undefined ||
      interestRate === undefined
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    await db.collection(collections.customerSettings).updateOne(
      {
        customerId: customerObjectId,
        companyId,
      },
      {
        $set: {
          creditLimit: Number(creditLimit),
          gracePeriod: Number(gracePeriod),
          interestRate: Number(interestRate),
          fineAmount:
            typeof fineAmount === "number" && isFinite(fineAmount) && fineAmount >= 0
              ? fineAmount
              : 0,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          customerId: customerObjectId,
          companyId,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json({
      creditLimit: Number(creditLimit),
      gracePeriod: Number(gracePeriod),
      interestRate: Number(interestRate),
      fineAmount:
        typeof fineAmount === "number" && isFinite(fineAmount) && fineAmount >= 0
          ? fineAmount
          : 0,
    })
  } catch (error) {
    console.error("Failed to update customer credit settings:", error)
    return NextResponse.json({ error: "Failed to update credit settings" }, { status: 500 })
  }
}
