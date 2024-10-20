import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customers } from './entitites/customers.entity';
import { CustomersFee } from './entitites/customers_fee.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Customers, CustomersFee]),
  ],
  controllers: [],
  providers: [],
})
export class CustomersModule {}
