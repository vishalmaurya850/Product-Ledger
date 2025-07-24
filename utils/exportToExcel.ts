import ExcelJS from "exceljs";

export async function exportToExcel(data: any[], fileName: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reports");

  if (data.length > 0) {
    // Get column headers from the first object
    const headers = Object.keys(data[0]);
    
    // Add headers
    worksheet.addRow(headers);
    
    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => item[header]);
      worksheet.addRow(row);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });
  }

  // Write to file
  await workbook.xlsx.writeFile(`${fileName}.xlsx`);
}