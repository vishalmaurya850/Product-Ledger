import { notFound, redirect } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditLedgerEntryForm } from "@/components/ledger/edit-ledger-entry-form"

export default async function EditLedgerEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await (params)
  const entryId = resolvedParams.id

  // Check if user is authenticated and has permission
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  // Check if user has permission to edit ledger entries
  if (!session.user.permissions?.includes("ledger_edit")) {
    redirect("/ledger")
  }

  // Get ledger entry details with customer
  const entry = await db.ledgerEntry.findUnique({
    where: { id: entryId },
    include: {
      customer: true,
    },
  })

  if (!entry || entry.companyId !== session.user.companyId) {
    notFound()
  }

  if (!entry.customer) {
    notFound()
  }

  // Get all customers for dropdown
  const customers = await db.customer.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { name: 'asc' },
  })

  // Get all products for dropdown
  const products = await db.product.findMany({
    where: { companyId: session.user.companyId },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Ledger Entry</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ledger Entry Details</CardTitle>
          <CardDescription>Update the ledger entry information</CardDescription>
        </CardHeader>
        <CardContent>
          <EditLedgerEntryForm
            entry={JSON.parse(JSON.stringify(entry))}
            customers={JSON.parse(JSON.stringify(customers))}
            products={JSON.parse(JSON.stringify(products))}
          />
        </CardContent>
      </Card>
    </div>
  )
}