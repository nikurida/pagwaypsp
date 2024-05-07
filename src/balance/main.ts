import { NestFactory } from '@nestjs/core';
import { BalanceModule } from './balance.module';
import { setupGlobalPipes } from '../common/setupGlobalPipes';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BalanceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@rabbitmq:5672'],
        queue: 'balance_queue',
        noAck: false,
        queueOptions: {
          durable: true,
        },
        maxConnectionAttempts: -1,
        persistent: true,
      },
      logger: false,
    },
  );

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  setupGlobalPipes(app);
  await app.listen();
}
bootstrap();
