import { Injectable } from '@nestjs/common';

const PDFDocument = require('pdfkit');
import * as fs from 'fs';
import * as path from 'path';

// Mock DB types for now
interface InvoiceData {
  id: string;
  tenantName: string;
  unitNumber: string;
  amount: number;
  items: { description: string; amount: number }[];
  date: Date;
}

@Injectable()
export class InvoicingService {
  async generateInvoicePdf(data: InvoiceData): Promise<string> {
    const doc = new PDFDocument();
    const fileName = `invoice-${data.id}.pdf`;
    const uploadDir = path.join(process.cwd(), 'uploads', 'invoices');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Header
    doc.fontSize(25).text('INVOICE', 50, 50);
    doc.fontSize(12).text('Building Manager RMS', 50, 80);
    doc.text(`Date: ${data.date.toLocaleDateString()}`, 50, 100);
    doc.text(`Invoice ID: ${data.id}`, 50, 115);

    // Tenant Info
    doc.text(`Tenant: ${data.tenantName}`, 50, 140);
    doc.text(`Unit: ${data.unitNumber}`, 50, 155);

    // Items
    let y = 200;
    doc.text('Description', 50, y, { underline: true });
    doc.text('Amount', 400, y, { underline: true });
    y += 20;

    data.items.forEach((item) => {
      doc.text(item.description, 50, y);
      doc.text(`$${item.amount.toFixed(2)}`, 400, y);
      y += 20;
    });

    // Total
    y += 20;
    doc
      .fontSize(14)
      .text(`Total: $${data.amount.toFixed(2)}`, 400, y, { bold: true });

    doc.end();

    return new Promise((resolve) => {
      writeStream.on('finish', () => {
        resolve(`/uploads/invoices/${fileName}`); // Return relative URL
      });
    });
  }
}
