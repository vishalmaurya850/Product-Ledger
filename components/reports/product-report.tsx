"use client";

import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export function ProductReport() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/reports/products");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch product data:", errorText);
          setError("Failed to fetch product data.");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError("An error occurred while fetching product data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="h-[350px] flex items-center justify-center">Loading product data...</div>;
  }

  if (error) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No product data available.</p>
          <p className="text-sm text-muted-foreground">Add products to see your product report.</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} units`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}