import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendOtpEmail(email: string, otp: string, type: "register" | "reset") {
  const subject = type === "register" ? "Verify your account" : "Reset your password"
  const description = type === "register" 
    ? "Thank you for registering. Please use the following OTP to verify your account:" 
    : "You requested a password reset. Please use the following OTP to reset your password:"

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${subject}</h2>
      <p>${description}</p>
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
        <h1 style="margin: 0; letter-spacing: 5px; color: #333;">${otp}</h1>
      </div>
      <p>This OTP is valid for 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    })
    console.log(`OTP sent to ${email}`)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}
