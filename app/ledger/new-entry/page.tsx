"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { CalendarIcon, Loader2, AlertTriangle, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createLedgerEntry } from "@/lib/actions"
import { currencyOptions, type CurrencyOption } from "../../../utils/constant"
import { getCurrencySymbol } from "../../../utils/getCurrencySymbol"

interface CreditInfo {
  creditLimit: number
  availableCredit: number
  creditUsed: number
  totalOutstanding: number
}

export default function NewLedgerEntryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const customerId = searchParams.get("customerId")

  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>(customerId || "")
  const [date, setDate] = useState<Date>(new Date())
  const [type, setType] = useState<string>("Sell")
  const [amount, setAmount] = useState<string>("")
  const [currency, setCurrency] = useState<string>("INR")
  const [description, setDescription] = useState<string>("")
  const [product, setProduct] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  
  // Credit limit validation
  const [creditInfo, setCreditInfo] = useState<CreditInfo | null>(null)
  const [loadingCredit, setLoadingCredit] = useState(false)
  const [creditWarning, setCreditWarning] = useState<string>("")
  
  // Warning dialog state
  const [showCreditWarning, setShowCreditWarning] = useState(false)
  const [creditExceededData, setCreditExceededData] = useState<{
    requestedAmount: number
    availableCredit: number
    excess: number
  } | null>(null)

  // Fetch customer credit information
  const fetchCreditInfo = async (customerId: string) => {
    if (!customerId) {
      setCreditInfo(null)
      return
    }

    try {
      setLoadingCredit(true)
      
      // Try the recalculation API first for most accurate data
      const recalcResponse = await fetch(`/api/customers/${customerId}/credit-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (recalcResponse.ok) {
        const recalcData = await recalcResponse.json()
        setCreditInfo({
          creditLimit: recalcData.creditLimit,
          availableCredit: recalcData.availableCredit,
          creditUsed: recalcData.creditUsed,
          totalOutstanding: recalcData.totalOutstandingBalance || 0
        })
        return
      }
      
      // Fallback to payment-completion API
      const response = await fetch(`/api/payment-completion?customerId=${customerId}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.customerStatus) {
          setCreditInfo(data.customerStatus)
        } else {
          setCreditInfo(null)
        }
      } else {
        setCreditInfo(null)
      }
    } catch (error) {
      console.error("❌ Error fetching credit info:", error)
      setCreditInfo(null)
    } finally {
      setLoadingCredit(false)
    }
  }

  // Check credit limit when amount or customer changes
  useEffect(() => {
    if (selectedCustomer && type === "Sell" && amount && creditInfo) {
      const entryAmount = parseFloat(amount)
      if (entryAmount > 0) {
        const remainingCredit = creditInfo.availableCredit
        
        if (entryAmount > remainingCredit) {
          setCreditWarning(
            `⚠️ Credit limit exceeded! Available credit: ${getCurrencySymbol(currency)}${remainingCredit.toFixed(2)}, Requested: ${getCurrencySymbol(currency)}${entryAmount.toFixed(2)}. Exceeds by ${getCurrencySymbol(currency)}${(entryAmount - remainingCredit).toFixed(2)}`
          )
        } else if (entryAmount > remainingCredit * 0.8) {
          setCreditWarning(
            `⚠️ Warning: This entry will use ${((entryAmount / creditInfo.creditLimit) * 100).toFixed(1)}% of total credit limit. Remaining after this: ${getCurrencySymbol(currency)}${(remainingCredit - entryAmount).toFixed(2)}`
          )
        } else {
          setCreditWarning("")
        }
      } else {
        setCreditWarning("")
      }
    } else {
      setCreditWarning("")
    }
  }, [amount, selectedCustomer, type, creditInfo])

  // Fetch credit info when customer changes
  useEffect(() => {
    if (selectedCustomer) {
      fetchCreditInfo(selectedCustomer)
    }
  }, [selectedCustomer])

  // Debug dialog state changes
  useEffect(() => {
    // Debug state changes if needed
  }, [showCreditWarning, creditExceededData])

  // Fetch customers and products
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch customers
        const timestamp = new Date().getTime()
        const customersResponse = await fetch(`/api/customers?t=${timestamp}`, {
          cache: "no-store",
          headers: {
            pragma: "no-cache",
            "cache-control": "no-cache",
          },
        })

        if (customersResponse.ok) {
          const customersData = await customersResponse.json()
          setCustomers(customersData)
        } else {
          console.error("Failed to fetch customers:", customersResponse.status)
        }

        // Fetch products
        const productsResponse = await fetch(`/api/products?t=${timestamp}`, {
          cache: "no-store",
          headers: {
            pragma: "no-cache",
            "cache-control": "no-cache",
          },
        })

        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setProducts(productsData)
        } else {
          console.error("Failed to fetch products:", productsResponse.status)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load required data",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCustomer) {
      toast({
        title: "Missing information",
        description: "Please select a customer",
        variant: "destructive",
      })
      return
    }

    // Credit limit validation for Sell transactions
    if (type === "Sell" && creditInfo && amount) {
      const entryAmount = parseFloat(amount)
      
      if (entryAmount > creditInfo.availableCredit) {
        // Show warning dialog instead of just toast
        const excess = entryAmount - creditInfo.availableCredit
        setCreditExceededData({
          requestedAmount: entryAmount,
          availableCredit: creditInfo.availableCredit,
          excess: excess
        })
        setShowCreditWarning(true)
        return
      }
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("customerId", selectedCustomer)
      formData.append("type", type)
      formData.append("date", date.toISOString())
      formData.append("amount", amount)
      formData.append("description", description)

      if (product) {
        formData.append("product", product)
      }

      if (notes) {
        formData.append("notes", notes)
      }

      const result = await createLedgerEntry(formData)

      if (result.success) {
        // Recalculate credit for payment entries to ensure accurate display
        if (type === "Payment In") {
          try {
            const recalcResponse = await fetch(`/api/customers/${selectedCustomer}/credit-settings`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            })
            
            if (recalcResponse.ok) {
              const recalcData = await recalcResponse.json()
            }
          } catch (recalcError) {
            console.error("Failed to recalculate credit:", recalcError)
          }
        }
        
        // Refresh credit information after creating entry
        if (type === "Sell" || type === "Payment In") {
          await fetchCreditInfo(selectedCustomer)
        }
        
        // Trigger global refresh for ledger table and other components
        if (typeof window !== 'undefined') {
          if ((window as any).refreshLedgerTable) {
            (window as any).refreshLedgerTable()
          }
          if ((window as any).refreshLedgerData) {
            (window as any).refreshLedgerData()
          }
          if ((window as any).refreshCreditDisplay) {
            (window as any).refreshCreditDisplay()
          }
        }
        
        toast({
          title: "Entry created",
          description: `${type} entry created successfully. ${type === "Sell" ? "Credit limit updated." : type === "Payment In" ? "Credit restored." : ""}`,
        })
        router.push(`/ledger?customerId=${selectedCustomer}`)
      } else {
        throw new Error(result.error || "Failed to create entry")
      }
    } catch (error) {
      console.error("Error creating ledger entry:", error)
      toast({
        title: "Error",
        description: "Failed to create ledger entry",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>New Ledger Entry</CardTitle>
          <CardDescription>Create a new transaction in the customer's ledger</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer._id} value={customer._id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Credit Information Display */}
            {selectedCustomer && creditInfo && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Credit Information</span>
                    {loadingCredit && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-700">Credit Limit:</span>
                      <span className="font-medium ml-2 text-gray-900">{getCurrencySymbol(currency)}{creditInfo.creditLimit.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Available Credit:</span>
                      <span className={`font-medium ml-2 ${creditInfo.availableCredit > 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {getCurrencySymbol(currency)}{creditInfo.availableCredit.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-700">Credit Used:</span>
                      <span className="font-medium ml-2 text-gray-900">{getCurrencySymbol(currency)}{creditInfo.creditUsed.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Outstanding:</span>
                      <span className="font-medium ml-2 text-gray-900">{getCurrencySymbol(currency)}{creditInfo.totalOutstanding.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sell">Sell</SelectItem>
                    <SelectItem value="Payment In">Payment In</SelectItem>
                    <SelectItem value="Payment Out">Payment Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex items-center space-x-2">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencyOptions.map((option: CurrencyOption) => (
                        <SelectItem key={option.code} value={option.code}>
                          {option.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className={creditWarning && type === "Sell" ? "border-orange-300 focus:border-orange-500" : ""}
                  />
                </div>
                
                {/* Credit Validation Alert */}
                {creditWarning && type === "Sell" && (
                  <Alert className={creditInfo && parseFloat(amount) > creditInfo.availableCredit ? "border-red-300 bg-red-50" : "border-orange-300 bg-orange-50"}>
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-sm text-gray-800">
                      {creditWarning}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Product (Optional)</Label>
                <Select value={product} onValueChange={setProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product.name}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            
            {/* Temporary test button for debugging */}
            {process.env.NODE_ENV === 'development' && (
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => {
                  setCreditExceededData({
                    requestedAmount: 5000,
                    availableCredit: 2000,
                    excess: 3000
                  })
                  setShowCreditWarning(true)
                }}
              >
                Test Warning
              </Button>
            )}
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className={
                type === "Sell" && creditInfo && parseFloat(amount) > creditInfo.availableCredit
                  ? "bg-red-600 hover:bg-red-700" 
                  : ""
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : type === "Sell" && creditInfo && parseFloat(amount) > creditInfo.availableCredit ? (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Credit Limit Exceeded
                </>
              ) : (
                "Create Entry"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Credit Limit Warning Dialog */}
      <AlertDialog open={showCreditWarning} onOpenChange={setShowCreditWarning}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Credit Limit Exceeded
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <div className="text-gray-700">
                You are trying to create a sell entry that exceeds the available credit limit.
              </div>
              
              {creditExceededData && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Requested Amount:</span>
                    <span className="font-semibold text-red-600">{getCurrencySymbol(currency)}{creditExceededData.requestedAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available Credit:</span>
                    <span className="font-semibold text-green-600">{getCurrencySymbol(currency)}{creditExceededData.availableCredit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-red-200 pt-2">
                    <span className="text-gray-600">Excess Amount:</span>
                    <span className="font-bold text-red-700">{getCurrencySymbol(currency)}{creditExceededData.excess.toFixed(2)}</span>
                  </div>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                Please either:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Reduce the entry amount to {getCurrencySymbol(currency)}{creditInfo?.availableCredit.toFixed(2) || '0.00'} or less</li>
                  <li>Contact the administrator to increase the credit limit</li>
                  <li>Process payment entries to free up available credit</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCreditWarning(false)}>
              Got it
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowCreditWarning(false)
                // Focus on amount field to edit
                const amountInput = document.querySelector('input[name="amount"]') as HTMLInputElement
                if (amountInput) {
                  amountInput.focus()
                  amountInput.select()
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Edit Amount
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
