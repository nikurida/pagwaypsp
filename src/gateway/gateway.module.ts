import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: 'transactions_queue',
        },
      },
      {
        name: 'PAYABLE_SERVICE',
        transport: Transport.RMQ,
        options: { urls: [process.env.RABBITMQ_URI], queue: 'payables_queue' },
      },
      {
        name: 'BALANCE_SERVICE',
        transport: Transport.RMQ,
        options: { urls: [process.env.RABBITMQ_URI], queue: 'balance_queue' },
      },
    ]),
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}
