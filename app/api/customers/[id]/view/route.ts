import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user has permission to view customers
    if (!session.user.permissions?.includes("customers_view")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const companyId = session.user.companyId;

    // Get customer by ID with credit settings and recent entries
    const customer = await db.customer.findUnique({
      where: { id: resolvedParams.id },
      include: {
        customerCreditSettings: true,
        ledgerEntries: {
          where: { companyId },
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });

    if (!customer || customer.companyId !== companyId) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Calculate total outstanding amount
    const outstandingResult = await db.ledgerEntry.aggregate({
      where: {
        customerId: resolvedParams.id,
        companyId,
        status: "Unpaid",
      },
      _sum: { amount: true },
    });

    const outstandingAmount = outstandingResult._sum.amount || 0;

    // Prepare the response
    const response = {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        panCard: customer.panCard,
        aadharCard: customer.aadharCard,
        imageUrl: customer.imageUrl,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      },
      creditSettings: customer.customerCreditSettings || {
        customerId: resolvedParams.id,
        creditLimit: 10000,
        gracePeriod: 30,
        interestRate: 18,
        companyId,
      },
      recentEntries: customer.ledgerEntries,
      outstandingAmount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch customer details:", error);
    return NextResponse.json({ error: "Failed to fetch customer details" }, { status: 500 });
  }
}