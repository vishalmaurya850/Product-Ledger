"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpDown, MoreHorizontal, Settings, RefreshCw, Loader2, AlertCircle } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { InlineCreditSettings } from "@/components/ledger/credit-limit-settings"

export default function OverduePage() {
  const [overdueEntries, setOverdueEntries] = useState<any[]>([])
  const [filteredEntries, setFilteredEntries] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [creditSettings, setCreditSettings] = useState({
    creditLimit: 10000,
    gracePeriod: 30,
    interestRate: 18,
  })

  const fetchOverdueEntries = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Add cache-busting timestamp
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/overdue?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch overdue entries: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched overdue entries:", data)

      if (!Array.isArray(data)) {
        console.error("Expected array but got:", typeof data)
        throw new Error("Invalid data format received from server")
      }

      setOverdueEntries(data)
      setFilteredEntries(data)
    } catch (error) {
      console.error("Error fetching overdue entries:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch overdue entries")
      toast({
        title: "Error",
        description: "Failed to load overdue entries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const fetchCreditSettings = async () => {
    try {
      const response = await fetch(`/api/overdue/settings?t=${Date.now()}`, {
        cache: "no-store",
      })

      if (response.ok) {
        const settings = await response.json()
        setCreditSettings(settings)
      } else {
        console.warn("Could not load company credit settings, using defaults")
      }
    } catch (error) {
      console.error("Error fetching credit settings:", error)
    }
  }

  useEffect(() => {
    fetchOverdueEntries()
    fetchCreditSettings()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = overdueEntries.filter(
        (entry) =>
          (entry.description && entry.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (entry.invoiceNumber && entry.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (entry._id && entry._id.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredEntries(filtered)
    } else {
      setFilteredEntries(overdueEntries)
    }
  }, [searchTerm, overdueEntries])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchOverdueEntries()
    fetchCreditSettings()
  }

  const handleSettingsUpdate = (newSettings: any) => {
    setCreditSettings(newSettings)
    fetchOverdueEntries() // Refresh data with new settings
  }

  const handleMarkAsPaid = async (entryId: string) => {
    try {
      const response = await fetch(`/api/ledger/${entryId}/mark-paid`, {
        method: "POST",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to mark entry as paid")
      }

      toast({
        title: "Entry marked as paid",
        description: "The ledger entry has been marked as paid successfully.",
      })

      // Refresh the entries list
      fetchOverdueEntries()
    } catch (error) {
      console.error("Error marking entry as paid:", error)
      toast({
        title: "Error",
        description: "Failed to mark entry as paid. Please try again.",
        variant: "destructive",
      })
    }
  }

  const { toast } = useToast()

  // const createTestData = async () => {
  //   try {
  //     setIsLoading(true)
  //     const response = await fetch("/api/test/create-overdue", {
  //       method: "POST",
  //     })

  //     if (!response.ok) {
  //       throw new Error("Failed to create test data")
  //     }

  //     const data = await response.json()
  //     toast({
  //       title: "Test data created",
  //       description: data.message,
  //     })

  //     // Refresh the entries list
  //     fetchOverdueEntries()
  //   } catch (error) {
  //     console.error("Error creating test data:", error)
  //     toast({
  //       title: "Error",
  //       description: "Failed to create test data",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Overdue Payments</h2>
        <div className="flex items-center space-x-2">
          {/* <Button variant="outline" onClick={createTestData} disabled={isLoading}>
            Create Test Data
          </Button> */}
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="mr-2 h-4 w-4" />
            {showSettings ? "Hide Settings" : "Credit Settings"}
          </Button>
        </div>
      </div>

      {showSettings && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Credit Settings</CardTitle>
            <CardDescription>Manage company-wide credit settings for overdue calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <InlineCreditSettings
              customerId="company"
              initialSettings={creditSettings}
              onSettingsUpdate={handleSettingsUpdate}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Overdue Entries</CardTitle>
          <CardDescription>
            Manage overdue payments and apply interest charges. Current settings: Grace Period:{" "}
            {creditSettings.gracePeriod} days, Interest Rate: {creditSettings.interestRate}% per annum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-4">
            <Input
              placeholder="Filter overdue entries..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading overdue entries...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error loading overdue entries</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <Button variant="ghost" className="p-0 font-medium">
                        Invoice #
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium">
                        Due Date
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" className="p-0 font-medium">
                        Days Overdue
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Original Amount</TableHead>
                    <TableHead className="text-right">Interest</TableHead>
                    <TableHead className="text-right">Total Due</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No overdue entries found. All payments are up to date.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntries.map((entry) => (
                      <TableRow key={entry._id}>
                        <TableCell className="font-medium">
                          {entry.invoiceNumber || entry._id.substring(0, 8)}
                        </TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>{format(new Date(entry.dueDate), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              entry.daysOverdue > 30
                                ? "bg-red-100 text-red-800"
                                : entry.daysOverdue > 15
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {entry.daysOverdue} days (grace: {creditSettings.gracePeriod} days)
                          </span>
                        </TableCell>
                        <TableCell className="text-right">₹{entry.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">₹{entry.interest.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">₹{entry.totalDue.toFixed(2)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/ledger/${entry._id}/view`}>View details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/ledger/${entry._id}/edit`}>Edit entry</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleMarkAsPaid(entry._id)}>
                                <span className="text-green-600">Mark as paid</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}