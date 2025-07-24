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
      { customerId: testCustomer._id, companyId },
      {
        $set: {
          creditLimit: 50000,
          gracePeriod: 30,
          interestRate: 18,
          companyId,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    // Create test ledger entries with different statuses and due dates
    const testEntries = [
      {
        // Paid entry
        customerId: testCustomer._id,
        type: "Sell",
        invoiceNumber: generateInvoiceNumber(),
        amount: 5000,
        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // Due 15 days ago
        description: "Test Sale - Already Paid",
        status: "Paid",
        paidDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Paid 10 days ago
        daysElapsed: 0,
        accruedInterest: 0,
        originalCreditLimit: 50000,
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.user.id,
      },
      {
        // Unpaid but within grace period
        customerId: testCustomer._id,
        type: "Sell",
        invoiceNumber: generateInvoiceNumber(),
        amount: 8000,
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Due 5 days ago (within 30-day grace)
        description: "Test Sale - Unpaid (Within Grace Period)",
        status: "Unpaid",
        daysElapsed: 5,
        accruedInterest: 0,
        originalCreditLimit: 50000,
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.user.id,
      },
      {
        // Overdue with interest
        customerId: testCustomer._id,
        type: "Sell",
        invoiceNumber: generateInvoiceNumber(),
        amount: 12000,
        date: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000), // 70 days ago
        dueDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // Due 40 days ago (10 days overdue)
        description: "Test Sale - Overdue with Interest",
        status: "Overdue",
        daysElapsed: 40,
        accruedInterest: 59.18, // ~12000 * (18/365) * 10 days
        overdueStartDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        originalCreditLimit: 50000,
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.user.id,
      },
      {
        // Recently due but should be overdue (for testing auto-update)
        customerId: testCustomer._id,
        type: "Sell",
        invoiceNumber: generateInvoiceNumber(),
        amount: 15000,
        date: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000), // 80 days ago
        dueDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000), // Due 50 days ago (should be overdue)
        description: "Test Sale - Should Be Overdue (Needs Status Update)",
        status: "Unpaid", // This should be updated to "Overdue" by the auto-update function
        daysElapsed: 50,
        accruedInterest: 0, // Should be calculated by auto-update
        originalCreditLimit: 50000,
        companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: session.user.id,
      }
    ]

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