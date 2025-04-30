import { NextResponse } from "next/server"
import { connectToDatabase, collections } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export const dynamic = "force-dynamic" // Disable caching for this route

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await context.params; // Await the params
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const companyId = session.user.companyId || session.user.id;
    const { db } = await connectToDatabase();

    console.log(`Generating invoice for entry ID: ${resolvedParams.id}`);

    // Get the ledger entry
    let entry;
    try {
      entry = await db.collection(collections.ledger).findOne({
        _id: new ObjectId(resolvedParams.id), // Use resolvedParams.id
      });
    } catch (error) {
      console.error("Error parsing ObjectId:", error);
      return NextResponse.json({ error: "Invalid ledger entry ID format" }, { status: 400 });
    }

    if (!entry) {
      console.log("Ledger entry not found");
      return NextResponse.json({ error: "Ledger entry not found" }, { status: 404 });
    }

    console.log("Found ledger entry:", { id: entry._id, description: entry.description });

    // Get the customer if customerId exists
    let customer = null;
    if (entry.customerId) {
      try {
        customer = await db.collection(collections.customers).findOne({
          _id: new ObjectId(entry.customerId),
        });

        console.log("Found customer:", customer ? { id: customer._id, name: customer.name } : "No customer found");
      } catch (error) {
        console.error("Error fetching customer:", error);
        // Continue without customer data
      }
    }
    
    let companies = null;
    if (entry.companyId) {
      try {
        companies=await db.collection(collections.companies).findOne({
          _id: new ObjectId(companyId),
        });
        console.log("Found company:", companies ? { id: companies._id, name: companies.name } : "No company found");
      }
      catch (error) {
        console.error("Error fetching company:", error);
        // Continue without company data
      }
    }

    // Generate a simple invoice HTML
    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice #${entry.invoiceNumber || resolvedParams.id.substring(0, 8)}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .invoice-header h1 {
            color: #2563eb;
            margin-bottom: 5px;
          }
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .invoice-details div {
            flex: 1;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th, td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f9fafb;
          }
          .total-row {
            font-weight: bold;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>INVOICE</h1>
          <p>Invoice #${entry.invoiceNumber || resolvedParams.id.substring(0, 8)}</p>
        </div>
        
        <div class="invoice-details">
          <div>
            <h3>From:</h3>
            <p>${companies.name}<br>
            ${companies.address}<br>
            Phone: ${companies.phone}<br>
            Email: ${companies.email}</p>
          </div>
          <div>
            <h3>To:</h3>
            <p>${customer ? customer.name : "Customer"}<br>
            ${customer ? customer.address : "Address"}<br>
            ${customer ? `Phone: ${customer.phone}` : ""}<br>
            ${customer ? `Email: ${customer.email}` : ""}</p>
          </div>
          <div>
            <h3>Details:</h3>
            <p>Date: ${new Date(entry.date).toLocaleDateString()}<br>
            Status: ${entry.status}<br>
            Type: ${entry.type}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Product</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${entry.description}</td>
              <td>${entry.product || "N/A"}</td>
              <td>₹${entry.amount.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2" style="text-align: right;">Total:</td>
              <td>₹${entry.amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div>
          <h3>Notes:</h3>
          <p>${entry.notes || "No additional notes."}</p>
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
        </div>
      </body>
      </html>
    `;

    console.log("Generated invoice HTML");

    // Set headers for HTML download
    const headers = new Headers();
    headers.set("Content-Type", "text/html");
    headers.set(
      "Content-Disposition",
      `attachment; filename="invoice-${entry.invoiceNumber || resolvedParams.id.substring(0, 8)}.html"`,
    );

    return new Response(invoiceHtml, {
      headers,
    });
  } catch (error) {
    console.error("Failed to generate invoice:", error);
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 });
  }
}