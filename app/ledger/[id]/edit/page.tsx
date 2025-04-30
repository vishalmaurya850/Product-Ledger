import { notFound, redirect } from "next/navigation"
import { connectToDatabase, collections } from "@/lib/db"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
// import { use } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditLedgerEntryForm } from "@/components/ledger/edit-ledger-entry-form"

export default async function EditLedgerEntryPage({ params }: { params: Promise<{ id: string }> }) {
  // Use React.use to unwrap the params promise
  const resolvedParams = await (params)
  const entryId = resolvedParams.id

  // Check if user is authenticated and has permission
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  // Check if user has permission to edit ledger entries
  if (!session.user.permissions?.includes("ledger_edit")) {
    redirect("/ledger")
  }

  // Get ledger entry details
  const { db } = await connectToDatabase()
  const entry = await db.collection(collections.ledger).findOne({
    _id: new ObjectId(entryId),
    companyId: session.user.companyId,
  })

  if (!entry) {
    notFound()
  }

  // Get customer details
  const customer = await db.collection(collections.customers).findOne({
    _id: new ObjectId(entry.customerId),
    companyId: session.user.companyId,
  })

  if (!customer) {
    notFound()
  }

  // Get all customers for dropdown
  const customers = await db
    .collection(collections.customers)
    .find({ companyId: session.user.companyId })
    .sort({ name: 1 })
    .toArray()

  // Get all products for dropdown
  const products = await db
    .collection(collections.products)
    .find({ companyId: session.user.companyId })
    .sort({ name: 1 })
    .toArray()

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