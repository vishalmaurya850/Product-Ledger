"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface RecentSalesProps {
  companyId: string
}

export function RecentSales({ companyId }: RecentSalesProps) {
  interface Sale {
    _id: string
    customer: {
      name: string
    }
    description: string
    date: string
    status: "Paid" | "Overdue" | "Pending"
    amount: number
  }

  const [recentSales, setRecentSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/reports/recent-sales?companyId=${companyId}`)
        if (response.ok) {
          const data = await response.json()
          setRecentSales(data)
        } else {
          throw new Error("Failed to fetch recent sales")
        }
      } catch (error) {
        console.error("Error fetching recent sales:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [companyId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (recentSales.length === 0) {
    return (
      <div className="flex items-center justify-center h-60">
        <p className="text-muted-foreground">No recent sales</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {recentSales.map((sale) => (
        <div key={sale._id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {sale.customer.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customer.name}</p>
            <p className="text-sm text-muted-foreground">{sale.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{format(new Date(sale.date), "MMM d, yyyy")}</span>
              <Badge
                variant={sale.status === "Paid" ? "outline" : sale.status === "Overdue" ? "destructive" : "secondary"}
                className={
                  sale.status === "Paid"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : sale.status === "Overdue"
                      ? ""
                      : "bg-orange-50 text-orange-700 border-orange-200"
                }
              >
                {sale.status}
              </Badge>
            </div>
          </div>
          <div className="ml-auto font-medium">₹{sale.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}