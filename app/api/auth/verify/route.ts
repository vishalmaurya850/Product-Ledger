import { NextResponse } from "next/server"
import { db } from "@/lib/db"

// Simple in-memory rate limiter for OTP verification attempts
const otpAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_OTP_ATTEMPTS = 5
const OTP_LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

function checkOtpRateLimit(email: string): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now()
  const record = otpAttempts.get(email)

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_OTP_ATTEMPTS - 1 }
  }

  // Reset if lockout period has passed
  if (now - record.lastAttempt > OTP_LOCKOUT_DURATION) {
    otpAttempts.delete(email)
    return { allowed: true, remainingAttempts: MAX_OTP_ATTEMPTS - 1 }
  }

  if (record.count >= MAX_OTP_ATTEMPTS) {
    return { allowed: false, remainingAttempts: 0 }
  }

  return { allowed: true, remainingAttempts: MAX_OTP_ATTEMPTS - record.count - 1 }
}

function recordOtpAttempt(email: string): void {
  const now = Date.now()
  const record = otpAttempts.get(email)

  if (!record) {
    otpAttempts.set(email, { count: 1, lastAttempt: now })
  } else {
    otpAttempts.set(email, { count: record.count + 1, lastAttempt: now })
  }

  // Cleanup old entries periodically
  if (otpAttempts.size > 1000) {
    const cutoff = now - OTP_LOCKOUT_DURATION
    for (const [key, val] of otpAttempts.entries()) {
      if (val.lastAttempt < cutoff) {
        otpAttempts.delete(key)
      }
    }
  }
}

function clearOtpAttempts(email: string): void {
  otpAttempts.delete(email)
}

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase()

    // Check rate limit before processing
    const { allowed, remainingAttempts } = checkOtpRateLimit(normalizedEmail)
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please try again in 15 minutes." },
        { status: 429 }
      )
    }

    // Find token
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        identifier: normalizedEmail,
        token: otp,
      },
    })

    if (!verificationToken) {
      // Record failed attempt
      recordOtpAttempt(normalizedEmail)
      return NextResponse.json(
        { error: "Invalid OTP", remainingAttempts },
        { status: 400 }
      )
    }

    // Check expiration
    if (new Date() > verificationToken.expires) {
      recordOtpAttempt(normalizedEmail)
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

    // Clear rate limit on success
    clearOtpAttempts(normalizedEmail)

    return NextResponse.json({ success: true, message: "Email verified successfully" })

  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
