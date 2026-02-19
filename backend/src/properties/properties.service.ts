import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) { }

  async createBuilding(data: { name: string; address: string; description?: string; status?: 'ACTIVE' | 'INACTIVE' }, userId: string) {
    try {
      console.log(`Creating building for userId: ${userId}`);

      // Basic slug generation
      let slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

      // Check for uniqueness and append counter if needed
      let uniqueSlug = slug;
      let counter = 1;
      while (await this.prisma.building.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }

      const buildingData = {
        ...data,
        slug: uniqueSlug,
      };

      return await this.prisma.$transaction(async (tx) => {
        const building = await tx.building.create({ data: buildingData });
        console.log(`Building created with ID: ${building.id}`);

        // Assign creator as ADMIN of the building
        await tx.userBuildingRole.create({
          data: {
            userId,
            buildingId: building.id,
            role: 'BUILDING_ADMIN',
            firstName: 'Admin',
            lastName1: 'Sistema',
          },
        });
        console.log(`UserBuildingRole assigned for user: ${userId}`);

        return building;
      });
    } catch (error) {
      console.error('Error in createBuilding:', error);
      throw error;
    }
  }

  async createUnit(data: Prisma.UnitCreateInput) {
    return this.prisma.unit.create({ data });
  }

  async findAllUnits(buildingId: string) {
    return this.prisma.unit.findMany({
      where: { buildingId },
      orderBy: { number: 'asc' },
      include: {
        contracts: {
          where: { status: 'ACTIVE' },
          include: { tenant: true },
        },
      },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.userBuildingRole.findMany({
      where: { userId },
      include: { building: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.building.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return this.prisma.building.findUnique({ where: { slug } });
  }
}
