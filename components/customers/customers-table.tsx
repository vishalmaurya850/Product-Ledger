"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Search } from "lucide-react"
import { deleteCustomer } from "@/lib/actions"

export function CustomersTable() {
  const router = useRouter()
  const [customers, setCustomers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Fetch customers
  useEffect(() => {
    async function fetchCustomers() {
      try {
        setIsLoading(true)
        setFetchError(null)

        console.log("Fetching customers...")
        const timestamp = new Date().getTime() // Add timestamp to prevent caching
        const response = await fetch(`/api/customers?t=${timestamp}`, {
          cache: "no-store",
          headers: {
            pragma: "no-cache",
            "cache-control": "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch customers: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Customers data received:", data)

        if (Array.isArray(data)) {
          setCustomers(data)
          console.log(`Loaded ${data.length} customers`)
        } else {
          console.error("Expected array but got:", typeof data)
          setFetchError("Invalid data format received from server")
        }
      } catch (error) {
        console.error("Error fetching customers:", error)
        setFetchError(error instanceof Error ? error.message : "Failed to load customers")
        toast({
          title: "Error",
          description: "Failed to load customers. Please try refreshing the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery),
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

  // Handle customer deletion
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return

    setIsDeleting(true)
    try {
      const result = await deleteCustomer(customerToDelete)

      if (result.success) {
        setCustomers(customers.filter((customer) => customer._id !== customerToDelete))
        toast({
          title: "Customer deleted",
          description: "Customer has been deleted successfully",
        })
      } else {
        throw new Error(result.error || "Failed to delete customer")
      }
    } catch (error: any) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete customer",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setCustomerToDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading customers...</span>
      </div>
    )
  }

  if (fetchError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64 p-6">
          <h3 className="text-xl font-semibold mb-2 text-red-500">Error Loading Data</h3>
          <p className="text-muted-foreground mb-4 text-center">{fetchError}</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </CardContent>
      </Card>
    )
  }

  if (customers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64 p-6">
          <h3 className="text-xl font-semibold mb-2">No Customers</h3>
          <p className="text-muted-foreground mb-4 text-center">You haven't added any customers yet.</p>
          <Button onClick={() => router.push("/customers/new")}>Add Your First Customer</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="mb-4">
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

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No customers match your search</p>
        </div>
      ) : (
        <div className="rounded-md border divide-y">
          {filteredCustomers.map((customer) => (
            <div key={customer._id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                  {getInitials(customer.name)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{customer.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {customer.email} • {customer.phone}
                  </div>
                </div>
                <div className="flex items-center gap-2 max-sm:hidden">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/ledger?customerId=${customer._id}`)}>
                    View Ledger
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/customers/${customer._id}/edit`)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => setCustomerToDelete(customer._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {customerToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this customer? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCustomerToDelete(null)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCustomer} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}