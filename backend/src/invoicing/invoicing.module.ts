import { Module } from '@nestjs/common';
import { InvoicingService } from './invoicing.service';
// import { InvoicingController } from './invoicing.controller';

@Module({
  providers: [InvoicingService],
  // controllers: [InvoicingController],
  exports: [InvoicingService],
})
export class InvoicingModule {}
