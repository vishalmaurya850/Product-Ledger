"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { CreditSettings } from "@/components/ledger/ledger-table"


interface InlineCreditSettingsProps {
  customerId: string
  initialSettings: CreditSettings
  onSettingsUpdate: (settings: CreditSettings) => void
}

export function InlineCreditSettings({ customerId, initialSettings, onSettingsUpdate }: InlineCreditSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<CreditSettings>(initialSettings)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/customers/${customerId}/credit-setting`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to update credit settings")
      }

      const updatedSettings = await response.json()
      onSettingsUpdate(updatedSettings)
      setIsOpen(false)
      toast.success("Credit settings updated successfully")
    } catch (error) {
      console.error("Error updating credit settings:", error)
      toast.error("Failed to update credit settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Credit Settings</DialogTitle>
          <DialogDescription>Update the credit limit and payment terms for this customer.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="creditLimit" className="text-right">
              Credit Limit
            </Label>
            <Input
              id="creditLimit"
              type="number"
              value={settings.creditLimit}
              onChange={(e) => setSettings({ ...settings, creditLimit: Number.parseFloat(e.target.value) || 0 })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentTerms" className="text-right">
              Payment Terms (days)
            </Label>
            <Input
              id="paymentTerms"
              type="number"
              value={settings.gracePeriod}
              onChange={(e) => setSettings({ ...settings, gracePeriod: Number.parseInt(e.target.value) || 0 })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interestRate" className="text-right">
              Interest Rate (%)
            </Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              value={settings.interestRate}
              onChange={(e) => setSettings({ ...settings, interestRate: Number.parseFloat(e.target.value) || 0 })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fineAmount" className="text-right">
              Fine Amount
            </Label>
            <Input
              id="fineAmount"
              type="number"
              value={settings.fineAmount}
              onChange={(e) => setSettings({ ...settings, fineAmount: Number.parseFloat(e.target.value) || 0 })}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}