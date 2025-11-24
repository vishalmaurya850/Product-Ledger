import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
import Credentials from "next-auth/providers/credentials"

export const authConfig: NextAuthConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
          credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) return null
            
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          include: { company: true }
        })

        if (!user) return null

        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password)

        if (!isPasswordValid) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          companyName: user.company.name,
          permissions: user.permissions,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.companyId = user.companyId
        token.companyName = user.companyName
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.companyId = token.companyId as string
        session.user.companyName = token.companyName as string
        session.user.permissions = token.permissions as string[]
      }
      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export async function createUser(data: any) {
  try {
    const { name, email, password, companyName } = data
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create company first
    const company = await db.company.create({
      data: {
        name: companyName || "My Company",
      }
    })

    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        companyId: company.id,
        role: "admin", // Making the first user admin of the company
        permissions: ["ledger_view", "products_view", "customers_view", "settings_view", "reports_view"],
      }
    })

    return {
      id: user.id,
      name,
      email,
    }
  } catch (error: any) {
    console.error("Failed to create user:", error)
    throw new Error(error.message || "Failed to create user")
  }
}

export async function generatePasswordResetToken(email: string) {
  // Check if user exists
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })

  if (!user) {
    // Returning the email to prevent email enumeration attacks
    return { token: "", email }
  }

  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 hour

  // Delete any existing tokens for this user
  await db.passwordReset.deleteMany({ where: { userId: user.id } })

  // Create new password reset token
  await db.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expires,
    }
  })

  return { token, email: user.email }
}

export async function resetPassword(token: string, password: string) {
  // Get password reset token
  const passwordReset = await db.passwordReset.findFirst({ where: { token } })

  if (!passwordReset) {
    throw new Error("Invalid token")
  }

  if (passwordReset.expires < new Date()) {
    throw new Error("Token has expired")
  }

  // Get user
  const user = await db.user.findUnique({ where: { id: passwordReset.userId } })

  if (!user) {
    throw new Error("User not found")
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Update user's password
  await db.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
    }
  })

  // Delete password reset token
  await db.passwordReset.delete({ where: { id: passwordReset.id } })
}
