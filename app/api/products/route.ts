import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
export const dynamic = "force-dynamic" // Disable caching for this route
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      console.log("No authenticated user found in session")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const companyId = session.user.companyId || session.user.id
    console.log("Using companyId for query:", companyId)
    const products = await db.product.findMany({
      where: { companyId },
      orderBy: { name: 'asc' }
    })
    console.log(`Found ${products.length} products for company ${companyId}`)
    return NextResponse.json(products, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
      },
    })
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const companyId = session.user.companyId || session.user.id
    const userId = session.user.id
    console.log("Using companyId for new product:", companyId)
    const data = await request.json()
    const product = await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        unit: data.unit,
        imageUrl: data.imageUrl,
        sku: data.sku,
        category: data.category,
        companyId,
        createdBy: userId,
      }
    })
    console.log("Product created with ID:", product.id)
    return NextResponse.json({
      success: true,
      id: product.id,
      product,
    })
  } catch (error) {
    console.error("Failed to create product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}