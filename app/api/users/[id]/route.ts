import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Check if user has permission to view users
    if (!session.user.permissions?.includes("users_view")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }

    const companyId = session.user.companyId
    const { db } = await connectToDatabase()

    // Get user by ID and ensure they belong to the same company
    const user = await db.collection(collections.users).findOne(
      { _id: new ObjectId(params.id), companyId },
      { projection: { password: 0 } }, // Exclude password
    )

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}