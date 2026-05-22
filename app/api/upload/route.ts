import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const companyId = session.user.companyId;

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const id = formData.get("id") as string; // ID of the customer or company
    const type = formData.get("type") as string; // Type: "customer" or "company"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    if (!type || (type !== "customer" && type !== "company")) {
      return NextResponse.json({ error: "Invalid type. Must be 'customer' or 'company'" }, { status: 400 });
    }

    // Verify ownership before allowing upload
    if (type === "customer") {
      const customer = await db.customer.findUnique({
        where: { id },
        select: { companyId: true }
      });
      if (!customer || customer.companyId !== companyId) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
    } else if (type === "company") {
      if (id !== companyId) {
        return NextResponse.json({ error: "Permission denied" }, { status: 403 });
      }
    }

    // Check file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename - strip original name to prevent path traversal
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: "Invalid file extension" }, { status: 400 });
    }
    const fileName = `${uuidv4()}.${ext}`;

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, fileName), buffer);
    } catch (error) {
      console.error("Error saving file:", error);
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
    }

    // Save the file URL in database
    const url = `/uploads/${fileName}`;
    try {
      if (type === "customer") {
        await db.customer.update({
          where: { id },
          data: { imageUrl: url }
        });
      } else if (type === "company") {
        await db.company.update({
          where: { id },
          data: { logo: url }
        });
      }
    } catch (error) {
      console.error("Error saving file URL in database:", error);
      return NextResponse.json({ error: "Failed to save file URL in database" }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
