import { NestFactory } from '@nestjs/core';
import { setupGlobalPipes } from 'src/common/setupGlobalPipes';
import { CustomersModule } from './customers.module';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CustomersModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@rabbitmq:5672'],
        queue: 'customers_queue',
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

console.log('Starting customers microservice...');
bootstrap()
  .then(() => {
    console.log('Customers microservice started');
  })
  .catch((err) => {
    console.log('Error starting customers microservice', err);
  });
