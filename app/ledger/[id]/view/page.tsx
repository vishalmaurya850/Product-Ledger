import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { format } from "date-fns";
import { ArrowLeft, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const dynamic = "force-dynamic"; // Disable caching for this route

export default async function ViewLedgerEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // Await the params
  const session = await auth();

  if (!session?.user?.id) {
    return <div>Not authenticated</div>;
  }

  const companyId = session.user.companyId || session.user.id;

  // Fetch overdue settings for gracePeriod
  const overdueSettings = await db.overdueSettings.findUnique({ where: { companyId } });
  const gracePeriod = overdueSettings?.gracePeriod || 7; // Default to 7 days if not found

  console.log("Grace Period:", gracePeriod);

  // Get the ledger entry with customer included
  const entry = await db.ledgerEntry.findUnique({
    where: { id: resolvedParams.id },
    include: {
      customer: true,
    },
  });

  if (!entry) {
    notFound();
  }

  // Calculate due date using gracePeriod
  const dueDate =
    entry.date && gracePeriod
      ? new Date(new Date(entry.date).getTime() + gracePeriod * 24 * 60 * 60 * 1000)
      : null;

  console.log("Due date:", dueDate); // Log the due date for debugging

  // Get company details
  const company = await db.company.findUnique({
    where: { id: companyId },
  }) || {
    name: "Your Company",
    address: "Company Address",
    phone: "Phone Number",
    email: "company@example.com",
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Invoice</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/api/invoices/${resolvedParams.id}/download`} target="_blank">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Link>
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none">
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <CardTitle className="text-2xl">INVOICE</CardTitle>
              <p className="text-muted-foreground mt-1">#{entry.invoiceNumber || resolvedParams.id.substring(0, 8)}</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="font-bold">{company.name}</p>
              <p className="text-muted-foreground">{company.address}</p>
              <p className="text-muted-foreground">{company.phone}</p>
              <p className="text-muted-foreground">{company.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Bill To:</h3>
              {entry.customer ? (
                <div>
                  <p className="font-medium">{entry.customer.name}</p>
                  <p>{entry.customer.address}</p>
                  <p>{entry.customer.phone}</p>
                  <p>{entry.customer.email}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">Customer information not available</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Invoice Details:</h3>
              <div className="grid grid-cols-2 gap-1">
                <p className="text-muted-foreground">Invoice Date:</p>
                <p>{format(new Date(entry.date), "PPP")}</p>

                <p className="text-muted-foreground">Due Date:</p>
                <p>{dueDate ? format(new Date(dueDate), "PPP") : "No due date available"}</p>

                <p className="text-muted-foreground">Status:</p>
                <p
                  className={
                    entry.status === "Paid"
                      ? "text-green-600 font-medium"
                      : entry.status === "Overdue"
                      ? "text-red-600 font-medium"
                      : "text-yellow-600 font-medium"
                  }
                >
                  {entry.status}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Invoice Items:</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.product || "N/A"}</TableCell>
                    <TableCell className="text-right">₹{entry.amount.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2} className="text-right font-medium">
                      Total:
                    </TableCell>
                    <TableCell className="text-right font-bold">₹{entry.amount.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {entry.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes:</h3>
              <p className="text-muted-foreground">{entry.notes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t flex flex-col items-start pt-6">
          <Button variant="outline" asChild>
            <Link href="/ledger">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Ledger
            </Link>
          </Button>
          <p className="text-muted-foreground text-sm mt-4 w-full text-center">Thank you for your business!</p>
        </CardFooter>
      </Card>
    </div>
  );
}