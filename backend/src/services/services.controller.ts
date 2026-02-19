import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BuildingGuard } from '../auth/building.guard';

@Controller('services')
@UseGuards(JwtAuthGuard, BuildingGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post('meters')
  createMeter(@Body() data: any, @Headers('x-building-id') buildingId: string) {
    if (!buildingId)
      throw new BadRequestException('Building ID header required');

    // Ensure data is valid, or let Prisma throw
    // Using 'any' for data type in controller to avoid strict Prisma Input mismatch if frontend sends partial
    return this.servicesService.createMeter({
      type: data.type,
      unit: data.unitId ? { connect: { id: data.unitId } } : undefined,
      isBuildingMeter: data.isBuildingMeter,
      building: { connect: { id: buildingId } },
    });
  }

  @Get('units/:unitId/meters')
  getMeters(@Param('unitId') unitId: string) {
    // Technically we should check if unit belongs to the buildingId in header
    return this.servicesService.getMetersByUnit(unitId);
  }

  @Post('meters/:id/readings')
  addReading(@Param('id') id: string, @Body('value') value: number) {
    return this.servicesService.addReading(id, value);
  }
}
