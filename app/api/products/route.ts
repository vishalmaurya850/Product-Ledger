import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic" // Disable caching for this route

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      console.log("No authenticated user found in session")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Debug session data
    console.log("Session user:", {
      id: session.user.id,
      companyId: session.user.companyId,
      email: session.user.email,
    })

    // Use companyId from session if available, otherwise fall back to user.id
    const companyId = session.user.companyId || session.user.id
    console.log("Using companyId for query:", companyId)

    const { db } = await connectToDatabase()

    // Debug the MongoDB connection
    console.log("Connected to database:", db.databaseName)

    // First, check if the collection exists and has documents
    const collectionExists = await db.listCollections({ name: collections.products }).toArray()
    console.log("Products collection exists:", collectionExists.length > 0)

    // Count total documents in the collection
    const totalProducts = await db.collection(collections.products).countDocuments()
    console.log("Total products in collection:", totalProducts)

    // Try to find products with this companyId
    const products = await db.collection(collections.products).find({ companyId }).sort({ name: 1 }).toArray()
    console.log(`Found ${products.length} products for company ${companyId}`)

    // If no products found with companyId, try a more lenient approach
    if (products.length === 0) {
      console.log("No products found with exact companyId match, trying alternative approaches")

      // Try to find any products in the collection
      const anyProducts = await db.collection(collections.products).find({}).limit(5).toArray()
      console.log(`Found ${anyProducts.length} products without companyId filter`)

      if (anyProducts.length > 0) {
        // Return these products as a fallback
        console.log("Returning products without companyId filter as fallback")
        return NextResponse.json(anyProducts, {
          headers: {
            "Cache-Control": "no-store, max-age=0",
            Pragma: "no-cache",
          },
        })
      }
    }

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
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Use companyId from session if available, otherwise fall back to user.id
    const companyId = session.user.companyId || session.user.id
    console.log("Using companyId for new product:", companyId)

    const { db } = await connectToDatabase()
    const data = await request.json()

    // Add timestamps and company ID
    const product = {
      ...data,
      stock: Number(data.stock),
      price: Number(data.price),
      companyId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("Creating new product:", { name: product.name, sku: product.sku, companyId: product.companyId })
    const result = await db.collection(collections.products).insertOne(product)
    console.log("Product created with ID:", result.insertedId)

    // Convert ObjectId to string before returning
    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      product: { ...product, _id: result.insertedId.toString() },
    })
  } catch (error) {
    console.error("Failed to create product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}