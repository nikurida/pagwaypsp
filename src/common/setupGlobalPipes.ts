import { INestApplication, ValidationPipe } from '@nestjs/common';

export function setupGlobalPipes(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production', // Exemplo de condição ambiental
    }),
  );
}
