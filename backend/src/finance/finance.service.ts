import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async createCharge(data: Prisma.ChargeCreateInput) {
    return this.prisma.charge.create({ data });
  }

  async findAllCharges() {
    return this.prisma.charge.findMany({ include: { contract: true } });
  }

  async getPendingCharges() {
    return this.prisma.charge.findMany({ where: { status: 'PENDING' } });
  }
}
