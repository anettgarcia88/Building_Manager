import { Module } from '@nestjs/common';
import { ClosingService } from './closing.service';
import { ClosingController } from './closing.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ServicesModule } from '../services/services.module';
import { InvoicingModule } from '../invoicing/invoicing.module';
import { ClosingScheduler } from './closing.scheduler';

@Module({
  imports: [PrismaModule, ServicesModule, InvoicingModule],
  controllers: [ClosingController],
  providers: [ClosingService, ClosingScheduler],
  exports: [ClosingService],
})
export class ClosingModule { }
