import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
export async function GET(request: Request) {
  try {
    const session = await auth()
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
    // Get recent sales (type: "Sell") with customer details
    const recentSales = await db.ledgerEntry.findMany({
      where: {
        companyId,
        type: "Sell",
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 5,
    })
    return NextResponse.json(recentSales)
  } catch (error) {
    console.error("Failed to fetch recent sales:", error)
    return NextResponse.json({ error: "Failed to fetch recent sales" }, { status: 500 })
  }
}