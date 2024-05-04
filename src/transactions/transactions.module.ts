import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionService } from './transactions.service';
import { DatabaseModule } from 'src/database/database.module';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [DatabaseModule, RabbitMQModule.register('transaction_queue')],
  controllers: [TransactionsController],
  providers: [TransactionService],
})
export class TransactionsModule {}
