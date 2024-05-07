import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { DatabaseModule } from 'src/database/database.module';
import { BalanceRepository } from './repositories/balance.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    CustomLoggerModule,
    TypeOrmModule.forFeature([BalanceRepository]),
    DatabaseModule,
  ],
  providers: [BalanceService],
  controllers: [],
})
export class BalanceModule {}
