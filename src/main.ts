import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupGlobalPipes } from './common/setupGlobalPipes';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule);
  setupGlobalPipes(app);
  await app.listen();
}
bootstrap();
