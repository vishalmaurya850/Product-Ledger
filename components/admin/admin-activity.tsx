import { db } from "@/lib/db"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

export async function AdminActivity() {
  // Fetch recent activity from Prisma

  // Get the 5 most recent ledger entries
  const recentLedger = await db.ledgerEntry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      type: true,
      description: true,
      amount: true,
      createdAt: true,
    },
  })

  // Get the 3 most recent product updates
  const recentProducts = await db.product.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 3,
    select: {
      id: true,
      name: true,
      price: true,
      updatedAt: true,
    },
  })

  // Combine and sort by date
  const allActivity = [
    ...recentLedger.map((entry) => ({
      type: "ledger",
      action: entry.type === "Cash In" ? "received payment" : "made payment",
      description: entry.description,
      amount: entry.amount,
      date: entry.createdAt,
      id: entry.id,
    })),
    ...recentProducts.map((product) => ({
      type: "product",
      action: "updated product",
      description: product.name,
      price: product.price,
      date: product.updatedAt,
      id: product.id,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-8">
      {allActivity.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{activity.type === "ledger" ? "LE" : "PR"}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Admin {activity.action}</p>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(activity.date))} ago</p>
          </div>
          {activity.type === "ledger" && (
            <div
              className={`ml-auto font-medium ${activity.action === "received payment" ? "text-green-600" : "text-red-600"}`}
            >
              {activity.type === "ledger" && (
                <>{activity.action === "received payment" ? "+" : "-"}${"amount" in activity ? activity.amount.toFixed(2) : ""}</>
              )}
            </div>
          )}
          {activity.type === "product" && (
            <div className="ml-auto font-medium">${"price" in activity ? activity.price.toFixed(2) : ""}</div>
          )}
        </div>
      ))}

      {allActivity.length === 0 && <p className="text-center text-muted-foreground">No recent activity</p>}
    </div>
  )
}
