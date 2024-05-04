import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [DatabaseModule, RabbitMQModule.register('balance_queue')],
  providers: [BalanceService],
  controllers: [BalanceController],
})
export class BalanceModule {}
