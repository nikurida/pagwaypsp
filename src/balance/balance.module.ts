import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { DatabaseModule } from 'src/database/database.module';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    DatabaseModule,
    RabbitMQModule.register('balance_queue', 'BALANCE_SERVICE'),
  ],
  providers: [BalanceService],
  controllers: [],
})
export class BalanceModule {}
