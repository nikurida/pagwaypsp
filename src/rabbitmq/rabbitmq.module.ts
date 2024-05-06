import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({})
export class RabbitMQModule {
  static register(queueName: string, serviceName: string): DynamicModule {
    return {
      module: RabbitMQModule,
      imports: [
        ClientsModule.register([
          {
            name: serviceName,
            transport: Transport.RMQ,
            options: {
              urls: [process.env.RABBITMQ_URI],
              queue: queueName,
              queueOptions: {
                durable: true,
              },
            },
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
