import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLoggerModule } from 'src/logger/logger.module';
import { BalanceController } from './balance.controller';
import { Balance } from './entities/balance.entity';

@Module({
  imports: [
    CustomLoggerModule,
    TypeOrmModule.forFeature([Balance]),
    DatabaseModule,
  ],
  providers: [BalanceService],
  controllers: [BalanceController],
})
export class BalanceModule {}
