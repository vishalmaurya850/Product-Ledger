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
    <div className="p-6 md:p-10 max-w-[1440px] mx-auto">
      <div className="mb-8">
        <h1 className="text-display-lg text-[var(--ink)]">Company Settings</h1>
        <p className="text-[17px] tracking-[-0.374px] text-[var(--body-muted)] mt-1">
          Manage your company details and settings.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <CompanySettingsForm company={JSON.parse(JSON.stringify(company))} readOnly={!canEdit} />
        </CardContent>
      </Card>
    </div>
  )
}