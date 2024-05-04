import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';
import { PayableController } from './payable.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [DatabaseModule, RabbitMQModule.register('payable_queue')],
  providers: [PayableService],
  controllers: [PayableController],
})
export class PayableModule {}
