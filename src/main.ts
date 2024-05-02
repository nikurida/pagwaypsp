import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não esperadas
      forbidNonWhitelisted: true, // Lança erro se propriedades não esperadas forem encontradas
      transform: true, // Transforma o payload para corresponder aos tipos das classes DTO
      disableErrorMessages: false, // Mostra mensagens de erro
    }),
  );

  await app.listen(3000);
}
bootstrap();
