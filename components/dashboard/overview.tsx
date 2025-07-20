"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Loader2 } from "lucide-react"

interface OverviewProps {
  companyId: string
}

export function Overview({ companyId }: OverviewProps) {
  const [data, setData] = useState<[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/reports/overview?companyId=${companyId}`)
        if (response.ok) {
          const chartData = await response.json()
          setData(chartData)
        } else {
          throw new Error("Failed to fetch overview data")
        }
      } catch (error) {
        console.error("Error fetching overview data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [companyId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`₹${value.toFixed(2)}`, ""]}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Legend />
        <Bar dataKey="sales" name="Sales" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="payments" name="Payments" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
        <Bar dataKey="outstanding" name="Outstanding" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}