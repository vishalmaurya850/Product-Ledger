import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import crypto from "crypto"
import { sendOtpEmail } from "@/lib/mail"

export async function POST(request: Request) {
  try {
    const { name, email, password, companyName } = await request.json()

    // Validate input
    if (!name || !email || !password || !companyName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Strong password check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json({ 
        error: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character" 
      }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase()

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
      }
      
      // If user exists but not verified, update details and resend OTP
      const hashedPassword = await bcrypt.hash(password, 12)
      
      // Update user and company name if needed (optional, but good for correction)
      await db.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          password: hashedPassword,
          company: {
            update: {
              name: companyName
            }
          }
        }
      })
    } else {
      // Create new user and company
      const hashedPassword = await bcrypt.hash(password, 12)

      const company = await db.company.create({
        data: {
          name: companyName,
        }
      })

      await db.user.create({
        data: {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          companyId: company.id,
          role: "admin",
          permissions: ["ledger_view", "products_view", "customers_view", "settings_view", "reports_view"],
          emailVerified: null, // Explicitly null
        }
      })
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP - Delete old tokens for this email, then create new one
    await db.verificationToken.deleteMany({
      where: { identifier: normalizedEmail }
    })
    
    await db.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token: otp,
        expires
      }
    })

    // Send Email
    const emailSent = await sendOtpEmail(normalizedEmail, otp, "register")

    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "OTP sent to email" })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed" }, { status: 500 })
  }
}
