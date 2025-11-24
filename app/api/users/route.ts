import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    // Check if user has permission to view users
    if (!session.user.permissions?.includes("users_view")) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }
    const companyId = session.user.companyId
    // Get all users from the same company
    const users = await db.user.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
      }
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}