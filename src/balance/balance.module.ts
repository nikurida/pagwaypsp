import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { DatabaseModule } from 'src/database/database.module';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { BalanceRepository } from './repositories/balance.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([BalanceRepository]),
    DatabaseModule,
    RabbitMQModule.register('balance_queue', 'BALANCE_SERVICE'),
  ],
  providers: [BalanceService],
  controllers: [],
})
export class BalanceModule {}
