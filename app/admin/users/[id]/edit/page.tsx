import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase, collections } from "@/lib/db"
import { ObjectId } from "mongodb"
// import { use } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditUserForm } from "@/components/admin/edit-user-form"

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  // Use React.use to unwrap the params promise
  const resolvedParams = await (params)
  const userId = resolvedParams.id

  // Check if user is authenticated and has permission
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  // Check if user has permission to edit users
  if (!session.user.permissions?.includes("users_edit")) {
    redirect("/admin/users")
  }

  // Get user details
  const { db } = await connectToDatabase()
  const user = await db.collection(collections.users).findOne(
    {
      _id: new ObjectId(userId),
      companyId: session.user.companyId,
    },
    { projection: { password: 0 } }, // Exclude password
  )

  if (!user) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Update user information and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <EditUserForm user={JSON.parse(JSON.stringify(user))} />
        </CardContent>
      </Card>
    </div>
  )
}