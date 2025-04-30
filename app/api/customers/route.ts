import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic" // Disable caching for this route

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      console.log("No authenticated user found in session")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Debug session data
    console.log("Session user:", {
      id: session.user.id,
      companyId: session.user.companyId,
      email: session.user.email,
    })

    // Use companyId from session if available, otherwise fall back to user.id
    const companyId = session.user.companyId || session.user.id
    console.log("Using companyId for query:", companyId)

    const { db } = await connectToDatabase()

    // Debug the MongoDB connection
    console.log("Connected to database:", db.databaseName)
    console.log("Collections:", collections)

    // First, check if the collection exists and has documents
    const collectionExists = await db.listCollections({ name: collections.customers }).toArray()
    console.log("Customer collection exists:", collectionExists.length > 0)

    // Count total documents in the collection
    const totalCustomers = await db.collection(collections.customers).countDocuments()
    console.log("Total customers in collection:", totalCustomers)

    // Try querying without the companyId filter first to see if any data exists
    interface Customer {
      _id: string
      name: string
      companyId: string
    }

    const allCustomers = await db.collection(collections.customers).find({}).limit(5).toArray()
    console.log(
      "Sample of all customers (up to 5):",
      allCustomers.map((c: Customer) => ({ id: c._id, name: c.name, companyId: c.companyId })),
    )

    // Now query with the companyId filter
    const customers = await db.collection(collections.customers).find({ companyId }).sort({ name: 1 }).toArray()

    console.log(`Fetched ${customers.length} customers for company ${companyId}`)

    // If no customers found, log a more detailed message
    if (customers.length === 0) {
      console.log("No customers found for companyId:", companyId)
    }

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
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Use companyId from session if available, otherwise fall back to user.id
    const companyId = session.user.companyId || session.user.id
    console.log("Using companyId for new customer:", companyId)

    const { db } = await connectToDatabase()
    const data = await request.json()

    // Add timestamps and company ID
    const customer = {
      ...data,
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("Creating new customer:", { name: customer.name, email: customer.email, companyId: customer.companyId })
    const result = await db.collection(collections.customers).insertOne(customer)
    console.log("Customer created with ID:", result.insertedId)

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      customer: { ...customer, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Failed to create customer:", error)
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}