import type { NextAuthOptions } from "next-auth"
// import { MongoDBAdapter } from "@auth/mongodb-adapter"
import bcrypt from "bcryptjs"
import { connectToDatabase, collections } from "@/lib/db"
import { ObjectId } from "mongodb"
import { v4 as uuidv4 } from "uuid"
import Credentials from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
          credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials: Record<string, string> | undefined) {
            if (!credentials || !credentials.email || !credentials.password) return null
            if (!credentials?.email || !credentials?.password) return null

        const { db } = await connectToDatabase()

        const user = await db.collection(collections.users).findOne({
          email: credentials.email,
        })

        if (!user) return null

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) return null

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          companyName: user.companyName,
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
  // Removed the invalid adapter property as it is not supported by NextAuthOptions
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
}

export async function createUser(data: any) {
  try {
    const { name, email, password, companyName } = data
    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection(collections.users).findOne({ email: email.toLowerCase() })
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      companyName,
      role: "user",
      permissions: ["ledger_view", "products_view", "customers_view"],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(collections.users).insertOne(user)

    return {
      id: result.insertedId,
      name,
      email,
    }
  } catch (error: any) {
    console.error("Failed to create user:", error)
    throw new Error(error.message || "Failed to create user")
  }
}

export async function generatePasswordResetToken(email: string) {
  const { db } = await connectToDatabase()

  // Check if user exists
  const user = await db.collection(collections.users).findOne({ email: email.toLowerCase() })

  if (!user) {
    // Returning the email to prevent email enumeration attacks
    return { token: "", email }
  }

  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000) // 1 hour

  // Delete any existing tokens for this user
  await db.collection(collections.passwordResets).deleteMany({ userId: user._id })

  // Create new password reset token
  await db.collection(collections.passwordResets).insertOne({
    userId: user._id,
    token,
    expires,
    createdAt: new Date(),
  })

  return { token, email: user.email }
}

export async function resetPassword(token: string, password: string) {
  const { db } = await connectToDatabase()

  // Get password reset token
  const passwordReset = await db.collection(collections.passwordResets).findOne({ token })

  if (!passwordReset) {
    throw new Error("Invalid token")
  }

  if (passwordReset.expires < new Date()) {
    throw new Error("Token has expired")
  }

  // Get user
  const user = await db.collection(collections.users).findOne({ _id: passwordReset.userId })

  if (!user) {
    throw new Error("User not found")
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Update user's password
  await db.collection(collections.users).updateOne(
    { _id: user._id },
    {
      $set: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    },
  )

  // Delete password reset token
  await db.collection(collections.passwordResets).deleteOne({ token })
}
