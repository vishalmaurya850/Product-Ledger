"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { InlineCreditSettings } from "@/components/ledger/credit-limit-settings"

export function CreditSettingsReport() {
  const [companySettings, setCompanySettings] = useState({
    creditLimit: 10000,
    gracePeriod: 30,
    interestRate: 18,
    fineAmount: 0,
  })
  const [customerSettings, setCustomerSettings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)

  // Fetch company credit settings and customer credit settings
  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch company settings
      const companyResponse = await fetch(`/api/overdue/settings?t=${Date.now()}`, {
        cache: "no-store",
      })

      if (companyResponse.ok) {
        const settings = await companyResponse.json()
        setCompanySettings(settings)
      } else {
        console.warn("Could not load company credit settings, using defaults")
      }

      // Fetch customer settings
      const customersResponse = await fetch(`/api/customers/credit-settings?t=${Date.now()}`, {
        cache: "no-store",
      })

      if (customersResponse.ok) {
        const data = await customersResponse.json()
        setCustomerSettings(data)
      } else {
        throw new Error("Failed to fetch customer credit settings")
      }
    } catch (error) {
      console.error("Error fetching credit settings:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch credit settings")
      toast({
        title: "Error",
        description: "Failed to load credit settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchData()
  }

  // Handle company settings update
  const handleSettingsUpdate = (newSettings: any) => {
    setCompanySettings(newSettings)
    toast({
      title: "Settings updated",
      description: "Company credit settings have been updated successfully",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading credit settings...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <div className="flex items-center mb-2">
          <AlertCircle className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Error loading credit settings</h3>
        </div>
        <p className="text-sm">{error}</p>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-4" disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Company Default Credit Settings</h3>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? "Hide Settings Form" : "Edit Settings"}
          </Button>
        </div>

        {showSettings ? (
          <InlineCreditSettings
            customerId="company"
            initialSettings={companySettings}
            onSettingsUpdate={handleSettingsUpdate}
          />
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Default Credit Limit</p>
                  <p className="text-lg font-medium">₹{companySettings.creditLimit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Grace Period</p>
                  <p className="text-lg font-medium">{companySettings.gracePeriod} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="text-lg font-medium">{companySettings.interestRate}% per annum</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fine Amount</p>
                  <p className="text-lg font-medium">₹{companySettings.fineAmount.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Customer Credit Settings</h3>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
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
        </div>

        {customerSettings.length === 0 ? (
          <div className="p-8 text-center border rounded-md">
            <p className="text-muted-foreground">No customer credit settings found</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead className="text-right">Credit Limit (₹)</TableHead>
                  <TableHead className="text-right">Grace Period (Days)</TableHead>
                  <TableHead className="text-right">Interest Rate (%)</TableHead>
                  <TableHead className="text-right">Credit Used (₹)</TableHead>
                  <TableHead className="text-right">Available Credit (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerSettings.map((customer) => (
                  <TableRow key={customer.customerId}>
                    <TableCell className="font-medium">{customer.customerName}</TableCell>
                    <TableCell className="text-right">{customer.creditLimit.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{customer.gracePeriod}</TableCell>
                    <TableCell className="text-right">{customer.interestRate}%</TableCell>
                    <TableCell className="text-right">{customer.creditUsed.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <span className={customer.availableCredit < 0 ? "text-red-600 font-medium" : ""}>
                        {customer.availableCredit.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
