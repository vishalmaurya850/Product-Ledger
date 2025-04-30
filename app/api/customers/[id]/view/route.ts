import { NextResponse } from "next/server";
import { connectToDatabase, collections } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user has permission to view customers
    if (!session.user.permissions?.includes("customers_view")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    const companyId = session.user.companyId;
    const { db } = await connectToDatabase();

    // Get customer by ID and ensure it belongs to the same company
    const customer = await db.collection(collections.customers).findOne({
      _id: new ObjectId(resolvedParams.id),
      companyId,
    });

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Get customer credit settings
    const creditSettings = await db.collection(collections.customerSettings).findOne({
      customerId: new ObjectId(resolvedParams.id),
      companyId,
    });

    // Get recent ledger entries for this customer
    const recentEntries = await db
      .collection(collections.ledger)
      .find({
        customerId: new ObjectId(resolvedParams.id),
        companyId,
      })
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    // Calculate total outstanding amount
    const ledgerEntries = await db
      .collection(collections.ledger)
      .find({
        customerId: new ObjectId(resolvedParams.id),
        companyId,
      })
      .toArray();

    const outstandingAmount = ledgerEntries.reduce((total: number, entry: { status: string; amount: number }) => {
      if (entry.status === "Unpaid" && typeof entry.amount === "number") {
        return total + entry.amount;
      }
      return total;
    }, 0);

    // Prepare the response
    const response = {
      customer: {
        id: customer._id.toString(),
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
      creditSettings: creditSettings || {
        customerId: resolvedParams.id,
        creditLimit: 10000,
        gracePeriod: 30,
        interestRate: 18,
        companyId,
      },
      recentEntries,
      outstandingAmount,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch customer details:", error);
    return NextResponse.json({ error: "Failed to fetch customer details" }, { status: 500 });
  }
}