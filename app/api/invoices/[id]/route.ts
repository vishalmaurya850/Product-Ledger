import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: invoiceId } = await params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get the ledger entry (invoice) with customer and company
    const invoice = await db.ledgerEntry.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        company: true,
      },
    })

    if (!invoice || invoice.companyId !== session.user.companyId) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    // Get payment history for this invoice
    const payments = await db.ledgerEntry.findMany({
      where: {
        companyId: session.user.companyId,
        type: "Payment In",
        description: { contains: invoiceId },
      },
    })

    // Calculate remaining amount
    const totalPaid = payments.reduce((sum: number, payment: any) => sum + payment.amount, 0)
    const remainingAmount = Math.max(0, invoice.amount - totalPaid)

    const invoiceData = {
      ...invoice,
      customer: {
        name: invoice.customer?.name || "Unknown Customer",
        email: invoice.customer?.email || "",
        phone: invoice.customer?.phone || "",
        address: invoice.customer?.address || "",
      },
      company: {
        name: invoice.company?.name || "Your Company",
        address: invoice.company?.address || "",
        email: invoice.company?.email || "",
        phone: invoice.company?.phone || "",
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