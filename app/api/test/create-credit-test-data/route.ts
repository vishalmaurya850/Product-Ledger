import { NextResponse } from "next/server"
import { connectToDatabase, collections, generateInvoiceNumber } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const companyId = session.user.companyId || session.user.id
    const { db } = await connectToDatabase()

    // Create a test customer if none exists
    let testCustomer = await db.collection(collections.customers).findOne({
      companyId,
      email: "test@example.com"
    })

    if (!testCustomer) {
      const customerResult = await db.collection(collections.customers).insertOne({
        name: "Test Customer",
        email: "test@example.com",
        phone: "1234567890",
        address: "123 Test Street",
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.user.id,
      })
      testCustomer = {
        _id: customerResult.insertedId,
        name: "Test Customer",
        email: "test@example.com",
        phone: "1234567890",
        address: "123 Test Street",
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.user.id,
      }
    }

    // Create customer credit settings
    await db.collection(collections.customerSettings).updateOne(
        customerId: testCustomer._id.toString(),

    // Insert test entries
    const insertResults = await db.collection(collections.ledger).insertMany(testEntries)

    // Create a test payment entry
    const paymentEntry = {
      customerId: testCustomer._id,
      type: "Payment In",
      invoiceNumber: generateInvoiceNumber(),
      amount: 5000,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      description: "Test Payment",
      status: "Paid",
      paidDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      relatedEntryId: insertResults.insertedIds[0], // Related to first entry
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: session.user.id,
    }

    await db.collection(collections.ledger).insertOne(paymentEntry)

    return NextResponse.json({
      success: true,
      message: "Test data created successfully",
      testCustomer: {
        id: testCustomer._id.toString(),
        name: testCustomer.name,
        email: testCustomer.email,
      },
      entriesCreated: testEntries.length + 1, // +1 for payment entry
      testScenarios: [
        "Paid entry with credit limit restoration",
        "Unpaid entry within grace period",
        "Overdue entry with accrued interest",
        "Entry that needs status update to overdue",
        "Payment entry linked to sale"
      ]
    })

  } catch (error) {
    console.error("Failed to create test data:", error)
    return NextResponse.json({ error: "Failed to create test data" }, { status: 500 })
  }
}