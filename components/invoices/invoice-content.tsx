"use client"

import { useEffect, useState, useRef } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Loader2, ArrowLeft, Printer, Share2, Mail, Phone, MapPin, Calendar, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useReactToPrint } from "react-to-print"

interface InvoiceData {
  id: string
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
  const invoiceRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${invoiceId.slice(-8)}`,
  })

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

  const handleShare = async () => {
    try {
      // Check if Web Share API is available
      if (!navigator.share) {
        toast.error("Share not supported on this device")
        return
      }

      // Fetch the PDF for sharing
      const response = await fetch(`/api/invoices/${invoiceId}`)
      if (!response.ok) {
        throw new Error("Failed to load invoice")
      }

      const blob = await response.blob()
      const file = new File([blob], `invoice-${invoiceId}.pdf`, { type: "application/pdf" })

      // Check if the device can share files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Invoice #${invoiceId.slice(-8).toUpperCase()}`,
          text: `Invoice from ${invoice?.company.name || "Company"}`,
          files: [file],
        })
        toast.success("Invoice shared successfully")
      } else {
        // Fallback to sharing just the URL/text if file sharing isn't supported
        const shareUrl = window.location.href
        await navigator.share({
          title: `Invoice #${invoiceId.slice(-8).toUpperCase()}`,
          text: `Invoice from ${invoice?.company.name || "Company"}`,
          url: shareUrl,
        })
        toast.success("Invoice link shared successfully")
      }
    } catch (error: any) {
      // User cancelled the share or an error occurred
      if (error.name !== "AbortError") {
        console.error("Error sharing invoice:", error)
        toast.error("Failed to share invoice")
      }
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Action Buttons - Not printed */}
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          {/* <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download PDF
          </Button> */}
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Professional Invoice Template */}
      <div ref={invoiceRef} className="bg-white dark:bg-gray-950 print:bg-white">
        <Card className="border-2 print:border-0 print:shadow-none">
          <CardContent className="p-8 md:p-12">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-gray-200 dark:border-gray-700 print:border-gray-300">
              <div>
                <h1 className="text-4xl font-bold text-primary mb-2">{invoice.company.name}</h1>
                <div className="space-y-1 text-sm text-muted-foreground print:text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{invoice.company.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{invoice.company.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{invoice.company.phone}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block bg-primary/10 px-6 py-3 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground print:text-gray-600 mb-1">INVOICE</p>
                  <p className="text-2xl font-bold text-primary">#{invoice.id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-muted-foreground print:text-gray-600">Date:</span>
                    <span className="font-semibold">{format(new Date(invoice.createdAt), "MMM dd, yyyy")}</span>
                  </div>
                  {invoice.dueDate && (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-muted-foreground print:text-gray-600">Due Date:</span>
                      <span className="font-semibold">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bill To / Bill From Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-md">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-primary uppercase tracking-wide">Bill To</h3>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 print:bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="font-bold text-lg">{invoice.customer.name}</p>
                  <div className="space-y-1 text-sm text-muted-foreground print:text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{invoice.customer.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span>{invoice.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{invoice.customer.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-md">
                  <Calendar className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-primary uppercase tracking-wide">Invoice Details</h3>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 print:bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-muted-foreground print:text-gray-600">Invoice Number</span>
                    <span className="font-semibold">#{invoice.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-muted-foreground print:text-gray-600">Issue Date</span>
                    <span className="font-semibold">{format(new Date(invoice.createdAt), "MMM dd, yyyy")}</span>
                  </div>
                  {invoice.dueDate && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-sm text-muted-foreground print:text-gray-600">Due Date</span>
                      <span className="font-semibold">{format(new Date(invoice.dueDate), "MMM dd, yyyy")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground print:text-gray-600">Status</span>
                    <Badge className={`${getStatusColor(invoice.status)} print:border print:border-gray-300`}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Items Table */}
            <div className="mb-8">
              <div className="bg-primary/5 print:bg-gray-100 px-6 py-3 rounded-t-lg">
                <h3 className="font-bold text-primary uppercase tracking-wide">Description</h3>
              </div>
              <div className="border-2 border-t-0 border-gray-200 dark:border-gray-700 print:border-gray-300 rounded-b-lg p-6">
                <p className="text-base leading-relaxed whitespace-pre-wrap">{invoice.description}</p>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-96 space-y-3">
                <div className="bg-gray-50 dark:bg-gray-900 print:bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-semibold">₹{invoice.amount.toFixed(2)}</span>
                  </div>
                  
                  {invoice.payments.length > 0 && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center text-green-600 print:text-green-700">
                        <span className="font-medium">Amount Paid:</span>
                        <span className="font-semibold">- ₹{(invoice.amount - invoice.remainingAmount).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  
                  <Separator className="bg-gray-300 dark:bg-gray-600" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                      {invoice.payments.length > 0 ? "Balance Due:" : "Total Amount:"}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{invoice.payments.length > 0 ? invoice.remainingAmount.toFixed(2) : invoice.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History */}
            {invoice.payments.length > 0 && (
              <div className="mb-8">
                <div className="bg-primary/5 print:bg-gray-100 px-6 py-3 rounded-t-lg">
                  <h3 className="font-bold text-primary uppercase tracking-wide">Payment History</h3>
                </div>
                <div className="border-2 border-t-0 border-gray-200 dark:border-gray-700 print:border-gray-300 rounded-b-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 print:bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Payment Method</th>
                        <th className="px-6 py-3 text-right text-sm font-semibold">Amount</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold print:hidden">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {invoice.payments.map((payment, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900 print:hover:bg-white">
                          <td className="px-6 py-4 text-sm">{format(new Date(payment.date), "MMM dd, yyyy")}</td>
                          <td className="px-6 py-4 text-sm">{payment.method}</td>
                          <td className="px-6 py-4 text-sm text-right font-semibold">₹{payment.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-center print:hidden">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Paid
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-8 border-t-2 border-gray-200 dark:border-gray-700 print:border-gray-300">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground print:text-gray-600">
                  Thank you for your business!
                </p>
                <p className="text-xs text-muted-foreground print:text-gray-500">
                  For any questions regarding this invoice, please contact {invoice.company.email} or call {invoice.company.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}