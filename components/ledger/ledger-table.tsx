"use client"

import { useState, useEffect } from "react"
import { format, differenceInDays } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import {
  Loader2,
  FileDown,
  Eye,
  ArrowUpDown,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  RefreshCcw,
  CreditCard,
  DollarSign,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { markLedgerEntryAsPaid, deleteLedgerEntry } from "@/lib/actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InlineCreditSettings } from "@/components/ledger/credit-limit-settings"
import { getCurrencySymbol } from "@/utils/getCurrencySymbol"

export interface CreditSettings {
  creditLimit: number
  gracePeriod: number
  interestRate: number
  fineAmount: number
}

interface LedgerTableProps {
  customerId: string
  userPermissions: string[]
}

export function LedgerTable({ customerId, userPermissions }: LedgerTableProps) {
  const router = useRouter()
  const [entries, setEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [creditSettings, setCreditSettings] = useState<any>({
    creditLimit: 0,
    gracePeriod: 30,
    interestRate: 18,
  })
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSettlementDialog, setShowSettlementDialog] = useState(false)
  const [settlementAmount, setSettlementAmount] = useState<number>(0)
  const [selectedUnpaidEntry, setSelectedUnpaidEntry] = useState<any>(null)
  const [unpaidEntries, setUnpaidEntries] = useState<any[]>([])
  const [paymentInAmount, setPaymentInAmount] = useState<number>(0)
  const [remainingCredit, setRemainingCredit] = useState<number>(0)
  const [isSettling, setIsSettling] = useState(false)
  const [paymentEntryId, setPaymentEntryId] = useState<string | null>(null)
  const [showCreditSettings, setShowCreditSettings] = useState(false)

  // Check permissions
  const canEdit = userPermissions.includes("ledger_edit")
  const canDelete = userPermissions.includes("ledger_delete")

  // Fetch ledger entries and credit settings
  const fetchData = async () => {
    if (!customerId) return

    setIsLoading(true)
    setError(null)
    try {
      console.log("Fetching ledger data for customer:", customerId)

      // Add cache-busting timestamp
      const timestamp = new Date().getTime()

      // Fetch ledger entries
      const entriesResponse = await fetch(`/api/ledger/customer/${customerId}?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      })

      if (!entriesResponse.ok) {
        throw new Error(`Failed to fetch ledger entries: ${entriesResponse.status}`)
      }

      const entriesData = await entriesResponse.json()
      console.log(`Received ${entriesData.length} ledger entries`)

      // Fetch credit settings
      const settingsResponse = await fetch(`/api/customers/${customerId}/credit-settings?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      })

      let settingsData = {
        creditLimit: 0,
        gracePeriod: 30,
        interestRate: 18,
      }

      if (settingsResponse.ok) {
        settingsData = await settingsResponse.json()
        setCreditSettings(settingsData)
        console.log("Credit settings loaded:", settingsData)
      } else {
        console.warn("Could not load credit settings, using defaults")
      }

      // Calculate balances and interest
      let runningBalance = 0
      const today = new Date()
      const unpaidEntriesList: any[] = []

      const processedEntries = entriesData.map((entry: any) => {
        // Update running balance
        if (entry.type === "Sell") {
          runningBalance += entry.amount
        } else if (entry.type === "Payment In") {
          runningBalance -= entry.amount
        } else if (entry.type === "Payment Out") {
          runningBalance += entry.amount
        }

        // For paid entries, balance should be 0
        let entryBalance =
          entry.balance !== undefined
            ? entry.balance
            : entry.status === "Paid"
              ? 0
              : entry.type === "Payment In"
                ? entry.amount - (entry.settledAmount || 0)
                : runningBalance

        // Calculate days count based on status
        let daysCount = 0
        let interest = 0
        let status = entry.status

        if (entry.status === "Paid" && entry.paidDate) {
          // For paid entries: days between paidDate and date
          daysCount = differenceInDays(new Date(entry.paidDate), new Date(entry.date))
        } else {
          // For unpaid/overdue entries: days between today and date
          daysCount = differenceInDays(today, new Date(entry.date))

          // Update status to Overdue if past grace period
          if (daysCount > settingsData.gracePeriod && entry.type === "Sell") {
            status = "Overdue"

            // Calculate interest for overdue entries
            const daysWithInterest = daysCount - settingsData.gracePeriod
            const dailyRate = settingsData.interestRate / 365 / 100
            interest = entry.amount * dailyRate * daysWithInterest
          }

          // Add to unpaid entries list if it's a "Sell" type and not fully paid
          if (entry.type === "Sell" && status !== "Paid") {
            unpaidEntriesList.push({
              ...entry,
              daysCount,
              interest: interest.toFixed(2),
              status,
              balance: entry.balance !== undefined ? entry.balance : entry.amount + interest,
            })
          }
        }

        // Calculate balance based on status and type
        if (entry.balance === undefined) {
          if (status === "Overdue") {
            entryBalance = entry.amount + interest - (entry.partialPaymentAmount || 0)
          } else if (status === "Unpaid" && entry.type === "Sell") {
            entryBalance = entry.amount - (entry.partialPaymentAmount || 0)
          } else if (entry.type === "Payment In") {
            entryBalance = entry.amount - (entry.settledAmount || 0)
          }
        }

        return {
          ...entry,
          balance: entryBalance,
          daysCount,
          interest: interest.toFixed(2),
          status, // Updated status
        }
      })

      setEntries(processedEntries)
      setUnpaidEntries(unpaidEntriesList)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch ledger data")
      toast({
        title: "Error",
        description: "Failed to fetch ledger data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [customerId])

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Sort entries
  const sortedEntries = [...entries].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    // Handle date sorting
    if (sortField === "date") {
      aValue = new Date(a.date).getTime()
      bValue = new Date(b.date).getTime()
    }

    // Handle numeric sorting
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    // Handle string sorting
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  // Handle mark as paid
  const handleMarkAsPaid = async (entryId: string) => {
    if (!canEdit) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit ledger entries",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await markLedgerEntryAsPaid(entryId)

      if (result.success) {
        // Update local state
        setEntries(
          entries.map((entry) => {
            if (entry._id === entryId) {
              const paidDate = new Date()
              const daysCount = differenceInDays(paidDate, new Date(entry.date))
              return {
                ...entry,
                status: "Paid",
                paidDate,
                daysCount,
                interest: 0,
                balance: 0, // Set balance to 0 when paid
              }
            }
            return entry
          }),
        )

        // Update unpaid entries list
        setUnpaidEntries(unpaidEntries.filter((entry) => entry._id !== entryId))

        toast({
          title: "Entry updated",
          description: "Ledger entry marked as paid",
        })
      } else {
        throw new Error(result.error || "Failed to update entry status")
      }
    } catch (error) {
      console.error("Error marking entry as paid:", error)
      toast({
        title: "Error",
        description: "Failed to update entry status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle payment in settlement
  const handlePaymentInSettlement = (entry: any) => {
    if (!canEdit) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to settle payments",
        variant: "destructive",
      })
      return
    }

    // Check if payment entry has any remaining balance to settle
    if (entry.balance === 0 || entry.settledAmount === entry.amount) {
      toast({
        title: "Payment already settled",
        description: "This payment has already been fully settled.",
      })
      return
    }

    // Check if there are any unpaid entries
    if (unpaidEntries.length === 0) {
      toast({
        title: "No unpaid entries",
        description: `Payment of ₹${entry.amount.toFixed(2)} will be added to customer's credit.`,
      })
      return
    }

    // Calculate remaining amount to settle
    const remainingToSettle = entry.balance !== undefined ? entry.balance : entry.amount - (entry.settledAmount || 0)

    setPaymentInAmount(entry.amount)
    setRemainingCredit(remainingToSettle)
    setPaymentEntryId(entry._id)
    setShowSettlementDialog(true)
  }

  // Handle settlement submission
  const handleSettlePayment = async () => {
    if (!selectedUnpaidEntry || !canEdit || !paymentEntryId) return

    setIsSettling(true)
    try {
      // Calculate the amount to settle
      const amountToSettle = Math.min(remainingCredit, selectedUnpaidEntry.balance)
      const isFullPayment = amountToSettle >= selectedUnpaidEntry.balance

      // Call the API to process the settlement
      const response = await fetch("/api/ledger/settle-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentEntryId,
          unpaidEntryId: selectedUnpaidEntry._id,
          settlementAmount: amountToSettle,
          remainingCredit: isFullPayment ? remainingCredit - selectedUnpaidEntry.balance : 0,
          isFullPayment,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to settle payment")
      }

      const result = await response.json()

      // Update UI based on settlement result
      if (isFullPayment) {
        // Full payment - update unpaid entries list
        setUnpaidEntries(unpaidEntries.filter((entry) => entry._id !== selectedUnpaidEntry._id))

        // Update remaining credit
        const newRemainingCredit = remainingCredit - selectedUnpaidEntry.balance
        setRemainingCredit(newRemainingCredit)

        toast({
          title: "Payment settled",
          description: `Entry #${selectedUnpaidEntry.invoiceNumber} marked as paid. Remaining credit: ₹${newRemainingCredit.toFixed(2)}`,
        })

        // If there's remaining credit and more unpaid entries, continue settlement
        if (newRemainingCredit > 0 && unpaidEntries.length > 1) {
          // Reset selected entry
          setSelectedUnpaidEntry(null)
        } else {
          // If no more credit or no more unpaid entries, close dialog
          setShowSettlementDialog(false)
        }
      } else {
        // Partial payment - update UI with new balance
        toast({
          title: "Partial payment applied",
          description: `Partial payment of ₹${amountToSettle.toFixed(2)} applied to entry #${selectedUnpaidEntry.invoiceNumber}. Remaining balance: ₹${result.remainingDue.toFixed(2)}`,
        })

        // Close dialog and refresh data to show updated entries
        setShowSettlementDialog(false)
      }

      // Refresh data to show updated entries
      fetchData()
    } catch (error) {
      console.error("Error settling payment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to settle payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSettling(false)
    }
  }

  // Update customer credit limit
  const updateCustomerCreditLimit = async (additionalCredit: number) => {
    try {
      // Get current credit settings
      const response = await fetch(`/api/customers/${customerId}/credit-settings`)
      if (!response.ok) throw new Error("Failed to fetch credit settings")

      const settings = await response.json()

      // Update credit limit
      const updatedSettings = {
        ...settings,
        creditLimit: settings.creditLimit + additionalCredit,
      }

      // Save updated settings
      const updateResponse = await fetch(`/api/customers/${customerId}/credit-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSettings),
      })

      if (!updateResponse.ok) throw new Error("Failed to update credit limit")

      toast({
        title: "Credit limit updated",
        description: `₹${additionalCredit.toFixed(2)} added to customer's credit limit. New limit: ₹${updatedSettings.creditLimit.toFixed(2)}`,
      })

      // Update local state
      setCreditSettings(updatedSettings)
    } catch (error) {
      console.error("Error updating credit limit:", error)
      toast({
        title: "Error",
        description: "Failed to update credit limit",
        variant: "destructive",
      })
    }
  }

  // Handle download invoice
  const handleDownloadInvoice = async (entryId: string) => {
    try {
      window.open(`/api/invoices/${entryId}/download`, "_blank")
    } catch (error) {
      console.error("Error downloading invoice:", error)
      toast({
        title: "Error",
        description: "Failed to download invoice",
        variant: "destructive",
      })
    }
  }

  // Handle view invoice
  const handleViewInvoice = (entryId: string) => {
    router.push(`/invoices/${entryId.toString()}`)
  }

  // Handle edit entry
  const handleEditEntry = (entryId: string) => {
    if (!canEdit) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit ledger entries",
        variant: "destructive",
      })
      return
    }
    router.push(`/ledger/${entryId}/edit`)
  }

  // Handle delete entry
  const handleDeleteEntry = async () => {
    if (!entryToDelete) return

    if (!canDelete) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete ledger entries",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteLedgerEntry(entryToDelete)

      if (result.success) {
        setEntries(entries.filter((entry) => entry._id !== entryToDelete))
        setUnpaidEntries(unpaidEntries.filter((entry) => entry._id !== entryToDelete))
        toast({
          title: "Entry deleted",
          description: "Ledger entry has been deleted successfully",
        })
      } else {
        throw new Error(result.error || "Failed to delete entry")
      }
    } catch (error: any) {
      console.error("Error deleting entry:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete entry",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setEntryToDelete(null)
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchData()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading ledger entries...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading ledger data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh Data
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center h-64 p-6">
        <h3 className="text-xl font-semibold mb-2">No Ledger Entries</h3>
        <p className="text-muted-foreground mb-4 text-center">This customer doesn't have any ledger entries yet.</p>
        {userPermissions.includes("ledger_create") && (
          <Button onClick={() => router.push(`/ledger/new-entry?customerId=${customerId}`)}>Create First Entry</Button>
        )}
      </Card>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Ledger Entries</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/ledger/new-entry?customerId=${customerId}`)}
            className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Integrated Credit Settings */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-blue-800">Credit Information</h4>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowCreditSettings(!showCreditSettings)}
            className="bg-white text-blue-700 border-blue-200 hover:bg-blue-100"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {showCreditSettings ? "Hide Settings" : "Edit Settings"}
          </Button>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-600">
            Credit Limit: <span className="font-semibold">₹{creditSettings.creditLimit.toFixed(2)}</span> | Grace
            Period: <span className="font-semibold">{creditSettings.gracePeriod} days</span> | Interest Rate:{" "}
            <span className="font-semibold">{creditSettings.interestRate}%</span>
          </p>
        </div>
        {showCreditSettings && (
          <div className="mt-2">
            <InlineCreditSettings
              customerId={customerId}
              initialSettings={creditSettings}
              onSettingsUpdate={(newSettings: CreditSettings) => {
                setCreditSettings(newSettings)
                fetchData() // Refresh data with new settings
              }}
            />
          </div>
        )}
      </div>

      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">S.No</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("type")}>
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("date")}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("status")}>
                    Settlement
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("amount")}>
                    Total
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 font-medium" onClick={() => handleSort("balance")}>
                    Balance
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Interest</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.map((entry, index) => (
                <TableRow key={entry._id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        entry.type === "Sell" ? "default" : entry.type === "Payment In" ? "outline" : "destructive"
                      }
                    >
                      {entry.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.invoiceNumber || "-"}</TableCell>
                  <TableCell>{format(new Date(entry.date), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{entry.product || "-"}</TableCell>
                  <TableCell>
                    {entry.status === "Paid" ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Paid {entry.partiallyPaid ? "(Partial)" : ""} (after {entry.daysCount} days)
                      </Badge>
                    ) : entry.status === "Overdue" ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Overdue ({entry.daysCount} days, grace: {creditSettings.gracePeriod} days)
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                        Unpaid ({entry.daysCount} days, grace: {creditSettings.gracePeriod - entry.daysCount} days left)
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">{getCurrencySymbol(entry.currency)} {entry.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">{getCurrencySymbol(entry.currency)} {entry.balance.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    {Number.parseFloat(entry.interest) > 0 ? (
                      <span className="text-red-600 font-medium">₹{entry.interest}</span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      {/* Payment In Settlement Button */}
                      {entry.type === "Payment In" && unpaidEntries.length > 0 && canEdit && entry.balance > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePaymentInSettlement(entry)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          Settle
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewInvoice(entry._id.toString())}
                        title="View Invoice"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownloadInvoice(entry._id)}
                        title="Download Invoice"
                      >
                        <FileDown className="h-4 w-4" />
                      </Button>
                      {canEdit && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditEntry(entry._id)}
                          title="Edit Entry"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEntryToDelete(entry._id)}
                          title="Delete Entry"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {entry.status !== "Paid" && entry.type === "Sell" && canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsPaid(entry._id)}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the ledger entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteEntry()
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Payment Settlement Dialog */}
      <Dialog open={showSettlementDialog} onOpenChange={setShowSettlementDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Settle Payment</DialogTitle>
            <DialogDescription>
              Apply this payment to settle unpaid invoices. Total payment amount: ₹{paymentInAmount.toFixed(2)}.
              Remaining credit: ₹{remainingCredit.toFixed(2)}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unpaidEntry">Select invoice to settle</Label>
              <Select
                value={selectedUnpaidEntry?._id || ""}
                onValueChange={(value) => {
                  const entry = unpaidEntries.find((e) => e._id === value)
                  setSelectedUnpaidEntry(entry)
                }}
              >
                <SelectTrigger id="unpaidEntry">
                  <SelectValue placeholder="Select an unpaid invoice" />
                </SelectTrigger>
                <SelectContent>
                  {unpaidEntries.map((entry) => (
                    <SelectItem key={entry._id} value={entry._id}>
                      Invoice #{entry.invoiceNumber} - ₹{entry.balance.toFixed(2)} ({entry.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedUnpaidEntry && (
              <div className="space-y-2">
                <Label>Invoice details</Label>
                <div className="p-3 bg-slate-50 rounded-md text-sm">
                  <p>
                    <span className="font-medium">Invoice #:</span> {selectedUnpaidEntry.invoiceNumber}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {format(new Date(selectedUnpaidEntry.date), "dd/MM/yyyy")}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span> ₹{selectedUnpaidEntry.amount.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Interest:</span> ₹{selectedUnpaidEntry.interest}
                  </p>
                  <p>
                    <span className="font-medium">Total due:</span> ₹{selectedUnpaidEntry.balance.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {selectedUnpaidEntry.status}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="settlementAmount">Settlement amount</Label>
              <Input
                id="settlementAmount"
                type="number"
                value={settlementAmount || Math.min(remainingCredit, selectedUnpaidEntry?.balance || 0)}
                onChange={(e) => {
                  const value = Number.parseFloat(e.target.value)
                  if (!isNaN(value) && value <= remainingCredit && value > 0) {
                    setSettlementAmount(value)
                  }
                }}
                disabled={!selectedUnpaidEntry}
                className="text-right"
              />
              <p className="text-xs text-muted-foreground">Maximum available: ₹{remainingCredit.toFixed(2)}</p>

              {/* Partial payment checkbox */}
              {selectedUnpaidEntry && remainingCredit < selectedUnpaidEntry.balance && (
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id="partialPayment"
                    className="rounded border-gray-300"
                    checked={true}
                    readOnly
                  />
                  <Label htmlFor="partialPayment" className="text-sm text-amber-600">
                    This will be processed as a partial payment
                  </Label>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettlementDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSettlePayment}
              disabled={!selectedUnpaidEntry || isSettling}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSettling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Settle Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}