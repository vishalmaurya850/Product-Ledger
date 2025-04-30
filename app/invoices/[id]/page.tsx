import { notFound } from "next/navigation"
import Link from "next/link"
import { connectToDatabase, collections } from "@/lib/db"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { format } from "date-fns"
import { ArrowLeft, Download } from "lucide-react"
import { PrintButton } from "@/components/ui/print-button";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  // Use React.use to unwrap the params promise
  const resolvedParams = await params
  const invoiceId = resolvedParams.id

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return <div>Not authenticated</div>
  }

  const companyId = session.user.id
  const { db } = await connectToDatabase()

  // Get the ledger entry
  let entry
  try {
    entry = await db.collection(collections.ledger).findOne({
      _id: new ObjectId(invoiceId),
      companyId,
    })
  } catch (error) {
    console.error("Error fetching invoice:", error)
  }

  if (!entry) {
    notFound()
  }

  // Get customer details
  let customer
  try {
    customer = await db.collection(collections.customers).findOne({
      _id: new ObjectId(entry.customerId),
      companyId,
    })
  } catch (error) {
    console.error("Error fetching customer:", error)
  }

  // Get company details
  let company
  try {
    company = await db.collection(collections.users).findOne({
      _id: new ObjectId(companyId),
    })
  } catch (error) {
    console.error("Error fetching company:", error)
  }

  // Calculate days since creation for unpaid entries
  let daysSinceCreation = 0
  let interest = 0

  if (entry.status !== "Paid" && entry.type === "Sell") {
    daysSinceCreation = Math.floor((new Date().getTime() - new Date(entry.date).getTime()) / (1000 * 60 * 60 * 24))

    // Get credit settings
    const creditSettings = (await db.collection(collections.customerSettings).findOne({
      customerId: new ObjectId(entry.customerId),
      companyId,
    })) || { gracePeriod: 30, interestRate: 18 }

    // Calculate interest if past grace period
    if (daysSinceCreation > creditSettings.gracePeriod) {
      const daysWithInterest = daysSinceCreation - creditSettings.gracePeriod
      const dailyRate = creditSettings.interestRate / 365 / 100
      interest = entry.amount * dailyRate * daysWithInterest
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Invoice</h2>
        <div className="flex items-center space-x-2">
          <PrintButton />
          <Button asChild>
            <Link href={`/api/invoices/${invoiceId}/download`}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Link>
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle className="text-2xl">Invoice #{entry.invoiceNumber}</CardTitle>
              <p className="text-muted-foreground mt-1">{format(new Date(entry.date), "MMMM d, yyyy")}</p>
            </div>
            <Badge
              className="mt-2 md:mt-0"
              variant={
                entry.status === "Paid"
                  ? "outline"
                  : daysSinceCreation > (customer?.gracePeriod || 30)
                    ? "destructive"
                    : "secondary"
              }
            >
              {entry.status === "Paid"
                ? "Paid"
                : daysSinceCreation > (customer?.gracePeriod || 30)
                  ? `Overdue (${daysSinceCreation} days)`
                  : `Unpaid (${daysSinceCreation} days)`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">From</h3>
              <p className="font-medium">{company?.companyName || "Your Company"}</p>
              <p>{company?.email || ""}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">To</h3>
              <p className="font-medium">{customer?.name}</p>
              <p>{customer?.email}</p>
              {customer?.phone && <p>{customer.phone}</p>}
              {customer?.address && <p className="max-w-md">{customer.address}</p>}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Transaction Details</h3>
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Description</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-right p-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3">{entry.description}</td>
                    <td className="p-3">
                      <Badge
                        variant={
                          entry.type === "Sell" ? "default" : entry.type === "Payment In" ? "outline" : "destructive"
                        }
                      >
                        {entry.type}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">₹{entry.amount.toFixed(2)}</td>
                  </tr>
                  {interest > 0 && (
                    <tr className="border-t">
                      <td className="p-3">Interest ({daysSinceCreation - (customer?.gracePeriod || 30)} days)</td>
                      <td className="p-3"></td>
                      <td className="p-3 text-right text-red-600">₹{interest.toFixed(2)}</td>
                    </tr>
                    
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={2} className="p-3 font-semibold">
                      Total
                    </td>
                    <td className="p-3 text-right font-semibold">₹{(entry.amount + interest).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {entry.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-muted-foreground">{entry.notes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/ledger?customerId=${entry.customerId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Ledger
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}