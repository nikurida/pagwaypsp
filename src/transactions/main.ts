import { NestFactory } from '@nestjs/core';
import { TransactionsModule } from './transactions.module';
import { setupGlobalPipes } from 'src/common/setupGlobalPipes';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TransactionsModule);
  setupGlobalPipes(app);
  await app.listen();
}
bootstrap();
