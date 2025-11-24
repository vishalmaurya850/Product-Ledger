import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
export const dynamic = "force-dynamic" // Disable caching for this route
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      console.log("No authenticated user found in session")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const companyId = session.user.companyId || session.user.id
    console.log("Using companyId for query:", companyId)
    const customers = await db.customer.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
      include: {
        customerCreditSettings: true,
      }
    })
    console.log(`Fetched ${customers.length} customers for company ${companyId}`)
    return NextResponse.json(customers, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
      },
    })
  } catch (error) {
    console.error("Failed to fetch customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const companyId = session.user.companyId || session.user.id
    const userId = session.user.id
    console.log("Using companyId for new customer:", companyId)
    const data = await request.json()
    const customer = await db.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        panCard: data.panCard,
        aadharCard: data.aadharCard,
        imageUrl: data.imageUrl,
        companyId,
        createdBy: userId,
      }
    })
    console.log("Customer created with ID:", customer.id)
    return NextResponse.json({
      success: true,
      id: customer.id,
      customer,
    })
  } catch (error) {
    console.error("Failed to create customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}