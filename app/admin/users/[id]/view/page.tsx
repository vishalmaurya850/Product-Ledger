import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { db, availablePermissions } from "@/lib/db"
import { format } from "date-fns"
import { ArrowLeft, Edit, Mail, Shield, Calendar, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ViewUserPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await (params)
  const userId = resolvedParams.id

  // Check if user is authenticated and has permission
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  // Check if user has permission to view users
  if (!session.user.permissions?.includes("users_view")) {
    redirect("/")
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

  // Group permissions by module
  const permissionsByModule: Record<string, string[]> = {}

  user.permissions.forEach((permission: string) => {
    const permissionInfo = availablePermissions.find((p) => p.name === permission)
    if (permissionInfo) {
      if (!permissionsByModule[permissionInfo.module]) {
        permissionsByModule[permissionInfo.module] = []
      }
      permissionsByModule[permissionInfo.module].push(permissionInfo.description)
    }
  })

  // Check if current user can edit this user
  const canEdit = session.user.permissions?.includes("users_edit")

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
        <div className="flex items-center space-x-2">
          {canEdit && (
            <Link href={`/admin/users/${userId}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </Button>
            </Link>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Mail className="mr-2 h-4 w-4" />
                {user.email}
              </CardDescription>
            </div>
            <Badge variant={user.role === "admin" ? "destructive" : "default"} className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Created on:</span>
                <span className="ml-2">{format(new Date(user.createdAt), "PPP")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Last updated:</span>
                <span className="ml-2">{format(new Date(user.updatedAt), "PPP")}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(permissionsByModule).map(([module, permissions]) => (
                <Card key={module} className="overflow-hidden">
                  <CardHeader className="bg-muted py-2">
                    <CardTitle className="text-base capitalize">{module}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="list-disc pl-5 space-y-1">
                      {permissions.map((permission, index) => (
                        <li key={index} className="text-sm">
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}