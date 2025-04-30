import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
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

    // Get all users from the same company
    const users = await db
      .collection(collections.users)
      .find({ companyId })
      .project({ password: 0 }) // Exclude password
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}