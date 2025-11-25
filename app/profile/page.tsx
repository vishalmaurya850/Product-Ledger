import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db, availablePermissions } from "@/lib/db"
import { format } from "date-fns"
import { Mail, Shield, Calendar, Clock, Building2, User, Key, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function ProfilePage() {
  // Check if user is authenticated
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  // Get current user details (excluding password)
  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      company: true,
    },
  })

  if (!user) {
    redirect("/auth/login")
  }

  // Group permissions by module
  const permissionsByModule: Record<string, { name: string; description: string }[]> = {}

  user.permissions.forEach((permission: string) => {
    const permissionInfo = availablePermissions.find((p) => p.name === permission)
    if (permissionInfo) {
      if (!permissionsByModule[permissionInfo.module]) {
        permissionsByModule[permissionInfo.module] = []
      }
      permissionsByModule[permissionInfo.module].push({
        name: permissionInfo.action,
        description: permissionInfo.description,
      })
    }
  })

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const moduleIcons: Record<string, any> = {
    dashboard: "📊",
    ledger: "📒",
    products: "📦",
    customers: "👥",
    users: "👤",
    reports: "📈",
    settings: "⚙️",
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">View and manage your account information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-3 lg:col-span-1">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary/10">
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              {user.email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant={user.role === "admin" ? "destructive" : "secondary"} className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">User ID</span>
                <span className="text-sm font-mono">{user.id.slice(0, 8)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Joined</span>
                <span className="text-sm">{format(new Date(user.createdAt), "MMM yyyy")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="md:col-span-3 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your personal details and account status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name
                </label>
                <div className="text-lg">{user.name}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address
                </label>
                <div className="text-lg">{user.email}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Account Created
                </label>
                <div className="text-lg">{format(new Date(user.createdAt), "PPP")}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Last Updated
                </label>
                <div className="text-lg">{format(new Date(user.updatedAt), "PPP")}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Company Details
                </label>
                <Card className="bg-muted/50">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-muted-foreground">Company Name</span>
                      <span className="font-semibold text-right">{user.company.name}</span>
                    </div>
                    {user.company.address && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">Address</span>
                        <span className="font-medium text-right text-sm max-w-[200px]">{user.company.address}</span>
                      </div>
                    )}
                    {user.company.phone && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">Phone</span>
                        <span className="font-medium">{user.company.phone}</span>
                      </div>
                    )}
                    {user.company.email && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="font-medium">{user.company.email}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Permissions & Access
          </CardTitle>
          <CardDescription>
            Your current permissions across different modules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(permissionsByModule).length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(permissionsByModule).map(([module, permissions]) => (
                <Card key={module} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-2xl">{moduleIcons[module] || "📋"}</span>
                      <span className="capitalize">{module}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {permissions.map((permission, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{permission.description}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No specific permissions assigned</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.permissions.length}</div>
            <p className="text-xs text-muted-foreground">Active permissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Module Access</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(permissionsByModule).length}</div>
            <p className="text-xs text-muted-foreground">Modules accessible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Account is active</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
