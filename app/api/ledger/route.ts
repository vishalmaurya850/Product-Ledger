import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
export const dynamic = "force-dynamic" // Disable caching for this route
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const companyId = session.user.companyId
    console.log("Using companyId for ledger query:", companyId)
    const ledgerEntries = await db.ledgerEntry.findMany({
      where: { companyId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: { date: 'desc' }
    })
    console.log(`Fetched ${ledgerEntries.length} ledger entries for company ${companyId}`)
    return NextResponse.json(ledgerEntries, {
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
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const companyId = session.user.companyId || session.user.id
    const userId = session.user.id
    const data = await request.json()
    const entry = await db.ledgerEntry.create({
      data: {
        customerId: data.customerId,
        type: data.type,
        invoiceNumber: data.invoiceNumber || `INV-${Date.now()}`,
        amount: Number(data.amount),
        description: data.description,
        date: new Date(data.date),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        status: data.status || "pending",
        companyId,
        createdBy: userId,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })
    return NextResponse.json({
      success: true,
      id: entry.id,
      entry,
    })
  } catch (error) {
    console.error("Failed to create ledger entry:", error)
    return NextResponse.json({ error: "Failed to create ledger entry" }, { status: 500 })
  }
}