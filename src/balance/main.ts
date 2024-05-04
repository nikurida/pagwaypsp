import { NestFactory } from '@nestjs/core';
import { BalanceModule } from './balance.module';
import { setupGlobalPipes } from '../common/setupGlobalPipes';

async function bootstrap() {
  const app = await NestFactory.create(BalanceModule);
  setupGlobalPipes(app);
  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
