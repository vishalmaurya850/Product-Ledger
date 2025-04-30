import { NextResponse } from "next/server"
import { createUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { name, email, password, companyName } = await request.json()

    // Validate input
    if (!name || !email || !password || !companyName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    // Create user
    const user = await createUser({ name, email, password, companyName })

    if (!user) {
      return NextResponse.json({ error: "User creation failed" }, { status: 500 })
    }
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed" }, { status: 500 })
  }
}
