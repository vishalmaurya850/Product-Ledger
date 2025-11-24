import { db } from "@/lib/db"
import { format } from "date-fns"
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
import { deleteLedgerEntry } from "@/lib/actions"

export async function AdminLedgerTable() {
  // Fetch real data from Prisma
  const ledgerEntries = await db.ledgerEntry.findMany({
    orderBy: { date: 'desc' },
  })
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Button variant="ghost" className="p-0 font-medium">
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium">
                Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium">
                Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" className="p-0 font-medium">
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium">
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium">
                Due Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ledgerEntries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No ledger entries found. Add your first entry to get started.
              </TableCell>
            </TableRow>
          ) : (
            ledgerEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{format(new Date(entry.date), "MMM d, yyyy")}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      entry.type === "Cash In" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {entry.type}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={entry.type === "Cash In" ? "text-green-600" : "text-red-600"}>
                    {entry.type === "Cash In" ? "+" : "-"}${entry.amount.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      entry.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : entry.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {entry.status}
                  </span>
                </TableCell>
                <TableCell>{entry.dueDate ? format(new Date(entry.dueDate), "MMM d, yyyy") : "-"}</TableCell>
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
                        <a href={`/admin/ledger/${entry.id}/view`}>View details</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`/admin/ledger/${entry.id}/edit`}>Edit entry</a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <form
                          action={async () => {
                            "use server"
                            await deleteLedgerEntry(entry.id)
                          }}
                        >
                          <button className="w-full text-left text-red-600">Delete entry</button>
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
