import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { format, differenceInDays } from "date-fns"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { markLedgerEntryAsPaid } from "@/lib/actions"
import Link from "next/link"

export async function AdminOverdueTable() {
  // Get user session
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return <div>Not authenticated</div>
  }

  const companyId = session.user.id
  const { db } = await connectToDatabase()

  // Get overdue settings
  const settings = (await db.collection(collections.overdueSettings).findOne({ companyId })) || {
    gracePeriod: 7,
    interestRate: 0.15, // 15% annual interest rate
    compoundingPeriod: "daily",
    minimumFee: 5,
    companyId,
  }

  // Find all entries that are past due date and not paid
  const today = new Date()
  const overdueEntries = (await db
    .collection(collections.ledger)
    .find({
      companyId,
      dueDate: { $lt: today },
      status: { $ne: "Paid" },
    })
    .sort({ dueDate: 1 })
    .toArray()).map((entry: { _id: string; description?: string; dueDate?: string; amount?: number; status?: string }) => ({
      _id: entry._id.toString(),
      description: entry.description || "",
      dueDate: entry.dueDate || "",
      amount: entry.amount || 0,
      status: entry.status || "Unknown",
    })) as LedgerEntry[]

  // Define the type for ledger entries
  interface LedgerEntry {
    _id: string
    description: string
    dueDate: string
    amount: number
    status: string
    daysOverdue?: number
    interest?: number
    totalDue?: number
  }

  // Calculate interest for each overdue entry
  const entriesWithInterest = overdueEntries.map((entry: LedgerEntry) => {
    const dueDate = new Date(entry.dueDate)
    const daysOverdue = differenceInDays(today, dueDate)

    // Only apply interest after grace period
    if (daysOverdue <= settings.gracePeriod) {
      return { ...entry, daysOverdue, interest: 0, totalDue: entry.amount }
    }

    // Calculate interest based on settings
    const effectiveDaysOverdue = daysOverdue - settings.gracePeriod
    const dailyRate = settings.interestRate / 365

    let interest = 0
    if (settings.compoundingPeriod === "daily") {
      interest = entry.amount * (Math.pow(1 + dailyRate, effectiveDaysOverdue) - 1)
    } else if (settings.compoundingPeriod === "weekly") {
      const weeks = Math.floor(effectiveDaysOverdue / 7)
      const remainingDays = effectiveDaysOverdue % 7
      const weeklyRate = dailyRate * 7
      interest = entry.amount * (Math.pow(1 + weeklyRate, weeks) * (1 + dailyRate * remainingDays) - 1)
    } else {
      // monthly
      const months = Math.floor(effectiveDaysOverdue / 30)
      const remainingDays = effectiveDaysOverdue % 30
      const monthlyRate = dailyRate * 30
      interest = entry.amount * (Math.pow(1 + monthlyRate, months) * (1 + dailyRate * remainingDays) - 1)
    }

    // Apply minimum fee if needed
    interest = Math.max(interest, settings.minimumFee)

    return {
      ...entry,
      daysOverdue,
      interest,
      totalDue: entry.amount + interest,
    }
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button variant="ghost" className="p-0 font-medium">
                Invoice #
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium">
                Due Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium">
                Days Overdue
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Original Amount</TableHead>
            <TableHead className="text-right">Interest</TableHead>
            <TableHead className="text-right">Total Due</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entriesWithInterest.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No overdue entries found. All payments are up to date.
              </TableCell>
            </TableRow>
          ) : (
            entriesWithInterest.map((entry: LedgerEntry) => (
              <TableRow key={entry._id.toString()}>
                <TableCell className="font-medium">{entry._id.toString().substring(0, 8)}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>{format(new Date(entry.dueDate), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      (entry.daysOverdue ?? 0) > 30
                        ? "bg-red-100 text-red-800"
                        : (entry.daysOverdue ?? 0) > 15
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {(entry.daysOverdue ?? 0)} days
                  </span>
                </TableCell>
                <TableCell className="text-right">₹{entry.amount.toFixed(2)}</TableCell>
                <TableCell className="text-right">₹{(entry.interest ?? 0).toFixed(2)}</TableCell>
                <TableCell className="text-right font-medium">₹{(entry.totalDue ?? 0).toFixed(2)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/ledger/${entry._id}/view`}>View details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/ledger/${entry._id}/edit`}>Edit entry</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <form
                          action={async () => {
                            "use server"
                            await markLedgerEntryAsPaid(entry._id.toString())
                          }}
                        >
                          <button className="w-full text-left text-green-600">Mark as paid</button>
                        </form>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}