import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TenancyService {
  constructor(private prisma: PrismaService) { }

  async createTenant(data: {
    firstName: string;
    lastName1: string;
    lastName2?: string;
    email: string;
    phone?: string;
    buildingId: string;
    userId?: string;
  }) {
    try {
      return await this.prisma.tenant.create({ data });
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  }

  async findAllTenants() {
    return this.prisma.tenant.findMany({ include: { contracts: true } });
  }

  async findAllTenantsByBuilding(buildingId: string, search?: string) {
    const where: Prisma.TenantWhereInput = {
      buildingId,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName1: { contains: search, mode: 'insensitive' } },
        { lastName2: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    return this.prisma.tenant.findMany({
      where,
      orderBy: { firstName: 'asc' },
    });
  }

  async createContract(data: Prisma.ContractCreateInput) {
    // 1. Check if unit is already occupied (optional but good)
    /* 
    const activeContract = await this.prisma.contract.findFirst({
      where: { unitId: data.unit.connect?.id, status: 'ACTIVE' }
    });
    if (activeContract) throw new Error('Unit is already occupied');
    */

    // 2. Create Contract
    const contract = await this.prisma.contract.create({ data });

    // 3. Update Unit status to OCCUPIED
    if (data.unit?.connect?.id) {
      await this.prisma.unit.update({
        where: { id: data.unit.connect.id },
        data: { status: 'OCCUPIED' }
      });
    }

    return contract;
  }

  async findAllContracts() {
    return this.prisma.contract.findMany({
      include: { tenant: true, unit: true },
    });
  }

  async findTenantByUserId(userId: string) {
    return this.prisma.tenant.findUnique({
      where: { userId },
      include: {
        contracts: {
          include: {
            unit: true,
            charges: true,
            monthlyClosings: {
              include: { invoices: true },
              orderBy: { id: 'desc' },
            },
          },
        },
      },
    });
  }
}
