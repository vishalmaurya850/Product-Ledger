import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    // Get user by ID and ensure they belong to the same company
    const user = await db.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyId: true,
        permissions: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user || user.companyId !== companyId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}