import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { setupGlobalPipes } from '../common/setupGlobalPipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupGlobalPipes(app);
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
