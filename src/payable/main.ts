import { NestFactory } from '@nestjs/core';
import { setupGlobalPipes } from '../common/setupGlobalPipes';
import { PayableModule } from './payable.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(PayableModule);
  setupGlobalPipes(app);
  await app.listen();
}
bootstrap();
