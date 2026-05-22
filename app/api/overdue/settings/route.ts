import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const companyId = session.user.companyId;
    try {
      // Fetch overdue settings from the database
      const settings = await db.overdueSettings.findUnique({ where: { companyId } });
      if (!settings) {
        console.warn(`No overdue settings found for companyId: ${companyId}. Returning default settings.`);
        return NextResponse.json({
          gracePeriod: 7, // Default grace period
          interestRate: 0.15, // Default interest rate
          compoundingPeriod: "daily",
          minimumFee: 5,
          creditLimit: 10000,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      console.log("Overdue settings fetched:", settings);
      return NextResponse.json(settings);
    } catch (error) {
      console.error("Database error while fetching overdue settings:", error);
      // Return default settings if database connection fails
      return NextResponse.json({
        gracePeriod: 7,
        interestRate: 0.15,
        compoundingPeriod: "daily",
        minimumFee: 5,
        creditLimit: 10000,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Failed to fetch overdue settings:", error);
    return NextResponse.json({ error: "Failed to fetch overdue settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const companyId = session.user.companyId;
    const body = await request.json();

    const settings = await db.overdueSettings.upsert({
      where: { companyId },
      update: {
        gracePeriod: body.gracePeriod !== undefined ? Number(body.gracePeriod) : undefined,
        interestRate: body.interestRate !== undefined ? Number(body.interestRate) : undefined,
        compoundingPeriod: body.compoundingPeriod || undefined,
        minimumFee: body.minimumFee !== undefined ? Number(body.minimumFee) : undefined,
        creditLimit: body.creditLimit !== undefined ? Number(body.creditLimit) : undefined,
      },
      create: {
        companyId,
        gracePeriod: Number(body.gracePeriod) || 7,
        interestRate: Number(body.interestRate) || 0.15,
        compoundingPeriod: body.compoundingPeriod || "daily",
        minimumFee: Number(body.minimumFee) || 5,
        creditLimit: body.creditLimit !== undefined ? Number(body.creditLimit) : 10000,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update overdue settings:", error);
    return NextResponse.json({ error: "Failed to update overdue settings" }, { status: 500 });
  }
}