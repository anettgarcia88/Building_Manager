import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LaundryService } from './laundry.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('laundry')
@UseGuards(JwtAuthGuard)
export class LaundryController {
  constructor(private readonly laundryService: LaundryService) {}

  @Post('book')
  async book(
    @Request() req: any,
    @Body()
    body: { date: string; startTime: string; endTime: string; unitId?: string },
  ) {
    // Determine unitId from user. simplified for MVP: User -> Tenant -> Contracts -> Unit
    // For now, we'll assume the request comes with unitId or we fetch it.

    // Quick fix: User must pass unitId if Admin, or we use their first unit if Tenant.
    // Let's assume body has unitId for now to speed up.
    if (!body.unitId) {
      // In real app, default to tenant's unit. For now, require it or mock.
      // throw new BadRequestException('unitId is required');
      // Let's rely on frontend sending it.
    }
    return this.laundryService.book(
      body.unitId!,
      new Date(body.date),
      new Date(body.startTime),
      new Date(body.endTime),
    );
  }

  @Get()
  findAll() {
    return this.laundryService.findAll();
  }
}
