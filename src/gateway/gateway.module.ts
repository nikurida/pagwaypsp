import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { AuthModule } from 'src/auth/auth.module';

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
        name: 'USERS_SERVICE',
        transport: Transport.RMQ,
        options: { urls: [process.env.RABBITMQ_URI], queue: 'users_queue' },
      },
      {
        name: 'BALANCE_SERVICE',
        transport: Transport.RMQ,
        options: { urls: [process.env.RABBITMQ_URI], queue: 'balance_queue' },
      },
    ]),
    AuthModule,
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}
