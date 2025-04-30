import "next-auth"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id */
      id: string
      /** The user's role */
      role: string
      /** The user's company ID */
      companyId: string
      /** The user's company name */
      companyName: string
      /** The user's permissions */
      permissions: string[]
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name: string
    email: string
    role: string
    companyId: string
    companyName: string
    permissions: string[]
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's id */
    id: string
    /** The user's role */
    role: string
    /** The user's company ID */
    companyId: string
    /** The user's company name */
    companyName: string
    /** The user's permissions */
    permissions: string[]
  }
}