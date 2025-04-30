import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { connectToDatabase, collections } from "@/lib/db"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { format } from "date-fns"
import { ArrowLeft, Edit, Mail, Phone, MapPin, CreditCard, User, Calendar } from "lucide-react"
// import { use } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export default async function ViewCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  // Use React.use to unwrap the params promise
  const resolvedParams = await (params)
  const customerId = resolvedParams.id

  // Check if user is authenticated
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/login")
  }

  // Check if user has permission to view customers
  if (!session.user.permissions?.includes("customers_view")) {
    redirect("/")
  }

  // Get customer details
  const { db } = await connectToDatabase()
  const customer = await db.collection(collections.customers).findOne({
    _id: new ObjectId(customerId),
    companyId: session.user.companyId,
  })

  if (!customer) {
    notFound()
  }

  // Get customer credit settings
  const creditSettings = await db.collection(collections.customerSettings).findOne({
    customerId: new ObjectId(customerId),
    companyId: session.user.companyId,
  })

  // Get recent ledger entries for this customer
  type LedgerEntry = {
    _id: ObjectId
    date: string
    type: string
    description: string
    amount: number
    status: string
  }

  const recentEntries: LedgerEntry[] = (await db
    .collection(collections.ledger)
    .find({
      customerId: new ObjectId(customerId),
      companyId: session.user.companyId,
    })
    .sort({ date: -1 })
    .limit(5)
    .toArray()).map((entry: LedgerEntry) => ({
      _id: entry._id,
      date: entry.date,
      type: entry.type,
      description: entry.description,
      amount: entry.amount,
      status: entry.status,
    }))

  // Calculate total outstanding amount
  const ledgerEntries = (await db
    .collection(collections.ledger)
    .find({
      customerId: new ObjectId(customerId),
      companyId: session.user.companyId,
    })
    .toArray()) as LedgerEntry[]

  let totalOutstanding = 0
  let totalPaid = 0
  let totalOverdue = 0

  ledgerEntries.forEach((entry: LedgerEntry) => {
    if (entry.type === "Sell" && entry.status !== "Paid") {
      totalOutstanding += entry.amount
      if (entry.status === "Overdue") {
        totalOverdue += entry.amount
      }
    } else if (entry.status === "Paid") {
      totalPaid += entry.amount
    }
  })

  // Check if current user can edit this customer
  const canEdit = session.user.permissions?.includes("customers_edit")

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customer Details</h2>
        <div className="flex items-center space-x-2">
          {canEdit && (
            <Link href={`/customers/${customerId}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Customer
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
              {customer.imageUrl ? (
                <Image
                  src={customer.imageUrl || "/placeholder.svg"}
                  alt={customer.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-muted">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <CardTitle>{customer.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Mail className="mr-2 h-4 w-4" />
                {customer.email}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone || "No phone number"}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-1" />
                    <span className="whitespace-pre-wrap">{customer.address || "No address"}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">ID Documents</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>PAN Card: {customer.panCard || "Not provided"}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Aadhar Card: {customer.aadharCard || "Not provided"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
              <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground">Created At</h4>
                  <div className="flex items-center mt-1">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(customer.createdAt), "PPP")}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground">Last Updated</h4>
                  <div className="flex items-center mt-1">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(customer.updatedAt), "PPP")}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Credit and payment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Credit Settings</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Credit Limit:</span>
                  <span className="font-medium">₹{creditSettings?.creditLimit.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Grace Period:</span>
                  <span className="font-medium">{creditSettings?.gracePeriod || 30} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Interest Rate:</span>
                  <span className="font-medium">{creditSettings?.interestRate || 18}% per annum</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-muted-foreground">Outstanding Balance</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Outstanding:</span>
                  <span className="font-medium text-amber-600">₹{totalOutstanding.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Overdue Amount:</span>
                  <span className="font-medium text-red-600">₹{totalOverdue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Paid:</span>
                  <span className="font-medium text-green-600">₹{totalPaid.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={`/ledger?customerId=${customerId}`}>View Full Ledger</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>The most recent ledger entries for this customer</CardDescription>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No transactions found for this customer</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEntries.map((entry) => (
                    <tr key={entry._id.toString()} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-2">{format(new Date(entry.date), "dd/MM/yyyy")}</td>
                      <td className="px-4 py-2">{entry.type}</td>
                      <td className="px-4 py-2">{entry.description}</td>
                      <td className="px-4 py-2 text-right">₹{entry.amount.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            entry.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : entry.status === "Overdue"
                                ? "bg-red-100 text-red-800"
                                : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/customers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Customers
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
