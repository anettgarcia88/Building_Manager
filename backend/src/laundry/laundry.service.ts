import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { startOfWeek, endOfWeek } from 'date-fns';

@Injectable()
export class LaundryService {
  constructor(private prisma: PrismaService) { }

  async book(unitId: string, date: Date, startTime: Date, endTime: Date) {
    const start = startOfWeek(date);
    const end = endOfWeek(date);

    const count = await this.prisma.laundryReservation.count({
      where: {
        unitId,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    if (count >= 3) {
      throw new BadRequestException('Max 3 reservations per week allowed.');
    }

    // Get buildingId from unit
    const unit = await this.prisma.unit.findUnique({ where: { id: unitId } });
    if (!unit) throw new BadRequestException('Unit not found');

    return this.prisma.laundryReservation.create({
      data: {
        unitId,
        date,
        startTime,
        endTime,
        machineId: 'MACHINE_1',
        status: 'CONFIRMED',
        buildingId: unit.buildingId,
      },
    });
  }

  async findAll() {
    return this.prisma.laundryReservation.findMany({ include: { unit: true } });
  }
}
