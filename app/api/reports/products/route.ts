import { NextResponse } from "next/server";
import { connectToDatabase, collections } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const companyId = session.user.id;
    const { db } = await connectToDatabase();

    // Use the correct method to query the products collection
    const categoryCounts = await db
      .collection(collections.products) // Access the products collection
      .aggregate([
        { $match: { companyId } }, // Match products belonging to the current company
        { $group: { _id: "$category", value: { $sum: 1 } } }, // Group by category and count
        { $project: { _id: 0, name: "$_id", value: 1 } }, // Format the output
        { $sort: { value: -1 } }, // Sort by count in descending order
        { $limit: 6 }, // Limit to top 6 categories
      ])
      .toArray();

    return NextResponse.json(categoryCounts);
  } catch (error) {
    console.error("Failed to fetch product report:", error);
    return NextResponse.json({ error: "Failed to fetch product report" }, { status: 500 });
  }
}