"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Loader2, Settings, AlertCircle, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { InlineCreditSettings } from "@/components/ledger/credit-limit-settings"

interface OverdueWidgetProps {
  companyId: string
}

export function OverdueWidget({ companyId }: OverdueWidgetProps) {
  const router = useRouter()
  const [overdueEntries, setOverdueEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [creditSettings, setCreditSettings] = useState({
    creditLimit: 10000,
    gracePeriod: 30,
    interestRate: 18,
    paymentTerms: 30,
    fineAmount: 0,
  })
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)

  // Fetch overdue entries
  const fetchOverdueEntries = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Add cache-busting timestamp
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/overdue?t=${timestamp}&limit=5`, {
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
      setOverdueEntries(data)
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
    }
  }

  // Fetch company credit settings
  const fetchCreditSettings = async () => {
    try {
      setIsLoadingSettings(true)
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
    } finally {
      setIsLoadingSettings(false)
    }
  }

  useEffect(() => {
    fetchOverdueEntries()
    fetchCreditSettings()
  }, [companyId])

  // Handle credit settings update
  const handleCreditSettingsUpdate = (newSettings: any) => {
    setCreditSettings(newSettings)
    fetchOverdueEntries() // Refresh overdue entries with new settings
    toast({
      title: "Settings updated",
      description: "Credit settings have been updated successfully",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading overdue entries...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
        <div className="flex items-center mb-2">
          <AlertCircle className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Error loading overdue entries</h3>
        </div>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Company Credit Settings</h3>
        <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
          <Settings className="h-4 w-4 mr-2" />
          {showSettings ? "Hide Settings" : "Show Settings"}
        </Button>
      </div>

      {showSettings ? (
        <InlineCreditSettings
          customerId={companyId}
          initialSettings={creditSettings}
          onSettingsUpdate={handleCreditSettingsUpdate}
        />
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Default Credit Limit</p>
                <p className="text-lg font-medium">
                  ₹{(creditSettings.creditLimit ?? 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grace Period</p>
                <p className="text-lg font-medium">
                  {(creditSettings.gracePeriod ?? 0)} days
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interest Rate</p>
                <p className="text-lg font-medium">
                  {(creditSettings.interestRate ?? 0)}% per annum
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <h3 className="text-lg font-medium mt-6">Recent Overdue Entries</h3>

      {overdueEntries.length === 0 ? (
        <div className="p-8 text-center border rounded-md bg-green-50 text-green-700">
          <p className="font-medium">No overdue entries found</p>
          <p className="text-sm mt-1">All payments are up to date</p>
        </div>
      ) : (
        <div className="space-y-3">
          {overdueEntries.slice(0, 5).map((entry) => (
            <Card key={entry.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center border-l-4 border-red-500">
                  <div className="p-4 flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">
                        {entry.description || `Invoice #${entry.invoiceNumber || entry.id.substring(0, 8)}`}
                      </h4>
                      <span className="text-red-600 font-medium">₹{entry.totalDue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className="text-sm text-muted-foreground">
                        Due: {format(new Date(entry.dueDate), "MMM d, yyyy")}
                      </div>
                      <div className="text-sm text-red-600">{entry.daysOverdue} days overdue</div>
                    </div>
                    <div className="flex justify-between mt-1 text-sm">
                      <span>Original: ₹{entry.amount.toFixed(2)}</span>
                      <span>Interest: ₹{entry.interest.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="h-full rounded-none px-4 border-l"
                    onClick={() => router.push(`/ledger/${entry.id}/view`)}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {overdueEntries.length > 5 && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => router.push("/overdue")}>
                View All {overdueEntries.length} Overdue Entries
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
