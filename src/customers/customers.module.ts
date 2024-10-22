import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from './entitites/customers.entity';
import { CustomersFee } from './entitites/customers_fee.entity';
import { CustomersController } from './customers.controller';
import { CustomerService } from './customers.service';
import { CustomLoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    CustomLoggerModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Customers, CustomersFee]),
  ],
  controllers: [CustomersController],
  providers: [CustomerService],
})
export class CustomersModule {}
