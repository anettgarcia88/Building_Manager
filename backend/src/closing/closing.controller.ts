import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ClosingService } from './closing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('closing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClosingController {
  constructor(private readonly closingService: ClosingService) {}

  @Post('run')
  @Roles('ADMIN')
  async runClosing(@Body() body: { month: number; year: number }) {
    return this.closingService.executeMonthlyClosing(body.month, body.year);
  }
}
