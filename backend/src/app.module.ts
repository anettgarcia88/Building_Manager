import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { TenancyModule } from './tenancy/tenancy.module';
import { FinanceModule } from './finance/finance.module';
import { ServicesModule } from './services/services.module';
import { InvoicingModule } from './invoicing/invoicing.module';
import { ClosingModule } from './closing/closing.module';
import { LaundryModule } from './laundry/laundry.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    PropertiesModule,
    TenancyModule,
    FinanceModule,
    PrismaModule,
    ServicesModule,
    InvoicingModule,
    ClosingModule,
    LaundryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
