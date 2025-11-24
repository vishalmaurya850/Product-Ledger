"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { InlineCreditSettings } from "@/components/ledger/credit-limit-settings"

export function OverdueReport() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creditSettings, setCreditSettings] = useState({
    creditLimit: 10000,
    gracePeriod: 30,
    interestRate: 18,
    fineAmount: 0,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchData()
    fetchCreditSettings()
  }, [])

  async function fetchData() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/reports/overdue")
      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else {
        throw new Error("Failed to fetch overdue data")
      }
    } catch (error) {
      console.error("Error fetching overdue data:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch overdue data")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  async function fetchCreditSettings() {
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

  const handleSettingsUpdate = (newSettings: any) => {
    setCreditSettings(newSettings)
    fetchData() // Refresh data with new settings
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchData()
  }

  if (isLoading) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading overdue data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
            <p className="text-lg font-medium text-red-500">Error loading overdue data</p>
          </div>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
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
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No overdue data available.</p>
          <p className="text-sm text-muted-foreground">Add overdue entries to see your overdue report.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Credit Settings</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
              {showSettings ? "Hide Settings" : "Edit Settings"}
            </Button>
          </div>
        </div>

        {showSettings ? (
          <InlineCreditSettings
            customerId="company"
            initialSettings={creditSettings}
            onSettingsUpdate={handleSettingsUpdate}
          />
        ) : (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Default Credit Limit</p>
                  <p className="text-lg font-medium">₹{creditSettings.creditLimit.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Grace Period</p>
                  <p className="text-lg font-medium">{creditSettings.gracePeriod} days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="text-lg font-medium">{creditSettings.interestRate}% per annum</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
          <Legend />
          <Bar dataKey="amount" name="Original Amount" fill="#3b82f6" />
          <Bar dataKey="interest" name="Interest" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}