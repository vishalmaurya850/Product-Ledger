import NextAuth from "next-auth"
import { NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "@/lib/auth"

const handler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, authOptions)

export { handler as GET, handler as POST }
