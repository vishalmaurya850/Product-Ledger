import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic" // Disable caching

// GET credit settings for a customer
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId || session.user.id
    const customerId = resolvedParams.id

    // Get customer credit settings
    const creditSettings = await db.customerCreditSettings.findFirst({
      where: {
        customerId,
        companyId,
      },
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
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId || session.user.id
    const customerId = resolvedParams.id

    // Parse request body
    const body = await request.json()

    // Validate required fields
    if (body.creditLimit === undefined || body.gracePeriod === undefined || body.interestRate === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update or create credit settings using Prisma upsert
    const settings = await db.customerCreditSettings.upsert({
      where: {
        customerId_companyId: {
          customerId,
          companyId,
        },
      },
      update: {
        creditLimit: Number(body.creditLimit),
        gracePeriod: Number(body.gracePeriod),
        interestRate: Number(body.interestRate),
      },
      create: {
        customerId,
        companyId,
        creditLimit: Number(body.creditLimit),
        gracePeriod: Number(body.gracePeriod),
        interestRate: Number(body.interestRate),
      },
    })

    // Return updated settings
    return NextResponse.json({
      creditLimit: settings.creditLimit,
      gracePeriod: settings.gracePeriod,
      interestRate: settings.interestRate,
    })
  } catch (error) {
    console.error("Failed to update customer credit settings:", error)
    return NextResponse.json({ error: "Failed to update credit settings" }, { status: 500 })
  }
}
