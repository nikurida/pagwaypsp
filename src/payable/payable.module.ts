import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';
import { DatabaseModule } from 'src/database/database.module';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayableRepository } from './repositories/payable-.repository';
import { CustomersFeeRepository } from 'src/customers/repositories/customers_fee.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PayableRepository]),
    TypeOrmModule.forFeature([CustomersFeeRepository]),
    DatabaseModule,
    RabbitMQModule.register('payable_queue', 'PAYABLE_SERVICE'),
  ],
  providers: [PayableService],
  controllers: [],
})
export class PayableModule {}
