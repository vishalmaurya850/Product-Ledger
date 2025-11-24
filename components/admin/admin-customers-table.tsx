import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { format } from "date-fns"
import { ArrowUpDown, MoreHorizontal, Mail, Phone, User } from "lucide-react"
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
import { deleteCustomer } from "@/lib/actions"
import Link from "next/link"
export async function AdminCustomersTable() {
  // Get user session
  const session = await auth()
  if (!session?.user?.id) {
    return <div>Not authenticated</div>
  }
  const companyId = session.user.id
  // Fetch real data from Prisma
  const customers = await db.customer.findMany({
    where: { companyId },
    orderBy: { name: 'asc' },
  })
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium">
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium">
                Created
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No customers found. Add your first customer to get started.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-blue-500" />
                    {customer.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-green-500" />
                    {customer.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-purple-500" />
                    {customer.phone || "-"}
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{customer.address || "-"}</TableCell>
                <TableCell>{customer.createdAt ? format(new Date(customer.createdAt), "MMM d, yyyy") : "-"}</TableCell>
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
                        <Link href={`/admin/customers/${customer.id}/view`}>View details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/customers/${customer.id}/edit`}>Edit customer</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <form
                          action={async () => {
                            "use server"
                            await deleteCustomer(customer.id)
                          }}
                        >
                          <button className="w-full text-left text-red-600">Delete customer</button>
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