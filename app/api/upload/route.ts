import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { connectToDatabase, collections } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

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

    // Generate unique filename
    const fileName = `${uuidv4()}-${file.name.replace(/\s/g, "_")}`.toLowerCase();

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true }); // Ensure the directory exists
      await writeFile(join(uploadDir, fileName), buffer);
    } catch (error) {
      console.error("Error saving file:", error);
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
    }

    // Save the file URL in MongoDB
    const url = `/uploads/${fileName}`;
    try {
      const { db } = await connectToDatabase();

      if (type === "customer") {
        // Update customer image
        const result = await db.collection(collections.customers).updateOne(
          { _id: new ObjectId(id) }, // Match the customer by ID
          { $set: { imageUrl: url, updatedAt: new Date() } } // Update the imageUrl field
        );

        if (result.matchedCount === 0) {
          return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        console.log("Image URL saved in MongoDB for customer:", id);
      } else if (type === "company") {
        // Update company logo
        const result = await db.collection(collections.companies).updateOne(
          { _id: new ObjectId(id) }, // Match the company by ID
          { $set: { logo: url, updatedAt: new Date() } } // Update the logo field
        );

        if (result.matchedCount === 0) {
          return NextResponse.json({ error: "Company not found" }, { status: 404 });
        }

        console.log("Logo URL saved in MongoDB for company:", id);
      }
    } catch (error) {
      console.error("Error saving file URL in MongoDB:", error);
      return NextResponse.json({ error: "Failed to save file URL in database" }, { status: 500 });
    }

    // Return the URL
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}