import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import crypto from "crypto"
import { sendOtpEmail } from "@/lib/mail"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase()

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    // If user exists, generate OTP and send email
    if (user) {
      const otp = crypto.randomInt(100000, 999999).toString()
      const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      // Delete existing tokens
      await db.verificationToken.deleteMany({
        where: { identifier: normalizedEmail },
      })

      // Create new token
      await db.verificationToken.create({
        data: {
          identifier: normalizedEmail,
          token: otp,
          expires,
        },
      })

      // Send email
      await sendOtpEmail(normalizedEmail, otp, "reset")
    }

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({ success: true, message: "If an account exists, a reset code has been sent." })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ success: true, message: "If an account exists, a reset code has been sent." })
  }
}