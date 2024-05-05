import { NestFactory } from '@nestjs/core';
import { BalanceModule } from './balance.module';
import { setupGlobalPipes } from '../common/setupGlobalPipes';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(BalanceModule);
  setupGlobalPipes(app);
  await app.listen();
}
bootstrap();
