import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLoggerModule } from 'src/logger/logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionController } from './transactions.controller';
import { Transactions } from './entities/transaction.entity';

@Module({
  imports: [
    CustomLoggerModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Transactions]),
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
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionsModule {}
