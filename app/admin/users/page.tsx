import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminUsersTable } from "@/components/admin/admin-users-table"
export default async function AdminUsersPage() {
  // Check if user is authenticated and has permission
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/login")
  }
  // Check if user has permission to view users
  if (!session.user.permissions?.includes("users_view")) {
    redirect("/")
  }
  // Get all users for this company (excluding password)
  const users = await db.user.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { createdAt: 'desc' },
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
  // Check if user can create new users
  const canCreateUsers = session.user.permissions?.includes("users_create")
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        {canCreateUsers && (
          <Link href="/admin/users/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </Link>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminUsersTable users={JSON.parse(JSON.stringify(users))} />
        </CardContent>
      </Card>
    </div>
  )
}
