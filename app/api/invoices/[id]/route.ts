import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const invoiceId = params.id

    // Get the ledger entry (invoice)
    const invoice = await db.collection(collections.ledger).findOne({
      _id: new ObjectId(invoiceId),
      companyId: session.user.companyId,
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Get customer details
    const customer = await db.collection(collections.customers).findOne({
      _id: new ObjectId(invoice.customerId),
      companyId: session.user.companyId,
    })

    // Get company details
    const company = await db.collection(collections.users).findOne({
      _id: new ObjectId(session.user.id),
    })

    // Get payment history for this invoice
    const payments = await db
      .collection(collections.ledger)
      .find({
        companyId: session.user.companyId,
        type: "Payment In",
        description: { $regex: invoiceId, $options: "i" },
      })
      .toArray()

    // Calculate remaining amount
    const totalPaid = payments.reduce((sum: number, payment: any) => sum + payment.amount, 0)
    const remainingAmount = Math.max(0, invoice.amount - totalPaid)

    const invoiceData = {
      ...invoice,
      customer: {
        name: customer?.name || "Unknown Customer",
        email: customer?.email || "",
        phone: customer?.phone || "",
        address: customer?.address || "",
      },
      company: {
        name: company?.profile?.companyName || company?.name || "Your Company",
        address: company?.profile?.address || "",
        email: company?.email || "",
        phone: company?.profile?.phone || "",
      },
      payments: payments.map((payment: any) => ({
        amount: payment.amount,
        date: payment.createdAt,
        method: payment.paymentMethod || "Cash",
      })),
      remainingAmount,
    }

    return NextResponse.json(invoiceData)
  } catch (error) {
    console.error("Failed to fetch invoice:", error)
    return NextResponse.json({ error: "Failed to fetch invoice" }, { status: 500 })
  }
}