import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
;
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const companyId = session.user.id;
    // Group products by category if your schema has a category field
    // If not, you can group by another field or return top products by stock/price
    const productCounts = await db.product.groupBy({
      by: ['name'],
      where: { companyId },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 6,
    });
    const categoryCounts = productCounts.map(item => ({
      name: item.name,
      value: item._count.id,
    }));
    return NextResponse.json(categoryCounts);
  } catch (error) {
    console.error("Failed to fetch product report:", error);
    return NextResponse.json({ error: "Failed to fetch product report" }, { status: 500 });
  }
}