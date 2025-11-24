import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditUserForm } from "@/components/admin/edit-user-form"

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await (params)
  const userId = resolvedParams.id

  // Check if user is authenticated and has permission
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  // Check if user has permission to edit users
  if (!session.user.permissions?.includes("users_edit")) {
    redirect("/admin/users")
  }

  // Get user details (excluding password)
  const user = await db.user.findUnique({
    where: {
      id: userId,
      companyId: session.user.companyId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      companyId: true,
      companyName: true,
      role: true,
      permissions: true,
      createdAt: true,
      updatedAt: true,
    },
  })

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