import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { NewUserForm } from "@/components/admin/new-user-form"
export default async function NewUserPage() {
  // Check if user is authenticated and has permission
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/login")
  }
  // Check if user has permission to create users
  if (!session.user.permissions?.includes("users_create")) {
    redirect("/admin/users")
  }
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add New User</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Create a new user account</CardDescription>
        </CardHeader>
        <CardContent>
          <NewUserForm companyId={session?.user?.companyId || ""} />
        </CardContent>
      </Card>
    </div>
  )
}