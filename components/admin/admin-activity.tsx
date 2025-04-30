import { connectToDatabase, collections } from "@/lib/db"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

export async function AdminActivity() {
  // Fetch recent activity from MongoDB
  const { db } = await connectToDatabase()

  // Get the 10 most recent ledger entries
  interface LedgerEntry {
    type: string
    description: string
    amount: number
    createdAt: string
    _id: { toString: () => string }
  }

  const recentLedger: LedgerEntry[] = (await db.collection(collections.ledger).find({}).sort({ createdAt: -1 }).limit(5).toArray()).map((entry: LedgerEntry) => ({
    type: entry.type,
    description: entry.description,
    amount: entry.amount,
    createdAt: entry.createdAt,
    _id: entry._id,
  }))

  // Get the 5 most recent product updates
  interface Product {
    name: string
    price: number
    updatedAt: string
    _id: { toString: () => string }
  }
  const recentProducts: Product[] = (await db.collection(collections.products).find({}).sort({ updatedAt: -1 }).limit(3).toArray()).map((product: Product) => ({
    name: product.name,
    price: product.price,
    updatedAt: product.updatedAt,
    _id: product._id,
  }))

  // Combine and sort by date
  const allActivity = [
    ...recentLedger.map((entry: LedgerEntry) => ({
      type: "ledger",
      action: entry.type === "Cash In" ? "received payment" : "made payment",
      description: entry.description,
      amount: entry.amount,
      date: entry.createdAt,
      id: entry._id.toString(),
    })),
    ...recentProducts.map((product: Product) => ({
      type: "product",
      action: "updated product",
      description: product.name,
      price: product.price,
      date: product.updatedAt,
      id: product._id.toString(),
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
