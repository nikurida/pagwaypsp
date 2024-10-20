import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CustomLoggerModule } from 'src/logger/logger.module';
import {
  ClientProviderOptions,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

@Module({
  imports: [
    CustomLoggerModule,
    AuthModule,
    ClientsModule.register([
      buildService('transactions'),
      buildService('balance'),
      buildService('users'),
      buildService('customers'),
      buildService('auth'),
    ]),
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}

function buildService(serviceName: string): ClientProviderOptions {
  const uppercased = serviceName.toUpperCase();
  const lowercased = serviceName.toLowerCase();

  const name = `${uppercased}_SERVICE`;
  const url = `amqp://user:password@rabbitmq:5672`;
  const queue = `${lowercased}_queue`;

  return {
    name,
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue,
      queueOptions: {
        durable: true,
      },
    },
  };
}
