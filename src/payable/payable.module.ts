import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';
import { DatabaseModule } from 'src/database/database.module';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    DatabaseModule,
    RabbitMQModule.register('payable_queue', 'PAYABLE_SERVICE'),
  ],
  providers: [PayableService],
  controllers: [],
})
export class PayableModule {}
