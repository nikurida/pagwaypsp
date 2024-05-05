import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayableModule } from './payable/payable.module';
import { BalanceModule } from './balance/balance.module';
import { TransactionsModule } from './transactions/transactions.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { DatabaseModule } from './database/database.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    TypeOrmModule,
    PayableModule,
    BalanceModule,
    TransactionsModule,
    RabbitMQModule,
    DatabaseModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
