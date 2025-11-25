import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"

export const dynamic = "force-dynamic" // Disable caching for this route

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await context.params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const companyId = session.user.companyId || session.user.id;

    console.log(`Generating invoice for entry ID: ${resolvedParams.id}`);

    // Get the ledger entry with customer and company
    const entry = await db.ledgerEntry.findUnique({
      where: { id: resolvedParams.id },
      include: {
        customer: true,
        company: true,
      },
    });

    if (!entry) {
      console.log("Ledger entry not found");
      return NextResponse.json({ error: "Ledger entry not found" }, { status: 404 });
    }

    console.log("Found ledger entry:", { id: entry.id, description: entry.description });
    
    // Get payment history for this invoice (same as the invoice route)
    const payments = await db.ledgerEntry.findMany({
      where: {
        companyId: companyId,
        type: "Payment In",
        description: { contains: resolvedParams.id },
      },
    });
    
    // Calculate remaining amount
    const totalPaid = payments.reduce((sum: number, payment) => sum + payment.amount, 0);
    const remainingAmount = Math.max(0, entry.amount - totalPaid);

    const customer = entry.customer;
    const companies = entry.company;

    // Create PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Define colors exactly matching web design
    const primaryColor: [number, number, number] = [37, 99, 235]; // #2563EB
    const primaryLight: [number, number, number] = [219, 234, 254]; // #DBEAFE bg-primary/10
    const grayColor: [number, number, number] = [107, 114, 128]; // #6B7280
    const lightGray: [number, number, number] = [249, 250, 251]; // #F9FAFB
    const borderGray: [number, number, number] = [229, 231, 235]; // #E5E7EB

    let yPos = margin;

    // ========== HEADER SECTION (matching web exactly) ==========
    // Company name - large and bold
    doc.setTextColor(...primaryColor);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text(companies.name, margin, yPos);
    yPos += 10;

    // Company address, email, phone (small gray text)
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    doc.text(companies.address || "", margin, yPos);
    yPos += 5;
    doc.text(companies.email || "", margin, yPos);
    yPos += 5;
    doc.text(companies.phone || "", margin, yPos);
    
    // Invoice box on the right side (matching the rounded box in web)
    const invoiceBoxX = pageWidth - margin - 50;
    const invoiceBoxY = margin;
    
    // Light blue background box
    doc.setFillColor(...primaryLight);
    doc.roundedRect(invoiceBoxX - 8, invoiceBoxY - 3, 58, 22, 3, 3, "F");
    
    // "INVOICE" label
    doc.setTextColor(...grayColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("INVOICE", invoiceBoxX, invoiceBoxY + 2);
    
    // Invoice number - large and bold
    doc.setTextColor(...primaryColor);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const invoiceNum = `#${entry.invoiceNumber || resolvedParams.id.substring(0, 8).toUpperCase()}`;
    doc.text(invoiceNum, invoiceBoxX, invoiceBoxY + 10);

    // Date and Due Date below invoice box
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    let dateY = invoiceBoxY + 16;
    doc.text("Date:", invoiceBoxX, dateY);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(format(new Date(entry.date), "MMM dd, yyyy"), invoiceBoxX + 14, dateY);
    
    if (entry.dueDate) {
      dateY += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...grayColor);
      doc.text("Due Date:", invoiceBoxX, dateY);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(format(new Date(entry.dueDate), "MMM dd, yyyy"), invoiceBoxX + 14, dateY);
    }

    yPos += 15;

    // Border line below header
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(1);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // ========== BILL TO & INVOICE DETAILS (Two columns) ==========
    const leftColX = margin;
    const rightColX = pageWidth / 2 + 5;
    const colWidth = (pageWidth / 2) - margin - 10;

    // BILL TO section (Left column)
    // Header with light blue background
    doc.setFillColor(...primaryLight);
    doc.roundedRect(leftColX, yPos, colWidth, 8, 2, 2, "F");
    doc.setTextColor(...primaryColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO", leftColX + 3, yPos + 5.5);
    
    yPos += 10;

    // Customer info box with light gray background
    const billToBoxHeight = 32;
    doc.setFillColor(...lightGray);
    doc.roundedRect(leftColX, yPos, colWidth, billToBoxHeight, 3, 3, "F");
    
    // Customer name - bold
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(customer ? customer.name : "Customer", leftColX + 4, yPos + 7);
    
    // Customer details
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...grayColor);
    let custY = yPos + 13;
    if (customer) {
      doc.text(customer.address || "", leftColX + 4, custY);
      custY += 5;
      doc.text(customer.email || "", leftColX + 4, custY);
      custY += 5;
      doc.text(customer.phone || "", leftColX + 4, custY);
    }

    // INVOICE DETAILS section (Right column)
    let detailsYPos = yPos - 10;
    
    // Header with light blue background
    doc.setFillColor(...primaryLight);
    doc.roundedRect(rightColX, detailsYPos, colWidth, 8, 2, 2, "F");
    doc.setTextColor(...primaryColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE DETAILS", rightColX + 3, detailsYPos + 5.5);
    
    detailsYPos += 10;

    // Details box with light gray background
    doc.setFillColor(...lightGray);
    doc.roundedRect(rightColX, detailsYPos, colWidth, billToBoxHeight, 3, 3, "F");
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    
    const details = [
      { label: "Invoice Number", value: `#${entry.invoiceNumber || resolvedParams.id.substring(0, 8).toUpperCase()}` },
      { label: "Issue Date", value: format(new Date(entry.date), "MMM dd, yyyy") },
      { label: "Status", value: entry.status },
      { label: "Type", value: entry.type },
    ];

    let detY = detailsYPos + 6;
    details.forEach((detail) => {
      // Draw separator line
      doc.setDrawColor(...borderGray);
      doc.setLineWidth(0.2);
      if (detY > detailsYPos + 6) {
        doc.line(rightColX + 2, detY - 3, rightColX + colWidth - 2, detY - 3);
      }
      
      doc.setTextColor(...grayColor);
      doc.text(detail.label, rightColX + 4, detY);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      const valueWidth = doc.getTextWidth(detail.value);
      doc.text(detail.value, rightColX + colWidth - valueWidth - 4, detY);
      doc.setFont("helvetica", "normal");
      detY += 7;
    });

    yPos += billToBoxHeight + 20;

    // ========== DESCRIPTION SECTION ==========
    // Header with light blue background
    doc.setFillColor(...primaryLight);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, "F");
    doc.setTextColor(...primaryColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("DESCRIPTION", margin + 3, yPos + 5.5);
    
    yPos += 10;

    // Description box
    const descriptionLines = doc.splitTextToSize(entry.description || "No description provided", pageWidth - 2 * margin - 10);
    const descBoxHeight = Math.max(15, (descriptionLines.length * 5) + 8);
    
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, descBoxHeight, 3, 3, "S");
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(descriptionLines, margin + 5, yPos + 7);
    yPos += descBoxHeight + 15;

    // ========== ITEMS TABLE ==========
    autoTable(doc, {
      startY: yPos,
      head: [["Product", "Quantity", "Rate", "Amount"]],
      body: [[
        entry.product || "Service",
        "1",
        `Rs. ${entry.amount.toFixed(2)}`,
        `Rs. ${entry.amount.toFixed(2)}`
      ]],
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: borderGray,
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        halign: "left",
      },
      bodyStyles: {
        textColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: "center" },
        2: { cellWidth: 40, halign: "right" },
        3: { cellWidth: 40, halign: "right", fontStyle: "bold" },
      },
      margin: { left: margin, right: margin },
    });

    yPos = (doc as any).lastAutoTable.finalY + 20;

    // ========== AMOUNT SUMMARY (matching web design exactly) ==========
    const summaryX = pageWidth - margin - 80;
    const summaryWidth = 80;
    
    // Calculate box height based on whether there are payments
    const hasPayments = payments && payments.length > 0;
    const summaryBoxHeight = hasPayments ? 45 : 32;
    
    // Light gray background box
    doc.setFillColor(...lightGray);
    doc.roundedRect(summaryX - 5, yPos, summaryWidth, summaryBoxHeight, 3, 3, "F");
    
    let summaryY = yPos + 8;
    
    // Subtotal
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text("Subtotal:", summaryX, summaryY);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs. ${entry.amount.toFixed(2)}`, pageWidth - margin - 10, summaryY, { align: "right" });
    
    summaryY += 8;
    
    // Amount Paid (if there are payments)
    if (hasPayments) {
      // Separator line
      doc.setDrawColor(...borderGray);
      doc.setLineWidth(0.3);
      doc.line(summaryX, summaryY - 2, pageWidth - margin - 10, summaryY - 2);
      
      summaryY += 5;
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(34, 197, 94); // Green color for paid amount
      doc.text("Amount Paid:", summaryX, summaryY);
      doc.setFont("helvetica", "bold");
      doc.text(`- Rs. ${totalPaid.toFixed(2)}`, pageWidth - margin - 10, summaryY, { align: "right" });
      
      summaryY += 8;
    }
    
    // Main separator line
    doc.setDrawColor(...grayColor);
    doc.setLineWidth(0.5);
    doc.line(summaryX, summaryY - 2, pageWidth - margin - 10, summaryY - 2);
    
    summaryY += 6;
    
    // Total/Balance Due - larger font
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    const label = hasPayments ? "Balance Due:" : "Total Amount:";
    doc.text(label, summaryX, summaryY);
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    const finalAmount = hasPayments ? remainingAmount : entry.amount;
    doc.text(`Rs. ${finalAmount.toFixed(2)}`, pageWidth - margin - 10, summaryY, { align: "right" });

    yPos += summaryBoxHeight + 15;

    // ========== PAYMENT HISTORY TABLE ==========
    if (hasPayments) {
      // Header with light blue background
      doc.setFillColor(...primaryLight);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, "F");
      doc.setTextColor(...primaryColor);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("PAYMENT HISTORY", margin + 3, yPos + 5.5);
      
      yPos += 10;

      // Payment history table
      const paymentData = payments.map((payment) => [
        format(new Date(payment.createdAt), "MMM dd, yyyy"),
        payment.paymentMethod || "Cash",
        `Rs. ${payment.amount.toFixed(2)}`,
        "Paid"
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Date", "Payment Method", "Amount", "Status"]],
        body: paymentData,
        theme: "grid",
        styles: {
          fontSize: 9,
          cellPadding: 4,
          lineColor: borderGray,
          lineWidth: 0.3,
        },
        headStyles: {
          fillColor: lightGray,
          textColor: [0, 0, 0],
          fontSize: 9,
          fontStyle: "bold",
          halign: "left",
        },
        bodyStyles: {
          textColor: [0, 0, 0],
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "left" },
          1: { cellWidth: 50, halign: "left" },
          2: { cellWidth: 40, halign: "right", fontStyle: "bold" },
          3: { 
            cellWidth: 40, 
            halign: "center",
            fillColor: [240, 253, 244], // Light green background
            textColor: [21, 128, 61], // Green text
            fontStyle: "bold"
          },
        },
        margin: { left: margin, right: margin },
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    }

    // ========== NOTES SECTION ==========
    if (entry.notes) {
      // Header with light blue background
      doc.setFillColor(...primaryLight);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 8, 2, 2, "F");
      doc.setTextColor(...primaryColor);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("NOTES", margin + 3, yPos + 5.5);
      
      yPos += 10;

      const notesLines = doc.splitTextToSize(entry.notes, pageWidth - 2 * margin - 10);
      const notesBoxHeight = (notesLines.length * 5) + 8;
      
      doc.setDrawColor(...borderGray);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, notesBoxHeight, 3, 3, "S");
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(notesLines, margin + 5, yPos + 7);
      yPos += notesBoxHeight + 15;
    }

    // ========== FOOTER ==========
    const footerY = pageHeight - 20;
    
    // Top border line
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(1);
    doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8);
    
    // Thank you message - centered
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    const thankYou = "Thank you for your business!";
    const thankYouWidth = doc.getTextWidth(thankYou);
    doc.text(thankYou, (pageWidth - thankYouWidth) / 2, footerY);
    
    // Contact info - centered and smaller
    doc.setFontSize(7);
    doc.setTextColor(...grayColor);
    const contactInfo = `For any questions regarding this invoice, please contact ${companies.email || ""} or call ${companies.phone || ""}`;
    const contactLines = doc.splitTextToSize(contactInfo, pageWidth - 2 * margin);
    let contactY = footerY + 5;
    contactLines.forEach((line: string) => {
      const lineWidth = doc.getTextWidth(line);
      doc.text(line, (pageWidth - lineWidth) / 2, contactY);
      contactY += 4;
    });

    console.log("Generated PDF invoice matching invoice-content.tsx design");

    // Generate PDF as buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    // Set headers for PDF download
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `attachment; filename="invoice-${entry.invoiceNumber || resolvedParams.id.substring(0, 8)}.pdf"`,
    );

    return new Response(pdfBuffer, {
      headers,
    });
  } catch (error) {
    console.error("Failed to generate invoice:", error);
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 });
  }
}