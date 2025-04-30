import { NextResponse } from "next/server"
import { generatePasswordResetToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Generate token
    const { token, email: userEmail } = await generatePasswordResetToken(email)

    // Create reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

    // Send email with reset link
    await fetch(`${process.env.NEXTAUTH_URL}/api/email/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail, resetLink }),
    })

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password reset error:", error)
    // Always return success to prevent email enumeration attacks
    return NextResponse.json({ success: true })
  }
}