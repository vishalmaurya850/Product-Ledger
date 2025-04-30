import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if user has permission to view reports
    if (!session.user.permissions?.includes("reports_view")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    const companyId = session.user.companyId
    const { db } = await connectToDatabase()

    // Get recent sales (type: "Sell") with customer details
    interface Sale {
      _id: string
      customerId: string
      date: Date
      amount: number
      [key: string]: unknown // Add additional fields as needed
    }

    const recentSales: Sale[] = (await db
      .collection(collections.ledger)
      .find({
        companyId,
        type: "Sell",
      })
      .sort({ date: -1 })
      .limit(5)
      .toArray()).map((doc: { _id: ObjectId; customerId: string; date: string; amount: number; [key: string]: unknown }) => {
        const { _id, customerId, date, amount, ...rest } = doc; // Destructure to exclude duplicate keys
        return {
          _id: _id.toString(),
          customerId,
          date: new Date(date),
          amount,
          ...rest, // Spread remaining fields
        };
      }) as Sale[]

    // Get customer details for each sale
    const salesWithCustomers = await Promise.all(
      recentSales.map(async (sale) => {
        const customer = await db.collection(collections.customers).findOne({
          _id: new ObjectId(sale.customerId),
          companyId,
        })

        return {
          ...sale,
          customer: {
            name: customer?.name || "Unknown Customer",
            email: customer?.email,
          },
        }
      }),
    )

    return NextResponse.json(salesWithCustomers)
  } catch (error) {
    console.error("Failed to fetch recent sales:", error)
    return NextResponse.json({ error: "Failed to fetch recent sales" }, { status: 500 })
  }
}