import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic" // Disable caching for this route

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const resolvedParams = await context.params;
    const companyId = session.user.companyId || session.user.id;

    console.log(`Fetching customer with ID: ${resolvedParams.id} for company: ${companyId}`)

    const customer = await db.customer.findUnique({
      where: { id: resolvedParams.id },
      include: {
        customerCreditSettings: true,
        ledgerEntries: {
          orderBy: { date: 'desc' },
          take: 10,
        }
      }
    })

    if (!customer || customer.companyId !== companyId) {
      console.log("Customer not found")
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    console.log("Customer found:", { id: customer.id, name: customer.name })

    return NextResponse.json(customer, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
      },
    })
  } catch (error) {
    console.error("Failed to fetch customer:", error)
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const resolvedParams = await context.params;
    const companyId = session.user.companyId || session.user.id;
    const data = await request.json();

    // Verify customer belongs to company
    const existing = await db.customer.findUnique({
      where: { id: resolvedParams.id },
      select: { companyId: true }
    })

    if (!existing || existing.companyId !== companyId) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    const customer = await db.customer.update({
      where: { id: resolvedParams.id },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        panCard: data.panCard,
        aadharCard: data.aadharCard,
        imageUrl: data.imageUrl,
      }
    })

    return NextResponse.json({
      success: true,
      id: customer.id,
      customer,
    })
  } catch (error) {
    console.error("Failed to update customer:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const resolvedParams = await context.params;
    const companyId = session.user.companyId || session.user.id;

    // Verify customer belongs to company before deleting
    const existing = await db.customer.findUnique({
      where: { id: resolvedParams.id },
      select: { companyId: true }
    })

    if (!existing || existing.companyId !== companyId) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    await db.customer.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete customer:", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}