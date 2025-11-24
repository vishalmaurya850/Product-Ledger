"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface CustomerSidebarProps {
  customers: any[]
  selectedCustomerId: string | undefined
  onSelectCustomer: (customer: any) => void
  isLoading: boolean
  customerBalances?: Record<string, number>
}

export function CustomerSidebar({
  customers,
  selectedCustomerId,
  onSelectCustomer,
  isLoading,
  customerBalances = {},
}: CustomerSidebarProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) =>
    customer.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get customer initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "NA"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading customers...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-sm text-muted-foreground text-center mb-4">No customers found</p>
          <Button variant="outline" size="sm" onClick={() => router.push("/customers/new")}>
            Add Your First Customer
          </Button>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-muted-foreground text-center">No customers match your search</p>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="px-2 py-2">
            {filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left mb-1 ${
                  selectedCustomerId === customer.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                }`}
                onClick={() => onSelectCustomer(customer)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={customer.imageUrl || "/placeholder.svg"} alt={customer.name} />
                  <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden flex-1">
                  <div className="font-medium truncate">{customer.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{customer.phone}</div>
                </div>
                {customerBalances[customer.id] !== undefined && (
                  <div
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      customerBalances[customer.id] < 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    ₹{Math.abs(customerBalances[customer.id]).toFixed(2)}
                  </div>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" onClick={() => router.push("/customers/new")}>
          Add New Customer
        </Button>
      </div>
    </div>
  )
}
