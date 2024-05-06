import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { DatabaseModule } from 'src/database/database.module';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { TransactionRepository } from './repositories/transaction.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionRepository]),
    DatabaseModule,
    RabbitMQModule.register('transactions_queue', 'TRANSACTIONS_SERVICE'),
  ],
  controllers: [],
  providers: [TransactionService],
})
export class TransactionsModule {}
