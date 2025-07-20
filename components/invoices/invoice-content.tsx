"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface InvoiceData {
  _id: string
  companyId: string
  customerId: string
  type: string
  amount: number
  description: string
  status: string
  dueDate?: string
  settledAt?: string
  createdAt: string
  updatedAt: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  company: {
    name: string
    address: string
    email: string
    phone: string
  }
  payments: Array<{
    amount: number
    date: string
    method: string
  }>
  remainingAmount: number
}

interface InvoiceContentProps {
  invoiceId: string
}

export function InvoiceContent({ invoiceId }: InvoiceContentProps) {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchInvoiceData()
  }, [invoiceId])

  const fetchInvoiceData = async () => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch invoice data")
      }
      const data = await response.json()
      setInvoice(data)
    } catch (error) {
      console.error("Error fetching invoice:", error)
      toast.error("Failed to load invoice")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/download`)
      if (!response.ok) {
        throw new Error("Failed to download invoice")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `invoice-${invoiceId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Invoice downloaded successfully")
    } catch (error) {
      console.error("Error downloading invoice:", error)
      toast.error("Failed to download invoice")
    } finally {
      setIsDownloading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Invoice Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          The invoice you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200"
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200"
      case "Partially Paid":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Invoice #{invoice._id.slice(-8)}</h1>
            <p className="text-muted-foreground">Created on {format(new Date(invoice.createdAt), "MMMM d, yyyy")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download PDF
          </Button>
        </div>
      </div>

      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company and Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">From:</h3>
              <div className="space-y-1">
                <p className="font-medium">{invoice.company.name}</p>
                <p className="text-sm text-muted-foreground">{invoice.company.address}</p>
                <p className="text-sm text-muted-foreground">{invoice.company.email}</p>
                <p className="text-sm text-muted-foreground">{invoice.company.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">To:</h3>
              <div className="space-y-1">
                <p className="font-medium">{invoice.customer.name}</p>
                <p className="text-sm text-muted-foreground">{invoice.customer.address}</p>
                <p className="text-sm text-muted-foreground">{invoice.customer.email}</p>
                <p className="text-sm text-muted-foreground">{invoice.customer.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Invoice Date</p>
              <p className="font-medium">{format(new Date(invoice.createdAt), "MMM d, yyyy")}</p>
            </div>
            {invoice.dueDate && (
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">{format(new Date(invoice.dueDate), "MMM d, yyyy")}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
            </div>
          </div>

          <Separator />

          {/* Line Items */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Description</h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <p>{invoice.description}</p>
            </div>
          </div>

          <Separator />

          {/* Amount Summary */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-lg">Total Amount:</span>
              <span className="text-lg font-semibold">₹{invoice.amount.toFixed(2)}</span>
            </div>
            {invoice.payments.length > 0 && (
              <>
                <div className="flex justify-between items-center text-green-600">
                  <span>Amount Paid:</span>
                  <span>₹{(invoice.amount - invoice.remainingAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-orange-600">
                  <span>Remaining Amount:</span>
                  <span className="font-semibold">₹{invoice.remainingAmount.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Payment History */}
          {invoice.payments.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-4">Payment History</h3>
                <div className="space-y-2">
                  {invoice.payments.map((payment, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">₹{payment.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(payment.date), "MMM d, yyyy")} • {payment.method}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Paid
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}