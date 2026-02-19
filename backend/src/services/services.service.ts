import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async createMeter(data: Prisma.MeterCreateInput) {
    return this.prisma.meter.create({ data });
  }

  async getMetersByUnit(unitId: string) {
    return this.prisma.meter.findMany({
      where: { unitId },
      include: { readings: { orderBy: { date: 'desc' }, take: 5 } },
    });
  }

  async addReading(meterId: string, value: number) {
    const meter = await this.prisma.meter.findUnique({
      where: { id: meterId },
    });
    if (!meter) throw new NotFoundException('Meter not found');

    return this.prisma.meterReading.create({
      data: {
        meterId,
        value,
        date: new Date(),
      },
    });
  }

  async calculateUsageCost(
    unitId: string,
    month: number,
    year: number,
  ): Promise<number> {
    // Mock calculation: Fetch meters for unit, get readings for month, diff * rate
    // For MVP, returning a random mock cost between 50-150
    return 50 + Math.random() * 100;
  }
}
