import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayableRepository } from './repositories/payable-.repository';
import { CustomersFeeRepository } from 'src/customers/repositories/customers_fee.repository';
import { CustomLoggerModule } from 'src/logger/logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CustomLoggerModule,
    TypeOrmModule.forFeature([PayableRepository]),
    TypeOrmModule.forFeature([CustomersFeeRepository]),
    ClientsModule.register([
      {
        name: 'BALANCE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'balance_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    DatabaseModule,
  ],
  providers: [PayableService],
  controllers: [],
})
export class PayableModule {}
