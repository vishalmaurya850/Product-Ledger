import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { validationSchemas, sanitizeObject } from "@/lib/security"
export const dynamic = "force-dynamic" // Disable caching for this route
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const companyId = session.user.companyId
    const products = await db.product.findMany({
      where: { companyId },
      orderBy: { name: 'asc' }
    })
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
    const companyId = session.user.companyId
    const userId = session.user.id
    const rawData = await request.json()

    // Validate input
    const validation = validationSchemas.product.safeParse(rawData)
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input", details: validation.error.issues }, { status: 400 })
    }

    // Sanitize data
    const data = sanitizeObject(validation.data)

    const product = await db.product.create({
      data: {
        name: data.name,
        description: data.description || "",
        price: data.price,
        stock: Number(rawData.stock) || 0,
        unit: data.unit || "",
        imageUrl: data.imageUrl || null,
        sku: rawData.sku || "",
        category: rawData.category || "",
        companyId,
        createdBy: userId,
      }
    })
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