"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CustomerSidebar } from "@/components/ledger/customer-sidebar"
import { LedgerTable } from "@/components/ledger/ledger-table"
import { getCurrentUserPermissions } from "@/lib/actions";
// import { InlineCreditSettings } from "@/components/ledger/credit-limit-settings"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function CustomerLedgerView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const customerId = searchParams.get("customerId")
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [, setCreditSettings] = useState({
    creditLimit: 10000,
    gracePeriod: 30,
    interestRate: 18,
  })
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [, setLoadingSettings] = useState(false)


  useEffect(() => {
    async function fetchPermissions() {
      // @ts-ignore
      const { role, permissions } = await getCurrentUserPermissions();
      setUserRole(role);
      setUserPermissions(permissions);
    }
    fetchPermissions();
  }, []);

  // Fetch all customers
  useEffect(() => {
    
    async function fetchCustomers() {
      try {
        setIsLoading(true)
        setFetchError(null)

        console.log("Fetching customers for ledger view...")
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
        console.log("Customers data received for ledger:", data)

        if (Array.isArray(data)) {
          setCustomers(data)
          console.log(`Loaded ${data.length} customers for ledger view`)

          // If customerId is in URL, select that customer
          if (customerId && data.length > 0) {
            const customer = data.find((c: any) => c._id === customerId)
            if (customer) {
              console.log("Selected customer from URL:", customer.name)
              setSelectedCustomer(customer)
              // Fetch credit settings for this customer
              fetchCreditSettings(customerId)
            } else {
              console.log("Customer ID from URL not found in data:", customerId)
            }
          }
        } else {
          console.error("Expected array but got:", typeof data)
          setFetchError("Invalid data format received from server")
        }
      } catch (error) {
        console.error("Error fetching customers for ledger:", error)
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
  }, [customerId, refreshTrigger])

  // Fetch credit settings for a customer
  const fetchCreditSettings = async (id: string) => {
    if (!id) return

    setLoadingSettings(true)
    try {
      const response = await fetch(`/api/customers/${id}/credit-settings`, {
        cache: "no-store",
        headers: {
          pragma: "no-cache",
          "cache-control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch credit settings: ${response.status}`)
      }

      const data = await response.json()
      console.log("Credit settings loaded:", data)
      setCreditSettings(data)
    } catch (error) {
      console.error("Error fetching credit settings:", error)
      toast({
        title: "Warning",
        description: "Could not load credit settings. Using default values.",
        variant: "destructive",
      })
    } finally {
      setLoadingSettings(false)
    }
  }

  // Handle customer selection
  const handleSelectCustomer = (customer: any) => {
    console.log("Customer selected:", customer.name)
    setSelectedCustomer(customer)
    fetchCreditSettings(customer._id)
    router.push(`/ledger?customerId=${customer._id}`)
  }

  // Handle new ledger entry
  const handleNewLedgerEntry = () => {
    if (selectedCustomer) {
      router.push(`/ledger/new-entry?customerId=${selectedCustomer._id}`)
    } else {
      toast({
        title: "Select a customer",
        description: "Please select a customer before creating a new ledger entry",
      })
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    if (selectedCustomer) {
      fetchCreditSettings(selectedCustomer._id)
    }
    setRefreshTrigger((prev) => prev + 1)
    toast({
      title: "Refreshing",
      description: "Updating customer and ledger data...",
    })
  }

  // Handle credit settings update
  // const handleCreditSettingsUpdate = (updatedSettings: any) => {
  //   setCreditSettings(updatedSettings)
  //   setRefreshTrigger((prev) => prev + 1)
  // }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading customers...</span>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="max-w-md w-full p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{fetchError}</AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button onClick={handleRefresh}>Refresh Page</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Customer sidebar */}
      <div className="w-full md:w-72 border-r bg-background">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Customers</h2>
          <p className="text-sm text-muted-foreground">Select a customer to view their ledger</p>
        </div>
        <CustomerSidebar
          customers={customers}
          selectedCustomerId={selectedCustomer?._id}
          onSelectCustomer={handleSelectCustomer}
          isLoading={isLoading}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {selectedCustomer ? (
          <>
            <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">{selectedCustomer.name}'s Ledger</h1>
                <p className="text-sm text-muted-foreground">Manage transactions and track balances</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRefresh} size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button onClick={handleNewLedgerEntry}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Entry
                </Button>
              </div>
            </div>

            {/* <div className="p-4 border-b bg-muted/30">
              {loadingSettings ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading credit settings...</span>
                </div>
              ) : (
                <InlineCreditSettings
                  customerId={selectedCustomer._id}
                  initialSettings={creditSettings}
                  onSettingsUpdate={handleCreditSettingsUpdate}
                />
              )}
            </div> */}

            <div className="flex-1 overflow-auto p-4">
              <LedgerTable customerId={selectedCustomer._id} userPermissions={userPermissions} key={`ledger-${selectedCustomer._id}-${refreshTrigger}`} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold mb-2">Select a Customer</h2>
              <p className="text-muted-foreground mb-6">Choose a customer from the sidebar to view their ledger</p>
              <Button variant="outline" onClick={() => router.push("/customers/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Customer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
