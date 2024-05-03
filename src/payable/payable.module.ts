import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';
import { PayableController } from './payable.controller';

@Module({
  providers: [PayableService],
  controllers: [PayableController],
})
export class PayableModule {}
