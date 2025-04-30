import { connectToDatabase, collections } from "@/lib/db"
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
import { deleteProduct } from "@/lib/actions"

// Define a Product type
interface Product {
  _id: string
  name: string
  sku: string
  price: number
  stock: number
  category: string
}

export async function AdminProductsTable() {
  // Fetch real data from MongoDB
  const { db } = await connectToDatabase()
  const products = (await db.collection(collections.products).find({}).sort({ name: 1 }).toArray()).map((doc: { _id: string; name: string; sku: string; price: number; stock: number; category: string }) => ({
    _id: doc._id.toString(),
    name: doc.name,
    sku: doc.sku,
    price: doc.price,
    stock: doc.stock,
    category: doc.category,
  })) as Product[]

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
            <TableHead>SKU</TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium">
                Price
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" className="p-0 font-medium">
                Stock
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No products found. Add your first product to get started.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product: Product) => (
              <TableRow key={product._id.toString()}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.stock > 10
                        ? "bg-green-100 text-green-800"
                        : product.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock > 0 ? product.stock : "Out of stock"}
                  </span>
                </TableCell>
                <TableCell>{product.category}</TableCell>
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
                        <a href={`/admin/products/${product._id}/view`}>View details</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`/admin/products/${product._id}/edit`}>Edit product</a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <form
                          action={async () => {
                            "use server"
                            await deleteProduct(product._id.toString())
                          }}
                        >
                          <button className="w-full text-left text-red-600">Delete product</button>
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
