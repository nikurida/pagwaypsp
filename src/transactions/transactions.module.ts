import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { DatabaseModule } from 'src/database/database.module';
import { TransactionRepository } from './repositories/transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLoggerModule } from 'src/logger/logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CustomLoggerModule,
    TypeOrmModule.forFeature([TransactionRepository]),
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'PAYABLE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'payable_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [],
  providers: [TransactionService],
})
export class TransactionsModule {}
