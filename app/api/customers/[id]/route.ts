import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic" // Disable caching for this route

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Use companyId from session if available, otherwise fall back to user.id
    const resolvedParams = await context.params;
    const companyId = session.user.companyId || session.user.id;
    const { db } = await connectToDatabase();

    console.log(`Fetching customer with ID: ${resolvedParams.id} for company: ${companyId}`)

    let customer
    try {
      // Try to find the customer with the exact companyId
      customer = await db.collection(collections.customers).findOne({
        _id: new ObjectId(resolvedParams.id),
        companyId,
      })
    } catch (error) {
      console.error("Error parsing ObjectId:", error)
      return NextResponse.json({ error: "Invalid customer ID format" }, { status: 400 })
    }

    // If not found, try without companyId filter as fallback
    if (!customer) {
      console.log("Customer not found with companyId filter, trying without filter")
      customer = await db.collection(collections.customers).findOne({
        _id: new ObjectId(resolvedParams.id),
      })
    }

    if (!customer) {
      console.log("Customer not found")
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    console.log("Customer found:", { id: customer._id, name: customer.name })

    // Convert ObjectId to string before returning
    const serializedCustomer = {
      ...customer,
      _id: customer._id.toString(),
    }

    return NextResponse.json(serializedCustomer, {
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
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const resolvedParams = await context.params;
    // const companyId = session.user.companyId || session.user.id;
    const { db } = await connectToDatabase();
    const data = await request.json();

    // Add timestamps
    const customer = {
      ...data,
      updatedAt: new Date(),
    }

    const result = await db
      .collection(collections.customers)
      .updateOne({ _id: new ObjectId(resolvedParams.id) }, { $set: customer })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      id: resolvedParams.id,
    })
  } catch (error) {
    console.error("Failed to update customer:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const resolvedParams = await context.params;
    // const companyId = session.user.companyId || session.user.id;
    const { db } = await connectToDatabase();

    const result = await db.collection(collections.customers).deleteOne({
      _id: new ObjectId(resolvedParams.id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete customer:", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}