import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { deleteProduct, updateProduct } from "@/lib/actions"

export const dynamic = "force-dynamic" // Disable caching for this route

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const session = await auth();

    if (!session?.user?.id) {
      console.log("No authenticated user found in session");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const companyId = session.user.companyId || session.user.id;
    console.log(`Fetching product with ID: ${resolvedParams.id}`);

    const product = await db.product.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!product || product.companyId !== companyId) {
      console.log("Product not found");
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.log("Found product:", { id: product.id, name: product.name });

    return NextResponse.json(product, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const data = await request.json();

    console.log(`Updating product with ID: ${resolvedParams.id}`);

    // Create FormData to pass to the server action
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("unit", data.unit || "");
    formData.append("imageUrl", data.imageUrl || "");

    const result = await updateProduct(resolvedParams.id, formData);

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error,
        unauthorized: result.unauthorized 
      }, { 
        status: result.unauthorized ? 403 : 500 
      });
    }

    console.log("Product updated successfully");

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    console.log(`Deleting product with ID: ${resolvedParams.id}`);

    const result = await deleteProduct(resolvedParams.id);

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error,
        unauthorized: result.unauthorized 
      }, { 
        status: result.unauthorized ? 403 : 500 
      });
    }

    console.log("Product deleted successfully");
    return NextResponse.json({ 
      success: true,
      message: result.message 
    });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}