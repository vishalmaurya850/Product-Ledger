import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if user has permission to view reports
    if (!session.user.permissions?.includes("reports_view")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    // Support companyId from session or query param
    let companyId = session.user.companyId
    if (!companyId) {
      const { searchParams } = new URL(request.url)
      companyId = searchParams.get("companyId") || ""
    }

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Define a type for sale
    interface Sale {
      _id: ObjectId | string;
      customerId: string;
      companyId: string;
      type: string;
      date: Date;
      [key: string]: any;
    }

    // Get recent sales (type: "Sell") with customer details
    const recentSales = await db
      .collection(collections.ledger)
      .find({
        companyId,
        type: "Sell",
      })
      .sort({ date: -1 })
      .limit(5)
      .toArray()

    // Get customer details for each sale
    const salesWithCustomers = await Promise.all(
      recentSales.map(async (sale: Sale) => {
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