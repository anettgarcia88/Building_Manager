import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Query,
} from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tenancy')
export class TenancyController {
  constructor(private readonly tenancyService: TenancyService) { }

  @UseGuards(JwtAuthGuard)
  @Get('my-profile')
  getMyProfile(@Request() req: any) {
    return this.tenancyService.findTenantByUserId(req.user.userId);
  }

  @Post('tenants')
  createTenant(@Body() data: { firstName: string; lastName1: string; lastName2?: string; email: string; phone?: string; buildingId: string }) {
    return this.tenancyService.createTenant(data);
  }

  @Get('buildings/:id/tenants')
  findAllTenantsByBuilding(
    @Param('id') id: string,
    @Query('search') search?: string,
  ) {
    return this.tenancyService.findAllTenantsByBuilding(id, search);
  }

  @Post('contracts')
  createContract(@Body() body: { tenantId: string; unitId: string; buildingId: string; rentAmount: number; startDate: string; endDate: string }) {
    return this.tenancyService.createContract({
      building: { connect: { id: body.buildingId } },
      tenant: { connect: { id: body.tenantId } },
      unit: { connect: { id: body.unitId } },
      rentAmount: body.rentAmount,
      expensesAmount: 0, // Default 0 for now
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      status: 'ACTIVE',
    });
  }
}
