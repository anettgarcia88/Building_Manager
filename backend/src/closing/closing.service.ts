import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ServicesService } from '../services/services.service';
import { InvoicingService } from '../invoicing/invoicing.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClosingService {
  constructor(
    private prisma: PrismaService,
    private servicesService: ServicesService,
    private invoicingService: InvoicingService,
  ) { }

  async executeMonthlyClosing(month: number, year: number) {
    // 1. Find all active contracts
    const contracts = await this.prisma.contract.findMany({
      where: { status: 'ACTIVE' },
      include: { tenant: true, unit: true },
    });

    const results = [];

    for (const contract of contracts) {
      // 2. Check if already closed
      const existing = await this.prisma.monthlyClosing.findFirst({
        where: { contractId: contract.id, month, year },
      });
      if (existing) continue;

      // 3. Calculate Amounts
      const rent = Number(contract.rentAmount);
      const expenses = Number(contract.expensesAmount);
      const servicesCost = await this.servicesService.calculateUsageCost(
        contract.unitId,
        month,
        year,
      );
      const total = rent + expenses + servicesCost;

      // 4. Create Closing Record
      const closing = await this.prisma.monthlyClosing.create({
        data: {
          month,
          year,
          contractId: contract.id,
          totalAmount: total,
          status: 'CLOSED',
          buildingId: contract.buildingId, // Inherit building from contract
        },
      });

      // 5. Generate Invoice PDF
      const pdfUrl = await this.invoicingService.generateInvoicePdf({
        id: closing.id,
        tenantName: `${contract.tenant.firstName} ${contract.tenant.lastName1}${contract.tenant.lastName2 ? ' ' + contract.tenant.lastName2 : ''}`,
        unitNumber: contract.unit.number,
        amount: total,
        date: new Date(),
        items: [
          { description: 'Base Rent', amount: rent },
          { description: 'Building Expenses', amount: expenses },
          { description: 'Variable Services', amount: servicesCost },
        ],
      });

      // 6. Save Invoice Record
      await this.prisma.invoice.create({
        data: {
          url: pdfUrl,
          closingId: closing.id,
          buildingId: contract.buildingId, // Inherit building
        },
      });

      results.push(closing);
    }

    return {
      message: `Closed ${results.length} contracts for ${month}/${year}`,
      closings: results,
    };
  }
}
