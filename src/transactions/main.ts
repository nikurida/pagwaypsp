import { NestFactory } from '@nestjs/core';
import { TransactionsModule } from './transactions.module';
import { setupGlobalPipes } from '../common/setupGlobalPipes';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsModule);
  setupGlobalPipes(app);
  await app.startAllMicroservices();
  await app.listen(3003);
}
bootstrap();
