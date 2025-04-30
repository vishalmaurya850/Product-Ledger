import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { email, resetLink } = await request.json()

    // Create a test account if no email configuration is provided
    // In production, you would use your actual email service credentials
    const testAccount = await nodemailer.createTestAccount()

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || "smtp.ethereal.email",
      port: Number.parseInt(process.env.EMAIL_SERVER_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER || testAccount.user,
        pass: process.env.EMAIL_SERVER_PASSWORD || testAccount.pass,
      },
    })

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Product Ledger" <noreply@productledger.com>',
      to: email,
      subject: "Reset Your Password - Product Ledger",
      text: `
        Hello,
        
        You requested to reset your password for your Product Ledger account.
        
        Please click the link below to reset your password:
        ${resetLink}
        
        If you did not request a password reset, please ignore this email.
        
        This link will expire in 1 hour.
        
        Regards,
        The Product Ledger Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Reset Your Password</h2>
          <p>Hello,</p>
          <p>You requested to reset your password for your Product Ledger account.</p>
          <p>Please click the button below to reset your password:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          </p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>This link will expire in 1 hour.</p>
          <p>Regards,<br>The Product Ledger Team</p>
        </div>
      `,
    })

    // For development purposes, log the preview URL
    if (!process.env.EMAIL_SERVER_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to send email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}