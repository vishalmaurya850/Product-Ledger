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
import { toast } from "@/hooks/use-toast"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { createLedgerEntry } from "@/lib/actions"

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
  const [description, setDescription] = useState<string>("")
  const [product, setProduct] = useState<string>("")
  const [notes, setNotes] = useState<string>("")

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
          console.log("Fetched customers for ledger entry:", customersData.length)
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
          console.log("Fetched products for ledger entry:", productsData.length)
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

      console.log("Submitting ledger entry for customer:", selectedCustomer)
      const result = await createLedgerEntry(formData)

      if (result.success) {
        console.log("Ledger entry created successfully")
        toast({
          title: "Success",
          description: result.message || "Ledger entry has been created successfully",
        })
        router.push(`/ledger?customerId=${selectedCustomer}`)
      } else {
        toast({
          title: result.unauthorized ? "Permission Denied" : "Error",
          description: result.error || "Failed to create entry",
          variant: "destructive",
        })
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
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
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
                      <SelectItem key={product.id} value={product.name}>
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Entry"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
