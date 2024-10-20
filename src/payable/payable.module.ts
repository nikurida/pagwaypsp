import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';
import { DatabaseModule } from 'src/database/database.module';
import { CustomLoggerModule } from 'src/logger/logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PayableController } from './payable.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payable } from './entities/payable.entity';
import { CustomersFee } from 'src/customers/entitites/customers_fee.entity';

@Module({
  imports: [
    CustomLoggerModule,
    TypeOrmModule.forFeature([Payable]),
    TypeOrmModule.forFeature([CustomersFee]),
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
  controllers: [PayableController],
})
export class PayableModule {}
