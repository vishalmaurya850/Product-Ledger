"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Save } from "lucide-react"

export interface CreditSettings {
  creditLimit: number
  gracePeriod: number
  interestRate: number
}

interface InlineCreditSettingsProps {
  customerId: string
  initialSettings: CreditSettings
  onSettingsUpdate: (settings: CreditSettings) => void
}

export function InlineCreditSettings({ customerId, initialSettings, onSettingsUpdate }: InlineCreditSettingsProps) {
  const [settings, setSettings] = useState<CreditSettings>({
    creditLimit: initialSettings.creditLimit || 10000,
    gracePeriod: initialSettings.gracePeriod || 30,
    interestRate: initialSettings.interestRate || 18,
  })
  const [isSaving, setIsSaving] = useState(false)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/customers/${customerId}/credit-settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error(`Failed to update settings: ${response.status}`)
      }

      const updatedSettings = await response.json()

      // Call the callback with updated settings
      onSettingsUpdate(updatedSettings)

      toast({
        title: "Settings updated",
        description: "Credit limit settings have been updated successfully",
      })
    } catch (error) {
      console.error("Error updating credit settings:", error)
      toast({
        title: "Error",
        description: "Failed to update credit settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
            <Input
              id="creditLimit"
              type="number"
              min="0"
              step="1000"
              value={settings.creditLimit}
              onChange={(e) => setSettings({ ...settings, creditLimit: Number(e.target.value) })}
              required
            />
            <p className="text-xs text-muted-foreground">Maximum credit allowed for this customer</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gracePeriod">Grace Period (Days)</Label>
            <Input
              id="gracePeriod"
              type="number"
              min="0"
              max="365"
              value={settings.gracePeriod}
              onChange={(e) => setSettings({ ...settings, gracePeriod: Number(e.target.value) })}
              required
            />
            <p className="text-xs text-muted-foreground">Days before interest starts accruing</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="interestRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.interestRate}
                onChange={(e) => setSettings({ ...settings, interestRate: Number(e.target.value) })}
                required
              />
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Interest rate applied after grace period</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}