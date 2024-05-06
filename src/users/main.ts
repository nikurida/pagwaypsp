import { NestFactory } from '@nestjs/core';
import { setupGlobalPipes } from 'src/common/setupGlobalPipes';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UsersModule);
  setupGlobalPipes(app);
  await app.listen();
}
bootstrap();
