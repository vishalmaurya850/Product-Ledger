import { NextResponse } from "next/server";
import { connectToDatabase, collections } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const companyId = session.user.companyId;

    try {
      const { db } = await connectToDatabase();

      // Fetch overdue settings from the database
      const settings = await db.collection(collections.customerSettings).findOne({ companyId });

      if (!settings) {
        console.warn(`No overdue settings found for companyId: ${companyId}. Returning default settings.`);
        return NextResponse.json({
          gracePeriod: 7, // Default grace period
          interestRate: 0.15, // Default interest rate
          compoundingPeriod: "daily",
          minimumFee: 5,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  } catch (error) {
    console.error("Failed to fetch overdue settings:", error);
    return NextResponse.json({ error: "Failed to fetch overdue settings" }, { status: 500 });
  }
}