import { NestFactory } from '@nestjs/core';
import { setupGlobalPipes } from '../common/setupGlobalPipes';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@rabbitmq:5672'],
        queue: 'auth_queue',
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
