"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function RevenueReport() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/reports/revenue")
        if (response.ok) {
          const result = await response.json()
          setData(result)
        } else {
          console.error("Failed to fetch revenue data")
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div className="h-[350px] flex items-center justify-center">Loading revenue data...</div>
  }

  if (data.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No revenue data available.</p>
          <p className="text-sm text-muted-foreground">Add ledger entries to see your revenue report.</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="cashIn" name="Cash In" fill="#22c55e" />
        <Bar dataKey="cashOut" name="Cash Out" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}