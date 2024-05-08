import { NestFactory } from '@nestjs/core';
import { setupGlobalPipes } from 'src/common/setupGlobalPipes';
import { UsersModule } from './users.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@rabbitmq:5672'],
        queue: 'users_queue',
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
