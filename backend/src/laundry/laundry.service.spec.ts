import { Test, TestingModule } from '@nestjs/testing';
import { LaundryService } from './laundry.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('LaundryService', () => {
  let service: LaundryService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LaundryService,
        {
          provide: PrismaService,
          useValue: {
            laundryReservation: {
              count: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
            },
            unit: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LaundryService>(LaundryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('book', () => {
    it('should throw BadRequestException if user has 3 or more reservations this week', async () => {
      // ARRANGEMENT
      jest.spyOn(prisma.laundryReservation, 'count').mockResolvedValue(3);

      // ACTION & ASSERTION
      await expect(
        service.book('unit-1', new Date(), new Date(), new Date()),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create reservation if user has fewer than 3 reservations', async () => {
      // ARRANGEMENT
      jest.spyOn(prisma.laundryReservation, 'count').mockResolvedValue(2);
      jest.spyOn(prisma.unit, 'findUnique').mockResolvedValue({
        id: 'unit-1',
        buildingId: 'building-1',
        number: '101',
        floor: 1,
        area: 50,
        status: 'OCCUPIED',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      jest.spyOn(prisma.laundryReservation, 'create').mockResolvedValue({
        id: 'res-1',
        unitId: 'unit-1',
        date: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        machineId: 'MACHINE_1',
        status: 'CONFIRMED',
        buildingId: 'building-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // ACTION
      const result = await service.book(
        'unit-1',
        new Date(),
        new Date(),
        new Date(),
      );

      // ASSERTION
      expect(result).toBeDefined();
      expect(prisma.laundryReservation.create).toHaveBeenCalled();
    });
  });
});
