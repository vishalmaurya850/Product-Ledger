import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CompanySettingsForm } from "@/components/admin/company-settings-form"
export default async function AdminSettingsPage() {
  // Check if user is authenticated and has permission
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/login")
  }
  // Check if user has permission to view settings
  if (!session.user.permissions?.includes("settings_view")) {
    redirect("/")
  }
  // Get company details
  let company = await db.company.findUnique({
    where: { id: session.user.companyId },
  })
  if (!company) {
    company = {
      id: session.user.companyId,
      name: session.user.companyName || "",
      address: "",
      phone: "",
      email: session.user.email || "",
      website: "",
      logo: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
  // Check if user can edit settings
  const canEdit = session.user.permissions?.includes("settings_edit")
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Company Settings</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Manage your company details and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <CompanySettingsForm company={JSON.parse(JSON.stringify(company))} readOnly={!canEdit} />
        </CardContent>
      </Card>
    </div>
  )
}