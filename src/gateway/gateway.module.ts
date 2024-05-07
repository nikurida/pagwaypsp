import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CustomLoggerModule } from 'src/logger/logger.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CustomLoggerModule,
    AuthModule,
    ClientsModule.register([
      {
        name: 'TRANSACTIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'transaction_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'BALANCE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'balance_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'USERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'users_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}
