import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase()

    // Find token
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        identifier: normalizedEmail,
        token: otp,
      },
    })

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    // Check expiration
    if (new Date() > verificationToken.expires) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 })
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify user
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
      },
    })

    // Delete token
    await db.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: normalizedEmail,
          token: otp,
        },
      },
    })

    return NextResponse.json({ success: true, message: "Email verified successfully" })

  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
